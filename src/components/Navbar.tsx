import React from 'react';
import { Sparkles, BrainCircuit, Sliders, Activity, User, ShieldCheck } from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  profile: UserProfile;
  onOpenAiChat: () => void;
  onOpenAdaptive: () => void;
  onOpenProfile: () => void;
  onOpenCheckin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  onOpenAiChat,
  onOpenAdaptive,
  onOpenProfile,
  onOpenCheckin,
}) => {
  const goalLabels: Record<string, string> = {
    hipertrofia: 'Hipertrofia',
    perda_gordura: 'Perda de Gordura',
    recomposicao: 'Recomposição',
    manutencao: 'Manutenção',
    ganho_peso: 'Ganho de Peso',
    performance: 'Performance',
  };

  return (
    <header className="sticky top-0 z-30 bg-neutral-950/85 backdrop-blur-md border-b border-neutral-800/80 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-950/40 text-black font-black text-lg tracking-wider">
            K
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white">KINETIC</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Adaptativo
              </span>
            </div>
            <div className="text-[11px] text-neutral-400 hidden sm:block">
              {profile.name} • <span className="text-emerald-400 font-medium">{goalLabels[profile.goal] || 'Fitness'}</span>
            </div>
          </div>
        </div>

        {/* Action Pills */}
        <div className="flex items-center gap-2">
          {/* Weekly Check-in Button */}
          <button
            onClick={onOpenCheckin}
            title="Check-in Semanal Central"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700/80 text-xs font-semibold transition cursor-pointer shadow-sm active:scale-95"
          >
            <Activity className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden lg:inline">Check-in Semanal</span>
            <span className="lg:hidden">Check-in</span>
          </button>

          {/* Adaptive Loop Engine Button */}
          <button
            onClick={onOpenAdaptive}
            title="Motor de Ajustes Adaptativos"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700/80 text-xs font-medium transition cursor-pointer shadow-sm active:scale-95"
          >
            <BrainCircuit className="w-4 h-4 text-emerald-400" />
            <span className="hidden md:inline">Auditoria Adaptativa</span>
            <span className="md:hidden">Ajustes</span>
          </button>

          {/* AI Coach Button */}
          <button
            onClick={onOpenAiChat}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-neutral-950 text-xs font-bold transition cursor-pointer shadow-md shadow-emerald-500/20 active:scale-95"
          >
            <Sparkles className="w-4 h-4 fill-neutral-950 text-neutral-950" />
            <span>KINETIC IA</span>
          </button>

          {/* Profile settings button */}
          <button
            onClick={onOpenProfile}
            title="Perfil e Avaliação"
            className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 transition cursor-pointer active:scale-95"
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
