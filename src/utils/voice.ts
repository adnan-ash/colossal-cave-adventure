/**
 * 1970s Mainframe Speech Synthesizer Utility
 * Emulates vintage retro computer voice terminal via Web Speech API.
 */

class VoiceSystem {
  private enabled: boolean = false;
  private synth: SpeechSynthesis | null = null;
  private isSpeaking: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('colossal_voice_enabled');
        this.enabled = stored === 'true';
      } catch {
        this.enabled = false;
      }

      if ('speechSynthesis' in window) {
        this.synth = window.speechSynthesis;
      }
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setEnabled(enable: boolean) {
    this.enabled = enable;
    try {
      localStorage.setItem('colossal_voice_enabled', enable.toString());
    } catch {
      // Ignore storage errors
    }
    if (!enable) {
      this.cancel();
    }
  }

  public toggle(): boolean {
    this.setEnabled(!this.enabled);
    return this.enabled;
  }

  public cancel() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
    }
  }

  public speak(text: string, interrupt: boolean = true) {
    if (!this.enabled || !this.synth) return;

    if (interrupt) {
      this.synth.cancel();
    }

    // Strip bracket tags like [KEYS] or [T01] for clean verbal speech
    const cleanText = text
      .replace(/\[[^\]]+\]/g, '')
      .replace(/[><_#*~`]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return;

    try {
      const utterance = new SpeechSynthesisUtterance(cleanText);
      // Mainframe pitch and cadence
      utterance.pitch = 0.88;
      utterance.rate = 1.08;

      // Select an English voice if available
      const voices = this.synth.getVoices();
      const retroVoice = voices.find(
        (v) => v.lang.startsWith('en') && (v.name.includes('David') || v.name.includes('Daniel') || v.name.includes('Fred') || v.name.includes('Alex'))
      ) || voices.find((v) => v.lang.startsWith('en'));

      if (retroVoice) {
        utterance.voice = retroVoice;
      }

      utterance.onstart = () => {
        this.isSpeaking = true;
      };
      utterance.onend = () => {
        this.isSpeaking = false;
      };
      utterance.onerror = () => {
        this.isSpeaking = false;
      };

      this.synth.speak(utterance);
    } catch {
      // Graceful fallback if speech synthesis is disabled or blocked
    }
  }
}

export const voice = new VoiceSystem();
