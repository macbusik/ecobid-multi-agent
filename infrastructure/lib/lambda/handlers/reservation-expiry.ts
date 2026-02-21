import { ScheduledEvent } from 'aws-lambda';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { getItem, updateItem } from '../shared/dynamodb';

const sesClient = new SESClient({});
const SES_FROM_EMAIL = process.env.SES_FROM_EMAIL!;

/**
 * Reservation Expiry Lambda Handler
 * Checks if reservation has expired and updates item status.
 */
export async function handler(event: ScheduledEvent): Promise<void> {
  try {
    const itemId = event.detail?.itemId;
    
    if (!itemId) {
      console.error('No itemId provided in event');
      return;
    }

    await checkReservationExpiry(itemId);
  } catch (error) {
    console.error('Error in reservation expiry handler:', error);
    throw error;
  }
}

/**
 * Check if reservation has expired and update status
 */
async function checkReservationExpiry(itemId: string): Promise<void> {
  // Get item details
  const item = await getItem(`ITEM#${itemId}`, 'METADATA');
  
  if (!item) {
    console.error(`Item ${itemId} not found`);
    return;
  }

  // Check if item is still in Reserved status (not confirmed)
  if (item.status !== 'Reserved') {
    console.log(`Item ${itemId} status is ${item.status}, not Reserved. No action needed.`);
    return;
  }

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

  // Get seller details and send notification
  const seller = await getItem(`USER#${item.sellerId}`, 'PROFILE');
  
  if (seller?.email) {
    await sendEmailNotification(
      seller.email,
      'Reservation expired for your item',
      `The reservation for "${item.title}" has expired. The winner did not confirm pickup within 24 hours.`
    );
  }

  console.log(`Reservation expired for item ${itemId}`);
}

/**
 * Send email notification using SES
 */
async function sendEmailNotification(to: string, subject: string, body: string): Promise<void> {
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
