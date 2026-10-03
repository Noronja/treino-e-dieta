import React from 'react';
import { 
  Play, Dumbbell, Flame, Target, Droplets, ArrowUpRight, ArrowDownRight, 
  CheckCircle2, BrainCircuit, Sparkles, TrendingDown, Clock, ShieldCheck, ChevronRight
} from 'lucide-react';
import { UserProfile, WorkoutProgram, NutritionPlan, Anthropometry, DailyNutritionLog, RecoveryLog, AdaptiveAdjustment } from '../types';
import { DisclaimerBanner } from './DisclaimerBanner';

interface DashboardViewProps {
  profile: UserProfile;
  program: WorkoutProgram;
  nutrition: NutritionPlan;
  anthropometry: Anthropometry[];
  todayNutrition: DailyNutritionLog;
  recovery: RecoveryLog;
  latestAdjustment: AdaptiveAdjustment;
  onStartWorkout: (routineIndex: number) => void;
  onNavigateTab: (tab: any) => void;
  onOpenAi: () => void;
  onOpenAdaptive: () => void;
  onOpenCheckin: () => void;
  onQuickAddWater: (amountMl: number) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  program,
  nutrition,
  anthropometry,
  todayNutrition,
  recovery,
  latestAdjustment,
  onStartWorkout,
  onNavigateTab,
  onOpenAi,
  onOpenAdaptive,
  onOpenCheckin,
  onQuickAddWater,
}) => {
  const currentAnth = anthropometry[0] || {
    weightKg: profile.weightKg,
    waistCm: 82,
    estimatedBodyFatPct: 15.8,
    estimatedLeanMassKg: 66.9,
  };
  
  const oldestAnth = anthropometry[anthropometry.length - 1] || currentAnth;
  const weightDelta = Math.round((currentAnth.weightKg - oldestAnth.weightKg) * 10) / 10;
  const waistDelta = Math.round((currentAnth.waistCm - oldestAnth.waistCm) * 10) / 10;

  // Next or today's routine
  const todayRoutine = program.routines[0] || null;

  // Macro calculations
  const calPercent = Math.min(100, Math.round((todayNutrition.consumedCalories / nutrition.targetMacros.calories) * 100));
  const protPercent = Math.min(100, Math.round((todayNutrition.consumedProtein / nutrition.targetMacros.proteinGrams) * 100));
  const carbPercent = Math.min(100, Math.round((todayNutrition.consumedCarbs / nutrition.targetMacros.carbsGrams) * 100));
  const fatPercent = Math.min(100, Math.round((todayNutrition.consumedFat / nutrition.targetMacros.fatGrams) * 100));
  const waterPercent = Math.min(100, Math.round((todayNutrition.consumedWaterMl / nutrition.hydrationTargetMl) * 100));

  return (
    <div className="space-y-6 pb-24">
      {/* Hero Welcome & Loop Badge */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-950 border border-neutral-800 p-5 shadow-lg">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase tracking-widest text-emerald-400 font-semibold">
                Ciclo Adaptativo Ativo
              </span>
              <span className="text-xs text-neutral-400">•</span>
              <span className="text-xs text-neutral-400">Semana {program.currentWeek} de {program.totalWeeks}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Olá, {profile.name.split(' ')[0]}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-xl">
              Seu plano individual está calibrado para <strong className="text-neutral-200 capitalize">{profile.goal.replace('_', ' ')}</strong> com base na sua resposta fisiológica recente.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAdaptive}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-neutral-800/90 hover:bg-neutral-800 border border-neutral-700/80 text-xs font-semibold text-neutral-200 cursor-pointer transition active:scale-95 shadow-sm"
            >
              <BrainCircuit className="w-4 h-4 text-emerald-400" />
              <span>Ver Ciclo Adaptativo</span>
            </button>
            <button
              onClick={onOpenAi}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-bold cursor-pointer transition active:scale-95 shadow-md shadow-emerald-500/20"
            >
              <Sparkles className="w-4 h-4 fill-neutral-950" />
              <span>Dúvida com IA</span>
            </button>
          </div>
        </div>

        {/* Adaptive Feedback Flow Diagram */}
        <div className="mt-4 pt-4 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-400 overflow-x-auto gap-2 scrollbar-none py-1">
          <span className="text-emerald-400 font-semibold flex items-center gap-1 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400" /> Dados
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
          <span className="text-neutral-300 font-medium shrink-0">Prescrição</span>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
          <span className="text-neutral-300 font-medium shrink-0">Execução</span>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
          <span className="text-neutral-300 font-medium shrink-0">Registro</span>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
          <span className="text-neutral-300 font-medium shrink-0">Análise</span>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
          <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 shrink-0">Ajuste</span>
        </div>
      </div>

      {/* SEÇÃO HOJE: Treino do Dia & Nutrição Diária */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            Hoje em Destaque
          </h2>
          <span className="text-xs text-neutral-400">{new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'short' })}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Card Treino do Dia */}
          <div className="lg:col-span-7 bg-neutral-900 border border-neutral-800 rounded-2xl p-5 flex flex-col justify-between shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition">
              <Dumbbell className="w-32 h-32 text-emerald-400" />
            </div>

            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Treino Prescrito
                </span>
                <span className="text-xs text-neutral-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  ~{todayRoutine?.estimatedDurationMin || 60} min
                </span>
              </div>

              <h3 className="text-lg font-extrabold text-white mb-1">
                {todayRoutine?.name || 'Treino do Dia'}
              </h3>
              <p className="text-xs text-neutral-400 mb-4">
                Foco: <span className="text-neutral-200">{todayRoutine?.focus || 'Músculos principais'}</span>
              </p>

              {/* Exercises preview */}
              <div className="space-y-2 mb-4">
                {todayRoutine?.exercises.slice(0, 3).map((ex, idx) => (
                  <div key={ex.id} className="flex items-center justify-between text-xs bg-neutral-950/60 p-2.5 rounded-xl border border-neutral-800/80">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-neutral-800 text-neutral-300 font-bold flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-neutral-200">{ex.name}</span>
                    </div>
                    <span className="text-neutral-400 text-[11px]">
                      {ex.workingSets}x {ex.repsTarget} <span className="text-emerald-400">(RIR {ex.targetRir})</span>
                    </span>
                  </div>
                ))}
                {todayRoutine && todayRoutine.exercises.length > 3 && (
                  <div className="text-[11px] text-neutral-400 text-right pr-1">
                    + {todayRoutine.exercises.length - 3} outros exercícios prescritos
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => onStartWorkout(0)}
                className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold py-3 px-4 rounded-xl text-sm transition shadow-lg shadow-emerald-500/20 active:scale-98 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-neutral-950" />
                <span>Iniciar Treino Agora</span>
              </button>
              <button
                onClick={() => onNavigateTab('treino')}
                className="px-3.5 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition cursor-pointer"
              >
                Ver Ficha
              </button>
            </div>
          </div>

          {/* Card Nutrição do Dia */}
          <div className="lg:col-span-5 bg-neutral-900 border border-neutral-800 rounded-2xl p-5 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" />
                  Meta Nutricional
                </span>
                <span className="text-xs text-neutral-400 capitalize">
                  {nutrition.dietStrategy === 'deficit' ? 'Déficit Calórico' : nutrition.dietStrategy === 'superavit' ? 'Superávit Calórico' : 'Manutenção'}
                </span>
              </div>

              {/* Main Calories Metric */}
              <div className="flex items-baseline justify-between mb-2">
                <div>
                  <span className="text-2xl font-black text-white">{todayNutrition.consumedCalories}</span>
                  <span className="text-xs text-neutral-400"> / {nutrition.targetMacros.calories} kcal</span>
                </div>
                <span className="text-xs font-semibold text-emerald-400">{calPercent}%</span>
              </div>

              <div className="w-full h-2.5 bg-neutral-800 rounded-full overflow-hidden mb-4">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500" 
                  style={{ width: `${calPercent}%` }}
                />
              </div>

              {/* Macro Bars */}
              <div className="grid grid-cols-3 gap-2.5 mb-4">
                <div className="bg-neutral-950/70 p-2.5 rounded-xl border border-neutral-800/80">
                  <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                    <span className="text-rose-400 font-semibold">Proteína</span>
                    <span>{protPercent}%</span>
                  </div>
                  <div className="text-sm font-bold text-white">{todayNutrition.consumedProtein}g</div>
                  <div className="text-[10px] text-neutral-400">meta: {nutrition.targetMacros.proteinGrams}g</div>
                  <div className="w-full h-1.5 bg-neutral-800 rounded-full mt-1.5 overflow-hidden">
                    <div className="h-full bg-rose-500 rounded-full" style={{ width: `${protPercent}%` }} />
                  </div>
                </div>

                <div className="bg-neutral-950/70 p-2.5 rounded-xl border border-neutral-800/80">
                  <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                    <span className="text-amber-400 font-semibold">Carboidrato</span>
                    <span>{carbPercent}%</span>
                  </div>
                  <div className="text-sm font-bold text-white">{todayNutrition.consumedCarbs}g</div>
                  <div className="text-[10px] text-neutral-400">meta: {nutrition.targetMacros.carbsGrams}g</div>
                  <div className="w-full h-1.5 bg-neutral-800 rounded-full mt-1.5 overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${carbPercent}%` }} />
                  </div>
                </div>

                <div className="bg-neutral-950/70 p-2.5 rounded-xl border border-neutral-800/80">
                  <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                    <span className="text-sky-400 font-semibold">Gordura</span>
                    <span>{fatPercent}%</span>
                  </div>
                  <div className="text-sm font-bold text-white">{todayNutrition.consumedFat}g</div>
                  <div className="text-[10px] text-neutral-400">meta: {nutrition.targetMacros.fatGrams}g</div>
                  <div className="w-full h-1.5 bg-neutral-800 rounded-full mt-1.5 overflow-hidden">
                    <div className="h-full bg-sky-500 rounded-full" style={{ width: `${fatPercent}%` }} />
                  </div>
                </div>
              </div>

              {/* Water Row */}
              <div className="flex items-center justify-between bg-neutral-950/70 p-2.5 rounded-xl border border-neutral-800/80">
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-cyan-400" />
                  <div>
                    <span className="text-xs font-semibold text-neutral-200">Hidratação: </span>
                    <span className="text-xs text-white font-bold">{todayNutrition.consumedWaterMl} ml</span>
                    <span className="text-[10px] text-neutral-400"> / {nutrition.hydrationTargetMl} ml</span>
                  </div>
                </div>
                <button
                  onClick={() => onQuickAddWater(250)}
                  className="px-2.5 py-1 rounded-lg bg-cyan-500/15 text-cyan-400 hover:bg-cyan-500/25 border border-cyan-500/30 text-xs font-semibold cursor-pointer active:scale-95 transition"
                >
                  +250ml
                </button>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-between">
              <button
                onClick={() => onNavigateTab('dieta')}
                className="w-full text-center text-xs font-semibold text-emerald-400 hover:text-emerald-300 py-1 transition cursor-pointer"
              >
                Abrir Refeições Detalhadas →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SEÇÃO EVOLUÇÃO: Cards de Acompanhamento */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-400" />
            Evolução Antropométrica & Performance
          </h2>
          <button 
            onClick={() => onNavigateTab('evolucao')}
            className="text-xs text-emerald-400 hover:underline cursor-pointer"
          >
            Ver histórico completo
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Card Peso */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3.5">
            <div className="text-[11px] font-medium text-neutral-400">Peso Atual</div>
            <div className="text-xl font-black text-white mt-0.5">{currentAnth.weightKg} <span className="text-xs font-normal text-neutral-400">kg</span></div>
            <div className="text-[10px] text-neutral-400 mt-1 flex items-center gap-1">
              {weightDelta < 0 ? (
                <span className="text-emerald-400 font-semibold flex items-center"><ArrowDownRight className="w-3 h-3" /> {Math.abs(weightDelta)}kg</span>
              ) : weightDelta > 0 ? (
                <span className="text-amber-400 font-semibold flex items-center"><ArrowUpRight className="w-3 h-3" /> +{weightDelta}kg</span>
              ) : (
                <span className="text-neutral-400 font-semibold">Estável</span>
              )}
              <span>no ciclo</span>
            </div>
          </div>

          {/* Card Cintura */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3.5">
            <div className="text-[11px] font-medium text-neutral-400">Cintura</div>
            <div className="text-xl font-black text-white mt-0.5">{currentAnth.waistCm} <span className="text-xs font-normal text-neutral-400">cm</span></div>
            <div className="text-[10px] text-neutral-400 mt-1 flex items-center gap-1">
              {waistDelta < 0 ? (
                <span className="text-emerald-400 font-semibold flex items-center"><ArrowDownRight className="w-3 h-3" /> {Math.abs(waistDelta)}cm</span>
              ) : (
                <span className="text-neutral-400 font-semibold">Inalterada</span>
              )}
              <span>perímetro</span>
            </div>
          </div>

          {/* Card % Gordura Estimada */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3.5">
            <div className="text-[11px] font-medium text-neutral-400">% Gordura Est.</div>
            <div className="text-xl font-black text-emerald-400 mt-0.5">{currentAnth.estimatedBodyFatPct}%</div>
            <div className="text-[10px] text-neutral-400 mt-1">Fórmula Navy</div>
          </div>

          {/* Card Massa Magra */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3.5">
            <div className="text-[11px] font-medium text-neutral-400">Massa Magra</div>
            <div className="text-xl font-black text-white mt-0.5">{currentAnth.estimatedLeanMassKg} <span className="text-xs font-normal text-neutral-400">kg</span></div>
            <div className="text-[10px] text-emerald-400 mt-1 font-semibold">Preservada</div>
          </div>

          {/* Card Frequência de Treino */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3.5">
            <div className="text-[11px] font-medium text-neutral-400">Frequência</div>
            <div className="text-xl font-black text-white mt-0.5">{profile.frequencyDays}x <span className="text-xs font-normal text-neutral-400">/sem</span></div>
            <div className="text-[10px] text-emerald-400 font-semibold mt-1">100% Adesão</div>
          </div>

          {/* Card Volume Load */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3.5">
            <div className="text-[11px] font-medium text-neutral-400">Volume Semanal</div>
            <div className="text-xl font-black text-teal-400 mt-0.5">14 <span className="text-xs font-normal text-neutral-400">sets/músc</span></div>
            <div className="text-[10px] text-neutral-400 mt-1">Faixa hipertrófica</div>
          </div>
        </div>
      </div>

      {/* SEÇÃO STATUS INTEGRADO (Treino, Nutrição, Recuperação, Evolução) */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-white mb-3">Status Fisiológico Integrado</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-neutral-950/60 p-3 rounded-xl border border-neutral-800 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm shrink-0">
              🏋️
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Treino</div>
              <div className="text-[11px] text-emerald-400 font-medium">Sobrecarga Ativa</div>
              <div className="text-[10px] text-neutral-400 mt-0.5">RIR médio 1.8</div>
            </div>
          </div>

          <div className="bg-neutral-950/60 p-3 rounded-xl border border-neutral-800 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-sm shrink-0">
              🥗
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Nutrição</div>
              <div className="text-[11px] text-emerald-400 font-medium">Adesão Alta (92%)</div>
              <div className="text-[10px] text-neutral-400 mt-0.5">Proteína batida</div>
            </div>
          </div>

          <div className="bg-neutral-950/60 p-3 rounded-xl border border-neutral-800 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold text-sm shrink-0">
              💤
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Recuperação</div>
              <div className="text-[11px] text-sky-400 font-medium">Ótima ({recovery.sleepHours}h)</div>
              <div className="text-[10px] text-neutral-400 mt-0.5">Fadiga 2/5 (baixa)</div>
            </div>
          </div>

          <div className="bg-neutral-950/60 p-3 rounded-xl border border-neutral-800 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-sm shrink-0">
              📈
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Evolução</div>
              <div className="text-[11px] text-purple-400 font-medium">Recomposição</div>
              <div className="text-[10px] text-neutral-400 mt-0.5">Cintura ↓ Força ↑</div>
            </div>
          </div>
        </div>
      </div>

      {/* SEÇÃO CARD MOTOR ADAPTATIVO & ÚLTIMA DECISÃO EXPLICADA */}
      <div className="bg-gradient-to-r from-neutral-900 to-neutral-950 border border-neutral-800 rounded-2xl p-5 shadow-sm space-y-4">
        {/* Weekly Check-in Callout with Haluch / Aceto / Belmiro */}
        <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Check-in Central da Semana
              </span>
              <span className="text-[11px] text-neutral-400">
                Haluch • Aceto • Belmiro de Salles
              </span>
            </div>
            <h4 className="text-sm font-bold text-white">
              Análise Multidimensional: Resposta → Interpretação → Decisão
            </h4>
            <p className="text-[11px] text-neutral-300 mt-0.5">
              Cruze peso, cintura, RIR, adesão e fadiga para gerar ajustes fundamentados sem alterações arbitrárias.
            </p>
          </div>

          <button
            onClick={onOpenCheckin}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs transition shadow-md shadow-emerald-500/20 active:scale-95 cursor-pointer whitespace-nowrap self-start sm:self-auto flex items-center gap-1.5"
          >
            <span>Realizar Check-in Semanal</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2 pt-2 border-t border-neutral-800/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                Auditoria do Sistema Adaptativo
              </span>
              <h3 className="text-base font-bold text-white">
                {latestAdjustment.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onOpenAdaptive}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition cursor-pointer self-start sm:self-auto"
          >
            <span>Auditar Resposta Completa</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-neutral-950/70 p-4 rounded-xl border border-neutral-800/80">
          <div>
            <div className="text-neutral-400 font-semibold mb-1">O que mudou?</div>
            <p className="text-neutral-200">{latestAdjustment.whatChanged}</p>
          </div>
          <div>
            <div className="text-neutral-400 font-semibold mb-1">Por que mudou?</div>
            <p className="text-neutral-200">{latestAdjustment.whyChanged}</p>
          </div>
          <div className="md:col-span-2 pt-2 border-t border-neutral-800/60 flex items-center justify-between text-[11px] text-neutral-400">
            <div>
              <strong className="text-neutral-300">Dados analisados:</strong> {latestAdjustment.dataTrigger}
            </div>
            <div className="text-emerald-400 font-semibold">
              Status: {latestAdjustment.status === 'optimal' ? 'Estratégia Mantida' : 'Ajuste Aplicado'}
            </div>
          </div>
        </div>
      </div>

      {/* Scientific & Legal Disclaimer Banner */}
      <DisclaimerBanner />
    </div>
  );
};
