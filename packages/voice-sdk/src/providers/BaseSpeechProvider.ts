import {
  SpeechProviderConfig,
  Transcript,
  AudioChunk,
  SessionConfig,
  VoiceAgentError
} from '../types';

/**
 * Base interface for speech-to-text providers
 */
export interface ISpeechProvider {
  /**
   * Initialize the provider
   */
  initialize(): Promise<void>;

  /**
   * Start a streaming transcription session
   */
  startStream(config: SessionConfig): Promise<TranscriptionStream>;

  /**
   * Transcribe audio buffer (non-streaming)
   */
  transcribe(audio: Buffer, config?: SessionConfig): Promise<Transcript>;

  /**
   * Close the provider and cleanup resources
   */
  close(): Promise<void>;
}

/**
 * Transcription stream interface
 */
export interface TranscriptionStream {
  /**
   * Send audio chunk for transcription
   */
  send(audio: AudioChunk): Promise<void>;

  /**
   * Listen for transcript events
   */
  on(event: 'transcript', listener: (transcript: Transcript) => void): void;
  on(event: 'error', listener: (error: Error) => void): void;
  on(event: 'close', listener: () => void): void;

  /**
   * Close the stream
   */
  close(): Promise<void>;
}

/**
 * Abstract base class for speech providers
 */
export abstract class BaseSpeechProvider implements ISpeechProvider {
  protected config: SpeechProviderConfig;
  protected initialized: boolean = false;

  constructor(config: SpeechProviderConfig) {
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
  }

  /**
   * Initialize the provider (must be implemented by subclass)
   */
  abstract initialize(): Promise<void>;

  /**
   * Start streaming transcription (must be implemented by subclass)
   */
  abstract startStream(config: SessionConfig): Promise<TranscriptionStream>;

  /**
   * Transcribe audio buffer (must be implemented by subclass)
   */
  abstract transcribe(audio: Buffer, config?: SessionConfig): Promise<Transcript>;

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
}
