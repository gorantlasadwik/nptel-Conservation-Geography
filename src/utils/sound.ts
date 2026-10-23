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
import type { TeluguMeme } from '../data/teluguMemes';
import { getMemeAudioUrl } from '../data/teluguMemes';

let fahhAudio: HTMLAudioElement | null = null;
let noiceAudio: HTMLAudioElement | null = null;
let rebelSaabAudio: HTMLAudioElement | null = null;
let currentMemeAudio: HTMLAudioElement | null = null;

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
  if (currentMemeAudio) {
    try {
      currentMemeAudio.pause();
      currentMemeAudio.currentTime = 0;
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
 * Plays the "Rebel Saab - The Raja Saab" sound effect (strictly for 100% score)
 */
export function playRebelSaabSound(): Promise<void> {
  return playAudioElement(getRebelSaabAudio());
}

/**
 * Plays a selected Telugu meme audio clip
 */
export function playTeluguMemeSound(meme: TeluguMeme): Promise<void> {
  if (!getSoundEnabled() || typeof window === 'undefined') {
    return Promise.resolve();
  }

  try {
    stopAllAudios();
    const url = getMemeAudioUrl(meme.cleanName);
    currentMemeAudio = new Audio(url);
    currentMemeAudio.volume = 0.95;
    const promise = currentMemeAudio.play();
    if (promise !== undefined) {
      return promise.catch((err) => {
        console.warn('Telugu meme audio play prevented or interrupted:', err);
      });
    }
  } catch (err) {
    console.warn('Telugu meme audio error:', err);
  }
  return Promise.resolve();
}

/**
 * Plays the "noice" sound effect (for correct answers in Practice mode)
 */
export function playNoiceSound(): Promise<void> {
  return playAudioElement(getNoiceAudio());
}

/**
 * Plays the "fahh" sound effect (for incorrect answers in Practice mode)
 */
export function playFahhSound(): Promise<void> {
  return playAudioElement(getFahhAudio());
}

/**
 * Evaluates the quiz outcome:
 * - ONLY 100% score plays "Rebel Saab - The Raja Saab"
 * - Rest all scores (< 100%) play from the Telugu meme collection
 */
export function playQuizResultAudio(
  accuracy: number,
  totalQuestions: number,
  correctCount: number,
  chosenMeme?: TeluguMeme | null
): 'rebel-saab' | 'meme' | 'noice' | 'fahh' | 'muted' {
  if (!getSoundEnabled()) {
    return 'muted';
  }

  // ONLY 100% score plays "Rebel Saab"
  const is100Percent = accuracy >= 100 || (totalQuestions > 0 && correctCount === totalQuestions && accuracy >= 99.5);

  if (is100Percent) {
    playRebelSaabSound();
    return 'rebel-saab';
  }

  // Rest all play from Telugu meme collection
  if (chosenMeme) {
    playTeluguMemeSound(chosenMeme);
    return 'meme';
  }

  // Fallback if no meme passed
  if (accuracy >= 75) {
    playNoiceSound();
    return 'noice';
  } else {
    playFahhSound();
    return 'fahh';
  }
}
