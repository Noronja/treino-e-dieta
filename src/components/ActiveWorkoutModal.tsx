import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, Check, Plus, AlertCircle, Trophy, Flame, Clock } from 'lucide-react';
import { WorkoutRoutine, WorkoutSessionLog, LoggedExercise, LoggedSet } from '../types';

interface ActiveWorkoutModalProps {
  routine: WorkoutRoutine;
  onClose: () => void;
  onFinishWorkout: (log: WorkoutSessionLog) => void;
}

export const ActiveWorkoutModal: React.FC<ActiveWorkoutModalProps> = ({
  routine,
  onClose,
  onFinishWorkout,
}) => {
  // Session duration timer
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [sessionActive, setSessionActive] = useState(true);

  // Rest interval countdown timer
  const [restRemaining, setRestRemaining] = useState(0);
  const [restTotal, setRestTotal] = useState(90);
  const [restActive, setRestActive] = useState(false);

  // RPE & Pain
  const [perceivedRPE, setPerceivedRPE] = useState(8);
  const [jointPainReported, setJointPainReported] = useState(false);
  const [sessionNotes, setSessionNotes] = useState('');

  // Local state of exercises being tracked in real time
  const [exercisesState, setExercisesState] = useState<LoggedExercise[]>(() => {
    return routine.exercises.map((ex) => {
      const defaultWeight = ex.personalRecord?.weightKg || 40;
      const sets: LoggedSet[] = [];
      for (let s = 1; s <= ex.workingSets; s++) {
        sets.push({
          setNumber: s,
          isWarmup: false,
          weightKg: defaultWeight,
          repsCompleted: parseInt(ex.repsTarget.split('-')[0]) || 8,
          rirAchieved: ex.targetRir,
          painScale: 0,
          completed: false,
        });
      }
      return {
        exerciseId: ex.id,
        exerciseName: ex.name,
        targetMuscle: ex.targetMuscle,
        sets,
      };
    });
  });

  // Track session timer
  useEffect(() => {
    let interval: any = null;
    if (sessionActive) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sessionActive]);

  // Track rest countdown timer
  useEffect(() => {
    let interval: any = null;
    if (restActive && restRemaining > 0) {
      interval = setInterval(() => {
        setRestRemaining((prev) => {
          if (prev <= 1) {
            setRestActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [restActive, restRemaining]);

  const startRestTimer = (seconds: number) => {
    setRestTotal(seconds);
    setRestRemaining(seconds);
    setRestActive(true);
  };

  const handleToggleSetComplete = (exIdx: number, setIdx: number, restSeconds: number) => {
    setExercisesState((prev) => {
      const updated = [...prev];
      const targetSet = updated[exIdx].sets[setIdx];
      const wasCompleted = targetSet.completed;
      targetSet.completed = !wasCompleted;

      // If user just marked set as done, trigger rest timer
      if (!wasCompleted) {
        startRestTimer(restSeconds);
      }
      return updated;
    });
  };

  const handleUpdateSetValue = (
    exIdx: number,
    setIdx: number,
    field: keyof LoggedSet,
    value: any
  ) => {
    setExercisesState((prev) => {
      const updated = [...prev];
      (updated[exIdx].sets[setIdx] as any)[field] = value;
      return updated;
    });
  };

  const handleAddSet = (exIdx: number) => {
    setExercisesState((prev) => {
      const updated = [...prev];
      const ex = updated[exIdx];
      const lastSet = ex.sets[ex.sets.length - 1];
      ex.sets.push({
        setNumber: ex.sets.length + 1,
        isWarmup: false,
        weightKg: lastSet ? lastSet.weightKg : 40,
        repsCompleted: lastSet ? lastSet.repsCompleted : 10,
        rirAchieved: 1,
        painScale: 0,
        completed: false,
      });
      return updated;
    });
  };

  // Calculate live volume load
  let totalVolumeLoad = 0;
  let totalCompletedSets = 0;
  exercisesState.forEach((ex) => {
    ex.sets.forEach((s) => {
      if (s.completed) {
        totalVolumeLoad += s.weightKg * s.repsCompleted;
        totalCompletedSets++;
      }
    });
  });

  const handleFinish = () => {
    const log: WorkoutSessionLog = {
      id: `log_${Date.now()}`,
      routineId: routine.id,
      routineName: routine.name,
      date: new Date().toISOString().split('T')[0],
      durationMinutes: Math.max(1, Math.round(elapsedSeconds / 60)),
      exercises: exercisesState,
      perceivedEffortRPE: perceivedRPE,
      jointPainReported: jointPainReported,
      notes: sessionNotes || 'Treino concluído conforme prescrição.',
      totalVolumeLoadKg: totalVolumeLoad,
    };
    onFinishWorkout(log);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header with Live Stats & Rest Timer */}
        <div className="bg-neutral-950 p-4 border-b border-neutral-800 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400">Em Execução</span>
              <span className="text-neutral-500">•</span>
              <span className="text-xs text-neutral-300 font-mono flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-neutral-400" />
                {formatTime(elapsedSeconds)}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-white">{routine.name}</h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Rest Countdown Bar (if active) */}
        {restRemaining > 0 && (
          <div className="bg-emerald-950/60 border-b border-emerald-800/40 p-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400 animate-spin" />
              <span className="text-emerald-200 font-semibold">Descanso Entre Séries:</span>
              <span className="text-lg font-black font-mono text-emerald-400">{formatTime(restRemaining)}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setRestRemaining((prev) => prev + 30)}
                className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-lg font-semibold text-xs transition"
              >
                +30s
              </button>
              <button
                onClick={() => { setRestRemaining(0); setRestActive(false); }}
                className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg text-xs transition"
              >
                Pular
              </button>
            </div>
          </div>
        )}

        {/* Exercises Scrollable List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {exercisesState.map((ex, exIdx) => {
            const definition = routine.exercises.find((d) => d.id === ex.exerciseId) || routine.exercises[exIdx];
            return (
              <div key={ex.exerciseId} className="bg-neutral-950/80 border border-neutral-800/80 rounded-xl p-3.5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <h3 className="font-bold text-white text-sm flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center">
                        {exIdx + 1}
                      </span>
                      {ex.exerciseName}
                    </h3>
                    <div className="text-[11px] text-neutral-400 mt-0.5">
                      {ex.targetMuscle} • Alvo: {definition?.repsTarget || '8-12'} reps • <span className="text-emerald-400">RIR Alvo: {definition?.targetRir ?? 1}</span>
                    </div>
                  </div>

                  {definition?.personalRecord && (
                    <div className="text-[11px] bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded-lg flex items-center gap-1 self-start sm:self-auto">
                      <Trophy className="w-3 h-3 text-amber-400" />
                      <span>Melhor: {definition.personalRecord.weightKg}kg x {definition.personalRecord.reps}</span>
                    </div>
                  )}
                </div>

                {/* Table of sets */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-neutral-400 border-b border-neutral-800/60 pb-1">
                        <th className="text-left font-medium py-1 px-1 w-12">Série</th>
                        <th className="text-left font-medium py-1 px-1">Carga (kg)</th>
                        <th className="text-left font-medium py-1 px-1">Reps Real</th>
                        <th className="text-left font-medium py-1 px-1">RIR (0-4)</th>
                        <th className="text-center font-medium py-1 px-1 w-14">Check</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/40">
                      {ex.sets.map((set, setIdx) => (
                        <tr
                          key={set.setNumber}
                          className={`transition ${set.completed ? 'bg-emerald-950/20 text-neutral-300' : 'text-neutral-200'}`}
                        >
                          <td className="py-2 px-1 font-bold text-neutral-400">
                            #{set.setNumber}
                          </td>
                          <td className="py-2 px-1">
                            <input
                              type="number"
                              step="0.5"
                              value={set.weightKg}
                              onChange={(e) =>
                                handleUpdateSetValue(exIdx, setIdx, 'weightKg', parseFloat(e.target.value) || 0)
                              }
                              className="w-18 bg-neutral-900 border border-neutral-700 rounded-lg px-2 py-1 text-white font-bold text-center focus:outline-none focus:border-emerald-500"
                            />
                          </td>
                          <td className="py-2 px-1">
                            <input
                              type="number"
                              value={set.repsCompleted}
                              onChange={(e) =>
                                handleUpdateSetValue(exIdx, setIdx, 'repsCompleted', parseInt(e.target.value) || 0)
                              }
                              className="w-16 bg-neutral-900 border border-neutral-700 rounded-lg px-2 py-1 text-white font-bold text-center focus:outline-none focus:border-emerald-500"
                            />
                          </td>
                          <td className="py-2 px-1">
                            <select
                              value={set.rirAchieved}
                              onChange={(e) =>
                                handleUpdateSetValue(exIdx, setIdx, 'rirAchieved', parseInt(e.target.value))
                              }
                              className="bg-neutral-900 border border-neutral-700 rounded-lg px-2 py-1 text-emerald-400 font-semibold text-center focus:outline-none focus:border-emerald-500"
                            >
                              <option value={0}>0 (Falha)</option>
                              <option value={1}>1 (Quase)</option>
                              <option value={2}>2 (Ótimo)</option>
                              <option value={3}>3 (Fácil)</option>
                              <option value={4}>4+</option>
                            </select>
                          </td>
                          <td className="py-2 px-1 text-center">
                            <button
                              onClick={() => handleToggleSetComplete(exIdx, setIdx, definition?.restSeconds || 90)}
                              className={`w-8 h-8 rounded-lg flex items-center justify-center transition cursor-pointer ${
                                set.completed
                                  ? 'bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-500/30'
                                  : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-400'
                              }`}
                            >
                              <Check className="w-4 h-4 stroke-[3]" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => handleAddSet(exIdx)}
                    className="text-[11px] font-semibold text-neutral-400 hover:text-emerald-400 flex items-center gap-1 cursor-pointer transition"
                  >
                    <Plus className="w-3.5 h-3.5" /> Adicionar Série
                  </button>
                  <span className="text-[10px] text-neutral-500">
                    Descanso recomendado: {definition?.restSeconds || 90}s
                  </span>
                </div>
              </div>
            );
          })}

          {/* Session Evaluation Section (RPE, Pain, Notes) */}
          <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-300">
              Avaliação Subjetiva da Sessão
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-neutral-400 block mb-1">
                  Percepção Geral de Esforço (RPE: 1 a 10)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.5"
                    value={perceivedRPE}
                    onChange={(e) => setPerceivedRPE(parseFloat(e.target.value))}
                    className="flex-1 accent-emerald-500 cursor-pointer"
                  />
                  <span className="w-8 text-center font-bold text-white bg-neutral-900 py-1 rounded border border-neutral-800">
                    {perceivedRPE}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-neutral-400 block mb-1">
                  Desconforto ou Dor Articular?
                </label>
                <button
                  type="button"
                  onClick={() => setJointPainReported(!jointPainReported)}
                  className={`w-full py-1.5 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                    jointPainReported
                      ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                  }`}
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{jointPainReported ? 'Sim, dor articular registrada' : 'Não, articulações 100%'}</span>
                </button>
              </div>
            </div>

            <div>
              <label className="text-neutral-400 block mb-1 text-xs">
                Observações do Treino (Opcional)
              </label>
              <input
                type="text"
                placeholder="Ex: Carga do supino subiu com folga; técnica no agachamento excelente."
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Footer with Volume Summary & Finish Button */}
        <div className="bg-neutral-950 p-4 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-xs text-neutral-400 w-full sm:w-auto justify-between sm:justify-start">
            <div>
              <span>Volume Total: </span>
              <strong className="text-white font-mono text-sm">{totalVolumeLoad.toLocaleString('pt-BR')} kg</strong>
            </div>
            <div>
              <span>Séries Concluídas: </span>
              <strong className="text-emerald-400 font-mono text-sm">{totalCompletedSets}</strong>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={handleFinish}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-bold transition shadow-lg shadow-emerald-500/25 active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Concluir Treino</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
