import React, { useState } from 'react';
import { BarChart3, TrendingUp, Droplet, Moon, Flame, Award, Calendar, ChevronRight } from 'lucide-react';
import { tactileAudio } from '../utils/audio';
import { HISTORICAL_WEEK_DATA } from '../utils/mockData';

export const WeeklySummary: React.FC = () => {
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(6); // Default to today (Sunday)

  const selectedDay = HISTORICAL_WEEK_DATA[selectedDayIdx];

  // Calculate weekly averages
  const avgCalories = Math.round(
    HISTORICAL_WEEK_DATA.reduce((acc, curr) => acc + curr.caloriesIn, 0) / HISTORICAL_WEEK_DATA.length
  );
  const avgWater = Math.round(
    HISTORICAL_WEEK_DATA.reduce((acc, curr) => acc + curr.waterIn, 0) / HISTORICAL_WEEK_DATA.length
  );
  const avgSleep = (
    HISTORICAL_WEEK_DATA.reduce((acc, curr) => acc + curr.sleepHours, 0) / HISTORICAL_WEEK_DATA.length
  ).toFixed(1);
  const totalBurn = HISTORICAL_WEEK_DATA.reduce((acc, curr) => acc + curr.caloriesBurned, 0);

  return (
    <div className="space-y-6">
      {/* SECTION 1: 7-DAY AGGREGATE SUMMARY MATRIX */}
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
                TELEMETRY CONSOLIDATION • 7-DAY CYCLE
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] shadow-[0_0_6px_#34d399]" />
            </div>
            <h2 className="text-sm font-bold font-mono text-[#e2e2e8] tracking-wider flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#34d399]" />
              WEEKLY PHYSIOLOGICAL EQUILIBRIUM
            </h2>
          </div>

          <div className="vfd-display px-3 py-1 rounded border border-[#2b303b]">
            <span className="text-xs font-mono font-bold text-[#34d399]">
              OCT 03 - OCT 09 • CYCLE 41
            </span>
          </div>
        </div>

        {/* 4 Core Weekly Averages */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          <div className="debossed-bay p-3 rounded-lg border border-[#21262f]">
            <div className="flex items-center justify-between text-[#fbbf24] mb-1">
              <span className="text-[9px] font-mono uppercase text-[#8b95a5]">AVG CALORIE INTAKE</span>
              <Flame className="w-3.5 h-3.5" />
            </div>
            <div className="text-2xl font-mono font-bold amber-glow-text">
              {avgCalories.toLocaleString()} <span className="text-xs text-[#8b95a5]">kcal/d</span>
            </div>
            <div className="text-[10px] font-mono text-[#34d399] mt-0.5">93% TARGET ADHERENCE</div>
          </div>

          <div className="debossed-bay p-3 rounded-lg border border-[#21262f]">
            <div className="flex items-center justify-between text-[#38bdf8] mb-1">
              <span className="text-[9px] font-mono uppercase text-[#8b95a5]">AVG HYDRATION</span>
              <Droplet className="w-3.5 h-3.5" />
            </div>
            <div className="text-2xl font-mono font-bold cyan-glow-text">
              {avgWater.toLocaleString()} <span className="text-xs text-[#8b95a5]">ml/d</span>
            </div>
            <div className="text-[10px] font-mono text-[#34d399] mt-0.5">95% VOLUMETRIC GOAL</div>
          </div>

          <div className="debossed-bay p-3 rounded-lg border border-[#21262f]">
            <div className="flex items-center justify-between text-[#818cf8] mb-1">
              <span className="text-[9px] font-mono uppercase text-[#8b95a5]">AVG SLEEP DURATION</span>
              <Moon className="w-3.5 h-3.5" />
            </div>
            <div className="text-2xl font-mono font-bold text-[#818cf8]">
              {avgSleep} <span className="text-xs text-[#8b95a5]">hrs/night</span>
            </div>
            <div className="text-[10px] font-mono text-[#34d399] mt-0.5">89/100 QUALITY INDEX</div>
          </div>

          <div className="debossed-bay p-3 rounded-lg border border-[#21262f]">
            <div className="flex items-center justify-between text-[#fb7185] mb-1">
              <span className="text-[9px] font-mono uppercase text-[#8b95a5]">TOTAL ACTIVE BURN</span>
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
            <div className="text-2xl font-mono font-bold ruby-glow-text">
              {totalBurn.toLocaleString()} <span className="text-xs text-[#8b95a5]">kcal</span>
            </div>
            <div className="text-[10px] font-mono text-[#38bdf8] mt-0.5">74,280 STEPS LOGGED</div>
          </div>
        </div>

        {/* 7-Day Skeuomorphic Hardware Meter Bars */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Caloric Intake Trend Bars */}
          <div className="debossed-bay p-4 rounded-xl border border-[#232731]">
            <div className="flex items-center justify-between mb-3 text-xs font-mono">
              <span className="font-bold text-[#fbbf24] flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" />
                DAILY CALORIC INTAKE VS 2,250 TARGET
              </span>
              <span className="text-[10px] text-[#8b95a5]">LED BAR COLUMNS</span>
            </div>

            <div className="h-44 flex items-end justify-between gap-2 pt-4 px-2 relative border-b border-[#292d37]">
              {/* Baseline target threshold line */}
              <div className="absolute left-0 right-0 top-12 border-b border-dashed border-[#fbbf24]/40 z-10">
                <span className="absolute right-1 -top-3.5 text-[8px] font-mono text-[#fbbf24]/80">
                  BUDGET: 2,250 KCAL
                </span>
              </div>

              {HISTORICAL_WEEK_DATA.map((day, idx) => {
                const heightPercent = Math.min(100, Math.round((day.caloriesIn / 2600) * 100));
                const isSelected = selectedDayIdx === idx;
                return (
                  <button
                    key={day.day}
                    onClick={() => {
                      tactileAudio.playRotaryDetent();
                      setSelectedDayIdx(idx);
                    }}
                    className="flex-1 flex flex-col items-center h-full justify-end group focus:outline-none"
                  >
                    <div
                      className={`w-full rounded-t-sm transition-all relative ${
                        isSelected
                          ? 'bg-gradient-to-t from-[#d97706] to-[#fbbf24] shadow-[0_0_12px_#fbbf24]'
                          : 'bg-gradient-to-t from-[#262930] to-[#3a3f4c] group-hover:to-[#fbbf24]/60'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    >
                      {/* Knurled notches along the bar */}
                      <div className="absolute inset-0 flex flex-col justify-between py-1 opacity-40 pointer-events-none">
                        <div className="h-[1px] bg-black" />
                        <div className="h-[1px] bg-black" />
                        <div className="h-[1px] bg-black" />
                      </div>
                    </div>
                    <span className={`text-[10px] font-mono mt-2 ${isSelected ? 'text-[#fbbf24] font-bold' : 'text-[#8b95a5]'}`}>
                      {day.day}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hydration Volume Trend Bars */}
          <div className="debossed-bay p-4 rounded-xl border border-[#232731]">
            <div className="flex items-center justify-between mb-3 text-xs font-mono">
              <span className="font-bold text-[#38bdf8] flex items-center gap-1.5">
                <Droplet className="w-3.5 h-3.5" />
                DAILY HYDRATION VOLUME VS 3,000ML GOAL
              </span>
              <span className="text-[10px] text-[#8b95a5]">FLUID COLUMNS</span>
            </div>

            <div className="h-44 flex items-end justify-between gap-2 pt-4 px-2 relative border-b border-[#292d37]">
              {/* Target 3000ml line */}
              <div className="absolute left-0 right-0 top-10 border-b border-dashed border-[#38bdf8]/40 z-10">
                <span className="absolute right-1 -top-3.5 text-[8px] font-mono text-[#38bdf8]/80">
                  TARGET: 3,000 ML
                </span>
              </div>

              {HISTORICAL_WEEK_DATA.map((day, idx) => {
                const heightPercent = Math.min(100, Math.round((day.waterIn / 3500) * 100));
                const isSelected = selectedDayIdx === idx;
                return (
                  <button
                    key={day.day}
                    onClick={() => {
                      tactileAudio.playRotaryDetent();
                      setSelectedDayIdx(idx);
                    }}
                    className="flex-1 flex flex-col items-center h-full justify-end group focus:outline-none"
                  >
                    <div
                      className={`w-full rounded-t-sm transition-all relative ${
                        isSelected
                          ? 'bg-gradient-to-t from-[#0284c7] to-[#38bdf8] shadow-[0_0_12px_#38bdf8]'
                          : 'bg-gradient-to-t from-[#1b2530] to-[#253746] group-hover:to-[#38bdf8]/60'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    >
                      {/* Fluid meniscus highlight */}
                      <div className="absolute top-0 inset-x-0 h-1 bg-[#e0f2fe] opacity-80" />
                    </div>
                    <span className={`text-[10px] font-mono mt-2 ${isSelected ? 'text-[#38bdf8] font-bold' : 'text-[#8b95a5]'}`}>
                      {day.day}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: DAY-BY-DAY TELEMETRY INSPECTION BAY */}
      <div className="gunmetal-panel rounded-xl p-4 sm:p-5 relative border border-[#343842] shadow-2xl">
        <span className="hardware-screw absolute top-3 left-3" />
        <span className="hardware-screw absolute top-3 right-3" />
        <span className="hardware-screw absolute bottom-3 left-3" />
        <span className="hardware-screw absolute bottom-3 right-3" />

        <div className="flex items-center justify-between mb-4 px-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-widest text-[#8b95a5] uppercase">
              DAY-LEVEL SPECTROGRAM: {selectedDay.day} ({selectedDay.date})
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-[#fbbf24]">
            INSPECTOR BAY ACTIVE
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="debossed-bay p-3 rounded-lg border border-[#21262f]">
            <span className="text-[9px] font-mono text-[#8b95a5] block uppercase">CALORIES IN</span>
            <span className="text-lg font-mono font-bold amber-glow-text">{selectedDay.caloriesIn}</span>
            <span className="text-[9px] font-mono text-[#8b95a5] block">/ 2,250 kcal</span>
          </div>

          <div className="debossed-bay p-3 rounded-lg border border-[#21262f]">
            <span className="text-[9px] font-mono text-[#8b95a5] block uppercase">CALORIES BURNED</span>
            <span className="text-lg font-mono font-bold ruby-glow-text">{selectedDay.caloriesBurned}</span>
            <span className="text-[9px] font-mono text-[#8b95a5] block">Active Metabolic</span>
          </div>

          <div className="debossed-bay p-3 rounded-lg border border-[#21262f]">
            <span className="text-[9px] font-mono text-[#8b95a5] block uppercase">WATER REPLENISHED</span>
            <span className="text-lg font-mono font-bold cyan-glow-text">{selectedDay.waterIn} ml</span>
            <span className="text-[9px] font-mono text-[#38bdf8] block">{Math.round((selectedDay.waterIn / 3000) * 100)}% target</span>
          </div>

          <div className="debossed-bay p-3 rounded-lg border border-[#21262f]">
            <span className="text-[9px] font-mono text-[#8b95a5] block uppercase">REST DURATION</span>
            <span className="text-lg font-mono font-bold text-[#818cf8]">{selectedDay.sleepHours} hrs</span>
            <span className="text-[9px] font-mono text-[#34d399] block">{selectedDay.sleepScore}% efficiency</span>
          </div>

          <div className="debossed-bay p-3 rounded-lg border border-[#21262f]">
            <span className="text-[9px] font-mono text-[#8b95a5] block uppercase">HRV RECOVERY</span>
            <span className="text-lg font-mono font-bold text-[#34d399]">{selectedDay.hrv} ms</span>
            <span className="text-[9px] font-mono text-[#8b95a5] block">Autonomic tone</span>
          </div>

          <div className="debossed-bay p-3 rounded-lg border border-[#21262f]">
            <span className="text-[9px] font-mono text-[#8b95a5] block uppercase">PEDOMETER</span>
            <span className="text-lg font-mono font-bold text-[#e2e2e8]">{selectedDay.steps.toLocaleString()}</span>
            <span className="text-[9px] font-mono text-[#34d399] block">Steps total</span>
          </div>
        </div>
      </div>
    </div>
  );
};
