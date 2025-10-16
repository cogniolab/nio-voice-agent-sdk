import { EventEmitter } from 'events';
import { ISpeechProvider } from './providers/BaseSpeechProvider';
import { ILLMProvider } from './providers/BaseLLMProvider';
import { SessionManager } from './session/SessionManager';
import {
  VoiceAgentConfig,
  VoiceSession,
  SessionConfig,
  SessionStatus,
  VoiceAgentEvent,
  EventListener,
  Transcript,
  LLMRequest,
  ChatMessage,
  ToolCall,
  VoiceAgentError
} from './types';

/**
 * Main Voice Agent class
 */
export class VoiceAgent extends EventEmitter {
  private speechProvider: ISpeechProvider;
  private llmProvider: ILLMProvider;
  private sessionManager: SessionManager;
  private systemPrompt: string;
  private conversationHistory: Map<string, ChatMessage[]> = new Map();

  constructor(config: VoiceAgentConfig) {
    super();

    // Create providers from config
    this.speechProvider = this.createSpeechProvider(config.speech);
    this.llmProvider = this.createLLMProvider(config.llm);
    this.sessionManager = new SessionManager();
    this.systemPrompt = config.systemPrompt;
  }

  /**
   * Initialize the voice agent
   */
  async initialize(): Promise<void> {
    await Promise.all([
      this.speechProvider.initialize(),
      this.llmProvider.initialize()
    ]);
  }

  /**
   * Start a voice session
   */
  async startSession(config: SessionConfig = {}): Promise<VoiceSession> {
    // Create session
    const session = this.sessionManager.createSession(config);
    this.conversationHistory.set(session.id, []);

    // Emit event
    this.emitEvent({ type: 'session:start', session });

    // Update status to active
    this.sessionManager.updateSessionStatus(session.id, SessionStatus.ACTIVE);

    return session;
  }

  /**
   * Process audio input and get response
   */
  async processAudio(
    sessionId: string,
    audio: Buffer
  ): Promise<{
    transcript: Transcript;
    response: string;
    toolCalls?: ToolCall[];
  }> {
    const session = this.sessionManager.getSession(sessionId);
    if (!session) {
      throw new VoiceAgentError(
        `Session not found: ${sessionId}`,
        'SESSION_NOT_FOUND'
      );
    }

    // Step 1: Transcribe audio
    this.emitEvent({
      type: 'audio:input',
      audio: { data: audio, timestamp: Date.now() }
    });

    const transcript = await this.speechProvider.transcribe(audio, session.config);

    this.emitEvent({ type: 'transcript:final', transcript });

    // Step 2: Get conversation history
    const history = this.conversationHistory.get(sessionId) || [];

    // Add user message
    history.push({
      role: 'user',
      content: transcript.text
    });

    // Step 3: Get LLM response
    const llmRequest: LLMRequest = {
      messages: history,
      systemPrompt: this.systemPrompt,
      stream: false
    };

    this.emitEvent({ type: 'llm:start', request: llmRequest });

    const llmResponse = await this.llmProvider.complete(llmRequest);

    this.emitEvent({ type: 'llm:response', response: llmResponse });

    // Add assistant response to history
    history.push({
      role: 'assistant',
      content: llmResponse.text
    });

    this.conversationHistory.set(sessionId, history);

    // Handle tool calls if any
    if (llmResponse.toolCalls) {
      for (const toolCall of llmResponse.toolCalls) {
        this.emitEvent({ type: 'tool:call', toolCall });
      }
    }

    return {
      transcript,
      response: llmResponse.text,
      toolCalls: llmResponse.toolCalls
    };
  }

  /**
   * Send tool result back to LLM
   */
  async sendToolResult(
    sessionId: string,
    toolCall: ToolCall,
    result: any
  ): Promise<string> {
    const history = this.conversationHistory.get(sessionId) || [];

    // Add tool result to history
    history.push({
      role: 'tool',
      content: JSON.stringify(result),
      name: toolCall.name,
      toolCallId: toolCall.id
    });

    // Get LLM response with tool result
    const llmRequest: LLMRequest = {
      messages: history,
      systemPrompt: this.systemPrompt
    };

    const llmResponse = await this.llmProvider.complete(llmRequest);

    // Add assistant response
    history.push({
      role: 'assistant',
      content: llmResponse.text
    });

    this.conversationHistory.set(sessionId, history);

    this.emitEvent({ type: 'tool:result', toolCall, result });

    return llmResponse.text;
  }

  /**
   * End a session
   */
  endSession(sessionId: string): void {
    const session = this.sessionManager.getSession(sessionId);
    if (!session) {
      throw new VoiceAgentError(
        `Session not found: ${sessionId}`,
        'SESSION_NOT_FOUND'
      );
    }

    this.sessionManager.endSession(sessionId);
    this.conversationHistory.delete(sessionId);

    this.emitEvent({ type: 'session:end', session });
  }

  /**
   * Get session
   */
  getSession(sessionId: string): VoiceSession | undefined {
    return this.sessionManager.getSession(sessionId);
  }

  /**
   * Get conversation history
   */
  getConversationHistory(sessionId: string): ChatMessage[] {
    return this.conversationHistory.get(sessionId) || [];
  }

  /**
   * Close the agent
   */
  async close(): Promise<void> {
    await Promise.all([
      this.speechProvider.close(),
      this.llmProvider.close()
    ]);

    // Clean up all sessions
    const activeSessions = this.sessionManager.getActiveSessions();
    for (const session of activeSessions) {
      this.sessionManager.endSession(session.id);
    }

    this.conversationHistory.clear();
  }

  /**
   * Emit event to listeners
   */
  private emitEvent(event: VoiceAgentEvent): void {
    this.emit('event', event);
    this.emit(event.type, event);
  }

  /**
   * Add event listener
   */
  onEvent(listener: EventListener): void {
    this.on('event', listener);
  }

  /**
   * Remove event listener
   */
  offEvent(listener: EventListener): void {
    this.off('event', listener);
  }

  /**
   * Create speech provider from config
   */
  private createSpeechProvider(config: any): ISpeechProvider {
    // This will be implemented based on config.provider
    // For now, throw error - providers should be passed directly
    throw new Error('Provider factory not implemented. Pass provider instances directly.');
  }

  /**
   * Create LLM provider from config
   */
  private createLLMProvider(config: any): ILLMProvider {
    // This will be implemented based on config.provider
    // For now, throw error - providers should be passed directly
    throw new Error('Provider factory not implemented. Pass provider instances directly.');
  }
}
