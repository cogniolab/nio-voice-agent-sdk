import { createClient, LiveTranscriptionEvents, LiveClient } from '@deepgram/sdk';
import {
  BaseSpeechProvider,
  ISpeechProvider,
  TranscriptionStream
} from './BaseSpeechProvider';
import {
  SpeechProviderConfig,
  Transcript,
  AudioChunk,
  SessionConfig,
  ProviderError
} from '../types';
import { EventEmitter } from 'events';

/**
 * Deepgram speech-to-text provider
 */
export class DeepgramProvider extends BaseSpeechProvider implements ISpeechProvider {
  private client: any;

  constructor(config: Omit<SpeechProviderConfig, 'provider'>) {
    super({ ...config, provider: 'deepgram' });
  }

  async initialize(): Promise<void> {
    try {
      this.client = createClient(this.config.apiKey!);
      this.initialized = true;
    } catch (error: any) {
      throw new ProviderError(
        `Failed to initialize Deepgram: ${error.message}`,
        'deepgram',
        { error }
      );
    }
  }

  async startStream(config: SessionConfig): Promise<TranscriptionStream> {
    this.ensureInitialized();

    return new DeepgramTranscriptionStream(
      this.client,
      config,
      this.config
    );
  }

  async transcribe(audio: Buffer, config?: SessionConfig): Promise<Transcript> {
    this.ensureInitialized();

    try {
      const { result, error } = await this.client.listen.prerecorded.transcribeFile(
        audio,
        {
          model: this.config.model || 'nova-2',
          language: config?.language || this.config.language || 'en',
          punctuate: true,
          diarize: false
        }
      );

      if (error) {
        throw new Error(error.message);
      }

      const channel = result.results.channels[0];
      const alternative = channel.alternatives[0];

      return {
        text: alternative.transcript,
        confidence: alternative.confidence,
        isFinal: true,
        words: alternative.words?.map((w: any) => ({
          word: w.word,
          start: w.start,
          end: w.end,
          confidence: w.confidence
        })),
        language: result.results.language,
        timestamp: Date.now(),
        duration: result.metadata.duration
      };
    } catch (error: any) {
      throw new ProviderError(
        `Transcription failed: ${error.message}`,
        'deepgram',
        { error }
      );
    }
  }

  async close(): Promise<void> {
    // Deepgram client doesn't need explicit cleanup
    this.initialized = false;
  }
}

/**
 * Deepgram transcription stream implementation
 */
class DeepgramTranscriptionStream extends EventEmitter implements TranscriptionStream {
  private connection: LiveClient;
  private closed: boolean = false;

  constructor(
    client: any,
    sessionConfig: SessionConfig,
    providerConfig: SpeechProviderConfig
  ) {
    super();

    const connection = client.listen.live({
      model: providerConfig.model || 'nova-2',
      language: sessionConfig.language || providerConfig.language || 'en',
      punctuate: true,
      interim_results: true,
      endpointing: sessionConfig.endpointing?.enabled ?
        sessionConfig.endpointing.silenceThreshold || 300 :
        false,
      encoding: sessionConfig.encoding || 'linear16',
      sample_rate: sessionConfig.sampleRate || 16000
    });

    this.connection = connection;

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.connection.on(LiveTranscriptionEvents.Open, () => {
      // Connection opened
    });

    this.connection.on(LiveTranscriptionEvents.Transcript, (data: any) => {
      const channel = data.channel;
      const alternative = channel.alternatives[0];

      if (!alternative || !alternative.transcript) {
        return;
      }

      const transcript: Transcript = {
        text: alternative.transcript,
        confidence: alternative.confidence,
        isFinal: data.is_final,
        words: alternative.words?.map((w: any) => ({
          word: w.word,
          start: w.start,
          end: w.end,
          confidence: w.confidence
        })),
        language: data.metadata?.model_info?.language,
        timestamp: Date.now(),
        duration: data.duration
      };

      this.emit('transcript', transcript);
    });

    this.connection.on(LiveTranscriptionEvents.Error, (error: any) => {
      this.emit('error', new ProviderError(
        `Deepgram error: ${error.message}`,
        'deepgram',
        { error }
      ));
    });

    this.connection.on(LiveTranscriptionEvents.Close, () => {
      this.closed = true;
      this.emit('close');
    });
  }

  async send(audio: AudioChunk): Promise<void> {
    if (this.closed) {
      throw new ProviderError(
        'Cannot send audio to closed stream',
        'deepgram'
      );
    }

    this.connection.send(audio.data);
  }

  async close(): Promise<void> {
    if (!this.closed) {
      this.connection.finish();
      this.closed = true;
    }
  }
}
