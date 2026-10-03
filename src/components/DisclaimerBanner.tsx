import React from 'react';
import { ShieldAlert, Info } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  return (
    <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-3 text-xs text-neutral-400 flex items-start gap-2.5 shadow-sm">
      <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
      <div>
        <span className="font-semibold text-neutral-200">Aviso Científico & Responsabilidade: </span>
        Os cálculos metabólicos e estimativas de composição corporal são aproximações estatísticas científicas (Mifflin-St Jeor / US Navy) e não constituem diagnósticos clínicos. Modificações dietéticas e de treino devem respeitar sua individualidade biológica.
      </div>
    </div>
  );
};
