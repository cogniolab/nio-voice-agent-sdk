# Nio Voice Agent SDK

**Open-source voice agent platform - Self-hosted alternative to enterprise voice AI solutions**

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)

## 🎯 Why Nio Voice Agent SDK?

Building production voice agents shouldn't require months of integration work and enterprise budgets. Nio Voice Agent SDK provides:

- **🚀 Deploy in minutes, not months** - Pre-built integrations with leading LLM and voice providers
- **💰 Self-hosted or managed** - Run on your infrastructure or use Nio Voice Cloud
- **🔌 MCP-native** - Built-in support for Model Context Protocol
- **🧪 Testing-first** - Human-in-the-loop testing framework included
- **📦 Production-ready** - Session management, streaming, error handling built-in

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                 Nio Voice Agent SDK                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Voice SDK   │  │     MCP      │  │   Testing    │      │
│  │              │  │  Framework   │  │  Framework   │      │
│  │ • Providers  │  │ • Adapters   │  │ • HITL       │      │
│  │ • Streaming  │  │ • Connectors │  │ • Scenarios  │      │
│  │ • Session    │  │ • Testing    │  │ • Assertions │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌─────────────────────────────────────────────────┐        │
│  │         Embeddable Voice Widget                  │        │
│  │         React + Vanilla JS                       │        │
│  └─────────────────────────────────────────────────┘        │
│                                                               │
└─────────────────────────────────────────────────────────────┘
         ↓                  ↓                    ↓
┌───────────────┐  ┌───────────────┐  ┌──────────────────┐
│   Deepgram    │  │  Claude AI    │  │ Your Business    │
│   OpenAI STT  │  │  OpenAI GPT   │  │ Logic (MCP)      │
│   ElevenLabs  │  │  Groq         │  │                  │
└───────────────┘  └───────────────┘  └──────────────────┘
```

## 📦 Packages

### Core Packages

- **[@nio-voice/sdk](./packages/voice-sdk)** - Core voice agent SDK with provider integrations
- **[@nio-voice/mcp-framework](./packages/mcp-framework)** - Model Context Protocol framework for integrations
- **[@nio-voice/testing](./packages/testing-framework)** - Human-in-the-loop testing framework
- **[@nio-voice/widget](./packages/widget)** - Embeddable voice widget for websites

## 🚀 Quick Start

### Installation

```bash
npm install @nio-voice/sdk @nio-voice/mcp-framework
```

### Basic Voice Agent

```typescript
import { VoiceAgent, DeepgramProvider, ClaudeProvider } from '@nio-voice/sdk';

const agent = new VoiceAgent({
  speech: new DeepgramProvider({
    apiKey: process.env.DEEPGRAM_API_KEY
  }),
  llm: new ClaudeProvider({
    apiKey: process.env.ANTHROPIC_API_KEY,
    model: 'claude-3-5-sonnet-20241022'
  }),
  systemPrompt: 'You are a helpful customer service agent.'
});

// Start voice session
await agent.startSession({
  onTranscript: (text) => console.log('User said:', text),
  onResponse: (text) => console.log('Agent said:', text),
  onEnd: () => console.log('Session ended')
});
```

### With MCP Integration

```typescript
import { VoiceAgent } from '@nio-voice/sdk';
import { MCPAdapter } from '@nio-voice/mcp-framework';

const agent = new VoiceAgent({
  // ... voice config
  mcp: new MCPAdapter({
    serverUrl: 'http://localhost:3000/mcp',
    tools: ['book_appointment', 'check_availability']
  })
});

// Agent can now call your business functions via MCP
```

### Add to Your Website

```html
<script src="https://unpkg.com/@nio-voice/widget@latest"></script>
<script>
  NioVoice.init({
    apiKey: 'your-api-key',
    agentId: 'your-agent-id',
    position: 'bottom-right'
  });
</script>
```

## 🎨 Examples

Check out the [examples](./examples) directory for complete working examples:

- **[Basic Agent](./examples/basic-agent)** - Simple customer service agent
- **[Appointment Booking](./examples/appointment-booking)** - Full booking workflow with MCP
- **[Customer Support](./examples/customer-support)** - Multi-turn support conversations

## 📚 Documentation

- [Getting Started Guide](./docs/guides/getting-started.md)
- [Voice SDK API Reference](./docs/api/voice-sdk.md)
- [MCP Framework Guide](./docs/api/mcp-framework.md)
- [Testing Framework Guide](./docs/api/testing-framework.md)
- [Widget Integration Guide](./docs/guides/widget-integration.md)

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## 📜 License

This project is licensed under **AGPL-3.0** - see the [LICENSE](./LICENSE) file for details.

### What does AGPL-3.0 mean?

- ✅ **Free to use** for personal and commercial projects
- ✅ **Modify and distribute** your changes
- ⚠️ **Network use = distribution** - If you offer this as a service over a network, you must share your source code
- 💼 **Commercial license available** - Contact dev@cogniolab.com for closed-source licensing

### Why AGPL?

We chose AGPL-3.0 to ensure that improvements to voice AI technology remain open and accessible to everyone. If you build a hosted service using this code, your users deserve the same freedoms.

**Need a proprietary license?** Contact dev@cogniolab.com

## 🌟 Nio Voice Cloud

Don't want to self-host? Use [Nio Voice Cloud](https://voice.cogniolab.com) for:

- 🎯 **Auto-discovery** - Paste your website URL, get a voice agent instantly
- 🏭 **Industry templates** - Pre-built for healthcare, HVAC, retail, etc.
- 📊 **Analytics dashboard** - Conversation insights and call analytics
- 🔧 **Managed infrastructure** - No servers to manage
- 💬 **Priority support** - Direct access to the Nio team

**Pricing**: $299-$2999/month (vs $100K+ for enterprise alternatives)

## 🆚 Comparison

| Feature | Nio Voice SDK (Open Source) | Retell AI / Vapi | Enterprise (Poly.ai) |
|---------|---------------------------|-----------------|---------------------|
| **Setup Time** | Minutes | Hours | Months |
| **Cost** | Free (self-hosted) | Usage-based ($$) | $100K+ |
| **Flexibility** | Full control | API limits | Consultative |
| **Lock-in** | None | Vendor lock-in | Contract lock-in |
| **Hosting** | Your infrastructure | Their cloud | Their cloud |
| **Source Code** | Available (AGPL) | Closed | Closed |

## 🎯 Roadmap

- [x] Core voice SDK with Deepgram/OpenAI
- [x] Claude and GPT integration
- [x] MCP framework
- [x] Testing framework
- [x] Embeddable widget
- [ ] Phone system integration (Twilio/Bandwidth)
- [ ] Advanced voice customization
- [ ] Multi-language support
- [ ] Real-time translation
- [ ] Voice analytics SDK

## 💬 Community

- [GitHub Discussions](https://github.com/cogniolab/nio-voice-agent-sdk/discussions) - Ask questions, share ideas
- [Discord](https://discord.gg/nio-voice) - Real-time community chat
- [Twitter](https://twitter.com/cogniolab) - Updates and announcements

## 📧 Support

- **Community Support**: GitHub Discussions (free)
- **Email**: dev@cogniolab.com
- **Enterprise Support**: Available with commercial license

---

**Built with ❤️ by [Cognio Labs](https://cogniolab.com)**

*Making voice AI accessible to everyone*
