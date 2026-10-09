import React, { useState } from 'react';
import { Utensils, Plus, Trash2, Camera, Sparkles, Clock, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { tactileAudio } from '../utils/audio';
import { FoodItem } from '../types';

interface FoodDiaryProps {
  foodItems: FoodItem[];
  onAddFood: (item: Omit<FoodItem, 'id' | 'timestamp'>) => void;
  onDeleteFood: (id: string) => void;
  onOpenScanner: () => void;
}

export const FoodDiary: React.FC<FoodDiaryProps> = ({
  foodItems,
  onAddFood,
  onDeleteFood,
  onOpenScanner,
}) => {
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualCalories, setManualCalories] = useState('');
  const [manualProtein, setManualProtein] = useState('');
  const [manualCarbs, setManualCarbs] = useState('');
  const [manualFat, setManualFat] = useState('');
  const [manualServing, setManualServing] = useState('1 standard portion');
  const [manualMealType, setManualMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');

  const mealSlots: { key: 'breakfast' | 'lunch' | 'dinner' | 'snack'; label: string; icon: string }[] = [
    { key: 'breakfast', label: 'BREAKFAST PHASE', icon: '🌅' },
    { key: 'lunch', label: 'MIDDAY FUEL (LUNCH)', icon: '☀️' },
    { key: 'dinner', label: 'EVENING RE-FEED (DINNER)', icon: '🌙' },
    { key: 'snack', label: 'METABOLIC ADJUNCTS (SNACKS)', icon: '⚡' },
  ];

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName || !manualCalories) return;

    tactileAudio.playSuccessChime();
    onAddFood({
      name: manualName,
      calories: parseInt(manualCalories, 10) || 0,
      macros: {
        protein: parseInt(manualProtein, 10) || 0,
        carbs: parseInt(manualCarbs, 10) || 0,
        fat: parseInt(manualFat, 10) || 0,
      },
      serving: manualServing || '1 portion',
      mealType: manualMealType,
      healthScore: 85,
    });

    // Reset & close
    setManualName('');
    setManualCalories('');
    setManualProtein('');
    setManualCarbs('');
    setManualFat('');
    setShowManualModal(false);
  };

  return (
    <div className="gunmetal-panel rounded-xl p-4 sm:p-5 relative border border-[#343842] shadow-2xl">
      {/* Corner Fasteners */}
      <span className="hardware-screw absolute top-3 left-3" />
      <span className="hardware-screw absolute top-3 right-3" />
      <span className="hardware-screw absolute bottom-3 left-3" />
      <span className="hardware-screw absolute bottom-3 right-3" />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 px-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-widest text-[#8b95a5] uppercase">NUTRIENT LOG TERMINAL</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#fbbf24] shadow-[0_0_6px_#fbbf24]" />
          </div>
          <h2 className="text-sm font-bold font-mono text-[#e2e2e8] tracking-wider flex items-center gap-1.5">
            <Utensils className="w-4 h-4 text-[#fbbf24]" />
            DAILY NUTRITION CHRONOLOGY
          </h2>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              tactileAudio.playLaserScan();
              onOpenScanner();
            }}
            className="px-3 py-1.5 rounded-md text-xs font-mono font-bold bg-gradient-to-b from-[#3d311d] to-[#251e10] border border-[#fbbf24]/60 text-[#fbbf24] shadow-[0_2px_8px_rgba(251,191,36,0.25)] hover:from-[#4d3d23] hover:to-[#2e2513] flex items-center gap-1.5 active:translate-y-0.5"
          >
            <Camera className="w-3.5 h-3.5" />
            AI OPTIC SCAN
          </button>

          <button
            onClick={() => {
              tactileAudio.playButtonThud();
              setShowManualModal(true);
            }}
            className="px-3 py-1.5 rounded-md text-xs font-mono font-bold tactile-button text-[#e2e2e8] border border-[#3c424e] flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-[#34d399]" />
            MANUAL ENTRY
          </button>
        </div>
      </div>

      {/* Meal Slot Sections */}
      <div className="space-y-4">
        {mealSlots.map((slot) => {
          const slotItems = foodItems.filter((item) => item.mealType === slot.key);
          const slotCalories = slotItems.reduce((acc, curr) => acc + curr.calories, 0);

          return (
            <div key={slot.key} className="debossed-bay rounded-lg p-3 border border-[#22262f]">
              {/* Slot Header */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#1f2229]">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{slot.icon}</span>
                  <span className="text-xs font-mono font-bold text-[#e2e2e8] tracking-wider">
                    {slot.label}
                  </span>
                  <span className="text-[10px] font-mono text-[#8b95a5]">
                    ({slotItems.length} {slotItems.length === 1 ? 'item' : 'items'})
                  </span>
                </div>

                <div className="text-right flex items-center gap-3">
                  <span className="text-xs font-mono font-bold amber-glow-text">
                    {slotCalories} <span className="text-[10px] text-[#8b95a5]">KCAL</span>
                  </span>
                </div>
              </div>

              {/* Items in Slot */}
              {slotItems.length === 0 ? (
                <div className="py-2.5 px-3 text-center text-xs font-mono text-[#6c7686] italic">
                  No bio-nutrients registered for this phase.
                </div>
              ) : (
                <div className="space-y-2">
                  {slotItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-md bg-[#181a1f] border border-[#272b35] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:border-[#38404e] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-12 h-12 rounded object-cover border border-[#333946] shadow-md flex-shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded bg-[#101216] border border-[#262a34] flex items-center justify-center flex-shrink-0 text-lg">
                            🥗
                          </div>
                        )}

                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-mono font-bold text-[#e2e2e8]">{item.name}</h4>
                            {item.healthScore && (
                              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#003825] border border-[#059669] text-[#6afec1]">
                                QS: {item.healthScore}
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] font-mono text-[#8b95a5] flex items-center gap-2 mt-0.5">
                            <span>{item.serving}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5" />
                              {item.timestamp}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Macros and Delete */}
                      <div className="flex items-center justify-between sm:justify-end gap-3 self-end sm:self-center w-full sm:w-auto">
                        {/* Macro Chips */}
                        <div className="flex items-center gap-1.5 font-mono text-[10px]">
                          <span className="px-1.5 py-0.5 rounded bg-[#131519] border border-[#2b303b] text-[#34d399]">
                            P: {item.macros.protein}g
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-[#131519] border border-[#2b303b] text-[#fbbf24]">
                            C: {item.macros.carbs}g
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-[#131519] border border-[#2b303b] text-[#fb7185]">
                            F: {item.macros.fat}g
                          </span>
                        </div>

                        {/* Calories Badge */}
                        <div className="text-right min-w-[65px]">
                          <span className="text-xs font-mono font-bold text-[#fbbf24]">
                            {item.calories} <span className="text-[9px] text-[#8b95a5]">kcal</span>
                          </span>
                        </div>

                        {/* Delete button */}
                        <button
                          onClick={() => {
                            tactileAudio.playButtonThud();
                            onDeleteFood(item.id);
                          }}
                          className="p-1 rounded text-[#8b95a5] hover:text-[#fb7185] hover:bg-[#2a171c]"
                          title="Erase log"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Manual Entry Modal */}
      {showManualModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="gunmetal-panel rounded-xl max-w-md w-full p-5 relative border border-[#3b404d] shadow-2xl">
            <span className="hardware-screw absolute top-3 left-3" />
            <span className="hardware-screw absolute top-3 right-3" />
            <span className="hardware-screw absolute bottom-3 left-3" />
            <span className="hardware-screw absolute bottom-3 right-3" />

            <div className="flex items-center justify-between mb-4 border-b border-[#2b303b] pb-2">
              <h3 className="text-sm font-mono font-bold text-[#e2e2e8] flex items-center gap-2">
                <Utensils className="w-4 h-4 text-[#fbbf24]" />
                CALIBRATE MANUAL NUTRITION ENTRY
              </h3>
              <button
                onClick={() => setShowManualModal(false)}
                className="text-xs font-mono text-[#8b95a5] hover:text-white"
              >
                ✕ ESC
              </button>
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] font-mono text-[#8b95a5] block uppercase mb-1">
                  Food Item / Dish Designation
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grilled Chicken Breast with Brown Rice"
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  className="w-full debossed-bay rounded p-2 text-xs font-mono text-[#e2e2e8] border border-[#2d323c] focus:outline-none focus:border-[#fbbf24]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono text-[#8b95a5] block uppercase mb-1">
                    Meal Phase Slot
                  </label>
                  <select
                    value={manualMealType}
                    onChange={(e: any) => setManualMealType(e.target.value)}
                    className="w-full debossed-bay rounded p-2 text-xs font-mono text-[#e2e2e8] border border-[#2d323c] focus:outline-none"
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-[#8b95a5] block uppercase mb-1">
                    Serving Quantity
                  </label>
                  <input
                    type="text"
                    value={manualServing}
                    onChange={(e) => setManualServing(e.target.value)}
                    placeholder="e.g. 1 bowl (300g)"
                    className="w-full debossed-bay rounded p-2 text-xs font-mono text-[#e2e2e8] border border-[#2d323c] focus:outline-none"
                  >
                  </input>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-[#8b95a5] block uppercase mb-1">
                  Total Energy Content (Kcal)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  placeholder="450"
                  value={manualCalories}
                  onChange={(e) => setManualCalories(e.target.value)}
                  className="w-full debossed-bay rounded p-2 text-sm font-mono font-bold text-[#fbbf24] border border-[#2d323c] focus:outline-none focus:border-[#fbbf24]"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[9px] font-mono text-[#34d399] block uppercase mb-1">
                    Protein (g)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="30"
                    value={manualProtein}
                    onChange={(e) => setManualProtein(e.target.value)}
                    className="w-full debossed-bay rounded p-2 text-xs font-mono text-[#e2e2e8] border border-[#2d323c]"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-mono text-[#fbbf24] block uppercase mb-1">
                    Carbs (g)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="45"
                    value={manualCarbs}
                    onChange={(e) => setManualCarbs(e.target.value)}
                    className="w-full debossed-bay rounded p-2 text-xs font-mono text-[#e2e2e8] border border-[#2d323c]"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-mono text-[#fb7185] block uppercase mb-1">
                    Fats (g)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="12"
                    value={manualFat}
                    onChange={(e) => setManualFat(e.target.value)}
                    className="w-full debossed-bay rounded p-2 text-xs font-mono text-[#e2e2e8] border border-[#2d323c]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="px-3 py-1.5 rounded text-xs font-mono text-[#8b95a5] hover:bg-[#20242b]"
                >
                  ABORT
                </button>
                <button
                  type="submit"
                  className="tactile-button-primary px-4 py-2 rounded-md text-xs font-mono tracking-wider flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  CONFIRM TO LOG
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
