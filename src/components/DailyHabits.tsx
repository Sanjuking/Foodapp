import React, { useState } from 'react';
import { Pill, Activity, Sun, Moon, Flame, Check, Plus, Trash2, Clock, Sparkles, Filter, ShieldCheck } from 'lucide-react';
import { tactileAudio } from '../utils/audio';
import { DailyHabit } from '../types';

interface DailyHabitsProps {
  habits: DailyHabit[];
  onToggleHabit: (id: string) => void;
  onAddHabit: (habit: Omit<DailyHabit, 'id' | 'streakDays'>) => void;
  onDeleteHabit: (id: string) => void;
}

export const DailyHabits: React.FC<DailyHabitsProps> = ({
  habits,
  onToggleHabit,
  onAddHabit,
  onDeleteHabit,
}) => {
  const [filterPhase, setFilterPhase] = useState<'all' | 'morning' | 'afternoon' | 'evening' | 'night'>('all');
  const [filterCategory, setFilterCategory] = useState<'all' | 'medication' | 'mobility' | 'recovery'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state for new habit
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'medication' | 'mobility' | 'recovery' | 'mindfulness' | 'nutrition'>('mobility');
  const [newTimeOfDay, setNewTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'night' | 'anytime'>('morning');
  const [newNotes, setNewNotes] = useState('');

  const completedCount = habits.filter((h) => h.completed).length;
  const totalCount = habits.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const filteredHabits = habits.filter((habit) => {
    const matchesPhase = filterPhase === 'all' || habit.timeOfDay === filterPhase || habit.timeOfDay === 'anytime';
    const matchesCategory = filterCategory === 'all' || habit.category === filterCategory;
    return matchesPhase && matchesCategory;
  });

  const handleToggle = (id: string) => {
    tactileAudio.playSwitchClick();
    onToggleHabit(id);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    tactileAudio.playSuccessChime();
    onAddHabit({
      title: newTitle,
      category: newCategory,
      timeOfDay: newTimeOfDay,
      completed: false,
      notes: newNotes || undefined,
    });

    setNewTitle('');
    setNewNotes('');
    setShowAddModal(false);
  };

  const getCategoryConfig = (cat: DailyHabit['category']) => {
    switch (cat) {
      case 'medication':
        return {
          icon: <Pill className="w-3.5 h-3.5 text-[#fb7185]" />,
          label: 'MEDICATION / RX',
          color: '#fb7185',
          bg: '#2a161b',
          border: '#53232e',
        };
      case 'mobility':
        return {
          icon: <Activity className="w-3.5 h-3.5 text-[#34d399]" />,
          label: 'MOBILITY & STRETCHING',
          color: '#34d399',
          bg: '#12261d',
          border: '#1f533f',
        };
      case 'recovery':
        return {
          icon: <Sun className="w-3.5 h-3.5 text-[#fbbf24]" />,
          label: 'CIRCADIAN RECOVERY',
          color: '#fbbf24',
          bg: '#2b2314',
          border: '#624d1f',
        };
      case 'nutrition':
        return {
          icon: <Sparkles className="w-3.5 h-3.5 text-[#38bdf8]" />,
          label: 'MINERAL & HYDRATION',
          color: '#38bdf8',
          bg: '#14232c',
          border: '#244e63',
        };
      default:
        return {
          icon: <ShieldCheck className="w-3.5 h-3.5 text-[#818cf8]" />,
          label: 'HABIT PROTOCOL',
          color: '#818cf8',
          bg: '#1b1d2e',
          border: '#3b406e',
        };
    }
  };

  return (
    <div className="gunmetal-panel rounded-xl p-4 sm:p-5 relative border border-[#343842] shadow-2xl">
      {/* Corner Fastener Screws */}
      <span className="hardware-screw absolute top-3 left-3" />
      <span className="hardware-screw absolute top-3 right-3" />
      <span className="hardware-screw absolute bottom-3 left-3" />
      <span className="hardware-screw absolute bottom-3 right-3" />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 px-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-widest text-[#8b95a5] uppercase">
              BISTABLE RELAY BANK • RECURRING PROTOCOLS
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] shadow-[0_0_6px_#34d399] animate-pulse" />
          </div>
          <h2 className="text-sm font-bold font-mono text-[#e2e2e8] tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#34d399]" />
            DAILY HABITS & RECURRING HEALTH TASKS
          </h2>
        </div>

        {/* Aggregate Status Readout */}
        <div className="flex items-center gap-3">
          <div className="vfd-display px-3 py-1.5 rounded-lg border border-[#2b303b] text-right">
            <div className="text-[8px] font-mono text-[#8b95a5] uppercase">PROTOCOL EXECUTION</div>
            <div className="text-sm sm:text-base font-mono font-bold leading-tight">
              <span className={completionPercentage >= 70 ? 'emerald-glow-text' : 'amber-glow-text'}>
                {completedCount} / {totalCount}
              </span>
              <span className="text-xs text-[#8b95a5]"> ({completionPercentage}%)</span>
            </div>
          </div>

          <button
            onClick={() => {
              tactileAudio.playButtonThud();
              setShowAddModal(true);
            }}
            className="px-3 py-2 rounded-md text-xs font-mono font-bold tactile-button text-[#e2e2e8] border border-[#3a404d] flex items-center gap-1.5 whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5 text-[#34d399]" />
            ADD HABIT
          </button>
        </div>
      </div>

      {/* Filter Selector Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 debossed-bay p-1.5 rounded-lg border border-[#21252e]">
        {/* Phase Filter */}
        <div className="flex items-center gap-1 overflow-x-auto max-w-full">
          <span className="text-[9px] font-mono text-[#8b95a5] px-1 uppercase hidden md:inline">PHASE:</span>
          {(['all', 'morning', 'afternoon', 'evening', 'night'] as const).map((phase) => (
            <button
              key={phase}
              onClick={() => {
                tactileAudio.playRotaryDetent();
                setFilterPhase(phase);
              }}
              className={`px-2.5 py-1 rounded text-[10px] font-mono uppercase whitespace-nowrap transition-all ${
                filterPhase === phase
                  ? 'bg-[#2b303a] text-[#fbbf24] font-bold border border-[#fbbf24]/40 shadow-inner'
                  : 'text-[#8b95a5] hover:text-[#e2e2e8]'
              }`}
            >
              {phase === 'all' ? 'ALL PHASES' : phase}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1">
          <span className="text-[9px] font-mono text-[#8b95a5] px-1 uppercase hidden md:inline">DOMAIN:</span>
          {(['all', 'medication', 'mobility', 'recovery'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => {
                tactileAudio.playRotaryDetent();
                setFilterCategory(cat);
              }}
              className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase whitespace-nowrap transition-all ${
                filterCategory === cat
                  ? 'bg-[#1b222d] text-[#38bdf8] font-bold border border-[#38bdf8]/40'
                  : 'text-[#8b95a5] hover:text-[#e2e2e8]'
              }`}
            >
              {cat === 'all' ? 'ALL DOMAINS' : cat === 'mobility' ? 'STRETCHING' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Habit Cards Matrix with Skeuomorphic Bistable Switches */}
      <div className="space-y-3">
        {filteredHabits.length === 0 ? (
          <div className="debossed-bay p-8 rounded-lg text-center text-xs font-mono text-[#6c7686] italic">
            No recurring health tasks registered for the selected filter criteria.
          </div>
        ) : (
          filteredHabits.map((habit) => {
            const catCfg = getCategoryConfig(habit.category);

            return (
              <div
                key={habit.id}
                className={`p-3 sm:p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  habit.completed
                    ? 'bg-[#171a20] border-[#29322c] shadow-[0_4px_12px_rgba(0,0,0,0.5)]'
                    : 'bg-[#191c22] border-[#272b35] hover:border-[#38404e]'
                }`}
              >
                {/* Left Information */}
                <div className="flex items-start gap-3">
                  {/* Category Stamp Icon */}
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 border shadow-inner"
                    style={{
                      backgroundColor: catCfg.bg,
                      borderColor: catCfg.border,
                    }}
                  >
                    {catCfg.icon}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border uppercase"
                        style={{
                          color: catCfg.color,
                          backgroundColor: catCfg.bg,
                          borderColor: catCfg.border,
                        }}
                      >
                        {catCfg.label}
                      </span>

                      <span className="text-[9px] font-mono text-[#8b95a5] uppercase px-1.5 py-0.2 rounded bg-[#101216] border border-[#21262f]">
                        {habit.timeOfDay}
                      </span>

                      {/* Streak Badge */}
                      <span className="text-[9px] font-mono text-[#fbbf24] flex items-center gap-1 font-bold">
                        <Flame className="w-2.5 h-2.5" />
                        {habit.streakDays}D STREAK
                      </span>
                    </div>

                    <h4
                      className={`text-xs sm:text-sm font-mono font-bold mt-1 ${
                        habit.completed ? 'text-[#e2e2e8]' : 'text-[#c6cbd3]'
                      }`}
                    >
                      {habit.title}
                    </h4>

                    {habit.notes && (
                      <p className="text-[11px] font-mono text-[#8b95a5] mt-0.5 leading-normal">
                        {habit.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Skeuomorphic Mechanical Toggle Switch */}
                <div className="flex items-center justify-between sm:justify-end gap-4 self-end sm:self-center w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[#22262f]">
                  {/* Jewel Status LED */}
                  <div className="flex items-center gap-1.5">
                    <div
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                        habit.completed
                          ? 'bg-[#34d399] shadow-[0_0_10px_#34d399]'
                          : 'bg-[#2a2e37] border border-[#3b414f]'
                      }`}
                    />
                    <span className="text-[9px] font-mono text-[#8b95a5] uppercase hidden lg:inline">
                      {habit.completed ? 'LOCKED ON' : 'DISARMED'}
                    </span>
                  </div>

                  {/* Physical Bistable Heavy Rocker / Slide Switch */}
                  <button
                    type="button"
                    onClick={() => handleToggle(habit.id)}
                    className="focus:outline-none flex items-center gap-2 group cursor-pointer"
                    title={`Click to ${habit.completed ? 'deactivate' : 'activate'} ${habit.title}`}
                  >
                    {/* Switch Track Housing */}
                    <div
                      className={`relative w-14 h-7 rounded-full p-1 transition-all duration-300 border shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)] ${
                        habit.completed
                          ? 'bg-gradient-to-r from-[#047857] to-[#10b981] border-[#34d399]/60 shadow-[0_0_12px_rgba(52,211,153,0.3)]'
                          : 'bg-[#101215] border-[#252a34]'
                      }`}
                    >
                      {/* Chunky Cylindrical Machined Metal Peg */}
                      <div
                        className={`w-5 h-5 rounded-full transition-transform duration-200 ease-out transform shadow-[0_2px_5px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.4)] flex items-center justify-center ${
                          habit.completed
                            ? 'translate-x-7 bg-gradient-to-b from-[#f3f4f6] via-[#d1d5db] to-[#9ca3af]'
                            : 'translate-x-0 bg-gradient-to-b from-[#4b5260] via-[#2f343d] to-[#1f2228]'
                        }`}
                      >
                        {/* Center tactile grip indentation on peg */}
                        <div
                          className={`w-1 h-2 rounded-sm ${
                            habit.completed ? 'bg-[#4b5563]' : 'bg-[#111317]'
                          }`}
                        />
                      </div>
                    </div>
                  </button>

                  {/* Delete button */}
                  <button
                    onClick={() => {
                      tactileAudio.playButtonThud();
                      onDeleteHabit(habit.id);
                    }}
                    className="p-1.5 rounded text-[#6c7686] hover:text-[#fb7185] hover:bg-[#251419]"
                    title="Remove recurring habit"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Habit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="gunmetal-panel rounded-xl max-w-md w-full p-5 relative border border-[#3b404d] shadow-2xl">
            <span className="hardware-screw absolute top-3 left-3" />
            <span className="hardware-screw absolute top-3 right-3" />
            <span className="hardware-screw absolute bottom-3 left-3" />
            <span className="hardware-screw absolute bottom-3 right-3" />

            <div className="flex items-center justify-between mb-4 border-b border-[#2b303b] pb-2">
              <h3 className="text-sm font-mono font-bold text-[#e2e2e8] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#34d399]" />
                ENROLL RECURRING HEALTH HABIT
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
                  Habit / Task Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Afternoon Hamstring Stretching or Evening Blood Pressure Rx"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full debossed-bay rounded p-2 text-xs font-mono text-[#e2e2e8] border border-[#2d323c] focus:outline-none focus:border-[#34d399]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono text-[#8b95a5] block uppercase mb-1">
                    Domain / Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e: any) => setNewCategory(e.target.value)}
                    className="w-full debossed-bay rounded p-2 text-xs font-mono text-[#e2e2e8] border border-[#2d323c]"
                  >
                    <option value="medication">Medication / Rx</option>
                    <option value="mobility">Mobility & Stretching</option>
                    <option value="recovery">Circadian Recovery</option>
                    <option value="nutrition">Hydration & Minerals</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-[#8b95a5] block uppercase mb-1">
                    Day Phase
                  </label>
                  <select
                    value={newTimeOfDay}
                    onChange={(e: any) => setNewTimeOfDay(e.target.value)}
                    className="w-full debossed-bay rounded p-2 text-xs font-mono text-[#e2e2e8] border border-[#2d323c]"
                  >
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                    <option value="evening">Evening</option>
                    <option value="night">Night</option>
                    <option value="anytime">Anytime</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-[#8b95a5] block uppercase mb-1">
                  Dosage / Routine Protocol Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. 10m foam rolling quadriceps & hip flexors"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
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
                  className="tactile-button-primary px-4 py-2 rounded-md text-xs font-mono tracking-wider flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  CONFIRM HABIT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
