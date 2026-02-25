#!/usr/bin/env node
/**
 * Test script for Nova Lite AI integration
 * Uploads 1.jpeg to S3 and analyzes it with Nova Lite
 */

const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');
const fs = require('fs');
const path = require('path');

const REGION = 'eu-central-1';
const BUCKET_NAME = 'ecobid-items-191138354216';
const IMAGE_PATH = path.join(__dirname, '..', '1.jpeg');
const S3_KEY = 'test/1.jpeg';
// Use cross-region inference profile for eu-central-1
const NOVA_LITE_MODEL_ID = 'eu.amazon.nova-lite-v1:0';

async function testNovaLite() {
  console.log('🚀 Starting Nova Lite test...\n');

  // Step 1: Upload image to S3
  console.log('📤 Step 1: Uploading image to S3...');
  const s3Client = new S3Client({ region: REGION });
  
  const imageBuffer = fs.readFileSync(IMAGE_PATH);
  await s3Client.send(new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: S3_KEY,
    Body: imageBuffer,
    ContentType: 'image/jpeg',
  }));
  console.log(`✅ Uploaded to s3://${BUCKET_NAME}/${S3_KEY}\n`);

  // Step 2: Analyze with Nova Lite
  console.log('🤖 Step 2: Analyzing image with Nova Lite...');
  const bedrockClient = new BedrockRuntimeClient({ region: REGION });
  
  const base64Image = imageBuffer.toString('base64');
  
  const requestBody = {
    messages: [
      {
        role: 'user',
        content: [
          {
            image: {
              format: 'jpeg',
              source: {
                bytes: base64Image,
              },
            },
          },
          {
            text: `You are an expert at writing marketplace listings for free household items.

Analyze this photo and generate a listing in JSON format:
{
  "title": "5-10 word catchy title",
  "description": "2-3 sentences describing the item, its condition, and potential uses",
  "category": "one of: Kitchen, Furniture, Electronics, Books, Clothing, Toys, Other"
}

Guidelines:
- Title should be specific and appealing (e.g., "Logitech MX Master Wireless Mouse" not "Mouse")
- Description should mention condition (e.g., "gently used", "like new", "shows wear")
- Description should suggest use cases (e.g., "perfect for home office", "great for students")
- Category should be the best fit from the list
- Keep tone friendly and casual

Return ONLY valid JSON, no other text.`,
          },
        ],
      },
    ],
    inferenceConfig: {
      maxTokens: 300,
      temperature: 0.7,
    },
  };

  const startTime = Date.now();
  const command = new InvokeModelCommand({
    modelId: NOVA_LITE_MODEL_ID,
    body: JSON.stringify(requestBody),
    contentType: 'application/json',
    accept: 'application/json',
  });

  const response = await bedrockClient.send(command);
  const latency = Date.now() - startTime;
  
  const responseBody = JSON.parse(new TextDecoder().decode(response.body));
  const contentList = responseBody.output.message.content;
  const textBlock = contentList.find(item => item.text);
  
  console.log(`✅ Response received in ${latency}ms\n`);

  // Step 3: Parse and display results
  console.log('📋 Step 3: Parsing results...');
  let jsonText = textBlock.text.trim();
  
  // Remove markdown code blocks if present
  if (jsonText.startsWith('```json')) {
    jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  } else if (jsonText.startsWith('```')) {
    jsonText = jsonText.replace(/```\n?/g, '').trim();
  }
  
  const listing = JSON.parse(jsonText);
  
  console.log('\n🎉 AI-Generated Listing:\n');
  console.log('Title:', listing.title);
  console.log('Category:', listing.category);
  console.log('Description:', listing.description);
  console.log('\n✨ Test completed successfully!');
  console.log(`⚡ Total latency: ${latency}ms`);
}

testNovaLite().catch(error => {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
});
