# Contributing to Nio Voice Agent SDK

Thank you for your interest in contributing to Nio Voice Agent SDK! We welcome contributions from the community.

## 📜 License Agreement

By contributing to this project, you agree that your contributions will be licensed under the **AGPL-3.0** license. This means:

- Your code will be freely available to the community
- Any network services using your code must also be open source (AGPL requirement)
- You retain copyright to your contributions
- You grant Cognio Labs the right to include your contribution in commercial licenses

If you need clarification on licensing, please email dev@cogniolab.com

## 🎯 Ways to Contribute

### 1. Report Bugs

Found a bug? Please open an issue with:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node version, etc.)

### 2. Suggest Features

Have an idea? Open a feature request with:
- Clear description of the feature
- Use case explaining why it's needed
- Example of how it would work
- Potential implementation approach

### 3. Submit Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass: `npm test`
6. Format code: `npm run format`
7. Commit: `git commit -m "feat: add amazing feature"`
8. Push: `git push origin feature/amazing-feature`
9. Open a Pull Request

## 🛠️ Development Setup

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Setup Steps

```bash
# Clone repository
git clone https://github.com/cogniolab/nio-voice-agent-sdk.git
cd nio-voice-agent-sdk

# Install dependencies
npm install

# Build all packages
npm run build

# Run tests
npm test

# Run in development mode
npm run dev
```

### Running Examples

```bash
# Navigate to example
cd examples/basic-agent

# Install dependencies
npm install

# Set environment variables
cp .env.example .env
# Edit .env with your API keys

# Run example
npm start
```

## 📝 Code Style

- Follow existing code patterns
- Use TypeScript with strict type checking
- Write clear, descriptive variable and function names
- Add JSDoc comments for public APIs
- Keep functions focused and small (< 50 lines)

### TypeScript Guidelines

```typescript
// Good: Clear types, good naming
async function startVoiceSession(
  config: VoiceConfig,
  options?: SessionOptions
): Promise<Session> {
  // Implementation
}

// Bad: Unclear types, vague naming
async function start(c: any, opts?: any): Promise<any> {
  // Implementation
}
```

## 🧪 Testing

- Write unit tests for all new functionality
- Use Jest for testing framework
- Mock external dependencies (Deepgram, OpenAI, etc.)
- Aim for >80% code coverage

Example test:

```typescript
import { VoiceAgent } from '../src/VoiceAgent';

describe('VoiceAgent', () => {
  let agent: VoiceAgent;

  beforeEach(() => {
    agent = new VoiceAgent({
      speech: mockSpeechProvider,
      llm: mockLLMProvider
    });
  });

  test('should start session', async () => {
    const session = await agent.startSession();
    expect(session.id).toBeDefined();
  });
});
```

## 📚 Documentation

- Update documentation for new features
- Add examples for new functionality
- Keep README up to date
- Add JSDoc comments for public APIs

## 🎯 Priority Areas

We'd love help with:

1. **Provider Integrations** - Add support for more LLM and speech providers
2. **MCP Connectors** - Build connectors for popular services
3. **Testing Tools** - Improve the testing framework
4. **Examples** - Create more real-world examples
5. **Documentation** - Improve guides and tutorials
6. **Performance** - Optimize streaming and session management

## 🔒 Security

**Found a security vulnerability?** Please **DO NOT** open a public issue.

Email dev@cogniolab.com with:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

We will respond within 48 hours and work with you to address the issue.

## 💬 Communication

- **GitHub Discussions** - Ask questions, share ideas
- **Discord** - Real-time community chat
- **Email** - dev@cogniolab.com for sensitive matters

## 🎖️ Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Credited in release notes
- Eligible for Nio Voice swag
- Invited to contributor calls

## 📋 Commit Message Guidelines

Use conventional commits:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `test:` - Test additions or changes
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `chore:` - Build process or tooling changes

Examples:

```
feat: add Groq LLM provider
fix: resolve session cleanup memory leak
docs: update MCP framework guide
test: add integration tests for voice streaming
```

## ⚖️ Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Provide constructive feedback
- Focus on collaboration
- Respect different perspectives

## 🚀 Release Process

1. Maintainers review and approve PRs
2. Changes are merged to `main`
3. CI/CD runs tests and builds
4. Semantic versioning for releases
5. Changelog generated automatically
6. npm packages published

## 📞 Questions?

- GitHub Discussions: Ask the community
- Email: dev@cogniolab.com
- Discord: Join our community

---

Thank you for contributing to Nio Voice Agent SDK! Together, we're making voice AI accessible to everyone. 🎉
