import fahhAudioUrl from '../assets/audio/fahhhhh.mp3';
import noiceAudioUrl from '../assets/audio/nioce.mp3';

const SOUND_STORAGE_KEY = 'nptel_sound_enabled';

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
 * Persists sound enabled / disabled preference.
 */
export function setSoundEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SOUND_STORAGE_KEY, enabled ? 'true' : 'false');
  } catch (e) {
    console.warn('Failed to save sound preference:', e);
  }
}

let activeAudio: HTMLAudioElement | null = null;

function playAudioFile(src: string): Promise<void> {
  if (!getSoundEnabled() || typeof window === 'undefined') {
    return Promise.resolve();
  }

  try {
    // Stop any existing sound if currently playing
    if (activeAudio) {
      activeAudio.pause();
      activeAudio.currentTime = 0;
    }

    const audio = new Audio(src);
    activeAudio = audio;
    audio.volume = 0.85;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      return playPromise.catch((err) => {
        // Handled silently if browser policy blocks autoplay before gesture
        console.warn('Audio play was prevented by browser policy:', err);
      });
    }
  } catch (e) {
    console.warn('Audio playback error:', e);
  }
  return Promise.resolve();
}

/**
 * Plays the "noice" sound effect
 */
export function playNoiceSound(): Promise<void> {
  return playAudioFile(noiceAudioUrl);
}

/**
 * Plays the "fahh" sound effect
 */
export function playFahhSound(): Promise<void> {
  return playAudioFile(fahhAudioUrl);
}

/**
 * Evaluates the quiz outcome:
 * If accuracy >= 75% or all answers correct -> plays "noice"
 * Otherwise -> plays "fahh"
 */
export function playQuizResultAudio(
  accuracy: number,
  totalQuestions: number,
  correctCount: number
): 'noice' | 'fahh' | 'muted' {
  if (!getSoundEnabled()) {
    return 'muted';
  }

  const isSuccess = accuracy >= 75 || (totalQuestions > 0 && correctCount === totalQuestions);

  if (isSuccess) {
    playNoiceSound();
    return 'noice';
  } else {
    playFahhSound();
    return 'fahh';
  }
}
