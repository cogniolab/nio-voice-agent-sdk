/**
 * Basic Voice Agent Example
 *
 * This example shows how to create a simple voice agent that:
 * 1. Transcribes user speech to text
 * 2. Processes with an LLM (Claude)
 * 3. Returns a text response
 *
 * Prerequisites:
 * - DEEPGRAM_API_KEY environment variable
 * - ANTHROPIC_API_KEY environment variable
 */

import { VoiceAgent, DeepgramProvider, AnthropicProvider } from '@nio-voice/sdk';
import * as fs from 'fs';

async function main() {
  console.log('🎙️  Nio Voice Agent - Basic Example\n');

  // Step 1: Create voice agent with Deepgram (speech) and Claude (LLM)
  const agent = new VoiceAgent({
    speech: new DeepgramProvider({
      apiKey: process.env.DEEPGRAM_API_KEY!,
      model: 'nova-2'
    }),
    llm: new AnthropicProvider({
      apiKey: process.env.ANTHROPIC_API_KEY!,
      model: 'claude-3-5-sonnet-20241022'
    }),
    systemPrompt: 'You are a helpful customer service agent. Be concise and friendly.'
  });

  // Step 2: Initialize the agent
  console.log('Initializing voice agent...');
  await agent.initialize();
  console.log('✓ Agent initialized\n');

  // Step 3: Start a session
  console.log('Starting voice session...');
  const session = await agent.startSession({
    language: 'en',
    sampleRate: 16000
  });
  console.log(`✓ Session started: ${session.id}\n`);

  // Step 4: Listen to agent events
  agent.onEvent((event) => {
    switch (event.type) {
      case 'transcript:final':
        console.log(`🎤 User: "${event.transcript.text}"`);
        console.log(`   Confidence: ${(event.transcript.confidence * 100).toFixed(1)}%\n`);
        break;

      case 'llm:response':
        console.log(`🤖 Agent: "${event.response.text}"`);
        if (event.response.usage) {
          console.log(`   Tokens: ${event.response.usage.totalTokens}`);
        }
        console.log();
        break;

      case 'error':
        console.error(`❌ Error: ${event.error.message}`);
        break;
    }
  });

  // Step 5: Process sample audio
  // In a real application, you would get audio from a microphone or phone call
  console.log('Processing audio input...\n');

  // For this example, we'll use a sample audio file
  // You can record your own audio or use text-to-speech to generate audio
  const audioBuffer = fs.readFileSync('./sample-audio.wav');

  const result = await agent.processAudio(session.id, audioBuffer);

  console.log('─'.repeat(50));
  console.log('Result:');
  console.log(`  Transcript: "${result.transcript.text}"`);
  console.log(`  Response: "${result.response}"`);
  console.log('─'.repeat(50));

  // Step 6: Process another interaction
  console.log('\nProcessing follow-up question...\n');

  const followUpAudio = fs.readFileSync('./followup-audio.wav');
  const followUpResult = await agent.processAudio(session.id, followUpAudio);

  console.log('─'.repeat(50));
  console.log('Follow-up Result:');
  console.log(`  Transcript: "${followUpResult.transcript.text}"`);
  console.log(`  Response: "${followUpResult.response}"`);
  console.log('─'.repeat(50));

  // Step 7: View conversation history
  const history = agent.getConversationHistory(session.id);
  console.log(`\n📜 Conversation History (${history.length} messages):`);
  history.forEach((msg, i) => {
    console.log(`  ${i + 1}. [${msg.role}] ${msg.content}`);
  });

  // Step 8: End session
  console.log('\nEnding session...');
  agent.endSession(session.id);
  console.log('✓ Session ended');

  // Step 9: Cleanup
  await agent.close();
  console.log('✓ Agent closed\n');
  console.log('Example completed! 🎉');
}

// Run example
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
