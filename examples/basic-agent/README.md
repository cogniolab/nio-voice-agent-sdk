# Basic Voice Agent Example

This example demonstrates how to create a simple voice agent using the Nio Voice SDK.

## What it does

1. **Initializes** a voice agent with Deepgram (speech-to-text) and Claude (LLM)
2. **Starts** a voice session
3. **Processes** audio input to get transcripts
4. **Generates** intelligent responses using Claude
5. **Maintains** conversation history
6. **Ends** the session cleanly

## Prerequisites

- Node.js >= 18.0.0
- Deepgram API key ([get one here](https://deepgram.com))
- Anthropic API key ([get one here](https://console.anthropic.com))

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set environment variables:
```bash
export DEEPGRAM_API_KEY="your-deepgram-api-key"
export ANTHROPIC_API_KEY="your-anthropic-api-key"
```

Or create a `.env` file:
```
DEEPGRAM_API_KEY=your-deepgram-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key
```

3. Prepare sample audio:

This example expects two audio files:
- `sample-audio.wav` - First user question
- `followup-audio.wav` - Follow-up question

You can:
- Record your own audio (16kHz, mono, WAV format recommended)
- Use text-to-speech to generate sample audio
- Modify the code to use microphone input instead

## Run

```bash
npm start
```

## Expected Output

```
🎙️  Nio Voice Agent - Basic Example

Initializing voice agent...
✓ Agent initialized

Starting voice session...
✓ Session started: abc-123-def-456

Processing audio input...

🎤 User: "What are your business hours?"
   Confidence: 95.3%

🤖 Agent: "Our business hours are Monday through Friday, 9 AM to 5 PM EST."
   Tokens: 42

──────────────────────────────────────────────────
Result:
  Transcript: "What are your business hours?"
  Response: "Our business hours are Monday through Friday, 9 AM to 5 PM EST."
──────────────────────────────────────────────────

...

Example completed! 🎉
```

## How it works

### 1. Create Voice Agent

```typescript
const agent = new VoiceAgent({
  speech: new DeepgramProvider({
    apiKey: process.env.DEEPGRAM_API_KEY!,
    model: 'nova-2'
  }),
  llm: new AnthropicProvider({
    apiKey: process.env.ANTHROPIC_API_KEY!,
    model: 'claude-3-5-sonnet-20241022'
  }),
  systemPrompt: 'You are a helpful customer service agent.'
});
```

### 2. Initialize

```typescript
await agent.initialize();
```

### 3. Start Session

```typescript
const session = await agent.startSession({
  language: 'en',
  sampleRate: 16000
});
```

### 4. Process Audio

```typescript
const result = await agent.processAudio(session.id, audioBuffer);
console.log(result.transcript.text);  // User's speech
console.log(result.response);         // Agent's response
```

### 5. Listen to Events

```typescript
agent.onEvent((event) => {
  if (event.type === 'transcript:final') {
    console.log('User said:', event.transcript.text);
  }
});
```

## Next Steps

- Check out the [Appointment Booking Example](../appointment-booking) for MCP integration
- Check out the [Customer Support Example](../customer-support) for multi-turn conversations
- Read the [Voice SDK API Documentation](../../docs/api/voice-sdk.md)

## Troubleshooting

### "API key is required"
Make sure you've set the environment variables correctly:
```bash
echo $DEEPGRAM_API_KEY
echo $ANTHROPIC_API_KEY
```

### "Audio file not found"
Create sample audio files or modify the code to use different input methods.

### "Provider initialization failed"
Check that your API keys are valid and have the necessary permissions.

## Learn More

- [Nio Voice SDK Documentation](../../README.md)
- [Deepgram Documentation](https://developers.deepgram.com)
- [Anthropic Documentation](https://docs.anthropic.com)
