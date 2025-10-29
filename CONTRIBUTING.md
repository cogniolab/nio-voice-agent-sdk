# Contributing to nio-voice-agent-sdk

Thank you for your interest in contributing to nio-voice-agent-sdk! This document provides guidelines for participating in our community.

## Code of Conduct

We're committed to providing a welcoming environment. Please treat all community members with respect and foster inclusive discussions.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/nio-voice-agent-sdk.git`
3. Create a feature branch: `git checkout -b feature/your-feature-name`
4. Make your changes and commit with clear messages
5. Push to your fork and submit a Pull Request

## Development Setup

```bash
# Install dependencies
pip install -r requirements.txt
pip install -r requirements-dev.txt

# Run tests
pytest tests/

# Format code
black .
isort .

# Lint
pylint src/
```

## Contribution Types

### Bug Reports
- Use GitHub Issues with the "bug" label
- Include reproduction steps, expected behavior, and actual behavior
- Specify your environment (OS, Python version, etc.)

### Feature Requests
- Label as "enhancement"
- Describe the use case and benefits
- Provide examples if applicable

### Code Contributions
- Write clean, well-documented code
- Add tests for new functionality (maintain >80% coverage)
- Follow PEP 8 style guidelines
- Update relevant documentation

### Documentation
- Fix typos and clarify explanations
- Add examples for complex features
- Update README and API docs as needed

## Commit Guidelines

Use conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `test:` Tests
- `refactor:` Code refactoring

Example: `feat: add streaming audio support for websocket connections`

## Pull Request Process

1. Ensure all tests pass: `pytest tests/`
2. Update CHANGELOG.md with your changes
3. Add yourself to CONTRIBUTORS.md
4. Write a clear PR description explaining your changes
5. Reference related issues using `Closes #123`
6. Maintain backwards compatibility when possible
7. Wait for at least one maintainer approval

## License

By contributing, you agree that your contributions will be licensed under the AGPL-3.0 license. See LICENSE file for details.

## Reporting Security Issues

Do not open public issues for security vulnerabilities. Email security@nio-agent.dev instead.

## Questions?

- Check existing issues and discussions first
- Ask in GitHub Discussions for general questions
- Join our Discord community (link in README)

## Recognition

Contributors are recognized in:
- CONTRIBUTORS.md
- Release notes for significant contributions
- Community highlights on our website

Thank you for making nio-voice-agent-sdk better!