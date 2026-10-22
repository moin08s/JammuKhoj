/**
 * JammuKhoj Voice Search Service
 * Provides speech-to-text input for senior pilgrims and travellers in English and Hindi/Dogri
 * Uses browser-native SpeechRecognition / webkitSpeechRecognition with zero external network overhead
 */

export interface VoiceSearchOptions {
  onResult: (transcript: string) => void;
  onError?: (error: string) => void;
  onStateChange?: (isListening: boolean) => void;
  lang?: string; // e.g. 'hi-IN' or 'en-IN'
}

class VoiceSearchService {
  private recognition: any = null;
  private isListening: boolean = false;

  public isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return !!(
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition
    );
  }

  public getIsListening(): boolean {
    return this.isListening;
  }

  public startListening(options: VoiceSearchOptions): () => void {
    if (!this.isSupported()) {
      if (options.onError) {
        options.onError('Voice recognition is not supported in this browser.');
      }
      return () => {};
    }

    // Stop existing session if active
    this.stopListening();

    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      const recognition = new SpeechRecognition();
      this.recognition = recognition;

      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = options.lang || 'hi-IN'; // Default to Indian Hindi/Dogri recognition
      recognition.maxAlternatives = 1;

      // Haptic confirmation for senior pilgrims
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate(40);
        } catch (_) {}
      }

      recognition.onstart = () => {
        this.isListening = true;
        if (options.onStateChange) options.onStateChange(true);
      };

      recognition.onresult = (event: any) => {
        if (event.results && event.results.length > 0) {
          const transcript = event.results[0][0]?.transcript || '';
          if (transcript.trim()) {
            options.onResult(transcript.trim());
          }
        }
      };

      recognition.onerror = (event: any) => {
        this.isListening = false;
        if (options.onStateChange) options.onStateChange(false);
        if (options.onError) {
          const err = event.error === 'no-speech' ? 'No voice detected' : event.error;
          options.onError(err);
        }
      };

      recognition.onend = () => {
        this.isListening = false;
        if (options.onStateChange) options.onStateChange(false);
      };

      recognition.start();

      return () => {
        this.stopListening();
      };
    } catch (e: any) {
      this.isListening = false;
      if (options.onStateChange) options.onStateChange(false);
      if (options.onError) options.onError(e?.message || 'Failed to start microphone');
      return () => {};
    }
  }

  public stopListening(): void {
    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch (_) {}
      this.recognition = null;
    }
    this.isListening = false;
  }
}

export const voiceSearchService = new VoiceSearchService();
