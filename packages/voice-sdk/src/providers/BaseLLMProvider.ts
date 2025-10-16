import {
  LLMProviderConfig,
  LLMRequest,
  LLMResponse,
  ChatMessage,
  VoiceAgentError
} from '../types';

/**
 * Base interface for LLM providers
 */
export interface ILLMProvider {
  /**
   * Initialize the provider
   */
  initialize(): Promise<void>;

  /**
   * Generate completion
   */
  complete(request: LLMRequest): Promise<LLMResponse>;

  /**
   * Generate streaming completion
   */
  stream(
    request: LLMRequest,
    onChunk: (chunk: string) => void
  ): Promise<LLMResponse>;

  /**
   * Close the provider and cleanup resources
   */
  close(): Promise<void>;
}

/**
 * Abstract base class for LLM providers
 */
export abstract class BaseLLMProvider implements ILLMProvider {
  protected config: LLMProviderConfig;
  protected initialized: boolean = false;

  constructor(config: LLMProviderConfig) {
    this.config = config;
    this.validateConfig();
  }

  /**
   * Validate provider configuration
   */
  protected validateConfig(): void {
    if (!this.config.apiKey && this.config.provider !== 'custom') {
      throw new VoiceAgentError(
        'API key is required',
        'INVALID_CONFIG',
        { provider: this.config.provider }
      );
    }

    if (!this.config.model) {
      throw new VoiceAgentError(
        'Model is required',
        'INVALID_CONFIG',
        { provider: this.config.provider }
      );
    }
  }

  /**
   * Initialize the provider (must be implemented by subclass)
   */
  abstract initialize(): Promise<void>;

  /**
   * Generate completion (must be implemented by subclass)
   */
  abstract complete(request: LLMRequest): Promise<LLMResponse>;

  /**
   * Generate streaming completion (must be implemented by subclass)
   */
  abstract stream(
    request: LLMRequest,
    onChunk: (chunk: string) => void
  ): Promise<LLMResponse>;

  /**
   * Close provider (must be implemented by subclass)
   */
  abstract close(): Promise<void>;

  /**
   * Check if provider is initialized
   */
  protected ensureInitialized(): void {
    if (!this.initialized) {
      throw new VoiceAgentError(
        'Provider not initialized. Call initialize() first.',
        'NOT_INITIALIZED',
        { provider: this.config.provider }
      );
    }
  }

  /**
   * Build messages array from request
   */
  protected buildMessages(request: LLMRequest): ChatMessage[] {
    const messages: ChatMessage[] = [];

    if (request.systemPrompt) {
      messages.push({
        role: 'system',
        content: request.systemPrompt
      });
    }

    messages.push(...request.messages);

    return messages;
  }
}
