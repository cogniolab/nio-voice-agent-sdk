/**
 * Nio Voice Agent SDK
 * Open-source voice agent platform
 */

// Main classes
export { VoiceAgent } from './VoiceAgent';
export { SessionManager } from './session/SessionManager';

// Provider interfaces
export {
  ISpeechProvider,
  TranscriptionStream,
  BaseSpeechProvider
} from './providers/BaseSpeechProvider';

export {
  ILLMProvider,
  BaseLLMProvider
} from './providers/BaseLLMProvider';

// Concrete providers
export { DeepgramProvider } from './providers/DeepgramProvider';
export { AnthropicProvider } from './providers/AnthropicProvider';

// Types
export * from './types';

// Version
export const VERSION = '0.1.0';
