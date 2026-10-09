import React, { useState } from 'react';
import { Droplet, Plus, Minus, RotateCcw, Waves, Sparkles, CheckCircle2 } from 'lucide-react';
import { tactileAudio } from '../utils/audio';
import { WaterLog } from '../types';

interface HydrationVesselProps {
  currentWater: number;
  waterTarget: number;
  waterLogs: WaterLog[];
  onAddWater: (amount: number) => void;
  onRemoveWater: (amount: number) => void;
  onResetWater: () => void;
}

export const HydrationVessel: React.FC<HydrationVesselProps> = ({
  currentWater,
  waterTarget,
  waterLogs,
  onAddWater,
  onRemoveWater,
  onResetWater,
}) => {
  const [customAmount, setCustomAmount] = useState<string>('250');
  const [isPouring, setIsPouring] = useState<boolean>(false);

  const percentage = Math.min(100, Math.round((currentWater / waterTarget) * 100));
  const tickSteps = [3000, 2500, 2000, 1500, 1000, 500, 0];

  const handleDispense = (amount: number) => {
    setIsPouring(true);
    tactileAudio.playWaterPour();
    onAddWater(amount);
    setTimeout(() => setIsPouring(false), 500);
  };

  const handleCustomDispense = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(customAmount, 10);
    if (!isNaN(val) && val > 0) {
      handleDispense(val);
    }
  };

  return (
    <div className="gunmetal-panel rounded-xl p-4 sm:p-5 relative border border-[#343842] shadow-2xl flex flex-col justify-between">
      {/* Corner Fastener Screws */}
      <span className="hardware-screw absolute top-3 left-3" />
      <span className="hardware-screw absolute top-3 right-3" />
      <span className="hardware-screw absolute bottom-3 left-3" />
      <span className="hardware-screw absolute bottom-3 right-3" />

      {/* Header Info */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-widest text-[#8b95a5] uppercase">CELLULAR RES. TUBE-01</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] shadow-[0_0_6px_#38bdf8] animate-pulse" />
          </div>
          <h2 className="text-sm font-bold font-mono text-[#e2e2e8] tracking-wider flex items-center gap-1.5">
            <Droplet className="w-4 h-4 text-[#38bdf8]" />
            HYDRATION VESSEL
          </h2>
        </div>

        {/* Digital Readout */}
        <div className="vfd-display px-3 py-1.5 rounded-md text-right border border-[#1b232c]">
          <div className="text-[9px] font-mono text-[#8b95a5] uppercase tracking-wider">NET FLUID</div>
          <div className="text-base sm:text-lg font-mono font-bold cyan-glow-text leading-tight">
            {currentWater.toLocaleString()} <span className="text-xs text-[#8b95a5]">/ {waterTarget} ml</span>
          </div>
        </div>
      </div>

      {/* Main Hydration Cylinder Visual & Graduations */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center my-1">
        {/* The Cylindrical Vessel Column */}
        <div className="md:col-span-6 flex justify-center py-2">
          <div className="relative w-36 sm:w-44 h-80 rounded-2xl bg-[#0c0e12] border-2 border-[#2b303b] shadow-[inset_0_4px_12px_rgba(0,0,0,0.9),0_10px_20px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col justify-end p-1.5">
            {/* Top Collar / Flange */}
            <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-[#3a3f4b] to-[#1c1f26] border-b border-[#14161b] z-20 flex items-center justify-center">
              <div className="w-16 h-1 rounded bg-[#101216]" />
            </div>

            {/* Bottom Flange Base */}
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-[#3a3f4b] to-[#1c1f26] border-t border-[#14161b] z-20" />

            {/* Glass Tube Background Depth */}
            <div className="absolute inset-0 bg-radial from-[#151922] to-[#08090b] pointer-events-none" />

            {/* Stamped Graduation Ticks along Right Edge */}
            <div className="absolute right-2 top-6 bottom-6 flex flex-col justify-between z-20 pointer-events-none select-none">
              {tickSteps.map((tick) => (
                <div key={tick} className="flex items-center gap-1.5 justify-end">
                  <span className="text-[9px] font-mono text-[#6c7686] font-semibold">{tick}</span>
                  <div className={`h-[1px] bg-[#4a5260] ${tick % 1000 === 0 ? 'w-4 bg-[#7a8494]' : 'w-2'}`} />
                </div>
              ))}
            </div>

            {/* Dynamic Liquid Column */}
            <div
              className="relative w-full rounded-b-xl overflow-hidden transition-all duration-700 ease-out z-10"
              style={{ height: `${Math.max(6, Math.min(94, percentage))}%` }}
            >
              {/* Liquid Body with vertical gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0284c7] via-[#0ea5e9] to-[#38bdf8] opacity-90 shadow-[0_0_24px_rgba(56,189,248,0.45)]">
                {/* Internal fluid bubbles */}
                <div className={`absolute inset-0 ${isPouring ? 'animate-pulse' : ''}`}>
                  <div className="w-1.5 h-1.5 rounded-full bg-white/40 absolute bottom-4 left-6 animate-ping" />
                  <div className="w-2 h-2 rounded-full bg-white/30 absolute bottom-12 right-10 animate-bounce" />
                </div>
              </div>

              {/* Glowing Meniscus (Surface Line) */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-b from-[#e0f2fe] via-[#7dd3fc] to-[#0284c7] shadow-[0_0_12px_#38bdf8] z-10 flex items-center justify-center">
                <div className="w-full h-[1px] bg-white opacity-80" />
              </div>
            </div>

            {/* Mineral Glass Refraction Specular Overlay */}
            <div className="absolute inset-0 glass-column-reflection pointer-events-none z-30 rounded-2xl" />

            {/* Center Status Pill */}
            <div className="absolute bottom-6 left-3 z-30 pointer-events-none">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/60 border border-[#38bdf8]/40 text-[#e0f2fe] drop-shadow-md">
                {percentage}% SATURATED
              </span>
            </div>
          </div>
        </div>

        {/* Right: Controls & Metrics Bay */}
        <div className="md:col-span-6 flex flex-col gap-3">
          {/* Status Telemetry Matrix */}
          <div className="debossed-bay p-3 rounded-lg border border-[#21252e] grid grid-cols-2 gap-2">
            <div>
              <span className="text-[9px] font-mono text-[#8b95a5] block uppercase">HYDRATION STATUS</span>
              <span className={`text-xs font-mono font-bold flex items-center gap-1 ${percentage >= 80 ? 'text-[#34d399]' : 'text-[#38bdf8]'}`}>
                {percentage >= 100 ? 'TARGET SECURED' : percentage >= 60 ? 'OPTIMAL EQUILIBRIUM' : 'REPLENISHMENT REQ.'}
              </span>
            </div>
            <div>
              <span className="text-[9px] font-mono text-[#8b95a5] block uppercase">VELOCITY RATE</span>
              <span className="text-xs font-mono font-bold text-[#e2e2e8]">
                ~265 ml / hour
              </span>
            </div>
            <div>
              <span className="text-[9px] font-mono text-[#8b95a5] block uppercase">REMAINING GOAL</span>
              <span className="text-xs font-mono font-bold text-[#fbbf24]">
                {Math.max(0, waterTarget - currentWater)} ml
              </span>
            </div>
            <div>
              <span className="text-[9px] font-mono text-[#8b95a5] block uppercase">ELECTROLYTIC COND.</span>
              <span className="text-xs font-mono font-bold text-[#6afec1]">
                BALANCED (Na/K)
              </span>
            </div>
          </div>

          {/* Quick Dispense Push Buttons */}
          <div>
            <div className="text-[10px] font-mono text-[#8b95a5] mb-1.5 uppercase tracking-wider flex items-center justify-between">
              <span>DISPENSE DOSE:</span>
              <span className="text-[9px] text-[#38bdf8]">RAPID SOLENOID</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleDispense(250)}
                className="tactile-button py-2 px-1 rounded-md text-center group border border-[#38404e]"
              >
                <div className="text-[10px] font-mono text-[#8b95a5] group-hover:text-[#38bdf8]">GLASS</div>
                <div className="text-xs font-mono font-bold text-[#e2e2e8]">+250 ml</div>
              </button>

              <button
                onClick={() => handleDispense(500)}
                className="tactile-button py-2 px-1 rounded-md text-center group border border-[#38404e]"
              >
                <div className="text-[10px] font-mono text-[#8b95a5] group-hover:text-[#38bdf8]">FLASK</div>
                <div className="text-xs font-mono font-bold text-[#e2e2e8]">+500 ml</div>
              </button>

              <button
                onClick={() => handleDispense(750)}
                className="tactile-button py-2 px-1 rounded-md text-center group border border-[#38404e]"
              >
                <div className="text-[10px] font-mono text-[#8b95a5] group-hover:text-[#38bdf8]">VESSEL</div>
                <div className="text-xs font-mono font-bold text-[#e2e2e8]">+750 ml</div>
              </button>
            </div>
          </div>

          {/* Custom Input + Undo Dispense */}
          <form onSubmit={handleCustomDispense} className="flex items-center gap-2">
            <div className="relative flex-1 debossed-bay rounded-md border border-[#2b303b] px-2 py-1">
              <span className="text-[9px] font-mono text-[#8b95a5] block uppercase">CALIBRATE CUSTOM (ML)</span>
              <input
                type="number"
                min="25"
                max="2000"
                step="25"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="w-full bg-transparent text-sm font-mono font-bold text-[#38bdf8] focus:outline-none focus:ring-0"
              />
            </div>

            <button
              type="submit"
              className="tactile-button px-3 py-2.5 rounded-md text-xs font-mono font-bold text-[#38bdf8] border border-[#38bdf8]/40 hover:bg-[#1a2b38] flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              INJECT
            </button>

            <button
              type="button"
              onClick={() => {
                tactileAudio.playButtonThud();
                onRemoveWater(250);
              }}
              title="Undo last 250ml"
              className="tactile-button p-2.5 rounded-md text-xs font-mono text-[#fb7185] border border-[#fb7185]/40 hover:bg-[#34181f]"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Today's Log Feed (Micro stamps) */}
          <div className="debossed-bay p-2 rounded-md max-h-24 overflow-y-auto">
            <div className="text-[9px] font-mono text-[#8b95a5] uppercase mb-1 flex items-center justify-between">
              <span>DISPENSE LOG CHRONOLOGY</span>
              <span>{waterLogs.length} LOGS</span>
            </div>
            <div className="space-y-1">
              {waterLogs.slice(-3).reverse().map((log) => (
                <div key={log.id} className="text-[10px] font-mono flex items-center justify-between text-[#d3c5ac]">
                  <span className="flex items-center gap-1">
                    <Droplet className="w-2.5 h-2.5 text-[#38bdf8]" />
                    +{log.amount} ml
                  </span>
                  <span className="text-[#8b95a5]">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
