import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, Target, Plus, Camera, Calendar, Scale, 
  Ruler, Trophy, Image, Check, AlertCircle, ArrowUpRight, ArrowDownRight 
} from 'lucide-react';
import { Anthropometry, UserProfile, WorkoutSessionLog } from '../types';
import { calculateNavyBodyFat } from '../utils/calculations';

interface EvolutionViewProps {
  anthropometry: Anthropometry[];
  profile: UserProfile;
  workoutLogs: WorkoutSessionLog[];
  onAddAnthropometry: (newRecord: Anthropometry) => void;
  onOpenAi: () => void;
}

export const EvolutionView: React.FC<EvolutionViewProps> = ({
  anthropometry,
  profile,
  workoutLogs,
  onAddAnthropometry,
  onOpenAi,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const latest = anthropometry[0] || {
    weightKg: profile.weightKg,
    waistCm: 82,
    neckCm: 38.5,
    armCm: 38,
    thighCm: 59,
    calfCm: 38,
    chestCm: 104,
  };

  const [formWeight, setFormWeight] = useState(latest.weightKg);
  const [formWaist, setFormWaist] = useState(latest.waistCm);
  const [formNeck, setFormNeck] = useState(latest.neckCm);
  const [formArm, setFormArm] = useState(latest.armCm);
  const [formThigh, setFormThigh] = useState(latest.thighCm);
  const [formCalf, setFormCalf] = useState(latest.calfCm);
  const [formChest, setFormChest] = useState(latest.chestCm || 103);
  const [formNotes, setFormNotes] = useState('');

  // Live calculation of preview body fat
  const previewBf = calculateNavyBodyFat(profile.gender, profile.heightCm, formWaist, formNeck);
  const previewLeanMass = Math.round((formWeight * (1 - previewBf / 100)) * 10) / 10;
  const previewFatMass = Math.round((formWeight - previewLeanMass) * 10) / 10;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: Anthropometry = {
      date: new Date().toISOString().split('T')[0],
      weightKg: Number(formWeight),
      heightCm: profile.heightCm,
      waistCm: Number(formWaist),
      neckCm: Number(formNeck),
      armCm: Number(formArm),
      thighCm: Number(formThigh),
      calfCm: Number(formCalf),
      chestCm: Number(formChest),
      estimatedBodyFatPct: previewBf,
      estimatedLeanMassKg: previewLeanMass,
      estimatedFatMassKg: previewFatMass,
      notes: formNotes || 'Acompanhamento periódico registrado.',
    };

    onAddAnthropometry(newRecord);
    setShowAddModal(false);
  };

  // Deltas between newest and oldest record
  const current = anthropometry[0] || latest;
  const oldest = anthropometry[anthropometry.length - 1] || current;
  const totalWeightDelta = Math.round((current.weightKg - oldest.weightKg) * 10) / 10;
  const totalWaistDelta = Math.round((current.waistCm - oldest.waistCm) * 10) / 10;
  const totalBfDelta = Math.round((current.estimatedBodyFatPct - oldest.estimatedBodyFatPct) * 10) / 10;

  // Chart data reversed for chronological left-to-right
  const chronologicalData = [...anthropometry].reverse();

  // SVG dimensions for weight trend
  const svgWidth = 500;
  const svgHeight = 160;
  const padding = 30;

  const weights = chronologicalData.map((d) => d.weightKg);
  const minWeight = Math.min(...weights, current.weightKg) - 1;
  const maxWeight = Math.max(...weights, current.weightKg) + 1;

  const points = chronologicalData.map((d, index) => {
    const x = padding + (index / Math.max(1, chronologicalData.length - 1)) * (svgWidth - padding * 2);
    const y = svgHeight - padding - ((d.weightKg - minWeight) / (maxWeight - minWeight || 1)) * (svgHeight - padding * 2);
    return { x, y, weight: d.weightKg, date: d.date };
  });

  const pathD = points.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              Biometria & Composição
            </span>
            <span className="text-xs text-neutral-400">{anthropometry.length} registros cadastrados</span>
          </div>
          <h1 className="text-2xl font-black text-white">Evolução & Acompanhamento Corporal</h1>
          <p className="text-xs text-neutral-400 mt-1 max-w-xl">
            Acompanhe a resposta morfológica do seu corpo. O motor adaptativo correlaciona suas alterações antropométricas com seu gasto calórico real.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs transition shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Registrar Novas Medidas</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
          <div className="text-xs text-neutral-400 flex items-center justify-between">
            <span>Peso Atual</span>
            <Scale className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1">
            {current.weightKg} <span className="text-xs text-neutral-400 font-normal">kg</span>
          </div>
          <div className="text-xs mt-1">
            {totalWeightDelta < 0 ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
                <ArrowDownRight className="w-3.5 h-3.5" /> {Math.abs(totalWeightDelta)} kg no ciclo
              </span>
            ) : totalWeightDelta > 0 ? (
              <span className="text-amber-400 font-semibold flex items-center gap-0.5">
                <ArrowUpRight className="w-3.5 h-3.5" /> +{totalWeightDelta} kg no ciclo
              </span>
            ) : (
              <span className="text-neutral-400 font-semibold">Peso estabilizado</span>
            )}
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
          <div className="text-xs text-neutral-400 flex items-center justify-between">
            <span>Circunferência Abdominal</span>
            <Ruler className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1">
            {current.waistCm} <span className="text-xs text-neutral-400 font-normal">cm</span>
          </div>
          <div className="text-xs mt-1">
            {totalWaistDelta < 0 ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
                <ArrowDownRight className="w-3.5 h-3.5" /> {Math.abs(totalWaistDelta)} cm no abdômen
              </span>
            ) : (
              <span className="text-neutral-400 font-semibold">Sem oscilação</span>
            )}
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
          <div className="text-xs text-neutral-400 flex items-center justify-between">
            <span>% Gordura (Navy)</span>
            <Target className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            {current.estimatedBodyFatPct}%
          </div>
          <div className="text-xs mt-1">
            {totalBfDelta < 0 ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
                <ArrowDownRight className="w-3.5 h-3.5" /> {Math.abs(totalBfDelta)}% gordura
              </span>
            ) : (
              <span className="text-neutral-400 font-semibold">Estável</span>
            )}
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
          <div className="text-xs text-neutral-400 flex items-center justify-between">
            <span>Massa Livre de Gordura</span>
            <Trophy className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1">
            {current.estimatedLeanMassKg} <span className="text-xs text-neutral-400 font-normal">kg</span>
          </div>
          <div className="text-xs text-emerald-400 font-semibold mt-1">
            Massa magra protegida
          </div>
        </div>
      </div>

      {/* SVG Interactive Chart: Peso ao Longo do Tempo */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Trajetória do Peso Corporal ao Longo do Tempo
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Tendência de peso (kg) plotada em cada medição registrada.
            </p>
          </div>
          <button
            onClick={onOpenAi}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer hidden sm:block"
          >
            Análise com IA →
          </button>
        </div>

        {/* SVG Container */}
        <div className="w-full overflow-x-auto bg-neutral-950/70 p-4 rounded-xl border border-neutral-800/80">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-44">
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            <line x1={padding} y1={padding} x2={svgWidth - padding} y2={padding} stroke="#333" strokeDasharray="3 3" />
            <line x1={padding} y1={svgHeight / 2} x2={svgWidth - padding} y2={svgHeight / 2} stroke="#333" strokeDasharray="3 3" />
            <line x1={padding} y1={svgHeight - padding} x2={svgWidth - padding} y2={svgHeight - padding} stroke="#444" />

            {/* Filled Area */}
            {points.length > 1 && (
              <path
                d={`${pathD} L ${points[points.length - 1].x} ${svgHeight - padding} L ${points[0].x} ${svgHeight - padding} Z`}
                fill="url(#chartGradient)"
              />
            )}

            {/* Trend line */}
            <path d={pathD} fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

            {/* Dots and Labels */}
            {points.map((pt, i) => (
              <g key={i}>
                <circle cx={pt.x} cy={pt.y} r="5" fill="#10b981" stroke="#000" strokeWidth="2" />
                <text x={pt.x} y={pt.y - 10} textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">
                  {pt.weight}kg
                </text>
                <text x={pt.x} y={svgHeight - 10} textAnchor="middle" fill="#888" fontSize="9">
                  {pt.date.slice(5)}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Histórico das Medidas Antropométricas */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-400" />
          Histórico Detalhado de Medidas
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-neutral-950 text-neutral-400 border-b border-neutral-800">
              <tr>
                <th className="py-2.5 px-3">Data</th>
                <th className="py-2.5 px-3">Peso</th>
                <th className="py-2.5 px-3">Cintura</th>
                <th className="py-2.5 px-3">Braço</th>
                <th className="py-2.5 px-3">Coxa</th>
                <th className="py-2.5 px-3">Panturrilha</th>
                <th className="py-2.5 px-3">% Gordura</th>
                <th className="py-2.5 px-3">Massa Magra</th>
                <th className="py-2.5 px-3">Notas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {anthropometry.map((record, idx) => (
                <tr key={idx} className="hover:bg-neutral-800/40 text-neutral-200 transition">
                  <td className="py-2.5 px-3 font-mono font-medium text-emerald-400">{record.date}</td>
                  <td className="py-2.5 px-3 font-bold text-white">{record.weightKg} kg</td>
                  <td className="py-2.5 px-3">{record.waistCm} cm</td>
                  <td className="py-2.5 px-3">{record.armCm} cm</td>
                  <td className="py-2.5 px-3">{record.thighCm} cm</td>
                  <td className="py-2.5 px-3">{record.calfCm} cm</td>
                  <td className="py-2.5 px-3 font-semibold text-teal-400">{record.estimatedBodyFatPct}%</td>
                  <td className="py-2.5 px-3 text-neutral-300">{record.estimatedLeanMassKg} kg</td>
                  <td className="py-2.5 px-3 text-neutral-400 text-[11px] max-w-xs truncate">{record.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Registrar Novas Medidas */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                Registrar Novas Medidas Antropométricas
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-neutral-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-300 font-semibold block mb-1">Peso (kg) *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formWeight}
                    onChange={(e) => setFormWeight(parseFloat(e.target.value))}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-white font-bold focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-neutral-300 font-semibold block mb-1">Cintura Abdômen (cm) *</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={formWaist}
                    onChange={(e) => setFormWaist(parseFloat(e.target.value))}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-white font-bold focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <label className="text-neutral-400 block mb-1">Pescoço (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formNeck}
                    onChange={(e) => setFormNeck(parseFloat(e.target.value))}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-white font-medium focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 block mb-1">Braço (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formArm}
                    onChange={(e) => setFormArm(parseFloat(e.target.value))}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-white font-medium focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 block mb-1">Coxa (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formThigh}
                    onChange={(e) => setFormThigh(parseFloat(e.target.value))}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-white font-medium focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 block mb-1">Panturrilha (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formCalf}
                    onChange={(e) => setFormCalf(parseFloat(e.target.value))}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-white font-medium focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Live Navy Preview */}
              <div className="bg-emerald-950/40 border border-emerald-800/60 p-3 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="text-emerald-300 font-semibold block">Estimativa Fórm. Navy:</span>
                  <span className="text-[11px] text-neutral-400">Gordura corporal calculada instantaneamente</span>
                </div>
                <div className="text-right">
                  <div className="text-base font-black text-emerald-400">{previewBf}% BF</div>
                  <div className="text-[10px] text-neutral-400">{previewLeanMass}kg massa magra</div>
                </div>
              </div>

              <div>
                <label className="text-neutral-300 block mb-1">Observações da Avaliação</label>
                <input
                  type="text"
                  placeholder="Ex: Medido em jejum matinal após hidratação regular."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-white placeholder-neutral-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold transition shadow-md shadow-emerald-500/20 cursor-pointer"
                >
                  Salvar Registro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
