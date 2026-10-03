import React, { useState } from 'react';
import { 
  X, Calendar, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, 
  BrainCircuit, Scale, Dumbbell, Utensils, HeartPulse, ShieldCheck, ChevronRight, Check
} from 'lucide-react';
import { 
  WeeklyCheckinData, 
  WeeklyCheckinReport, 
  UserProfile, 
  WorkoutProgram, 
  NutritionPlan, 
  Anthropometry, 
  WorkoutSessionLog, 
  DailyNutritionLog, 
  RecoveryLog 
} from '../types';
import { generateLocalWeeklyCheckin } from '../utils/methodology';

interface WeeklyCheckinModalProps {
  profile: UserProfile;
  program: WorkoutProgram;
  nutrition: NutritionPlan;
  anthropometry: Anthropometry[];
  workoutLogs: WorkoutSessionLog[];
  todayNutrition: DailyNutritionLog;
  recovery: RecoveryLog;
  onClose: () => void;
  onApplyCheckinReport: (report: WeeklyCheckinReport) => void;
}

export const WeeklyCheckinModal: React.FC<WeeklyCheckinModalProps> = ({
  profile,
  program,
  nutrition,
  anthropometry,
  workoutLogs,
  todayNutrition,
  recovery,
  onClose,
  onApplyCheckinReport,
}) => {
  const latestAnth = anthropometry[0] || {
    weightKg: profile.weightKg,
    waistCm: 82,
  };

  // Check-in input state pre-filled from user's current tracking data
  const [weightKg, setWeightKg] = useState(latestAnth.weightKg);
  const [waistCm, setWaistCm] = useState(latestAnth.waistCm);
  const [strengthProgression, setStrengthProgression] = useState<'aumentou' | 'manteve' | 'caiu'>('aumentou');
  const [avgRir, setAvgRir] = useState<number>(1.8);
  const [avgDailyCalories, setAvgDailyCalories] = useState<number>(nutrition.targetMacros.calories);
  const [adherenceScore, setAdherenceScore] = useState<number>(todayNutrition.adherenceScore || 5);
  const [hungerLevel, setHungerLevel] = useState<'baixa' | 'moderada' | 'alta'>(todayNutrition.hungerLevel || 'moderada');
  const [satietyLevel, setSatietyLevel] = useState<'ruim' | 'boa' | 'excelente'>(todayNutrition.satietyLevel || 'boa');
  const [sleepAvgHours, setSleepAvgHours] = useState<number>(recovery.sleepHours || 7.5);
  const [fatigueScore, setFatigueScore] = useState<number>(recovery.fatigueScore || 2);
  const [stressLevel, setStressLevel] = useState<number>(2);
  const [jointDiscomfort, setJointDiscomfort] = useState<boolean>(false);
  const [visualDensityNotes, setVisualDensityNotes] = useState<string>('Músculo denso, boa definição abdominal pela manhã, vascularização aparente no treino.');

  // Generated Report state
  const [report, setReport] = useState<WeeklyCheckinReport | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [appliedNotice, setAppliedNotice] = useState(false);

  const handleSubmitCheckin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setAppliedNotice(false);

    const checkinData: WeeklyCheckinData = {
      date: new Date().toISOString().split('T')[0],
      weightKg: Number(weightKg),
      waistCm: Number(waistCm),
      avgRir: Number(avgRir),
      strengthProgression,
      avgDailyCalories: Number(avgDailyCalories),
      avgProteinGrams: nutrition.targetMacros.proteinGrams,
      adherenceScore: Number(adherenceScore),
      hungerLevel,
      satietyLevel,
      sleepAvgHours: Number(sleepAvgHours),
      fatigueScore: Number(fatigueScore),
      stressLevel: Number(stressLevel),
      visualDensityNotes,
      jointDiscomfort,
    };

    try {
      // Call server AI endpoint
      const response = await fetch('/api/gemini/weekly-checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          checkinData,
          userContext: {
            profile,
            program: { name: program.name, week: program.currentWeek, split: program.splitType },
            nutrition: { calories: nutrition.targetMacros.calories, strategy: nutrition.dietStrategy },
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const fullReport: WeeklyCheckinReport = {
          id: `checkin_${Date.now()}`,
          date: checkinData.date,
          title: data.title || 'Check-in Semanal Processado',
          status: data.status || 'manter',
          resposta: data.resposta || 'Dados registrados com sucesso.',
          interpretacao: data.interpretacao || 'Progressão sustentada conforme parâmetros fisiológicos.',
          decisao: data.decisao || 'Manutenção do microciclo.',
          perguntasChave: data.perguntasChave || {
            paraQuem: `Praticante nível ${profile.experience}`,
            paraQue: 'Manter sobrecarga progressiva',
            emQualMomento: 'Microciclo de consolidação',
          },
          methodologicalInsights: {
            duduHaluch: 'Titulação gradual e foco estrito na adesão antes de qualquer ajuste calórico.',
            chrisAceto: 'Resposta visual e sustentação de força no espelho e nos aparelhos.',
            belmiroDeSalles: 'Para quem? Para quê? Em qual momento? Volume ajustado à capacidade de recuperação.',
          },
          ajustesRecomendados: data.ajustesRecomendados || { caloriasDelta: 0, volumeDeltaSets: 0, focoCarboidrato: 'Estável' },
          applied: false,
        };
        setReport(fullReport);
      } else {
        // Fallback to local rule engine
        const local = generateLocalWeeklyCheckin(checkinData, profile, program, nutrition);
        setReport(local);
      }
    } catch {
      const local = generateLocalWeeklyCheckin(checkinData, profile, program, nutrition);
      setReport(local);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplyReport = () => {
    if (!report) return;
    onApplyCheckinReport(report);
    setAppliedNotice(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-neutral-950 p-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-neutral-950 font-black shadow-md shadow-emerald-500/20">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">Check-in Semanal & Auditoria</h2>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Haluch • Aceto • Belmiro
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Avaliação integrada: Composição corporal + Performance + Nutrição + Recuperação
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-xs">
          
          {/* If report is already generated, show the synthesized Triad: RESPOSTA -> INTERPRETAÇÃO -> DECISÃO */}
          {report ? (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between gap-2 border-b border-emerald-800/40 pb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">
                      Resultado do Check-in • {report.date}
                    </span>
                    <h3 className="text-base sm:text-lg font-extrabold text-white mt-0.5">
                      {report.title}
                    </h3>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Status: {report.status.replace('_', ' ')}
                  </span>
                </div>

                {/* The Core Methodological Triad */}
                <div className="space-y-3 pt-1">
                  {/* 1. RESPOSTA */}
                  <div className="bg-neutral-900/90 border border-neutral-800 p-3.5 rounded-xl">
                    <span className="text-emerald-400 font-bold uppercase text-[11px] block mb-1">
                      1. RESPOSTA DO INDIVÍDUO (Dados Observados)
                    </span>
                    <p className="text-neutral-200 leading-relaxed">{report.resposta}</p>
                  </div>

                  {/* 2. INTERPRETAÇÃO */}
                  <div className="bg-neutral-900/90 border border-neutral-800 p-3.5 rounded-xl">
                    <span className="text-teal-400 font-bold uppercase text-[11px] block mb-1">
                      2. INTERPRETAÇÃO FISIOLÓGICA (Conceito Haluch / Aceto / Belmiro)
                    </span>
                    <p className="text-neutral-200 leading-relaxed">{report.interpretacao}</p>
                  </div>

                  {/* 3. DECISÃO */}
                  <div className="bg-neutral-900/90 border border-neutral-800 p-3.5 rounded-xl">
                    <span className="text-amber-400 font-bold uppercase text-[11px] block mb-1">
                      3. DECISÃO PRÁTICA & CONDUTA
                    </span>
                    <p className="text-neutral-200 leading-relaxed">{report.decisao}</p>
                  </div>
                </div>

                {/* The 3 Belmiro Questions Box */}
                <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800/80 space-y-2">
                  <div className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                    <BrainCircuit className="w-4 h-4 text-emerald-400" />
                    Tríade de Decisão Belmiro de Salles
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px]">
                    <div className="bg-neutral-900 p-2.5 rounded-lg border border-neutral-800">
                      <strong className="text-emerald-400 block mb-0.5">«Para quem?»</strong>
                      <span className="text-neutral-300">{report.perguntasChave.paraQuem}</span>
                    </div>
                    <div className="bg-neutral-900 p-2.5 rounded-lg border border-neutral-800">
                      <strong className="text-teal-400 block mb-0.5">«Para quê?»</strong>
                      <span className="text-neutral-300">{report.perguntasChave.paraQue}</span>
                    </div>
                    <div className="bg-neutral-900 p-2.5 rounded-lg border border-neutral-800">
                      <strong className="text-amber-400 block mb-0.5">«Em qual momento?»</strong>
                      <span className="text-neutral-300">{report.perguntasChave.emQualMomento}</span>
                    </div>
                  </div>
                </div>

                {/* Methodological Insights Accordion */}
                <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-2">
                  <span className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider block">
                    Fundamentação dos Especialistas
                  </span>
                  <div className="space-y-1.5 text-[11px] text-neutral-300">
                    <div>
                      <strong className="text-emerald-400">Dudu Haluch: </strong>
                      {report.methodologicalInsights.duduHaluch}
                    </div>
                    <div>
                      <strong className="text-cyan-400">Chris Aceto: </strong>
                      {report.methodologicalInsights.chrisAceto}
                    </div>
                    <div>
                      <strong className="text-purple-400">Belmiro de Salles: </strong>
                      {report.methodologicalInsights.belmiroDeSalles}
                    </div>
                  </div>
                </div>

                {/* Apply Button */}
                <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3">
                  {appliedNotice ? (
                    <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Decisão aplicada e sincronizada no plano com sucesso!
                    </span>
                  ) : (
                    <span className="text-[11px] text-neutral-400">
                      Aplique esta decisão para atualizar as metas de treino e dieta do próximo microciclo.
                    </span>
                  )}

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => setReport(null)}
                      className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl text-xs transition cursor-pointer"
                    >
                      Editar Dados
                    </button>
                    <button
                      onClick={handleApplyReport}
                      className="flex-1 sm:flex-none px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs rounded-xl transition shadow-lg shadow-emerald-500/25 active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Aplicar Decisão ao Plano</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Check-in Input Form */
            <form onSubmit={handleSubmitCheckin} className="space-y-5">
              
              {/* Pillar 1: Composição Corporal */}
              <div className="bg-neutral-950/70 p-4 rounded-xl border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white flex items-center gap-2 text-xs uppercase tracking-wider">
                    <Scale className="w-4 h-4 text-emerald-400" />
                    1. Composição Corporal (Peso, Medidas & Espelho)
                  </h3>
                  <span className="text-[10px] text-neutral-400">Referência: Haluch & Aceto</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-neutral-400 block mb-1">Peso da Semana (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={weightKg}
                      onChange={(e) => setWeightKg(parseFloat(e.target.value))}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-white font-bold focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-400 block mb-1">Cintura Abdômen (cm)</label>
                    <input
                      type="number"
                      step="0.5"
                      required
                      value={waistCm}
                      onChange={(e) => setWaistCm(parseFloat(e.target.value))}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-white font-bold focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-neutral-400 block mb-1">Densidade & Espelho</label>
                    <input
                      type="text"
                      value={visualDensityNotes}
                      onChange={(e) => setVisualDensityNotes(e.target.value)}
                      placeholder="Ex: Físico cheio, vascularização boa"
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Pillar 2: Performance */}
              <div className="bg-neutral-950/70 p-4 rounded-xl border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white flex items-center gap-2 text-xs uppercase tracking-wider">
                    <Dumbbell className="w-4 h-4 text-teal-400" />
                    2. Performance de Treino (Carga, Reps & RIR)
                  </h3>
                  <span className="text-[10px] text-neutral-400">Referência: Belmiro de Salles</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-neutral-400 block mb-1">Progressão de Força</label>
                    <select
                      value={strengthProgression}
                      onChange={(e) => setStrengthProgression(e.target.value as any)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-white focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="aumentou">Subiu carga / repetições</option>
                      <option value="manteve">Manteve estável</option>
                      <option value="caiu">Queda de rendimento / força</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-neutral-400 block mb-1">RIR Médio (Falha: 0)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="4"
                      value={avgRir}
                      onChange={(e) => setAvgRir(parseFloat(e.target.value))}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-white font-bold focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-neutral-400 block mb-1">Desconforto Articular?</label>
                    <button
                      type="button"
                      onClick={() => setJointDiscomfort(!jointDiscomfort)}
                      className={`w-full p-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                        jointDiscomfort
                          ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                          : 'bg-neutral-900 border-neutral-700 text-neutral-300'
                      }`}
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{jointDiscomfort ? 'Sim, dor relatada' : 'Sem dor nas articulações'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Pillar 3: Nutrição & Adesão */}
              <div className="bg-neutral-950/70 p-4 rounded-xl border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white flex items-center gap-2 text-xs uppercase tracking-wider">
                    <Utensils className="w-4 h-4 text-amber-400" />
                    3. Nutrição & Adesão Dietética
                  </h3>
                  <span className="text-[10px] text-neutral-400">Referência: Dudu Haluch & Chris Aceto</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-neutral-400 block mb-1">Calorias Médias / Dia</label>
                    <input
                      type="number"
                      value={avgDailyCalories}
                      onChange={(e) => setAvgDailyCalories(parseInt(e.target.value))}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-white font-bold focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-400 block mb-1">Adesão (1 a 5)</label>
                    <select
                      value={adherenceScore}
                      onChange={(e) => setAdherenceScore(parseInt(e.target.value))}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-white focus:border-emerald-500 focus:outline-none"
                    >
                      <option value={5}>5 (100% no plano)</option>
                      <option value={4}>4 (Adesão muito boa)</option>
                      <option value={3}>3 (Moderada)</option>
                      <option value={2}>2 (Vários deslizes)</option>
                      <option value={1}>1 (Desconectou do plano)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-neutral-400 block mb-1">Nível de Fome</label>
                    <select
                      value={hungerLevel}
                      onChange={(e) => setHungerLevel(e.target.value as any)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-white focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="baixa">Baixa</option>
                      <option value="moderada">Moderada</option>
                      <option value="alta">Alta</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-neutral-400 block mb-1">Saciedade</label>
                    <select
                      value={satietyLevel}
                      onChange={(e) => setSatietyLevel(e.target.value as any)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-white focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="excelente">Excelente</option>
                      <option value="boa">Boa</option>
                      <option value="ruim">Ruim</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Pillar 4: Recuperação */}
              <div className="bg-neutral-950/70 p-4 rounded-xl border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white flex items-center gap-2 text-xs uppercase tracking-wider">
                    <HeartPulse className="w-4 h-4 text-purple-400" />
                    4. Recuperação (Sono, Fadiga & Estresse)
                  </h3>
                  <span className="text-[10px] text-neutral-400">Referência: Belmiro de Salles</span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-neutral-400 block mb-1">Sono Médio (Horas)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={sleepAvgHours}
                      onChange={(e) => setSleepAvgHours(parseFloat(e.target.value))}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-white font-bold focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-400 block mb-1">Fadiga Central (1 a 5)</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={fatigueScore}
                      onChange={(e) => setFatigueScore(parseInt(e.target.value))}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-white font-bold focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-400 block mb-1">Estresse (1 a 5)</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={stressLevel}
                      onChange={(e) => setStressLevel(parseInt(e.target.value))}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-white font-bold focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold transition shadow-lg shadow-emerald-500/25 active:scale-95 cursor-pointer flex items-center gap-2 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 fill-neutral-950" />
                  <span>{isProcessing ? 'Sintetizando Dados com IA...' : 'Processar Check-in Semanal'}</span>
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
