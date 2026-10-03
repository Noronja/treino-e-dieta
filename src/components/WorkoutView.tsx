import React, { useState } from 'react';
import { Dumbbell, Play, Trophy, Sparkles, Clock, AlertTriangle, CheckCircle, Info, ChevronRight, BarChart3, Plus } from 'lucide-react';
import { WorkoutProgram, WorkoutRoutine, WorkoutSessionLog } from '../types';

interface WorkoutViewProps {
  program: WorkoutProgram;
  workoutLogs: WorkoutSessionLog[];
  onStartRoutine: (routineIndex: number) => void;
  onOpenAi: () => void;
  onOpenAdaptive: () => void;
}

export const WorkoutView: React.FC<WorkoutViewProps> = ({
  program,
  workoutLogs,
  onStartRoutine,
  onOpenAi,
  onOpenAdaptive,
}) => {
  const [selectedRoutineIndex, setSelectedRoutineIndex] = useState(0);
  const activeRoutine = program.routines[selectedRoutineIndex] || program.routines[0];

  const totalExercises = activeRoutine ? activeRoutine.exercises.length : 0;
  const totalWeeklySets = program.routines.reduce(
    (acc, r) => acc + r.exercises.reduce((exAcc, ex) => exAcc + ex.workingSets, 0),
    0
  );

  return (
    <div className="space-y-6 pb-24">
      {/* Header & Program Summary */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Divisão {program.splitType.toUpperCase().replace('_', ' ')}
              </span>
              <span className="text-xs text-neutral-400">
                Semana {program.currentWeek} de {program.totalWeeks}
              </span>
            </div>
            <h1 className="text-2xl font-black text-white">{program.name}</h1>
            <p className="text-xs text-neutral-400 mt-1 max-w-2xl">
              {program.scienceNotes}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAdaptive}
              className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-xs font-semibold text-neutral-200 transition cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Ajustar Volume</span>
            </button>
          </div>
        </div>

        {/* Weekly Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-neutral-800/80 text-xs">
          <div>
            <span className="text-neutral-400 block text-[11px]">Frequência Semanal</span>
            <strong className="text-white text-base font-bold">{program.weeklyFrequency} dias / semana</strong>
          </div>
          <div>
            <span className="text-neutral-400 block text-[11px]">Volume Total</span>
            <strong className="text-emerald-400 text-base font-bold">~{totalWeeklySets} séries de trabalho</strong>
          </div>
          <div>
            <span className="text-neutral-400 block text-[11px]">RIR Prescrito</span>
            <strong className="text-white text-base font-bold">1 a 2 (1-2 da falha)</strong>
          </div>
          <div>
            <span className="text-neutral-400 block text-[11px]">Status Deload</span>
            <strong className={`text-base font-bold ${program.isDeloadWeek ? 'text-amber-400' : 'text-teal-400'}`}>
              {program.isDeloadWeek ? 'Semana de Deload' : 'Sobrecarga Ativa'}
            </strong>
          </div>
        </div>
      </div>

      {/* Routine Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {program.routines.map((routine, idx) => {
          const isSelected = selectedRoutineIndex === idx;
          return (
            <button
              key={routine.id}
              onClick={() => setSelectedRoutineIndex(idx)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-2 border ${
                isSelected
                  ? 'bg-emerald-500 text-neutral-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                  : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border-neutral-800'
              }`}
            >
              <span>{routine.name.split(':')[0]}</span>
              {routine.dayOfWeek && (
                <span className={`text-[10px] font-normal ${isSelected ? 'text-neutral-900' : 'text-neutral-400'}`}>
                  ({routine.dayOfWeek.slice(0, 3)})
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Routine Detail Card */}
      {activeRoutine && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs text-emerald-400 font-semibold mb-0.5">
                {activeRoutine.dayOfWeek || 'Rotina de Treino'} • ~{activeRoutine.estimatedDurationMin} minutos
              </div>
              <h2 className="text-xl font-black text-white">{activeRoutine.name}</h2>
              <div className="text-xs text-neutral-400 mt-0.5">
                Foco muscular: <span className="text-neutral-200">{activeRoutine.focus}</span>
              </div>
            </div>

            <button
              onClick={() => onStartRoutine(selectedRoutineIndex)}
              className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold px-6 py-3 rounded-xl text-sm transition shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer self-start sm:self-auto"
            >
              <Play className="w-4 h-4 fill-neutral-950" />
              <span>Iniciar Sessão Agora</span>
            </button>
          </div>

          {/* Exercise List */}
          <div className="space-y-3">
            {activeRoutine.exercises.map((exercise, index) => (
              <div
                key={exercise.id}
                className="bg-neutral-950/70 border border-neutral-800/80 rounded-xl p-4 transition hover:border-neutral-700"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-lg bg-neutral-800 text-neutral-300 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="font-bold text-white text-sm sm:text-base">
                        {exercise.name}
                      </h3>
                      <div className="text-xs text-neutral-400 mt-0.5 flex flex-wrap items-center gap-2">
                        <span className="text-emerald-400 font-medium">{exercise.targetMuscle}</span>
                        <span>•</span>
                        <span>{exercise.equipment}</span>
                        <span>•</span>
                        <span>Descanso: {exercise.restSeconds}s</span>
                      </div>
                    </div>
                  </div>

                  {exercise.personalRecord && (
                    <div className="bg-amber-500/10 border border-amber-500/20 text-amber-300 px-2.5 py-1 rounded-lg text-xs flex items-center gap-1.5 self-start">
                      <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>PR: <strong>{exercise.personalRecord.weightKg} kg</strong> x {exercise.personalRecord.reps} reps</span>
                    </div>
                  )}
                </div>

                {/* Sets & Reps Specification */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-neutral-800/60 text-xs">
                  <div className="bg-neutral-900/80 p-2 rounded-lg">
                    <span className="text-neutral-400 text-[10px] block">Séries de Trabalho</span>
                    <strong className="text-white font-mono text-sm">{exercise.workingSets} séries</strong>
                  </div>
                  <div className="bg-neutral-900/80 p-2 rounded-lg">
                    <span className="text-neutral-400 text-[10px] block">Faixa de Repetições</span>
                    <strong className="text-emerald-400 font-mono text-sm">{exercise.repsTarget} reps</strong>
                  </div>
                  <div className="bg-neutral-900/80 p-2 rounded-lg">
                    <span className="text-neutral-400 text-[10px] block">RIR Alvo (Proximidade Falha)</span>
                    <strong className="text-teal-400 font-mono text-sm">{exercise.targetRir} RIR</strong>
                  </div>
                  <div className="bg-neutral-900/80 p-2 rounded-lg">
                    <span className="text-neutral-400 text-[10px] block">Séries Aquecimento</span>
                    <strong className="text-neutral-300 font-mono text-sm">{exercise.warmupSets} específica(s)</strong>
                  </div>
                </div>

                {exercise.notes && (
                  <div className="mt-2 text-[11px] text-neutral-400 flex items-start gap-1.5 bg-neutral-900/40 p-2 rounded-lg">
                    <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{exercise.notes}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Histórico Recente de Treinos */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            Histórico de Treinos Registrados
          </h2>
          <span className="text-xs text-neutral-400">{workoutLogs.length} sessões registradas</span>
        </div>

        {workoutLogs.length === 0 ? (
          <div className="text-center py-8 text-neutral-400 text-xs">
            Nenhuma sessão registrada ainda. Clique em "Iniciar Sessão Agora" para registrar seu primeiro treino.
          </div>
        ) : (
          <div className="space-y-3">
            {workoutLogs.map((log) => (
              <div
                key={log.id}
                className="bg-neutral-950/70 border border-neutral-800/80 rounded-xl p-3.5 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{log.routineName}</span>
                    <span className="text-neutral-400">•</span>
                    <span className="text-neutral-400 font-mono">{log.date}</span>
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-1 flex flex-wrap items-center gap-3">
                    <span>Duração: <strong>{log.durationMinutes} min</strong></span>
                    <span>Volume Load: <strong className="text-emerald-400">{log.totalVolumeLoadKg.toLocaleString('pt-BR')} kg</strong></span>
                    <span>RPE: <strong className="text-white">{log.perceivedEffortRPE}/10</strong></span>
                    {log.jointPainReported ? (
                      <span className="text-rose-400 font-semibold flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Dor articular relatada
                      </span>
                    ) : (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Articulações sem dor
                      </span>
                    )}
                  </div>
                  {log.notes && (
                    <div className="text-[11px] text-neutral-400 mt-1.5 italic">
                      "{log.notes}"
                    </div>
                  )}
                </div>

                <div className="self-end sm:self-center">
                  <span className="px-2.5 py-1 rounded-lg bg-neutral-800 text-neutral-300 font-semibold text-[11px]">
                    {log.exercises.length} exercícios
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
