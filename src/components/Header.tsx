import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, ShieldAlert, Sparkles, Activity, Clock } from 'lucide-react';
import { tactileAudio } from '../utils/audio';

interface HeaderProps {
  currentTab: 'console' | 'schedule' | 'weekly' | 'scanner';
  setCurrentTab: (tab: 'console' | 'schedule' | 'weekly' | 'scanner') => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  onOpenScanner: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  selectedDate,
  setSelectedDate,
  onOpenScanner,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [soundOn, setSoundOn] = useState<boolean>(true);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    tactileAudio.setSoundEnabled(next);
    if (next) tactileAudio.playSwitchClick();
  };

  const handleTabChange = (tab: 'console' | 'schedule' | 'weekly' | 'scanner') => {
    tactileAudio.playButtonThud();
    setCurrentTab(tab);
  };

  return (
    <header className="w-full bg-[#16181d] border-b border-[#2d313a] shadow-xl sticky top-0 z-40">
      {/* Top Precision Metal Edge */}
      <div className="h-1 bg-gradient-to-r from-[#2a2e37] via-[#4d5360] to-[#2a2e37] w-full" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Brand & Telemetry Status LEDs */}
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <div className="flex items-center gap-3">
            {/* Skeuomorphic instrument logo badge */}
            <div className="w-10 h-10 rounded-lg gunmetal-panel flex items-center justify-center relative border border-[#3b404d] shadow-inner">
              <span className="hardware-screw absolute top-1 left-1 transform scale-75" />
              <span className="hardware-screw absolute top-1 right-1 transform scale-75" />
              <span className="hardware-screw absolute bottom-1 left-1 transform scale-75" />
              <span className="hardware-screw absolute bottom-1 right-1 transform scale-75" />
              <Activity className="w-5 h-5 text-[#fbbf24] drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold tracking-widest text-[#8b95a5] uppercase">MOD-940</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#20242b] border border-[#2e333d] text-[#6afec1] font-mono">CALIBRATED</span>
              </div>
              <h1 className="text-base sm:text-lg font-bold font-mono tracking-wider text-[#e2e2e8] flex items-center gap-1.5">
                TACTILE PRECISION HEALTH
              </h1>
            </div>
          </div>

          {/* Jewel Status LEDs */}
          <div className="flex items-center gap-3 debossed-bay px-3 py-1.5 rounded-md border border-[#232730]">
            <div className="flex items-center gap-1.5" title="Chassis Power: Active">
              <div className="w-2.5 h-2.5 rounded-full bg-[#34d399] shadow-[0_0_8px_#34d399] animate-pulse" />
              <span className="text-[9px] font-mono font-bold text-[#8b95a5] hidden sm:inline">SYS</span>
            </div>
            <div className="w-[1px] h-3 bg-[#2b2f38]" />
            <div className="flex items-center gap-1.5" title="Telemetry Sync: 100%">
              <div className="w-2.5 h-2.5 rounded-full bg-[#fbbf24] shadow-[0_0_8px_#fbbf24]" />
              <span className="text-[9px] font-mono font-bold text-[#8b95a5] hidden sm:inline">SYNC</span>
            </div>
            <div className="w-[1px] h-3 bg-[#2b2f38]" />
            <div className="flex items-center gap-1.5" title="AI Optic Engine: Armed">
              <div className="w-2.5 h-2.5 rounded-full bg-[#38bdf8] shadow-[0_0_8px_#38bdf8]" />
              <span className="text-[9px] font-mono font-bold text-[#8b95a5] hidden sm:inline">AI</span>
            </div>
          </div>
        </div>

        {/* Center: Navigation Module (Pushed Tactile Switches) */}
        <nav className="flex items-center gap-1 p-1 debossed-bay rounded-lg border border-[#272b34] overflow-x-auto max-w-full">
          <button
            onClick={() => handleTabChange('console')}
            className={`px-3 py-1.5 rounded text-xs font-mono font-semibold transition-all whitespace-nowrap ${
              currentTab === 'console'
                ? 'tactile-button bg-[#2d323b] text-[#fbbf24] shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] border border-[#fbbf24]/40 amber-glow-text'
                : 'text-[#8b95a5] hover:text-[#d3c5ac] hover:bg-[#1a1c21]'
            }`}
          >
            DAILY CONSOLE
          </button>

          <button
            onClick={() => handleTabChange('schedule')}
            className={`px-3 py-1.5 rounded text-xs font-mono font-semibold transition-all whitespace-nowrap ${
              currentTab === 'schedule'
                ? 'tactile-button bg-[#2d323b] text-[#38bdf8] shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] border border-[#38bdf8]/40 cyan-glow-text'
                : 'text-[#8b95a5] hover:text-[#d3c5ac] hover:bg-[#1a1c21]'
            }`}
          >
            24H CHRONO & SLEEP
          </button>

          <button
            onClick={() => handleTabChange('weekly')}
            className={`px-3 py-1.5 rounded text-xs font-mono font-semibold transition-all whitespace-nowrap ${
              currentTab === 'weekly'
                ? 'tactile-button bg-[#2d323b] text-[#34d399] shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] border border-[#34d399]/40 emerald-glow-text'
                : 'text-[#8b95a5] hover:text-[#d3c5ac] hover:bg-[#1a1c21]'
            }`}
          >
            WEEKLY SUMMARY
          </button>

          <button
            onClick={() => {
              tactileAudio.playLaserScan();
              onOpenScanner();
            }}
            className="px-3 py-1.5 rounded text-xs font-mono font-semibold flex items-center gap-1.5 bg-gradient-to-b from-[#3a2f1c] to-[#241c0e] text-[#fbbf24] border border-[#fbbf24]/50 shadow-[0_2px_6px_rgba(251,191,36,0.2)] hover:from-[#493b23] hover:to-[#2e2412] active:translate-y-0.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#fbbf24]" />
            AI FOOD SCAN
          </button>
        </nav>

        {/* Right: Clock & Haptic Sound Toggle */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {/* LCD Digital Chronometer */}
          <div className="vfd-display px-3 py-1 rounded border border-[#222730] flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-[#fbbf24]/70" />
            <span className="font-mono text-sm tracking-wider font-bold amber-glow-text">
              {currentTime || '08:42:15'}
            </span>
          </div>

          {/* Sound FX Toggle (Skeuomorphic hardware switch) */}
          <button
            onClick={toggleSound}
            title={soundOn ? 'Tactile Sound FX: Enabled' : 'Tactile Sound FX: Muted'}
            className={`p-2 rounded-lg tactile-button flex items-center justify-center ${
              soundOn ? 'text-[#fbbf24] border-[#fbbf24]/30' : 'text-[#626875]'
            }`}
          >
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
