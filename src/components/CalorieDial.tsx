import React, { useState } from 'react';
import { Flame, Target, Utensils, Zap, Edit2, Check } from 'lucide-react';
import { tactileAudio } from '../utils/audio';
import { MacroNutrients } from '../types';

interface CalorieDialProps {
  targetCalories: number;
  consumedCalories: number;
  burnedCalories: number;
  macros: MacroNutrients;
  targetMacros?: MacroNutrients;
  onUpdateTarget: (newTarget: number) => void;
}

export const CalorieDial: React.FC<CalorieDialProps> = ({
  targetCalories,
  consumedCalories,
  burnedCalories,
  macros,
  targetMacros = { protein: 160, carbs: 220, fat: 70 },
  onUpdateTarget,
}) => {
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [tempTarget, setTempTarget] = useState(targetCalories.toString());

  // Caloric Balance formula
  const remainingCalories = targetCalories - consumedCalories + burnedCalories;
  const progressRatio = Math.min(1.2, consumedCalories / Math.max(1, targetCalories));
  const strokeDashoffset = 440 - 440 * Math.min(1, progressRatio);

  const handleSaveTarget = () => {
    const parsed = parseInt(tempTarget, 10);
    if (!isNaN(parsed) && parsed > 500) {
      tactileAudio.playButtonThud();
      onUpdateTarget(parsed);
    }
    setIsEditingTarget(false);
  };

  return (
    <div className="gunmetal-panel rounded-xl p-4 sm:p-5 relative border border-[#343842] shadow-2xl flex flex-col justify-between">
      {/* Corner Hardware Fasteners */}
      <span className="hardware-screw absolute top-3 left-3" />
      <span className="hardware-screw absolute top-3 right-3" />
      <span className="hardware-screw absolute bottom-3 left-3" />
      <span className="hardware-screw absolute bottom-3 right-3" />

      {/* Header and Title */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-widest text-[#8b95a5] uppercase">METABOLIC DIAL UNIT-02</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#fbbf24] shadow-[0_0_6px_#fbbf24]" />
          </div>
          <h2 className="text-sm font-bold font-mono text-[#e2e2e8] tracking-wider flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-[#fbbf24]" />
            CALORIC EXPENDITURE & INTAKE
          </h2>
        </div>

        {/* Quick Edit Budget Toggle */}
        {isEditingTarget ? (
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              value={tempTarget}
              onChange={(e) => setTempTarget(e.target.value)}
              className="w-20 bg-[#121417] text-xs font-mono font-bold text-[#fbbf24] border border-[#fbbf24] px-1.5 py-0.5 rounded"
            />
            <button
              onClick={handleSaveTarget}
              className="p-1 rounded bg-[#fbbf24] text-[#121417] hover:bg-[#f59e0b]"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              tactileAudio.playRotaryDetent();
              setIsEditingTarget(true);
            }}
            className="flex items-center gap-1 text-[10px] font-mono text-[#8b95a5] hover:text-[#fbbf24] debossed-bay px-2 py-1 rounded border border-[#262a34]"
          >
            <Edit2 className="w-3 h-3" />
            CALIBRATE TARGET
          </button>
        )}
      </div>

      {/* Center Knurled Rotary Dial */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center my-1">
        {/* The Rotary Horology Dial */}
        <div className="md:col-span-5 flex justify-center py-2">
          <div className="relative w-52 h-52 sm:w-56 sm:h-56 rounded-full bg-gradient-to-b from-[#2e333d] to-[#16181d] p-3 shadow-[0_12px_28px_rgba(0,0,0,0.85),inset_0_2px_3px_rgba(255,255,255,0.2)] flex items-center justify-center">
            {/* Outer Knurled Rim Ring */}
            <div className="absolute inset-1.5 rounded-full border border-[#444a57] knurled-border opacity-70 pointer-events-none" />

            {/* Inner Metallic Bezel */}
            <div className="relative w-full h-full rounded-full bg-[#121418] border border-[#1e2229] shadow-[inset_0_4px_10px_rgba(0,0,0,0.95)] flex items-center justify-center p-2">
              {/* Radial Meter SVG */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                {/* Background Track */}
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="transparent"
                  stroke="#1c1f26"
                  strokeWidth="8"
                  strokeDasharray="4 3"
                />
                {/* Progress Arc */}
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="transparent"
                  stroke={remainingCalories >= 0 ? '#fbbf24' : '#fb7185'}
                  strokeWidth="8"
                  strokeDasharray="440"
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                  style={{
                    filter:
                      remainingCalories >= 0
                        ? 'drop-shadow(0 0 6px rgba(251, 191, 36, 0.6))'
                        : 'drop-shadow(0 0 6px rgba(251, 113, 133, 0.6))',
                  }}
                />
              </svg>

              {/* Center VFD Phosphor Display (Flush Glass) */}
              <div className="absolute inset-6 rounded-full vfd-display flex flex-col items-center justify-center border border-[#252b36] shadow-inner text-center p-2">
                <span className="text-[9px] font-mono font-bold tracking-widest text-[#8b95a5] uppercase">
                  {remainingCalories >= 0 ? 'REMAINING' : 'SURPLUS'}
                </span>
                <span className={`text-2xl sm:text-3xl font-mono font-black tracking-tight ${remainingCalories >= 0 ? 'amber-glow-text' : 'ruby-glow-text'}`}>
                  {Math.abs(remainingCalories).toLocaleString()}
                </span>
                <span className="text-[10px] font-mono text-[#8b95a5] mt-0.5 uppercase">KCAL BALANCE</span>

                {/* Micro dial tick indicator */}
                <div className="flex items-center gap-1 mt-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${consumedCalories > targetCalories ? 'bg-[#fb7185]' : 'bg-[#34d399]'}`} />
                  <span className="text-[8px] font-mono text-[#a1abb9]">
                    {Math.round((consumedCalories / targetCalories) * 100)}% CONSUMED
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Laboratory Caloric Equation & Macronutrient Meters */}
        <div className="md:col-span-7 flex flex-col gap-3">
          {/* Caloric Equation Matrix */}
          <div className="debossed-bay p-3 rounded-lg border border-[#21252e]">
            <div className="text-[9px] font-mono text-[#8b95a5] uppercase mb-1.5 tracking-wider">
              THERMODYNAMIC FLUX EQUATION
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-1.5 rounded bg-[#181a1f] border border-[#242831]">
                <span className="text-[8px] font-mono text-[#8b95a5] block uppercase">BASE BUDGET</span>
                <span className="text-xs font-mono font-bold text-[#e2e2e8]">{targetCalories.toLocaleString()}</span>
              </div>
              <div className="p-1.5 rounded bg-[#181a1f] border border-[#242831]">
                <span className="text-[8px] font-mono text-[#8b95a5] block uppercase">FOOD INTAKE</span>
                <span className="text-xs font-mono font-bold text-[#fbbf24]">-{consumedCalories.toLocaleString()}</span>
              </div>
              <div className="p-1.5 rounded bg-[#181a1f] border border-[#242831]">
                <span className="text-[8px] font-mono text-[#8b95a5] block uppercase">ACTIVE BURN</span>
                <span className="text-xs font-mono font-bold text-[#34d399]">+{burnedCalories.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Macronutrient Distribution Bars */}
          <div className="space-y-2">
            <div className="text-[10px] font-mono text-[#8b95a5] uppercase tracking-wider flex items-center justify-between">
              <span>MACRONUTRIENT BALANCE:</span>
              <span className="text-[9px] text-[#34d399]">PRECISION SENSORS</span>
            </div>

            {/* Protein Bar */}
            <div className="debossed-bay p-2 rounded-md border border-[#21262f]">
              <div className="flex items-center justify-between text-xs font-mono mb-1">
                <span className="flex items-center gap-1.5 font-bold text-[#6afec1]">
                  <span className="w-2 h-2 rounded-sm bg-[#34d399] shadow-[0_0_4px_#34d399]" />
                  PROTEIN
                </span>
                <span className="text-[#e2e2e8]">
                  <span className="font-bold text-[#34d399]">{macros.protein}g</span> / {targetMacros.protein}g{' '}
                  <span className="text-[10px] text-[#8b95a5]">({Math.round((macros.protein / targetMacros.protein) * 100)}%)</span>
                </span>
              </div>
              <div className="w-full h-2 rounded bg-[#0b0d10] overflow-hidden border border-[#1b1f28] relative">
                <div
                  className="h-full bg-gradient-to-r from-[#059669] to-[#34d399] rounded transition-all duration-500 shadow-[0_0_8px_rgba(52,211,153,0.4)]"
                  style={{ width: `${Math.min(100, (macros.protein / targetMacros.protein) * 100)}%` }}
                />
              </div>
            </div>

            {/* Carbs Bar */}
            <div className="debossed-bay p-2 rounded-md border border-[#21262f]">
              <div className="flex items-center justify-between text-xs font-mono mb-1">
                <span className="flex items-center gap-1.5 font-bold text-[#fbbf24]">
                  <span className="w-2 h-2 rounded-sm bg-[#fbbf24] shadow-[0_0_4px_#fbbf24]" />
                  CARBOHYDRATES
                </span>
                <span className="text-[#e2e2e8]">
                  <span className="font-bold text-[#fbbf24]">{macros.carbs}g</span> / {targetMacros.carbs}g{' '}
                  <span className="text-[10px] text-[#8b95a5]">({Math.round((macros.carbs / targetMacros.carbs) * 100)}%)</span>
                </span>
              </div>
              <div className="w-full h-2 rounded bg-[#0b0d10] overflow-hidden border border-[#1b1f28] relative">
                <div
                  className="h-full bg-gradient-to-r from-[#d97706] to-[#fbbf24] rounded transition-all duration-500 shadow-[0_0_8px_rgba(251,191,36,0.4)]"
                  style={{ width: `${Math.min(100, (macros.carbs / targetMacros.carbs) * 100)}%` }}
                />
              </div>
            </div>

            {/* Fats Bar */}
            <div className="debossed-bay p-2 rounded-md border border-[#21262f]">
              <div className="flex items-center justify-between text-xs font-mono mb-1">
                <span className="flex items-center gap-1.5 font-bold text-[#fb7185]">
                  <span className="w-2 h-2 rounded-sm bg-[#fb7185] shadow-[0_0_4px_#fb7185]" />
                  LIPIDS / FATS
                </span>
                <span className="text-[#e2e2e8]">
                  <span className="font-bold text-[#fb7185]">{macros.fat}g</span> / {targetMacros.fat}g{' '}
                  <span className="text-[10px] text-[#8b95a5]">({Math.round((macros.fat / targetMacros.fat) * 100)}%)</span>
                </span>
              </div>
              <div className="w-full h-2 rounded bg-[#0b0d10] overflow-hidden border border-[#1b1f28] relative">
                <div
                  className="h-full bg-gradient-to-r from-[#e11d48] to-[#fb7185] rounded transition-all duration-500 shadow-[0_0_8px_rgba(251,113,133,0.4)]"
                  style={{ width: `${Math.min(100, (macros.fat / targetMacros.fat) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
