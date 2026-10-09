import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HydrationVessel } from './components/HydrationVessel';
import { CalorieDial } from './components/CalorieDial';
import { FoodDiary } from './components/FoodDiary';
import { DailyHabits } from './components/DailyHabits';
import { ScheduleChronometer } from './components/ScheduleChronometer';
import { WeeklySummary } from './components/WeeklySummary';
import { HealthMonitor } from './components/HealthMonitor';
import { FoodScannerModal } from './components/FoodScannerModal';
import { DayData, FoodItem, ScheduleEvent, SleepData, DailyHabit } from './types';
import { INITIAL_DAY_DATA, INITIAL_DAILY_HABITS } from './utils/mockData';
import { tactileAudio } from './utils/audio';
import { Smartphone, Monitor, Shield, Sparkles } from 'lucide-react';

export default function App() {
  const [dayData, setDayData] = useState<DayData>(() => {
    try {
      const saved = localStorage.getItem('tactile_health_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.habits) {
          parsed.habits = INITIAL_DAILY_HABITS;
        }
        return parsed;
      }
    } catch {
      // Fallback
    }
    return INITIAL_DAY_DATA;
  });

  const [currentTab, setCurrentTab] = useState<'console' | 'schedule' | 'weekly' | 'scanner'>('console');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [deviceFrameMode, setDeviceFrameMode] = useState<'responsive' | 'mobile-chassis'>('responsive');

  // Persist to local storage
  useEffect(() => {
    try {
      localStorage.setItem('tactile_health_data', JSON.stringify(dayData));
    } catch {
      // Ignore
    }
  }, [dayData]);

  // Derived Totals
  const consumedCalories = dayData.foodItems.reduce((acc, curr) => acc + curr.calories, 0);
  const currentMacros = dayData.foodItems.reduce(
    (acc, curr) => ({
      protein: acc.protein + curr.macros.protein,
      carbs: acc.carbs + curr.macros.carbs,
      fat: acc.fat + curr.macros.fat,
      fiber: (acc.fiber || 0) + (curr.macros.fiber || 0),
    }),
    { protein: 0, carbs: 0, fat: 0, fiber: 0 }
  );

  // Handlers
  const handleAddFood = (item: Omit<FoodItem, 'id' | 'timestamp'>) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    const newItem: FoodItem = {
      ...item,
      id: `food-${Date.now()}`,
      timestamp: timeStr,
    };
    setDayData((prev) => ({
      ...prev,
      foodItems: [newItem, ...prev.foodItems],
    }));
  };

  const handleDeleteFood = (id: string) => {
    setDayData((prev) => ({
      ...prev,
      foodItems: prev.foodItems.filter((i) => i.id !== id),
    }));
  };

  const handleAddWater = (amount: number) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    setDayData((prev) => ({
      ...prev,
      waterConsumed: prev.waterConsumed + amount,
      waterLogs: [...prev.waterLogs, { id: `w-${Date.now()}`, amount, timestamp: timeStr }],
    }));
  };

  const handleRemoveWater = (amount: number) => {
    setDayData((prev) => ({
      ...prev,
      waterConsumed: Math.max(0, prev.waterConsumed - amount),
      waterLogs: prev.waterLogs.slice(0, -1),
    }));
  };

  const handleResetWater = () => {
    setDayData((prev) => ({
      ...prev,
      waterConsumed: 0,
      waterLogs: [],
    }));
  };

  const handleToggleScheduleEvent = (id: string) => {
    setDayData((prev) => ({
      ...prev,
      schedule: prev.schedule.map((evt) =>
        evt.id === id ? { ...evt, completed: !evt.completed } : evt
      ),
    }));
  };

  const handleAddScheduleEvent = (event: Omit<ScheduleEvent, 'id'>) => {
    setDayData((prev) => ({
      ...prev,
      schedule: [...prev.schedule, { ...event, id: `sch-${Date.now()}` }],
    }));
  };

  const handleUpdateSleep = (sleep: SleepData) => {
    setDayData((prev) => ({ ...prev, sleep }));
  };

  const handleUpdateTarget = (calorieTarget: number) => {
    setDayData((prev) => ({ ...prev, calorieTarget }));
  };

  const handleToggleHabit = (id: string) => {
    setDayData((prev) => ({
      ...prev,
      habits: (prev.habits || INITIAL_DAILY_HABITS).map((h) => {
        if (h.id === id) {
          const willComplete = !h.completed;
          return {
            ...h,
            completed: willComplete,
            streakDays: willComplete ? h.streakDays + 1 : Math.max(0, h.streakDays - 1),
          };
        }
        return h;
      }),
    }));
  };

  const handleAddHabit = (habit: Omit<DailyHabit, 'id' | 'streakDays'>) => {
    const newHabit: DailyHabit = {
      ...habit,
      id: `habit-${Date.now()}`,
      streakDays: 1,
    };
    setDayData((prev) => ({
      ...prev,
      habits: [newHabit, ...(prev.habits || INITIAL_DAILY_HABITS)],
    }));
  };

  const handleDeleteHabit = (id: string) => {
    setDayData((prev) => ({
      ...prev,
      habits: (prev.habits || INITIAL_DAILY_HABITS).filter((h) => h.id !== id),
    }));
  };

  return (
    <div className="min-h-screen bg-[#111317] text-[#e2e2e8] flex flex-col font-sans">
      {/* Top Precision Chassis Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        onOpenScanner={() => setIsScannerOpen(true)}
      />

      {/* Viewport Chassis Toggle Bar */}
      <div className="bg-[#15171c] border-b border-[#252831] px-4 py-1.5 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2 text-[#8b95a5]">
          <span className="w-2 h-2 rounded-full bg-[#fbbf24] shadow-[0_0_6px_#fbbf24]" />
          <span>TACTILE PRECISION TELEMETRY CONSOLE • SKEUOMORPHIC LAB SPEC</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#8b95a5] uppercase hidden sm:inline">VIEWPORT ARCHITECTURE:</span>
          <button
            onClick={() => {
              tactileAudio.playButtonThud();
              setDeviceFrameMode('responsive');
            }}
            className={`px-2.5 py-1 rounded text-[10px] font-mono flex items-center gap-1.5 transition-all ${
              deviceFrameMode === 'responsive'
                ? 'tactile-button text-[#fbbf24] border border-[#fbbf24]/40 font-bold'
                : 'text-[#8b95a5] hover:text-[#d3c5ac]'
            }`}
          >
            <Monitor className="w-3 h-3" />
            EXPANSIVE CONSOLE
          </button>
          <button
            onClick={() => {
              tactileAudio.playButtonThud();
              setDeviceFrameMode('mobile-chassis');
            }}
            className={`px-2.5 py-1 rounded text-[10px] font-mono flex items-center gap-1.5 transition-all ${
              deviceFrameMode === 'mobile-chassis'
                ? 'tactile-button text-[#38bdf8] border border-[#38bdf8]/40 font-bold'
                : 'text-[#8b95a5] hover:text-[#d3c5ac]'
            }`}
          >
            <Smartphone className="w-3 h-3" />
            390PX MOCKUP CHASSIS
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-3 sm:p-6 flex justify-center">
        <div
          className={`w-full transition-all duration-300 ${
            deviceFrameMode === 'mobile-chassis'
              ? 'max-w-[420px] bg-[#16181e] p-3 rounded-[36px] border-4 border-[#353944] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),inset_0_2px_4px_rgba(255,255,255,0.15)] relative'
              : 'max-w-7xl'
          }`}
        >
          {/* Mobile Chassis Top Speaker Slot (if mobile mockup) */}
          {deviceFrameMode === 'mobile-chassis' && (
            <div className="w-full flex justify-center mb-3">
              <div className="w-20 h-1 rounded-full bg-[#2a2d36] shadow-inner" />
            </div>
          )}

          {/* TAB 1: DAILY CONSOLE */}
          {currentTab === 'console' && (
            <div className="space-y-6">
              {/* Row 1: Caloric Dial & Hydration Cylinder */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <div className="lg:col-span-6 flex">
                  <div className="w-full">
                    <CalorieDial
                      targetCalories={dayData.calorieTarget}
                      consumedCalories={consumedCalories}
                      burnedCalories={dayData.telemetry.activeBurn}
                      macros={currentMacros}
                      onUpdateTarget={handleUpdateTarget}
                    />
                  </div>
                </div>

                <div className="lg:col-span-6 flex">
                  <div className="w-full">
                    <HydrationVessel
                      currentWater={dayData.waterConsumed}
                      waterTarget={dayData.waterTarget}
                      waterLogs={dayData.waterLogs}
                      onAddWater={handleAddWater}
                      onRemoveWater={handleRemoveWater}
                      onResetWater={handleResetWater}
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Daily Habits Relay Bank (Medication, Stretching, Recovery) */}
              <DailyHabits
                habits={dayData.habits || INITIAL_DAILY_HABITS}
                onToggleHabit={handleToggleHabit}
                onAddHabit={handleAddHabit}
                onDeleteHabit={handleDeleteHabit}
              />

              {/* Row 3: Food Diary & Meal Logger */}
              <FoodDiary
                foodItems={dayData.foodItems}
                onAddFood={handleAddFood}
                onDeleteFood={handleDeleteFood}
                onOpenScanner={() => setIsScannerOpen(true)}
              />

              {/* Row 4: Biometric Oscilloscope & Health Telemetry */}
              <HealthMonitor telemetry={dayData.telemetry} />
            </div>
          )}

          {/* TAB 2: 24H CHRONOMETER & SLEEP */}
          {currentTab === 'schedule' && (
            <ScheduleChronometer
              schedule={dayData.schedule}
              sleep={dayData.sleep}
              onToggleEvent={handleToggleScheduleEvent}
              onAddEvent={handleAddScheduleEvent}
              onUpdateSleep={handleUpdateSleep}
            />
          )}

          {/* TAB 3: WEEKLY TELEMETRY SUMMARY */}
          {currentTab === 'weekly' && <WeeklySummary />}

          {/* TAB 4: AI SCANNER VIEW */}
          {currentTab === 'scanner' && (
            <div className="gunmetal-panel rounded-xl p-5 border border-[#343842] shadow-2xl">
              <span className="hardware-screw absolute top-3 left-3" />
              <span className="hardware-screw absolute top-3 right-3" />
              <span className="hardware-screw absolute bottom-3 left-3" />
              <span className="hardware-screw absolute bottom-3 right-3" />

              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-2xl bg-[#241e12] border border-[#fbbf24]/50 mx-auto flex items-center justify-center mb-4 shadow-xl">
                  <Sparkles className="w-8 h-8 text-[#fbbf24]" />
                </div>
                <h3 className="text-base font-mono font-bold text-[#e2e2e8] uppercase mb-2">
                  OPTICAL SPECTROMETRY LAB READY
                </h3>
                <p className="text-xs font-mono text-[#8b95a5] max-w-md mx-auto mb-5 leading-relaxed">
                  Provide a picture of your food (or choose from our curated benchmark meals) to run real-time AI calorie and macronutrient decomposition.
                </p>
                <button
                  onClick={() => setIsScannerOpen(true)}
                  className="tactile-button-primary px-6 py-3 rounded-lg text-xs font-mono tracking-wider uppercase inline-flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  LAUNCH AI OPTIC SCANNER
                </button>
              </div>
            </div>
          )}

          {/* Mobile Chassis Bottom Home Bar (if mobile mockup) */}
          {deviceFrameMode === 'mobile-chassis' && (
            <div className="w-full flex justify-center mt-4">
              <div className="w-32 h-1 rounded-full bg-[#414755]" />
            </div>
          )}
        </div>
      </main>

      {/* AI Food Scanner Modal */}
      <FoodScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onAddFood={handleAddFood}
      />

      {/* Footer Chassis Plate */}
      <footer className="w-full bg-[#0d0f13] border-t border-[#232731] py-3 px-4 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] font-mono text-[#6c7686]">
          <div className="flex items-center gap-2">
            <Shield className="w-3 h-3 text-[#34d399]" />
            <span>PRECISION BIO-TELEMETRY SPEC • MIL-STD-810H SKEUOMORPHIC INTERFACE</span>
          </div>
          <div>
            <span>CALIBRATED FOR DAILY METABOLIC BALANCING & CIRCADIAN SYNCHRONIZATION</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
