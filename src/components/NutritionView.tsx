import React, { useState } from 'react';
import { 
  Flame, Utensils, Droplets, Plus, Check, CheckCircle2, Circle, 
  Sparkles, Info, ShieldCheck, HeartPulse, BatteryCharging, Smile
} from 'lucide-react';
import { NutritionPlan, DailyNutritionLog, UserProfile } from '../types';

interface NutritionViewProps {
  nutrition: NutritionPlan;
  todayNutrition: DailyNutritionLog;
  profile: UserProfile;
  onUpdateNutritionLog: (log: DailyNutritionLog) => void;
  onToggleMealCompleted: (mealId: string) => void;
  onAddWater: (amountMl: number) => void;
  onOpenAi: () => void;
  onOpenAdaptive: () => void;
}

export const NutritionView: React.FC<NutritionViewProps> = ({
  nutrition,
  todayNutrition,
  profile,
  onUpdateNutritionLog,
  onToggleMealCompleted,
  onAddWater,
  onOpenAi,
  onOpenAdaptive,
}) => {
  const [adherenceScore, setAdherenceScore] = useState<number>(todayNutrition.adherenceScore || 5);
  const [hungerLevel, setHungerLevel] = useState<'baixa' | 'moderada' | 'alta'>(todayNutrition.hungerLevel || 'moderada');
  const [satietyLevel, setSatietyLevel] = useState<'ruim' | 'boa' | 'excelente'>(todayNutrition.satietyLevel || 'boa');
  const [energyLevel, setEnergyLevel] = useState<'baixa' | 'normal' | 'alta'>(todayNutrition.energyLevel || 'alta');
  const [savedFeedback, setSavedFeedback] = useState(false);

  const calPercent = Math.min(100, Math.round((todayNutrition.consumedCalories / nutrition.targetMacros.calories) * 100));
  const protPercent = Math.min(100, Math.round((todayNutrition.consumedProtein / nutrition.targetMacros.proteinGrams) * 100));
  const carbPercent = Math.min(100, Math.round((todayNutrition.consumedCarbs / nutrition.targetMacros.carbsGrams) * 100));
  const fatPercent = Math.min(100, Math.round((todayNutrition.consumedFat / nutrition.targetMacros.fatGrams) * 100));
  const waterPercent = Math.min(100, Math.round((todayNutrition.consumedWaterMl / nutrition.hydrationTargetMl) * 100));

  const proteinPerKg = (nutrition.targetMacros.proteinGrams / profile.weightKg).toFixed(1);

  const handleSaveFeedback = () => {
    onUpdateNutritionLog({
      ...todayNutrition,
      adherenceScore,
      hungerLevel,
      satietyLevel,
      energyLevel,
    });
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 3000);
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Energetic Prescription Banner */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                Estratégia: {nutrition.dietStrategy === 'deficit' ? 'Déficit Calórico' : nutrition.dietStrategy === 'superavit' ? 'Superávit Calórico' : 'Manutenção'}
              </span>
              <span className="text-xs text-neutral-400">
                Delta: <strong className="text-white">{nutrition.calorieDelta > 0 ? `+${nutrition.calorieDelta}` : nutrition.calorieDelta} kcal</strong>
              </span>
            </div>
            <h1 className="text-2xl font-black text-white">Plano Nutricional Individualizado</h1>
            <p className="text-xs text-neutral-400 mt-1 max-w-2xl">
              Cálculos termodinâmicos ajustados à sua taxa metabólica, intensidade de treinamento e meta de composição corporal.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAdaptive}
              className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-xs font-semibold text-neutral-200 transition cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Auditar Calorias</span>
            </button>
          </div>
        </div>

        {/* Metabolic Diagnostics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-neutral-800/80 text-xs">
          <div className="bg-neutral-950/60 p-3 rounded-xl border border-neutral-800/60">
            <span className="text-neutral-400 text-[11px] block">TMB (Metabolismo Basal)</span>
            <strong className="text-white text-base font-bold">{nutrition.bmr} kcal</strong>
            <span className="text-[10px] text-neutral-500 block">Fórmula Mifflin-St Jeor</span>
          </div>

          <div className="bg-neutral-950/60 p-3 rounded-xl border border-neutral-800/60">
            <span className="text-neutral-400 text-[11px] block">GET (Gasto Total Diário)</span>
            <strong className="text-teal-400 text-base font-bold">{nutrition.tdee} kcal</strong>
            <span className="text-[10px] text-neutral-500 block">Com treino {profile.frequencyDays}x/sem</span>
          </div>

          <div className="bg-neutral-950/60 p-3 rounded-xl border border-neutral-800/60">
            <span className="text-neutral-400 text-[11px] block">Meta Calórica Prescrita</span>
            <strong className="text-amber-400 text-base font-bold">{nutrition.targetMacros.calories} kcal</strong>
            <span className="text-[10px] text-neutral-500 block">Alvo diário balanceado</span>
          </div>

          <div className="bg-neutral-950/60 p-3 rounded-xl border border-neutral-800/60">
            <span className="text-neutral-400 text-[11px] block">Aporte Proteico</span>
            <strong className="text-rose-400 text-base font-bold">{proteinPerKg} g/kg</strong>
            <span className="text-[10px] text-neutral-500 block">Total: {nutrition.targetMacros.proteinGrams}g/dia</span>
          </div>
        </div>
      </div>

      {/* Daily Macros Tracking Progress Cards */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Flame className="w-4 h-4 text-emerald-400" />
            Progresso de Ingestão de Hoje
          </h2>
          <span className="text-xs text-neutral-400">{todayNutrition.consumedCalories} / {nutrition.targetMacros.calories} kcal ({calPercent}%)</span>
        </div>

        {/* Main Calorie Bar */}
        <div className="w-full h-3 bg-neutral-950 rounded-full overflow-hidden p-0.5 border border-neutral-800">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full transition-all duration-500"
            style={{ width: `${calPercent}%` }}
          />
        </div>

        {/* 4 Macros Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {/* Protein */}
          <div className="bg-neutral-950/80 p-3 rounded-xl border border-neutral-800/80">
            <div className="flex justify-between items-center mb-1">
              <span className="text-rose-400 font-bold">Proteína</span>
              <span className="text-[11px] text-neutral-400">{protPercent}%</span>
            </div>
            <div className="text-lg font-black text-white">
              {todayNutrition.consumedProtein} <span className="text-xs font-normal text-neutral-400">/ {nutrition.targetMacros.proteinGrams}g</span>
            </div>
            <div className="w-full h-1.5 bg-neutral-800 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-rose-500 rounded-full" style={{ width: `${protPercent}%` }} />
            </div>
          </div>

          {/* Carbs */}
          <div className="bg-neutral-950/80 p-3 rounded-xl border border-neutral-800/80">
            <div className="flex justify-between items-center mb-1">
              <span className="text-amber-400 font-bold">Carboidratos</span>
              <span className="text-[11px] text-neutral-400">{carbPercent}%</span>
            </div>
            <div className="text-lg font-black text-white">
              {todayNutrition.consumedCarbs} <span className="text-xs font-normal text-neutral-400">/ {nutrition.targetMacros.carbsGrams}g</span>
            </div>
            <div className="w-full h-1.5 bg-neutral-800 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: `${carbPercent}%` }} />
            </div>
          </div>

          {/* Fat */}
          <div className="bg-neutral-950/80 p-3 rounded-xl border border-neutral-800/80">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sky-400 font-bold">Gorduras</span>
              <span className="text-[11px] text-neutral-400">{fatPercent}%</span>
            </div>
            <div className="text-lg font-black text-white">
              {todayNutrition.consumedFat} <span className="text-xs font-normal text-neutral-400">/ {nutrition.targetMacros.fatGrams}g</span>
            </div>
            <div className="w-full h-1.5 bg-neutral-800 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-sky-500 rounded-full" style={{ width: `${fatPercent}%` }} />
            </div>
          </div>

          {/* Water */}
          <div className="bg-neutral-950/80 p-3 rounded-xl border border-neutral-800/80">
            <div className="flex justify-between items-center mb-1">
              <span className="text-cyan-400 font-bold flex items-center gap-1">
                <Droplets className="w-3 h-3" /> Água
              </span>
              <span className="text-[11px] text-neutral-400">{waterPercent}%</span>
            </div>
            <div className="text-lg font-black text-white">
              {todayNutrition.consumedWaterMl} <span className="text-xs font-normal text-neutral-400">/ {nutrition.hydrationTargetMl}ml</span>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <button
                onClick={() => onAddWater(250)}
                className="flex-1 py-0.5 rounded bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-400 text-[10px] font-bold transition cursor-pointer"
              >
                +250ml
              </button>
              <button
                onClick={() => onAddWater(500)}
                className="flex-1 py-0.5 rounded bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-400 text-[10px] font-bold transition cursor-pointer"
              >
                +500ml
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Refeições Estruturadas do Dia */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Utensils className="w-4 h-4 text-emerald-400" />
              Distribuição de Refeições Prescritas
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Alimentos nutritivos distribuídos para maximizar a síntese proteica (MPS) e níveis de energia estáveis.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {nutrition.meals.map((meal, idx) => (
            <div
              key={meal.id}
              className={`border rounded-xl p-4 transition ${
                meal.completed
                  ? 'bg-neutral-950/40 border-neutral-800/60 opacity-90'
                  : 'bg-neutral-950/80 border-neutral-800'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => onToggleMealCompleted(meal.id)}
                    className={`w-6 h-6 rounded-lg flex items-center justify-center transition cursor-pointer ${
                      meal.completed
                        ? 'bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-500/20'
                        : 'border border-neutral-700 hover:border-neutral-500 text-neutral-500'
                    }`}
                  >
                    {meal.completed ? <Check className="w-4 h-4 stroke-[3]" /> : <Circle className="w-3.5 h-3.5" />}
                  </button>
                  <div>
                    <h3 className={`text-sm font-bold ${meal.completed ? 'text-neutral-300 line-through' : 'text-white'}`}>
                      {meal.name}
                    </h3>
                    <span className="text-[11px] text-neutral-400 font-mono">Horário sugerido: {meal.time}</span>
                  </div>
                </div>

                <div className="text-xs text-neutral-400">
                  Meta: <strong className="text-amber-400 font-mono">~{meal.targetCalories} kcal</strong>
                </div>
              </div>

              {/* Items in meal */}
              <div className="space-y-1.5 pl-8 text-xs">
                {meal.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-2 rounded-lg bg-neutral-900/60 border border-neutral-800/40 gap-1"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-neutral-200">{item.name}</span>
                      <span className="text-neutral-400 text-[11px]">({item.portion})</span>
                    </div>
                    <div className="text-neutral-400 font-mono text-[11px] flex items-center gap-2">
                      <span>{item.calories} kcal</span>
                      <span>•</span>
                      <span className="text-rose-400">{item.protein}g P</span>
                      <span>•</span>
                      <span className="text-amber-400">{item.carbs}g C</span>
                      <span>•</span>
                      <span className="text-sky-400">{item.fat}g G</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Acompanhamento Nutricional & Feedback Subjetivo (Fome, Saciedade, Energia, Adesão) */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-emerald-400" />
            Check-in de Resposta Nutricional do Dia
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Esses dados são diretamente processados pelo Motor Adaptativo para evitar cortes calóricos arbitrários.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Adherence */}
          <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800">
            <label className="text-neutral-300 font-semibold block mb-2">Adesão ao Plano (1 a 5)</label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setAdherenceScore(star)}
                  className={`w-7 h-7 rounded-lg font-bold text-xs cursor-pointer transition ${
                    adherenceScore >= star
                      ? 'bg-emerald-500 text-neutral-950'
                      : 'bg-neutral-800 text-neutral-500 hover:bg-neutral-700'
                  }`}
                >
                  {star}
                </button>
              ))}
            </div>
            <span className="text-[10px] text-neutral-500 mt-1 block">
              {adherenceScore === 5 ? '100% no plano' : adherenceScore >= 3 ? 'Adesão moderada' : 'Fuga da dieta'}
            </span>
          </div>

          {/* Hunger */}
          <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800">
            <label className="text-neutral-300 font-semibold block mb-2">Nível de Fome</label>
            <div className="grid grid-cols-3 gap-1">
              {(['baixa', 'moderada', 'alta'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setHungerLevel(level)}
                  className={`py-1.5 rounded-lg text-xs capitalize transition cursor-pointer font-medium ${
                    hungerLevel === level
                      ? 'bg-amber-500 text-neutral-950 font-bold'
                      : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
            <span className="text-[10px] text-neutral-500 mt-1 block">Sinal de adaptação grelina</span>
          </div>

          {/* Satiety */}
          <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800">
            <label className="text-neutral-300 font-semibold block mb-2">Saciedade Pós-Refeição</label>
            <div className="grid grid-cols-3 gap-1">
              {(['ruim', 'boa', 'excelente'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setSatietyLevel(level)}
                  className={`py-1.5 rounded-lg text-xs capitalize transition cursor-pointer font-medium ${
                    satietyLevel === level
                      ? 'bg-teal-500 text-neutral-950 font-bold'
                      : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
            <span className="text-[10px] text-neutral-500 mt-1 block">Volume e fibras adequadas</span>
          </div>

          {/* Energy */}
          <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800">
            <label className="text-neutral-300 font-semibold block mb-2">Nível de Disposição</label>
            <div className="grid grid-cols-3 gap-1">
              {(['baixa', 'normal', 'alta'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setEnergyLevel(level)}
                  className={`py-1.5 rounded-lg text-xs capitalize transition cursor-pointer font-medium ${
                    energyLevel === level
                      ? 'bg-emerald-500 text-neutral-950 font-bold'
                      : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
            <span className="text-[10px] text-neutral-500 mt-1 block">Rendimento muscular</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          {savedFeedback && (
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Check-in registrado com sucesso!
            </span>
          )}
          <button
            onClick={handleSaveFeedback}
            className="ml-auto px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-bold rounded-xl transition shadow-md shadow-emerald-500/20 active:scale-95 cursor-pointer"
          >
            Salvar Resposta do Dia
          </button>
        </div>
      </div>
    </div>
  );
};
