import { FAHH_AUDIO_BASE64, NOICE_AUDIO_BASE64, REBEL_SAAB_AUDIO_BASE64 } from './audioData';

const SOUND_STORAGE_KEY = 'nptel_sound_enabled';

// Listeners for reactive sound state updates across components
type SoundListener = (enabled: boolean) => void;
const listeners = new Set<SoundListener>();

/**
 * Checks if sound effects are enabled in user preferences.
 * Defaults to true.
 */
export function getSoundEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const val = localStorage.getItem(SOUND_STORAGE_KEY);
    return val !== 'false'; // default true
  } catch (e) {
    return true;
  }
}

/**
 * Persists sound enabled / disabled preference and notifies subscribers.
 */
export function setSoundEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SOUND_STORAGE_KEY, enabled ? 'true' : 'false');
    listeners.forEach((fn) => fn(enabled));
  } catch (e) {
    console.warn('Failed to save sound preference:', e);
  }
}

export function subscribeSoundState(listener: SoundListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// Pre-instantiated audio elements with embedded base64 data for instantaneous latency-free playback
let fahhAudio: HTMLAudioElement | null = null;
let noiceAudio: HTMLAudioElement | null = null;
let rebelSaabAudio: HTMLAudioElement | null = null;

function getFahhAudio(): HTMLAudioElement {
  if (!fahhAudio && typeof window !== 'undefined') {
    fahhAudio = new Audio(FAHH_AUDIO_BASE64);
    fahhAudio.volume = 0.9;
    fahhAudio.preload = 'auto';
  }
  return fahhAudio!;
}

function getNoiceAudio(): HTMLAudioElement {
  if (!noiceAudio && typeof window !== 'undefined') {
    noiceAudio = new Audio(NOICE_AUDIO_BASE64);
    noiceAudio.volume = 0.9;
    noiceAudio.preload = 'auto';
  }
  return noiceAudio!;
}

function getRebelSaabAudio(): HTMLAudioElement {
  if (!rebelSaabAudio && typeof window !== 'undefined') {
    rebelSaabAudio = new Audio(REBEL_SAAB_AUDIO_BASE64);
    rebelSaabAudio.volume = 0.95;
    rebelSaabAudio.preload = 'auto';
  }
  return rebelSaabAudio!;
}

function stopAllAudios(): void {
  if (fahhAudio) {
    try {
      fahhAudio.pause();
      fahhAudio.currentTime = 0;
    } catch (e) {}
  }
  if (noiceAudio) {
    try {
      noiceAudio.pause();
      noiceAudio.currentTime = 0;
    } catch (e) {}
  }
  if (rebelSaabAudio) {
    try {
      rebelSaabAudio.pause();
      rebelSaabAudio.currentTime = 0;
    } catch (e) {}
  }
}

function playAudioElement(audio: HTMLAudioElement): Promise<void> {
  if (!getSoundEnabled() || typeof window === 'undefined') {
    return Promise.resolve();
  }

  try {
    stopAllAudios();
    audio.currentTime = 0;
    const promise = audio.play();
    if (promise !== undefined) {
      return promise.catch((err) => {
        console.warn('Audio play prevented or interrupted:', err);
      });
    }
  } catch (err) {
    console.warn('Audio play error:', err);
  }
  return Promise.resolve();
}

/**
 * Plays the "Rebel Saab - The Raja Saab" sound effect (for scores > 90%)
 */
export function playRebelSaabSound(): Promise<void> {
  return playAudioElement(getRebelSaabAudio());
}

/**
 * Plays the "noice" sound effect (for scores >= 75% or correct answers)
 */
export function playNoiceSound(): Promise<void> {
  return playAudioElement(getNoiceAudio());
}

/**
 * Plays the "fahh" sound effect (for scores < 75% or incorrect answers)
 */
export function playFahhSound(): Promise<void> {
  return playAudioElement(getFahhAudio());
}

/**
 * Evaluates the quiz outcome:
 * If accuracy > 90% (or >= 90%) -> plays "Rebel Saab - The Raja Saab"
 * If accuracy >= 75% -> plays "noice"
 * Otherwise (< 75%) -> plays "fahh"
 */
export function playQuizResultAudio(
  accuracy: number,
  totalQuestions: number,
  correctCount: number
): 'rebel-saab' | 'noice' | 'fahh' | 'muted' {
  if (!getSoundEnabled()) {
    return 'muted';
  }

  // Score above 90% triggers "Rebel Saab - The Raja Saab"
  const isSuperScore = accuracy > 90 || accuracy >= 90;

  if (isSuperScore) {
    playRebelSaabSound();
    return 'rebel-saab';
  }

  // Score >= 75% triggers "noice"
  const isSuccess = accuracy >= 75 || (totalQuestions > 0 && correctCount === totalQuestions);

  if (isSuccess) {
    playNoiceSound();
    return 'noice';
  } else {
    // Score < 75% triggers "fahh"
    playFahhSound();
    return 'fahh';
  }
}
