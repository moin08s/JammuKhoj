/**
 * JammuKhoj Audio Siren, Haptic Vibration & Multilingual Speech Synthesis Service
 * 
 * Provides:
 * 1. Pure Web Audio API synthesized two-tone civil defense emergency alarm (zero external MP3 assets needed).
 * 2. Mobile device hardware vibration pulses via Navigator.vibrate.
 * 3. Offline multilingual text-to-speech evacuation directives in Hindi, Dogri, and English via SpeechSynthesis.
 */

class AudioAlertService {
  private audioCtx: AudioContext | null = null;
  private sirenInterval: any = null;
  private isSirenActive = false;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  /**
   * Plays a distinct, synthesized two-tone civil defense alarm pulse (880 Hz / 440 Hz)
   */
  public playEmergencySiren(durationSeconds: number = 4): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    this.stopEmergencySiren();
    this.isSirenActive = true;

    try {
      const startTime = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      gain.gain.setValueAtTime(0.2, startTime);

      // Alternating frequency between high and low every 350ms
      for (let t = 0; t < durationSeconds; t += 0.7) {
        osc.frequency.setValueAtTime(880, startTime + t);
        osc.frequency.setValueAtTime(440, startTime + t + 0.35);
      }

      gain.gain.setValueAtTime(0.2, startTime + durationSeconds - 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + durationSeconds);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + durationSeconds);

      osc.onended = () => {
        this.isSirenActive = false;
      };
    } catch {
      this.isSirenActive = false;
    }

    // Trigger haptic vibration on mobile devices
    this.triggerEmergencyVibration();
  }

  /**
   * Stops any currently playing audio siren
   */
  public stopEmergencySiren(): void {
    if (this.sirenInterval) {
      clearInterval(this.sirenInterval);
      this.sirenInterval = null;
    }
    this.isSirenActive = false;
  }

  /**
   * Triggers hardware haptic vibration pulses (e.g. SOS pattern)
   */
  public triggerEmergencyVibration(): void {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([400, 150, 400, 150, 800]);
      } catch {}
    }
  }

  /**
   * Speaks aloud the mandatory evacuation directive in the chosen language (Hindi, Dogri, or English)
   */
  public speakEmergencyDirective(
    text: string,
    language: 'en' | 'hi' | 'doi' = 'hi',
    onEnd?: () => void
  ): boolean {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return false;
    }

    try {
      window.speechSynthesis.cancel(); // Cancel any existing speech

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95; // Slightly slower for clarity during emergencies
      utterance.pitch = 1.05;

      // Select matching voice language tag
      if (language === 'hi' || language === 'doi') {
        utterance.lang = 'hi-IN';
      } else {
        utterance.lang = 'en-IN';
      }

      if (onEnd) {
        utterance.onend = onEnd;
      }

      window.speechSynthesis.speak(utterance);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Cancels active speech synthesis
   */
  public stopSpeaking(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  /**
   * Narrates historic or cultural attraction lore in Dogri, Hindi, or English
   */
  public narrateAttractionStory(
    title: string,
    story: string,
    language: 'en' | 'hi' | 'doi' = 'en',
    onEnd?: () => void
  ): void {
    const speechText = `${title}. ${story}`;
    this.speakEmergencyDirective(speechText, language, onEnd);
  }
}

export const audioAlertService = new AudioAlertService();
