import React, { useState, useEffect } from 'react';
import { Activity, Heart, Wind, Flame, Footprints, ShieldCheck, Sparkles, RefreshCw } from 'lucide-react';
import { HealthTelemetry } from '../types';
import { tactileAudio } from '../utils/audio';

interface HealthMonitorProps {
  telemetry: HealthTelemetry;
}

export const HealthMonitor: React.FC<HealthMonitorProps> = ({ telemetry }) => {
  const [pulse, setPulse] = useState(false);
  const [aiInsight, setAiInsight] = useState<string>(
    'Circadian markers optimal. Calorie expenditure and fluid replenishment within normative thresholds. Maintain consistent wind-down at 22:30.'
  );
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse((prev) => !prev);
    }, 950);
    return () => clearInterval(interval);
  }, []);

  const handleFetchAiAdvisor = async () => {
    setIsLoadingInsight(true);
    tactileAudio.playLaserScan();
    try {
      const res = await fetch('/api/health-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dailySummary: telemetry }),
      });
      const data = await res.json();
      if (data.insight) {
        setAiInsight(data.insight);
      }
      tactileAudio.playSuccessChime();
    } catch {
      // Keep existing
    } finally {
      setIsLoadingInsight(false);
    }
  };

  return (
    <div className="gunmetal-panel rounded-xl p-4 sm:p-5 relative border border-[#343842] shadow-2xl">
      <span className="hardware-screw absolute top-3 left-3" />
      <span className="hardware-screw absolute top-3 right-3" />
      <span className="hardware-screw absolute bottom-3 left-3" />
      <span className="hardware-screw absolute bottom-3 right-3" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 px-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-widest text-[#8b95a5] uppercase">
              PHYSIOLOGICAL OSCILLOSCOPE • BIO-TELEMETRY
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#fb7185] shadow-[0_0_6px_#fb7185] animate-pulse" />
          </div>
          <h2 className="text-sm font-bold font-mono text-[#e2e2e8] tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#fb7185]" />
            CONTINUOUS HEALTH & BIOMETRIC TELEMETRY
          </h2>
        </div>

        {/* Oscilloscope Status */}
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#34d399] shadow-[0_0_8px_#34d399] animate-ping" />
          <span className="text-xs font-mono font-bold text-[#34d399]">LIVE TELEMETRY STREAM</span>
        </div>
      </div>

      {/* ECG Oscilloscope Screen */}
      <div className="debossed-bay p-3 rounded-xl border border-[#232832] mb-4 relative overflow-hidden bg-[#0a0c0f]">
        {/* Oscilloscope Grid Background */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(#34d399 1px, transparent 1px), linear-gradient(90deg, #34d399 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
          }}
        />

        <div className="flex items-center justify-between mb-2 relative z-10 px-2 text-[10px] font-mono text-[#8b95a5]">
          <span className="flex items-center gap-1.5">
            <Heart className={`w-3.5 h-3.5 text-[#fb7185] ${pulse ? 'scale-125' : 'scale-100'} transition-transform`} />
            ELECTROCARDIOGRAM (LEAD II)
          </span>
          <span className="text-[#34d399]">SWEEP: 25 mm/s • GAIN: 10 mm/mV</span>
        </div>

        {/* Animated ECG Waveform SVG */}
        <div className="w-full h-16 sm:h-20 relative z-10 flex items-center overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 600 80" preserveAspectRatio="none">
            {/* Pulsing trace line */}
            <path
              d="M0,40 L60,40 L80,38 L95,40 L110,40 L120,20 L130,70 L140,5 L150,55 L160,35 L175,40 L230,40 L250,38 L265,40 L280,40 L290,20 L300,70 L310,5 L320,55 L330,35 L345,40 L400,40 L420,38 L435,40 L450,40 L460,20 L470,70 L480,5 L490,55 L500,35 L515,40 L600,40"
              fill="none"
              stroke="#34d399"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ filter: 'drop-shadow(0 0 6px rgba(52, 211, 153, 0.8))' }}
            />
          </svg>
        </div>
      </div>

      {/* 5 Key Biometric Panels */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
        {/* Heart Rate */}
        <div className="debossed-bay p-3 rounded-lg border border-[#21262f]">
          <div className="flex items-center justify-between text-[#fb7185] mb-1">
            <span className="text-[9px] font-mono uppercase text-[#8b95a5]">CURRENT HR</span>
            <Heart className="w-3.5 h-3.5" />
          </div>
          <div className="text-xl font-mono font-bold ruby-glow-text">
            {telemetry.heartRate} <span className="text-xs text-[#8b95a5]">BPM</span>
          </div>
          <span className="text-[9px] font-mono text-[#34d399]">RESTING: {telemetry.restingHeartRate} BPM</span>
        </div>

        {/* HRV */}
        <div className="debossed-bay p-3 rounded-lg border border-[#21262f]">
          <div className="flex items-center justify-between text-[#38bdf8] mb-1">
            <span className="text-[9px] font-mono uppercase text-[#8b95a5]">HRV (RMSSD)</span>
            <Activity className="w-3.5 h-3.5" />
          </div>
          <div className="text-xl font-mono font-bold cyan-glow-text">
            {telemetry.hrv} <span className="text-xs text-[#8b95a5]">MS</span>
          </div>
          <span className="text-[9px] font-mono text-[#38bdf8]">AUTONOMIC SYNC</span>
        </div>

        {/* SpO2 */}
        <div className="debossed-bay p-3 rounded-lg border border-[#21262f]">
          <div className="flex items-center justify-between text-[#34d399] mb-1">
            <span className="text-[9px] font-mono uppercase text-[#8b95a5]">PULSE OX (SPO2)</span>
            <Wind className="w-3.5 h-3.5" />
          </div>
          <div className="text-xl font-mono font-bold emerald-glow-text">
            {telemetry.spo2}%
          </div>
          <span className="text-[9px] font-mono text-[#34d399]">NORMOSATURATED</span>
        </div>

        {/* Steps */}
        <div className="debossed-bay p-3 rounded-lg border border-[#21262f]">
          <div className="flex items-center justify-between text-[#fbbf24] mb-1">
            <span className="text-[9px] font-mono uppercase text-[#8b95a5]">STEPS TAKEN</span>
            <Footprints className="w-3.5 h-3.5" />
          </div>
          <div className="text-xl font-mono font-bold text-[#e2e2e8]">
            {telemetry.steps.toLocaleString()}
          </div>
          <span className="text-[9px] font-mono text-[#fbbf24]">84% OF 10,000 GOAL</span>
        </div>

        {/* Recovery Score */}
        <div className="debossed-bay p-3 rounded-lg border border-[#21262f] col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-[#6afec1] mb-1">
            <span className="text-[9px] font-mono uppercase text-[#8b95a5]">RECOVERY SCORE</span>
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <div className="text-xl font-mono font-bold text-[#6afec1]">
            {telemetry.recoveryScore}%
          </div>
          <span className="text-[9px] font-mono text-[#34d399]">PRIMED FOR STRAIN</span>
        </div>
      </div>

      {/* AI Precision Telemetry Advisor */}
      <div className="debossed-bay p-3.5 rounded-xl border border-[#262c37] bg-[#12151b] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="p-2 rounded-lg bg-[#241e12] border border-[#fbbf24]/40 flex-shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4 text-[#fbbf24]" />
          </div>
          <div>
            <div className="text-[9px] font-mono uppercase text-[#fbbf24] flex items-center gap-1.5 font-bold">
              CLINICAL AI BIO-TELEMETRY ADVISOR
            </div>
            <p className="text-xs font-mono text-[#d3c5ac] mt-0.5 leading-relaxed">
              {aiInsight}
            </p>
          </div>
        </div>

        <button
          onClick={handleFetchAiAdvisor}
          disabled={isLoadingInsight}
          className="px-3 py-1.5 rounded-md tactile-button text-xs font-mono font-bold text-[#fbbf24] border border-[#fbbf24]/30 flex items-center gap-1.5 whitespace-nowrap self-end sm:self-center"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoadingInsight ? 'animate-spin' : ''}`} />
          CALIBRATE AI INSIGHT
        </button>
      </div>
    </div>
  );
};
