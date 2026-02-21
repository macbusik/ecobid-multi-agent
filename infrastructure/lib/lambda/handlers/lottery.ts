import { ScheduledEvent } from 'aws-lambda';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { SchedulerClient, CreateScheduleCommand } from '@aws-sdk/client-scheduler';
import { getItem, query, updateItem } from '../shared/dynamodb';
import { LotteryEntry } from '../shared/types';

const sesClient = new SESClient({});
const schedulerClient = new SchedulerClient({});
const SES_FROM_EMAIL = process.env.SES_FROM_EMAIL!;
const RESERVATION_EXPIRY_LAMBDA_ARN = process.env.RESERVATION_EXPIRY_LAMBDA_ARN!;

/**
 * Lottery Lambda Handler
 * Selects random winner from lottery entries and sends notifications.
 */
export async function handler(event: ScheduledEvent): Promise<void> {
  try {
    const itemId = event.detail?.itemId;
    
    if (!itemId) {
      console.error('No itemId provided in event');
      return;
    }

    await selectWinner(itemId);
  } catch (error) {
    console.error('Error in lottery handler:', error);
    throw error;
  }
}

/**
 * Select random winner from lottery entries
 */
async function selectWinner(itemId: string): Promise<void> {
  // Get item details
  const item = await getItem(`ITEM#${itemId}`, 'METADATA');
  if (!item) {
    console.error(`Item ${itemId} not found`);
    return;
  }

  if (item.status !== 'Available') {
    console.log(`Item ${itemId} is not available, skipping lottery`);
    return;
  }

  // Query all lottery entries
  const entries = await query(
    'PK = :pk AND begins_with(SK, :sk)',
    { ':pk': `ITEM#${itemId}`, ':sk': 'LOTTERY#' }
  ) as LotteryEntry[];

  if (entries.length === 0) {
    console.log(`No lottery entries for item ${itemId}`);
    // Update status to Expired
    await updateItem(
      `ITEM#${itemId}`,
      'METADATA',
      'SET #status = :status, updatedAt = :updatedAt, GSI1PK = :gsi1pk',
      {
        ':status': 'Expired',
        ':updatedAt': new Date().toISOString(),
        ':gsi1pk': 'STATUS#Expired',
      },
      { '#status': 'status' }
    );
    return;
  }

  // Select random winner
  const randomIndex = Math.floor(Math.random() * entries.length);
  const winner = entries[randomIndex];
  const reservationExpiryTime = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  // Update item with winner
  await updateItem(
    `ITEM#${itemId}`,
    'METADATA',
    'SET #status = :status, winnerUserId = :winnerId, reservationExpiryTime = :expiryTime, updatedAt = :updatedAt, GSI1PK = :gsi1pk',
    {
      ':status': 'Reserved',
      ':winnerId': winner.userId,
      ':expiryTime': reservationExpiryTime,
      ':updatedAt': new Date().toISOString(),
      ':gsi1pk': 'STATUS#Reserved',
    },
    { '#status': 'status' }
  );

  // Get winner and seller details
  const winnerUser = await getItem(`USER#${winner.userId}`, 'PROFILE');
  const sellerUser = await getItem(`USER#${item.sellerId}`, 'PROFILE');

  // Send email to winner
  if (winnerUser?.email) {
    await sendEmail(
      winnerUser.email,
      'You won an item on EcoBid!',
      `Congratulations! You won "${item.title}". Please confirm pickup within 24 hours.`
    );
  }

  // Send email to seller
  if (sellerUser?.email) {
    await sendEmail(
      sellerUser.email,
      'Winner selected for your item',
      `A winner has been selected for "${item.title}". Winner: ${winnerUser?.name || 'Unknown'}`
    );
  }

  // Schedule reservation expiry check
  await scheduleReservationExpiry(itemId, reservationExpiryTime);

  console.log(`Winner selected for item ${itemId}: ${winner.userId}`);
}

/**
 * Send email using SES
 */
async function sendEmail(to: string, subject: string, body: string): Promise<void> {
  const command = new SendEmailCommand({
    Source: SES_FROM_EMAIL,
    Destination: { ToAddresses: [to] },
    Message: {
      Subject: { Data: subject },
      Body: { Text: { Data: body } },
    },
  });

  await sesClient.send(command);
}

/**
 * Schedule reservation expiry check using EventBridge Scheduler
 */
async function scheduleReservationExpiry(itemId: string, expiryTime: string): Promise<void> {
  const scheduleName = `reservation-expiry-${itemId}`;
  
  const command = new CreateScheduleCommand({
    Name: scheduleName,
    ScheduleExpression: `at(${new Date(expiryTime).toISOString().slice(0, 19)})`,
    Target: {
      Arn: RESERVATION_EXPIRY_LAMBDA_ARN,
      RoleArn: process.env.SCHEDULER_ROLE_ARN!,
      Input: JSON.stringify({ itemId }),
    },
    FlexibleTimeWindow: { Mode: 'OFF' },
  });

  await schedulerClient.send(command);
}
