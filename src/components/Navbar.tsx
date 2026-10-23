import React, { useState, useEffect } from 'react';
import { 
  Sun, 
  Moon, 
  BookOpen, 
  Layers, 
  Award, 
  RotateCcw, 
  GraduationCap, 
  Menu, 
  X, 
  Volume2, 
  VolumeX 
} from 'lucide-react';
import { COURSE_INFO } from '../utils/questionsLoader';
import { 
  getSoundEnabled, 
  setSoundEnabled, 
  getMemeSoundEnabled, 
  setMemeSoundEnabled, 
  subscribeMemeSoundState,
  subscribeSoundState 
} from '../utils/sound';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: 'home' | 'learn' | 'custom' | 'history') => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onResetHistory: () => void;
  totalCompletedSessions: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  theme,
  onToggleTheme,
  onResetHistory,
  totalCompletedSessions,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [soundOn, setSoundOn] = useState<boolean>(getSoundEnabled);
  const [isMemeSoundOn, setIsMemeSoundOn] = useState<boolean>(getMemeSoundEnabled);

  useEffect(() => {
    const unsubSound = subscribeSoundState((enabled) => setSoundOn(enabled));
    const unsubMeme = subscribeMemeSoundState((enabled) => setIsMemeSoundOn(enabled));
    return () => {
      unsubSound();
      unsubMeme();
    };
  }, []);

  const handleNavClick = (view: 'home' | 'learn' | 'custom' | 'history') => {
    onNavigate(view);
    setIsMobileMenuOpen(false);
  };

  const handleToggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
  };

  const handleToggleMemeSound = () => {
    const next = !isMemeSoundOn;
    setIsMemeSoundOn(next);
    setMemeSoundEnabled(next);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-zinc-950/90 border-b border-zinc-200 dark:border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <div 
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group min-w-0 flex-1 sm:flex-initial"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleNavClick('home')}
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 dark:from-indigo-600 dark:to-indigo-900 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform shrink-0">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm sm:text-base md:text-lg text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight truncate">
                NPTEL Practice
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold tracking-wider uppercase px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 shrink-0">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 hidden md:block">
              {COURSE_INFO.name} • Weeks 0–12
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              currentView === 'home'
                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-bold'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/60'
            }`}
          >
            Dashboard
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('learn')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              currentView === 'learn'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800/60'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/60'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Learn</span>
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('custom')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              currentView === 'custom'
                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-bold'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/60'
            }`}
          >
            <Layers className="w-4 h-4 text-indigo-500" />
            <span>Custom Quiz</span>
          </button>

          {totalCompletedSessions > 0 && (
            <button
              type="button"
              onClick={() => handleNavClick('history')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                currentView === 'history'
                  ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-bold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/60'
              }`}
            >
              <Award className="w-4 h-4 text-amber-500" />
              <span>Results</span>
            </button>
          )}

          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-1.5" />

          {/* Meme Sound / Data Saver Toggle (Desktop) */}
          <button
            type="button"
            onClick={handleToggleMemeSound}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
              isMemeSoundOn
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/50'
                : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
            title={
              isMemeSoundOn
                ? 'Meme audio is ON. Click to activate Data Saver (will NOT load meme audio clips to save your mobile data).'
                : 'Data Saver Active: Meme audio files are NOT loaded to save your mobile data. Click to enable memes.'
            }
            aria-label="Toggle meme sound"
          >
            <span className="text-sm">🎭</span>
            <span className="hidden lg:inline">{isMemeSoundOn ? 'Memes: ON' : 'Data Saver'}</span>
          </button>

          {/* Sound Toggle Button (Desktop) */}
          <button
            type="button"
            onClick={handleToggleSound}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              soundOn
                ? 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                : 'text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
            title={soundOn ? 'Mute sound effects' : 'Enable sound effects'}
            aria-label="Toggle sound effects"
          >
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Reset button if history exists */}
          {totalCompletedSessions > 0 && (
            <button
              type="button"
              onClick={onResetHistory}
              title="Reset practice history"
              className="p-2 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
              aria-label="Reset history"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="p-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-zinc-700" />
            )}
          </button>
        </nav>

        {/* Mobile Top Controls (Meme + Sound + Theme Toggle + Hamburger) */}
        <div className="flex md:hidden items-center gap-1">
          {/* Meme Sound / Data Saver Button (Mobile Header) */}
          <button
            type="button"
            onClick={handleToggleMemeSound}
            className={`p-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
              isMemeSoundOn
                ? 'border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-300'
                : 'border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
            }`}
            title={
              isMemeSoundOn
                ? 'Memes: ON (Click to turn off and save mobile data)'
                : 'Data Saver Active: Audio files won\'t be loaded to save your mobile data'
            }
            aria-label="Toggle meme sound"
          >
            <span className="text-sm">🎭</span>
          </button>

          {/* Sound Toggle (Mobile Header) */}
          <button
            type="button"
            onClick={handleToggleSound}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              soundOn
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-zinc-400 dark:text-zinc-500'
            }`}
            title={soundOn ? 'Mute sound' : 'Enable sound'}
            aria-label="Toggle sound"
          >
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={onToggleTheme}
            className="p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-zinc-700" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Open mobile menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md px-4 py-3 space-y-1.5 shadow-xl animate-fade-in">
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              currentView === 'home'
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('learn')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              currentView === 'learn'
                ? 'bg-emerald-600 text-white'
                : 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Direct Learn (Week 0–12 Solutions)</span>
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('custom')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              currentView === 'custom'
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Custom Quiz Builder</span>
          </button>

          {totalCompletedSessions > 0 && (
            <button
              type="button"
              onClick={() => handleNavClick('history')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                currentView === 'history'
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                  : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Recent Results ({totalCompletedSessions})</span>
            </button>
          )}

          {/* Telugu Meme Sound Toggle (Mobile Menu Row) */}
          <button
            type="button"
            onClick={handleToggleMemeSound}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-2">
                <span className="text-sm">🎭</span>
                <span>Telugu Meme Sound</span>
              </div>
              <span className="text-[10px] font-normal text-zinc-500 dark:text-zinc-400 mt-0.5">
                {isMemeSoundOn
                  ? 'Reactions & audio enabled'
                  : 'Data Saver: Audio is NOT loaded to save your mobile data'}
              </span>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ml-2 ${
              isMemeSoundOn
                ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300'
                : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
            }`}>
              {isMemeSoundOn ? 'MEMES ON' : 'DATA SAVER'}
            </span>
          </button>

          {/* Sound Toggle (Mobile Menu Row) */}
          <button
            type="button"
            onClick={handleToggleSound}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              {soundOn ? <Volume2 className="w-4 h-4 text-emerald-500" /> : <VolumeX className="w-4 h-4 text-zinc-400" />}
              <span>Master Sound</span>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              soundOn ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'
            }`}>
              {soundOn ? 'ON' : 'MUTED'}
            </span>
          </button>

          {totalCompletedSessions > 0 && (
            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => {
                  onResetHistory();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Practice History</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
