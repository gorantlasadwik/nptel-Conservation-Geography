import React, { useState, useEffect } from 'react';
import { subscribeMemeSoundState, getMemeSoundEnabled } from '../utils/sound';
import { ShieldCheck, Sparkles, X } from 'lucide-react';

export const DataSaverToast: React.FC = () => {
  const [toast, setToast] = useState<{
    show: boolean;
    enabled: boolean;
  }>({
    show: false,
    enabled: getMemeSoundEnabled(),
  });

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const unsubscribe = subscribeMemeSoundState((enabled) => {
      setToast({ show: true, enabled });

      clearTimeout(timer);
      timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 4000);
    });

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  if (!toast.show) return null;

  return (
    <aside
      aria-label="Audio preference notification"
      className="fixed bottom-5 right-5 z-50 max-w-sm sm:max-w-md w-full px-3 pointer-events-none animate-slide-up"
    >
      <div className={`pointer-events-auto rounded-2xl p-4 shadow-xl border backdrop-blur-md transition-all ${
        !toast.enabled
          ? 'bg-amber-500/95 text-zinc-950 border-amber-400 shadow-amber-500/20'
          : 'bg-zinc-900/95 text-white border-zinc-700 shadow-black/30'
      }`}>
        <div className="flex items-start gap-3">
          <div className="shrink-0 mt-0.5">
            {!toast.enabled ? (
              <div className="w-8 h-8 rounded-xl bg-zinc-950/20 flex items-center justify-center font-bold text-base">
                📶
              </div>
            ) : (
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center font-bold text-base">
                🎭
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight">
                {!toast.enabled ? 'Data Saver Active (Memes OFF)' : 'Telugu Meme Audio Enabled'}
              </span>
              <span className={`text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded ${
                !toast.enabled ? 'bg-zinc-950 text-amber-300' : 'bg-emerald-500 text-white'
              }`}>
                {!toast.enabled ? 'Saved Data' : 'Sound ON'}
              </span>
            </div>

            <p className={`text-xs mt-1 leading-snug ${
              !toast.enabled ? 'text-zinc-900 font-medium' : 'text-zinc-300'
            }`}>
              {!toast.enabled
                ? 'Telugu meme audio files will NOT be loaded or downloaded, saving your mobile data.'
                : 'Meme audio clips will play with sound effects for questions and quiz results.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setToast((prev) => ({ ...prev, show: false }))}
            className={`p-1 rounded-lg shrink-0 transition-colors cursor-pointer ${
              !toast.enabled ? 'hover:bg-zinc-950/10 text-zinc-900' : 'hover:bg-white/10 text-zinc-400'
            }`}
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
