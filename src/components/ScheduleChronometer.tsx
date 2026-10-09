import React, { useState } from 'react';
import { Moon, Sun, Clock, CheckCircle2, Circle, Plus, Zap, Heart, Activity, ShieldCheck, ChevronRight } from 'lucide-react';
import { tactileAudio } from '../utils/audio';
import { ScheduleEvent, SleepData } from '../types';

interface ScheduleChronometerProps {
  schedule: ScheduleEvent[];
  sleep: SleepData;
  onToggleEvent: (id: string) => void;
  onAddEvent: (event: Omit<ScheduleEvent, 'id'>) => void;
  onUpdateSleep: (sleep: SleepData) => void;
}

export const ScheduleChronometer: React.FC<ScheduleChronometerProps> = ({
  schedule,
  sleep,
  onToggleEvent,
  onAddEvent,
  onUpdateSleep,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newStart, setNewStart] = useState('14:00');
  const [newEnd, setNewEnd] = useState('15:00');
  const [newCategory, setNewCategory] = useState<'sleep' | 'nutrition' | 'fitness' | 'work' | 'recovery'>('work');
  const [newDesc, setNewDesc] = useState('');

  // Calculate current time angle on 24-hour dial
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const currentAngle = (currentMinutes / 1440) * 360; // 0 to 360 degrees

  // Convert time "HH:mm" to minutes
  const timeToMinutes = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  };

  const categoryColors = {
    sleep: { text: '#818cf8', bg: '#1e2238', border: '#434c7a', label: 'SLEEP / RESTORATION' },
    nutrition: { text: '#fbbf24', bg: '#292314', border: '#634f1e', label: 'NUTRITION & HYDRATION' },
    fitness: { text: '#fb7185', bg: '#2e181f', border: '#6d2e3e', label: 'PHYSICAL CONDITIONING' },
    work: { text: '#94a3b8', bg: '#1c1f26', border: '#3a4250', label: 'COGNITIVE FOCUS' },
    recovery: { text: '#34d399', bg: '#11251e', border: '#1e523f', label: 'PARASYMPATHETIC WIND' },
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    tactileAudio.playSuccessChime();
    onAddEvent({
      title: newTitle,
      category: newCategory,
      startTime: newStart,
      endTime: newEnd,
      color: categoryColors[newCategory].text,
      description: newDesc,
      completed: false,
    });

    setNewTitle('');
    setNewDesc('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* SECTION 1: SLEEP TIMING & SOMATIC RECOVERY PANEL */}
      <div className="gunmetal-panel rounded-xl p-4 sm:p-5 relative border border-[#343842] shadow-2xl">
        <span className="hardware-screw absolute top-3 left-3" />
        <span className="hardware-screw absolute top-3 right-3" />
        <span className="hardware-screw absolute bottom-3 left-3" />
        <span className="hardware-screw absolute bottom-3 right-3" />

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 px-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest text-[#8b95a5] uppercase">
                CIRCADIAN TELEMETRY • SOMNOGRAPHY
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#818cf8] shadow-[0_0_6px_#818cf8] animate-pulse" />
            </div>
            <h2 className="text-sm font-bold font-mono text-[#e2e2e8] tracking-wider flex items-center gap-2">
              <Moon className="w-4 h-4 text-[#818cf8]" />
              SLEEP TIMING & RECOVERY ARCHITECTURE
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-[#8b95a5]">TARGET REST:</span>
            <div className="vfd-display px-2.5 py-1 rounded border border-[#2b303b]">
              <span className="text-xs font-mono font-bold text-[#818cf8]">
                {sleep.bedtime} → {sleep.wakeTime} ({sleep.totalHours}h)
              </span>
            </div>
          </div>
        </div>

        {/* Sleep Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
          {/* Sleep Score Gauge */}
          <div className="debossed-bay p-3 rounded-lg border border-[#212630] flex items-center justify-between">
            <div>
              <span className="text-[9px] font-mono text-[#8b95a5] block uppercase">SLEEP EFFICIENCY</span>
              <span className="text-2xl font-mono font-bold emerald-glow-text">{sleep.qualityScore}%</span>
              <span className="text-[9px] font-mono text-[#34d399] block mt-0.5">OPTIMAL RESTORATION</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#11241b] border border-[#34d399]/40 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-[#34d399]" />
            </div>
          </div>

          {/* Total Duration */}
          <div className="debossed-bay p-3 rounded-lg border border-[#212630] flex items-center justify-between">
            <div>
              <span className="text-[9px] font-mono text-[#8b95a5] block uppercase">TOTAL SLEEP DURATION</span>
              <span className="text-2xl font-mono font-bold text-[#e2e2e8]">{sleep.totalHours} <span className="text-sm text-[#8b95a5]">HRS</span></span>
              <span className="text-[9px] font-mono text-[#8b95a5] block mt-0.5">4 CYCLES COMPLETED</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#1b1e2a] border border-[#818cf8]/40 flex items-center justify-center">
              <Clock className="w-5 h-5 text-[#818cf8]" />
            </div>
          </div>

          {/* Resting HR during sleep */}
          <div className="debossed-bay p-3 rounded-lg border border-[#212630] flex items-center justify-between">
            <div>
              <span className="text-[9px] font-mono text-[#8b95a5] block uppercase">NOCTURNAL RESTING HR</span>
              <span className="text-2xl font-mono font-bold ruby-glow-text">{sleep.heartRateResting} <span className="text-sm text-[#8b95a5]">BPM</span></span>
              <span className="text-[9px] font-mono text-[#34d399] block mt-0.5">-8 BPM BELOW BASELINE</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#271317] border border-[#fb7185]/40 flex items-center justify-center">
              <Heart className="w-5 h-5 text-[#fb7185]" />
            </div>
          </div>

          {/* HRV */}
          <div className="debossed-bay p-3 rounded-lg border border-[#212630] flex items-center justify-between">
            <div>
              <span className="text-[9px] font-mono text-[#8b95a5] block uppercase">HEART RATE VARIABILITY</span>
              <span className="text-2xl font-mono font-bold cyan-glow-text">{sleep.hrv} <span className="text-sm text-[#8b95a5]">MS</span></span>
              <span className="text-[9px] font-mono text-[#38bdf8] block mt-0.5">HIGH AUTONOMIC TONE</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#12222d] border border-[#38bdf8]/40 flex items-center justify-center">
              <Activity className="w-5 h-5 text-[#38bdf8]" />
            </div>
          </div>
        </div>

        {/* Somnography Stage Distribution Bars */}
        <div className="debossed-bay p-3.5 rounded-lg border border-[#222731]">
          <div className="text-[10px] font-mono text-[#8b95a5] uppercase mb-2 flex items-center justify-between">
            <span>SOMNOGRAPHIC SLEEP ARCHITECTURE (STAGES)</span>
            <span>480 MINUTES TOTAL</span>
          </div>

          {/* Multi-segmented stage bar */}
          <div className="w-full h-4 rounded-md overflow-hidden bg-[#0c0e12] flex border border-[#2b303c] mb-3">
            <div
              style={{ width: `${(sleep.stages.deep / 480) * 100}%` }}
              className="h-full bg-gradient-to-r from-[#312e81] to-[#4338ca] shadow-[0_0_8px_#4338ca]"
              title={`Deep Sleep: ${sleep.stages.deep}m`}
            />
            <div
              style={{ width: `${(sleep.stages.rem / 480) * 100}%` }}
              className="h-full bg-gradient-to-r from-[#4f46e5] to-[#818cf8] shadow-[0_0_8px_#818cf8]"
              title={`REM Sleep: ${sleep.stages.rem}m`}
            />
            <div
              style={{ width: `${(sleep.stages.light / 480) * 100}%` }}
              className="h-full bg-gradient-to-r from-[#38bdf8] to-[#0ea5e9] shadow-[0_0_8px_#38bdf8]"
              title={`Light Sleep: ${sleep.stages.light}m`}
            />
            <div
              style={{ width: `${(sleep.stages.awake / 480) * 100}%` }}
              className="h-full bg-[#fb7185]"
              title={`Awake / Restless: ${sleep.stages.awake}m`}
            />
          </div>

          {/* Legend Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
            <div className="p-2 rounded bg-[#15171d] border border-[#242933]">
              <div className="flex items-center gap-1.5 text-[#818cf8] font-bold">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#4338ca]" />
                DEEP SLEEP
              </div>
              <div className="text-sm font-bold text-[#e2e2e8] mt-0.5">
                {Math.floor(sleep.stages.deep / 60)}h {sleep.stages.deep % 60}m{' '}
                <span className="text-[10px] text-[#8b95a5]">({Math.round((sleep.stages.deep / 480) * 100)}%)</span>
              </div>
              <span className="text-[9px] text-[#8b95a5]">Cellular Repair & GH</span>
            </div>

            <div className="p-2 rounded bg-[#15171d] border border-[#242933]">
              <div className="flex items-center gap-1.5 text-[#818cf8] font-bold">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#818cf8]" />
                REM SLEEP
              </div>
              <div className="text-sm font-bold text-[#e2e2e8] mt-0.5">
                {Math.floor(sleep.stages.rem / 60)}h {sleep.stages.rem % 60}m{' '}
                <span className="text-[10px] text-[#8b95a5]">({Math.round((sleep.stages.rem / 480) * 100)}%)</span>
              </div>
              <span className="text-[9px] text-[#8b95a5]">Memory Consolidation</span>
            </div>

            <div className="p-2 rounded bg-[#15171d] border border-[#242933]">
              <div className="flex items-center gap-1.5 text-[#38bdf8] font-bold">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#38bdf8]" />
                LIGHT SLEEP
              </div>
              <div className="text-sm font-bold text-[#e2e2e8] mt-0.5">
                {Math.floor(sleep.stages.light / 60)}h {sleep.stages.light % 60}m{' '}
                <span className="text-[10px] text-[#8b95a5]">({Math.round((sleep.stages.light / 480) * 100)}%)</span>
              </div>
              <span className="text-[9px] text-[#8b95a5]">Autonomic Stabilization</span>
            </div>

            <div className="p-2 rounded bg-[#15171d] border border-[#242933]">
              <div className="flex items-center gap-1.5 text-[#fb7185] font-bold">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#fb7185]" />
                AWAKE / RESTLESS
              </div>
              <div className="text-sm font-bold text-[#e2e2e8] mt-0.5">
                {sleep.stages.awake}m{' '}
                <span className="text-[10px] text-[#8b95a5]">({Math.round((sleep.stages.awake / 480) * 100)}%)</span>
              </div>
              <span className="text-[9px] text-[#8b95a5]">Brief Micro-arousals</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: 24-HOUR CIRCULAR CHRONOMETER DIAL & TIMELINE */}
      <div className="gunmetal-panel rounded-xl p-4 sm:p-5 relative border border-[#343842] shadow-2xl">
        <span className="hardware-screw absolute top-3 left-3" />
        <span className="hardware-screw absolute top-3 right-3" />
        <span className="hardware-screw absolute bottom-3 left-3" />
        <span className="hardware-screw absolute bottom-3 right-3" />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5 px-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest text-[#8b95a5] uppercase">
                CHRONO-DIAL 2400 • DIURNAL CADENCE
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#fbbf24] shadow-[0_0_6px_#fbbf24]" />
            </div>
            <h2 className="text-sm font-bold font-mono text-[#e2e2e8] tracking-wider flex items-center gap-2">
              <Sun className="w-4 h-4 text-[#fbbf24]" />
              24-HOUR ROUTINE & CIRCADIAN CADENCE
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                tactileAudio.playButtonThud();
                setShowAddModal(true);
              }}
              className="px-3 py-1.5 rounded-md text-xs font-mono font-bold tactile-button text-[#e2e2e8] border border-[#3b414f] flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-[#fbbf24]" />
              ADD ROUTINE BLOCK
            </button>
          </div>
        </div>

        {/* 24-Hour Dial Visual & Timeline Stream */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Circular 24-Hour Dial Graphic */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-2">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full bg-gradient-to-b from-[#2b303a] to-[#14161b] p-3 shadow-[0_15px_30px_rgba(0,0,0,0.9),inset_0_2px_4px_rgba(255,255,255,0.15)] flex items-center justify-center">
              {/* Outer Knurled Rim */}
              <div className="absolute inset-2 rounded-full border border-[#444a57] knurled-border opacity-70 pointer-events-none" />

              {/* Inner Chassis Dial with SVG Markers */}
              <div className="relative w-full h-full rounded-full bg-[#0d0f13] border border-[#1e2229] shadow-[inset_0_4px_12px_rgba(0,0,0,0.95)] flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 200 200">
                  {/* Outer circle track */}
                  <circle cx="100" cy="100" r="88" fill="none" stroke="#1c2027" strokeWidth="6" />

                  {/* 24 Hour Tick Marks */}
                  {Array.from({ length: 24 }).map((_, i) => {
                    const angle = (i / 24) * 360 - 90;
                    const rad = (angle * Math.PI) / 180;
                    const x1 = 100 + 82 * Math.cos(rad);
                    const y1 = 100 + 82 * Math.sin(rad);
                    const x2 = 100 + (i % 6 === 0 ? 73 : 78) * Math.cos(rad);
                    const y2 = 100 + (i % 6 === 0 ? 73 : 78) * Math.sin(rad);

                    return (
                      <line
                        key={i}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke={i % 6 === 0 ? '#fbbf24' : '#444a56'}
                        strokeWidth={i % 6 === 0 ? '1.8' : '1'}
                      />
                    );
                  })}

                  {/* Hour labels (00, 06, 12, 18) */}
                  <text x="100" y="32" fill="#8b95a5" fontSize="8" fontFamily="JetBrains Mono" textAnchor="middle">
                    00:00 (NIGHT)
                  </text>
                  <text x="168" y="103" fill="#8b95a5" fontSize="8" fontFamily="JetBrains Mono" textAnchor="middle">
                    06:00
                  </text>
                  <text x="100" y="174" fill="#fbbf24" fontSize="8" fontFamily="JetBrains Mono" textAnchor="middle">
                    12:00 (NOON)
                  </text>
                  <text x="32" y="103" fill="#8b95a5" fontSize="8" fontFamily="JetBrains Mono" textAnchor="middle">
                    18:00
                  </text>

                  {/* Live Needle Pointer */}
                  <g transform={`rotate(${currentAngle - 90} 100 100)`}>
                    <line
                      x1="100"
                      y1="100"
                      x2="175"
                      y2="100"
                      stroke="#fbbf24"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      style={{ filter: 'drop-shadow(0 0 5px rgba(251, 191, 36, 0.8))' }}
                    />
                    <circle cx="175" cy="100" r="3" fill="#ffffff" />
                  </g>

                  {/* Center Hub */}
                  <circle cx="100" cy="100" r="16" fill="#1e222a" stroke="#fbbf24" strokeWidth="1.5" />
                  <circle cx="100" cy="100" r="6" fill="#fbbf24" />
                </svg>

                {/* Center VFD Digital Time Pill */}
                <div className="absolute bottom-6 vfd-display px-2 py-0.5 rounded border border-[#2b303b] text-center pointer-events-none">
                  <span className="text-[10px] font-mono font-bold amber-glow-text">
                    CHRONO LIVE
                  </span>
                </div>
              </div>
            </div>

            {/* Dial Legend */}
            <div className="flex items-center gap-3 mt-3 text-[10px] font-mono">
              <span className="flex items-center gap-1 text-[#818cf8]">
                <span className="w-2 h-2 rounded-full bg-[#818cf8]" /> Sleep
              </span>
              <span className="flex items-center gap-1 text-[#fbbf24]">
                <span className="w-2 h-2 rounded-full bg-[#fbbf24]" /> Fueling
              </span>
              <span className="flex items-center gap-1 text-[#94a3b8]">
                <span className="w-2 h-2 rounded-full bg-[#94a3b8]" /> Work
              </span>
              <span className="flex items-center gap-1 text-[#fb7185]">
                <span className="w-2 h-2 rounded-full bg-[#fb7185]" /> Workout
              </span>
            </div>
          </div>

          {/* Timeline Schedule Stream */}
          <div className="lg:col-span-7 space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
            <div className="text-[10px] font-mono text-[#8b95a5] uppercase mb-1 flex items-center justify-between">
              <span>24-HOUR CONTINUOUS PROTOCOL STREAM</span>
              <span>{schedule.length} BLOCKS TOTAL</span>
            </div>

            {schedule.map((evt) => {
              const catCfg = categoryColors[evt.category] || categoryColors.work;
              return (
                <div
                  key={evt.id}
                  onClick={() => {
                    tactileAudio.playSwitchClick();
                    onToggleEvent(evt.id);
                  }}
                  className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                    evt.completed
                      ? 'bg-[#14161a] border-[#20242b] opacity-75'
                      : 'bg-[#181a1f] border-[#292e38] hover:border-[#3d4554]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Checkbox button */}
                    <button
                      type="button"
                      className="mt-0.5 text-xs focus:outline-none"
                    >
                      {evt.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-[#34d399]" />
                      ) : (
                        <Circle className="w-4 h-4 text-[#606a7a]" />
                      )}
                    </button>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border uppercase"
                          style={{
                            color: catCfg.text,
                            backgroundColor: catCfg.bg,
                            borderColor: catCfg.border,
                          }}
                        >
                          {catCfg.label}
                        </span>
                        <h4
                          className={`text-xs font-mono font-bold ${
                            evt.completed ? 'line-through text-[#8b95a5]' : 'text-[#e2e2e8]'
                          }`}
                        >
                          {evt.title}
                        </h4>
                      </div>

                      {evt.description && (
                        <p className="text-[11px] font-mono text-[#8b95a5] mt-1 leading-normal">
                          {evt.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Time Range Badge */}
                  <div className="vfd-display px-2 py-1 rounded text-right whitespace-nowrap min-w-[90px] border border-[#232832]">
                    <span className="text-[10px] font-mono font-bold text-[#fbbf24]">
                      {evt.startTime} - {evt.endTime}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Block Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="gunmetal-panel rounded-xl max-w-md w-full p-5 relative border border-[#3b404d] shadow-2xl">
            <span className="hardware-screw absolute top-3 left-3" />
            <span className="hardware-screw absolute top-3 right-3" />
            <span className="hardware-screw absolute bottom-3 left-3" />
            <span className="hardware-screw absolute bottom-3 right-3" />

            <div className="flex items-center justify-between mb-4 border-b border-[#2b303b] pb-2">
              <h3 className="text-sm font-mono font-bold text-[#e2e2e8] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#fbbf24]" />
                ENROLL PROTOCOL SCHEDULE BLOCK
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-xs font-mono text-[#8b95a5] hover:text-white"
              >
                ✕ ESC
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] font-mono text-[#8b95a5] block uppercase mb-1">
                  Routine Block Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Afternoon Zone 2 Cardio & Electrolytes"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full debossed-bay rounded p-2 text-xs font-mono text-[#e2e2e8] border border-[#2d323c] focus:outline-none focus:border-[#fbbf24]"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-[#8b95a5] block uppercase mb-1">
                  Physiological Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e: any) => setNewCategory(e.target.value)}
                  className="w-full debossed-bay rounded p-2 text-xs font-mono text-[#e2e2e8] border border-[#2d323c]"
                >
                  <option value="sleep">Sleep / Nocturnal Recovery</option>
                  <option value="nutrition">Nutrition & Hydration</option>
                  <option value="fitness">Physical Conditioning / Workout</option>
                  <option value="work">Cognitive Focus / Deep Work</option>
                  <option value="recovery">Parasympathetic Wind Down</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono text-[#8b95a5] block uppercase mb-1">
                    Start Time (24h)
                  </label>
                  <input
                    type="time"
                    required
                    value={newStart}
                    onChange={(e) => setNewStart(e.target.value)}
                    className="w-full debossed-bay rounded p-2 text-xs font-mono text-[#fbbf24] border border-[#2d323c]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-[#8b95a5] block uppercase mb-1">
                    End Time (24h)
                  </label>
                  <input
                    type="time"
                    required
                    value={newEnd}
                    onChange={(e) => setNewEnd(e.target.value)}
                    className="w-full debossed-bay rounded p-2 text-xs font-mono text-[#fbbf24] border border-[#2d323c]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-[#8b95a5] block uppercase mb-1">
                  Protocol Description / Clinical Instructions
                </label>
                <input
                  type="text"
                  placeholder="e.g. 500ml sodium-rich water + 30m incline treadmill"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full debossed-bay rounded p-2 text-xs font-mono text-[#e2e2e8] border border-[#2d323c]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded text-xs font-mono text-[#8b95a5]"
                >
                  ABORT
                </button>
                <button
                  type="submit"
                  className="tactile-button-primary px-4 py-2 rounded-md text-xs font-mono tracking-wider"
                >
                  COMMIT TO SCHEDULE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
