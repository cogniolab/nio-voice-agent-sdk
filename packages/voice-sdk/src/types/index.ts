/**
 * Core type definitions for Nio Voice Agent SDK
 */

// ============================================================================
// Provider Types
// ============================================================================

/**
 * Supported speech-to-text providers
 */
export type SpeechProvider = 'deepgram' | 'openai' | 'custom';

/**
 * Supported LLM providers
 */
export type LLMProvider = 'anthropic' | 'openai' | 'groq' | 'custom';

/**
 * Supported text-to-speech providers
 */
export type TTSProvider = 'deepgram' | 'elevenlabs' | 'openai' | 'custom';

// ============================================================================
// Session Types
// ============================================================================

/**
 * Voice session status
 */
export enum SessionStatus {
  IDLE = 'idle',
  CONNECTING = 'connecting',
  ACTIVE = 'active',
  PAUSED = 'paused',
  ENDING = 'ending',
  ENDED = 'ended',
  ERROR = 'error'
}

/**
 * Voice session configuration
 */
export interface SessionConfig {
  id?: string;
  language?: string;
  sampleRate?: number;
  encoding?: string;
  interruptible?: boolean;
  endpointing?: {
    enabled: boolean;
    silenceThreshold?: number; // ms
    endThreshold?: number; // ms
  };
  metadata?: Record<string, any>;
}

/**
 * Active voice session
 */
export interface VoiceSession {
  id: string;
  status: SessionStatus;
  config: SessionConfig;
  startedAt: Date;
  endedAt?: Date;
  duration?: number; // seconds
  metadata: Record<string, any>;
}

// ============================================================================
// Audio Types
// ============================================================================

/**
 * Audio format configuration
 */
export interface AudioConfig {
  encoding: 'linear16' | 'mulaw' | 'opus' | 'mp3';
  sampleRate: 8000 | 16000 | 24000 | 48000;
  channels: 1 | 2;
  bitDepth?: 8 | 16 | 24 | 32;
}

/**
 * Audio chunk for streaming
 */
export interface AudioChunk {
  data: Buffer;
  timestamp: number;
  sequenceNumber?: number;
  isFinal?: boolean;
}

// ============================================================================
// Transcript Types
// ============================================================================

/**
 * Transcript result from speech-to-text
 */
export interface Transcript {
  text: string;
  confidence: number;
  isFinal: boolean;
  words?: TranscriptWord[];
  language?: string;
  timestamp: number;
  duration?: number;
}

/**
 * Individual word in transcript
 */
export interface TranscriptWord {
  word: string;
  start: number;
  end: number;
  confidence: number;
}

// ============================================================================
// LLM Types
// ============================================================================

/**
 * LLM request
 */
export interface LLMRequest {
  messages: ChatMessage[];
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  tools?: Tool[];
  toolChoice?: 'auto' | 'required' | 'none' | { name: string };
  stream?: boolean;
}

/**
 * LLM response
 */
export interface LLMResponse {
  text: string;
  role: 'assistant';
  toolCalls?: ToolCall[];
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  finishReason?: 'stop' | 'length' | 'tool_calls' | 'content_filter';
}

/**
 * Chat message
 */
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  name?: string;
  toolCallId?: string;
}

/**
 * Tool definition
 */
export interface Tool {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };
}

/**
 * Tool call from LLM
 */
export interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, any>;
}

// ============================================================================
// Agent Types
// ============================================================================

/**
 * Voice agent configuration
 */
export interface VoiceAgentConfig {
  speech: SpeechProviderConfig;
  llm: LLMProviderConfig;
  tts?: TTSProviderConfig;
  systemPrompt: string;
  tools?: Tool[];
  session?: SessionConfig;
  audio?: AudioConfig;
}

/**
 * Speech provider configuration
 */
export interface SpeechProviderConfig {
  provider: SpeechProvider;
  apiKey?: string;
  model?: string;
  language?: string;
  options?: Record<string, any>;
}

/**
 * LLM provider configuration
 */
export interface LLMProviderConfig {
  provider: LLMProvider;
  apiKey?: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
  options?: Record<string, any>;
}

/**
 * TTS provider configuration
 */
export interface TTSProviderConfig {
  provider: TTSProvider;
  apiKey?: string;
  voice: string;
  model?: string;
  speed?: number;
  pitch?: number;
  options?: Record<string, any>;
}

// ============================================================================
// Event Types
// ============================================================================

/**
 * Voice agent events
 */
export type VoiceAgentEvent =
  | { type: 'session:start'; session: VoiceSession }
  | { type: 'session:end'; session: VoiceSession }
  | { type: 'audio:input'; audio: AudioChunk }
  | { type: 'audio:output'; audio: AudioChunk }
  | { type: 'transcript:partial'; transcript: Transcript }
  | { type: 'transcript:final'; transcript: Transcript }
  | { type: 'llm:start'; request: LLMRequest }
  | { type: 'llm:response'; response: LLMResponse }
  | { type: 'llm:stream'; chunk: string }
  | { type: 'tool:call'; toolCall: ToolCall }
  | { type: 'tool:result'; toolCall: ToolCall; result: any }
  | { type: 'error'; error: Error };

/**
 * Event listener function
 */
export type EventListener = (event: VoiceAgentEvent) => void | Promise<void>;

// ============================================================================
// Error Types
// ============================================================================

/**
 * Voice agent error
 */
export class VoiceAgentError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'VoiceAgentError';
  }
}

/**
 * Provider error
 */
export class ProviderError extends VoiceAgentError {
  constructor(message: string, public provider: string, details?: any) {
    super(message, 'PROVIDER_ERROR', { provider, ...details });
    this.name = 'ProviderError';
  }
}

/**
 * Session error
 */
export class SessionError extends VoiceAgentError {
  constructor(message: string, public sessionId: string, details?: any) {
    super(message, 'SESSION_ERROR', { sessionId, ...details });
    this.name = 'SessionError';
  }
}
