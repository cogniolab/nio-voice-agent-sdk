import Anthropic from '@anthropic-ai/sdk';
import { BaseLLMProvider, ILLMProvider } from './BaseLLMProvider';
import {
  LLMProviderConfig,
  LLMRequest,
  LLMResponse,
  ChatMessage,
  ToolCall,
  ProviderError
} from '../types';

/**
 * Anthropic Claude LLM provider
 */
export class AnthropicProvider extends BaseLLMProvider implements ILLMProvider {
  private client: Anthropic;

  constructor(config: Omit<LLMProviderConfig, 'provider'>) {
    super({ ...config, provider: 'anthropic' });
    this.client = new Anthropic({
      apiKey: config.apiKey!
    });
  }

  async initialize(): Promise<void> {
    // Anthropic client doesn't require initialization
    this.initialized = true;
  }

  async complete(request: LLMRequest): Promise<LLMResponse> {
    this.ensureInitialized();

    try {
      const messages = this.buildMessages(request);

      // Convert to Anthropic format (no system role in messages)
      const anthropicMessages = messages
        .filter(m => m.role !== 'system')
        .map(m => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content
        }));

      const systemPrompt = messages.find(m => m.role === 'system')?.content;

      const response = await this.client.messages.create({
        model: this.config.model,
        max_tokens: request.maxTokens || this.config.maxTokens || 4096,
        temperature: request.temperature ?? this.config.temperature ?? 1.0,
        system: systemPrompt,
        messages: anthropicMessages,
        tools: request.tools ? this.convertTools(request.tools) : undefined,
        tool_choice: request.toolChoice ? this.convertToolChoice(request.toolChoice) : undefined
      });

      return this.convertResponse(response);
    } catch (error: any) {
      throw new ProviderError(
        `Claude completion failed: ${error.message}`,
        'anthropic',
        { error }
      );
    }
  }

  async stream(
    request: LLMRequest,
    onChunk: (chunk: string) => void
  ): Promise<LLMResponse> {
    this.ensureInitialized();

    try {
      const messages = this.buildMessages(request);

      const anthropicMessages = messages
        .filter(m => m.role !== 'system')
        .map(m => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content
        }));

      const systemPrompt = messages.find(m => m.role === 'system')?.content;

      const stream = await this.client.messages.create({
        model: this.config.model,
        max_tokens: request.maxTokens || this.config.maxTokens || 4096,
        temperature: request.temperature ?? this.config.temperature ?? 1.0,
        system: systemPrompt,
        messages: anthropicMessages,
        tools: request.tools ? this.convertTools(request.tools) : undefined,
        stream: true
      });

      let fullText = '';
      let usage: any = undefined;
      const toolCalls: ToolCall[] = [];

      for await (const event of stream) {
        if (event.type === 'content_block_delta') {
          if (event.delta.type === 'text_delta') {
            const chunk = event.delta.text;
            fullText += chunk;
            onChunk(chunk);
          } else if (event.delta.type === 'tool_use') {
            // Handle tool use in streaming
          }
        } else if (event.type === 'message_delta') {
          if (event.usage) {
            usage = event.usage;
          }
        }
      }

      return {
        text: fullText,
        role: 'assistant',
        toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
        usage: usage ? {
          promptTokens: usage.input_tokens || 0,
          completionTokens: usage.output_tokens || 0,
          totalTokens: (usage.input_tokens || 0) + (usage.output_tokens || 0)
        } : undefined,
        finishReason: 'stop'
      };
    } catch (error: any) {
      throw new ProviderError(
        `Claude streaming failed: ${error.message}`,
        'anthropic',
        { error }
      );
    }
  }

  async close(): Promise<void> {
    // Anthropic client doesn't need explicit cleanup
    this.initialized = false;
  }

  /**
   * Convert SDK tools to Anthropic format
   */
  private convertTools(tools: any[]): any[] {
    return tools.map(tool => ({
      name: tool.name,
      description: tool.description,
      input_schema: tool.parameters
    }));
  }

  /**
   * Convert tool choice to Anthropic format
   */
  private convertToolChoice(toolChoice: any): any {
    if (toolChoice === 'auto') return { type: 'auto' };
    if (toolChoice === 'required') return { type: 'any' };
    if (toolChoice === 'none') return { type: 'none' };
    if (typeof toolChoice === 'object' && toolChoice.name) {
      return { type: 'tool', name: toolChoice.name };
    }
    return { type: 'auto' };
  }

  /**
   * Convert Anthropic response to SDK format
   */
  private convertResponse(response: any): LLMResponse {
    const textContent = response.content.find((c: any) => c.type === 'text');
    const toolUses = response.content.filter((c: any) => c.type === 'tool_use');

    return {
      text: textContent?.text || '',
      role: 'assistant',
      toolCalls: toolUses.length > 0 ? toolUses.map((tu: any) => ({
        id: tu.id,
        name: tu.name,
        arguments: tu.input
      })) : undefined,
      usage: {
        promptTokens: response.usage.input_tokens,
        completionTokens: response.usage.output_tokens,
        totalTokens: response.usage.input_tokens + response.usage.output_tokens
      },
      finishReason: response.stop_reason as any
    };
  }
}
