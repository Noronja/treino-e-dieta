import React from 'react';
import { 
  User, ShieldCheck, Dumbbell, Utensils, RotateCcw, Sparkles, 
  BrainCircuit, HeartPulse, Scale, CheckCircle2, ChevronRight, Info 
} from 'lucide-react';
import { UserProfile, Anthropometry, WorkoutProgram, NutritionPlan } from '../types';
import { DisclaimerBanner } from './DisclaimerBanner';

interface ProfileViewProps {
  profile: UserProfile;
  latestAnthropometry?: Anthropometry;
  program: WorkoutProgram;
  nutrition: NutritionPlan;
  onOpenEvaluation: () => void;
  onOpenAdaptive: () => void;
  onOpenAi: () => void;
  onResetDemoData: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  latestAnthropometry,
  program,
  nutrition,
  onOpenEvaluation,
  onOpenAdaptive,
  onOpenAi,
  onResetDemoData,
}) => {
  const goalNames: Record<string, string> = {
    hipertrofia: 'Hipertrofia Muscular',
    perda_gordura: 'Perda de Gordura / Definição',
    recomposicao: 'Recomposição Corporal',
    manutencao: 'Manutenção',
    ganho_peso: 'Ganho de Peso',
    performance: 'Performance & Força',
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Profile Header Card */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-neutral-950 font-black text-2xl shadow-xl shadow-emerald-500/20">
              {profile.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">{profile.name}</h1>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Atleta KINETIC
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                {profile.age} anos • {profile.gender === 'masculino' ? 'Masculino' : 'Feminino'} • {profile.heightCm} cm • {profile.weightKg} kg
              </p>
            </div>
          </div>

          <button
            onClick={onOpenEvaluation}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs transition shadow-md shadow-emerald-500/20 active:scale-95 cursor-pointer self-start sm:self-auto"
          >
            Refazer Avaliação Inicial
          </button>
        </div>

        {/* Quick parameters grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-neutral-800 text-xs">
          <div>
            <span className="text-neutral-500 block text-[11px]">Objetivo Atual</span>
            <strong className="text-white font-semibold">{goalNames[profile.goal] || profile.goal}</strong>
          </div>
          <div>
            <span className="text-neutral-500 block text-[11px]">Experiência</span>
            <strong className="text-emerald-400 font-semibold capitalize">{profile.experience}</strong>
          </div>
          <div>
            <span className="text-neutral-500 block text-[11px]">Divisão de Treino</span>
            <strong className="text-white font-semibold capitalize">{program.splitType.replace('_', ' ')}</strong>
          </div>
          <div>
            <span className="text-neutral-500 block text-[11px]">Meta Calórica</span>
            <strong className="text-amber-400 font-semibold">{nutrition.targetMacros.calories} kcal/dia</strong>
          </div>
        </div>
      </div>

      {/* Training and Diet Prescriptions Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Training Parameters */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-emerald-400" />
              Parâmetros de Treinamento
            </h2>
          </div>

          <div className="space-y-2 text-xs divide-y divide-neutral-800/60">
            <div className="flex justify-between py-1.5">
              <span className="text-neutral-400">Frequência Semanal:</span>
              <strong className="text-white">{profile.frequencyDays} dias por semana</strong>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-neutral-400">Duração por Sessão:</span>
              <strong className="text-white">~{profile.sessionDurationMin || 60} minutos</strong>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-neutral-400">Equipamentos:</span>
              <strong className="text-neutral-200 capitalize">{profile.availableEquipment.replace('_', ' ')}</strong>
            </div>
            <div className="py-1.5">
              <span className="text-neutral-400 block mb-0.5">Limitações / Dores Declaradas:</span>
              <span className="text-neutral-300 italic">{profile.limitations || 'Nenhuma restrição articular.'}</span>
            </div>
          </div>
        </div>

        {/* Nutrition Parameters */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Utensils className="w-4 h-4 text-amber-400" />
              Parâmetros Nutricionais
            </h2>
          </div>

          <div className="space-y-2 text-xs divide-y divide-neutral-800/60">
            <div className="flex justify-between py-1.5">
              <span className="text-neutral-400">Metabolismo Basal (TMB):</span>
              <strong className="text-white">{nutrition.bmr} kcal</strong>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-neutral-400">Gasto Diário Total (GET):</span>
              <strong className="text-teal-400">{nutrition.tdee} kcal</strong>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-neutral-400">Estratégia Calórica:</span>
              <strong className="text-amber-400 capitalize">{nutrition.dietStrategy} ({nutrition.calorieDelta > 0 ? `+${nutrition.calorieDelta}` : nutrition.calorieDelta} kcal)</strong>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-neutral-400">Hidratação Recomendada:</span>
              <strong className="text-cyan-400">{nutrition.hydrationTargetMl} ml/dia</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Tools & Diagnostics */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-sm space-y-3">
        <h2 className="text-sm font-bold text-white mb-2">Diagnóstico & Ferramentas do Sistema</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <button
            onClick={onOpenAdaptive}
            className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-emerald-500/50 flex items-center justify-between text-left transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <BrainCircuit className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-white block font-bold">Motor Adaptativo KINETIC</strong>
                <span className="text-[11px] text-neutral-400">Auditar resposta e ver o ciclo de dados</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-500" />
          </button>

          <button
            onClick={onOpenAi}
            className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-emerald-500/50 flex items-center justify-between text-left transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-white block font-bold">Assistente de IA Integrado</strong>
                <span className="text-[11px] text-neutral-400">Tirar dúvidas fundamentadas nos seus dados</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-500" />
          </button>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onResetDemoData}
            className="text-[11px] text-neutral-500 hover:text-neutral-300 flex items-center gap-1.5 transition cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" /> Restaurar Dados de Demonstração
          </button>
        </div>
      </div>

      {/* Scientific Disclaimer */}
      <DisclaimerBanner />
    </div>
  );
};
