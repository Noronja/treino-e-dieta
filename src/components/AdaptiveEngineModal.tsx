import React, { useState } from 'react';
import { 
  X, BrainCircuit, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, 
  RotateCw, ShieldCheck, Activity, ChevronRight, Check
} from 'lucide-react';
import { AdaptiveAdjustment, UserProfile, Anthropometry, WorkoutProgram, NutritionPlan, WorkoutSessionLog, DailyNutritionLog } from '../types';
import { runAdaptiveAudit } from '../utils/calculations';

interface AdaptiveEngineModalProps {
  adjustment: AdaptiveAdjustment;
  adjustmentHistory: AdaptiveAdjustment[];
  profile: UserProfile;
  anthropometry: Anthropometry[];
  program: WorkoutProgram;
  nutrition: NutritionPlan;
  workoutLogs: WorkoutSessionLog[];
  todayNutrition: DailyNutritionLog;
  onClose: () => void;
  onApplyAdjustment: (newAdjustment: AdaptiveAdjustment) => void;
}

export const AdaptiveEngineModal: React.FC<AdaptiveEngineModalProps> = ({
  adjustment,
  adjustmentHistory,
  profile,
  anthropometry,
  program,
  nutrition,
  workoutLogs,
  todayNutrition,
  onClose,
  onApplyAdjustment,
}) => {
  const [currentAudit, setCurrentAudit] = useState<AdaptiveAdjustment>(adjustment);
  const [isAuditing, setIsAuditing] = useState(false);
  const [appliedNotice, setAppliedNotice] = useState(false);

  // Trigger a fresh AI/algorithmic audit
  const handleRunAudit = async () => {
    setIsAuditing(true);
    setAppliedNotice(false);

    try {
      const response = await fetch('/api/gemini/analyze-adaptive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userContext: {
            profile,
            currentWeight: anthropometry[0]?.weightKg,
            recentAnthropometry: anthropometry.slice(0, 4),
            currentProgramName: program.name,
            recentLogsSummary: workoutLogs.slice(0, 3).map((l) => ({
              routine: l.routineName,
              date: l.date,
              rpe: l.perceivedEffortRPE,
              jointPain: l.jointPainReported,
              volume: l.totalVolumeLoadKg,
            })),
            nutritionPlan: {
              strategy: nutrition.dietStrategy,
              calories: nutrition.targetMacros.calories,
              protein: nutrition.targetMacros.proteinGrams,
            },
            adherenceScore: todayNutrition.adherenceScore,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const generatedAdj: AdaptiveAdjustment = {
          id: `adj_${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          status: data.status || 'optimal',
          title: data.diagnosis || 'Auditoria Adaptativa Concluída',
          whatChanged: data.whatChanged || 'Manutenção programada do microciclo.',
          whyChanged: data.whyChanged || 'Sua resposta neuromuscular e taxa metabólica mantêm-se favoráveis.',
          dataTrigger: data.dataTrigger || 'Análise de peso, cargas e adesão dos últimos 14 dias.',
          evaluationMetrics: data.evaluationMetrics || 'Acompanhar média móvel do peso na próxima semana.',
          applied: false,
        };
        setCurrentAudit(generatedAdj);
      } else {
        // Fallback to local rule engine
        const fallback = runAdaptiveAudit(profile, anthropometry, workoutLogs, nutrition, 0.9);
        setCurrentAudit(fallback);
      }
    } catch (e) {
      const fallback = runAdaptiveAudit(profile, anthropometry, workoutLogs, nutrition, 0.9);
      setCurrentAudit(fallback);
    } finally {
      setIsAuditing(false);
    }
  };

  const handleApply = () => {
    onApplyAdjustment({
      ...currentAudit,
      applied: true,
    });
    setAppliedNotice(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-neutral-950 p-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                Diferencial Tecnológico
              </span>
              <h2 className="text-base sm:text-lg font-black text-white">
                Motor de Ajustes Adaptativos KINETIC
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Flow Visualizer */}
          <div className="bg-neutral-950/80 border border-neutral-800 rounded-xl p-4">
            <div className="text-[11px] font-semibold text-neutral-400 mb-2 uppercase tracking-wider">
              Ciclo Contínuo de Resposta Individual
            </div>
            <div className="flex items-center justify-between text-xs text-neutral-300 font-medium overflow-x-auto gap-2 py-1 scrollbar-none">
              <div className="text-center px-2 py-1 rounded bg-neutral-900 border border-neutral-800 shrink-0">1. Dados</div>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
              <div className="text-center px-2 py-1 rounded bg-neutral-900 border border-neutral-800 shrink-0">2. Prescrição</div>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
              <div className="text-center px-2 py-1 rounded bg-neutral-900 border border-neutral-800 shrink-0">3. Execução</div>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
              <div className="text-center px-2 py-1 rounded bg-neutral-900 border border-neutral-800 shrink-0">4. Registro</div>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
              <div className="text-center px-2 py-1 rounded bg-neutral-900 border border-neutral-800 shrink-0">5. Análise</div>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
              <div className="text-center px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold shrink-0">6. Ajuste</div>
            </div>
            <div className="text-[11px] text-neutral-400 mt-2">
              O sistema não faz alterações arbitrárias: cada decisão é fundamentada nos seus registros reais de carga, RIR, adesão e circunferências corporais.
            </div>
          </div>

          {/* Current Audit Report */}
          <div className="bg-neutral-950 border border-emerald-500/30 rounded-xl p-4 sm:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">
                  Auditoria Atual • {currentAudit.date}
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {currentAudit.title}
                </h3>
              </div>

              <button
                onClick={handleRunAudit}
                disabled={isAuditing}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-emerald-400 transition cursor-pointer self-start sm:self-auto disabled:opacity-50"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
                <span>{isAuditing ? 'Auditoria em Andamento...' : 'Reavaliar Resposta'}</span>
              </button>
            </div>

            {/* The 4 Core Explanatory Pillars Required by Prompt */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-neutral-900/90 p-3 rounded-lg border border-neutral-800">
                <span className="text-emerald-400 font-bold block mb-1">1. O que mudou?</span>
                <p className="text-neutral-200 leading-relaxed">{currentAudit.whatChanged}</p>
              </div>

              <div className="bg-neutral-900/90 p-3 rounded-lg border border-neutral-800">
                <span className="text-emerald-400 font-bold block mb-1">2. Por que mudou?</span>
                <p className="text-neutral-200 leading-relaxed">{currentAudit.whyChanged}</p>
              </div>

              <div className="bg-neutral-900/90 p-3 rounded-lg border border-neutral-800">
                <span className="text-emerald-400 font-bold block mb-1">3. Quais dados levaram à mudança?</span>
                <p className="text-neutral-200 leading-relaxed">{currentAudit.dataTrigger}</p>
              </div>

              <div className="bg-neutral-900/90 p-3 rounded-lg border border-neutral-800">
                <span className="text-emerald-400 font-bold block mb-1">4. O que será observado?</span>
                <p className="text-neutral-200 leading-relaxed">{currentAudit.evaluationMetrics}</p>
              </div>
            </div>

            {/* Apply Action Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              {appliedNotice ? (
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Ajuste adaptativo aplicado e sincronizado com o plano!
                </span>
              ) : (
                <span className="text-[11px] text-neutral-400">
                  {currentAudit.applied ? 'Ajuste já integrado no plano ativo.' : 'Clique abaixo para aplicar este ajuste ao seu treino/dieta.'}
                </span>
              )}

              <button
                onClick={handleApply}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs transition shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Aplicar Ajuste Recomendado</span>
              </button>
            </div>
          </div>

          {/* Past Adjustments Log */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-300">
              Histórico de Ajustes Anteriores
            </h4>

            {adjustmentHistory.length === 0 ? (
              <div className="text-xs text-neutral-500">Nenhum ajuste anterior arquivado.</div>
            ) : (
              <div className="space-y-2">
                {adjustmentHistory.map((past) => (
                  <div
                    key={past.id}
                    className="bg-neutral-950/60 p-3 rounded-xl border border-neutral-800/80 text-xs flex flex-col gap-1"
                  >
                    <div className="flex items-center justify-between text-neutral-400">
                      <strong className="text-white font-semibold">{past.title}</strong>
                      <span className="font-mono text-[10px]">{past.date}</span>
                    </div>
                    <div className="text-neutral-300 text-[11px] line-clamp-2 mt-0.5">
                      {past.whatChanged}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-neutral-950 p-4 border-t border-neutral-800 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
