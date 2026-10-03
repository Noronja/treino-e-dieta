import React from 'react';
import { Home, Dumbbell, Utensils, TrendingUp, User, Sparkles, BookOpen } from 'lucide-react';

export type TabType = 'inicio' | 'treino' | 'dieta' | 'evolucao' | 'metodologia' | 'perfil';

interface BottomNavProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onOpenAi: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab, onOpenAi }) => {
  const navItems: { id: TabType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'inicio', label: 'Início', icon: Home },
    { id: 'treino', label: 'Treino', icon: Dumbbell },
    { id: 'dieta', label: 'Dieta', icon: Utensils },
    { id: 'evolucao', label: 'Evolução', icon: TrendingUp },
    { id: 'metodologia', label: 'Método', icon: BookOpen },
    { id: 'perfil', label: 'Perfil', icon: User },
  ];

  return (
    <>
      {/* Floating AI Button (Accessible anywhere on mobile & desktop) */}
      <button
        onClick={onOpenAi}
        aria-label="Abrir KINETIC IA"
        className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 flex items-center gap-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-neutral-950 px-4 py-3 rounded-full font-bold shadow-xl shadow-emerald-500/25 border border-emerald-400/40 hover:scale-105 active:scale-95 transition cursor-pointer"
      >
        <Sparkles className="w-5 h-5 fill-neutral-950 animate-bounce" />
        <span className="text-xs tracking-wide uppercase font-black">Perguntar à IA</span>
      </button>

      {/* Fixed Bottom Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-neutral-950/95 backdrop-blur-lg border-t border-neutral-800/80 px-2 py-1.5 safe-bottom">
        <div className="max-w-md mx-auto grid grid-cols-6 items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex flex-col items-center justify-center py-1 transition-all rounded-lg cursor-pointer ${
                  isActive
                    ? 'text-emerald-400 font-semibold'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <div className={`p-1 rounded-lg transition ${isActive ? 'bg-emerald-500/15' : ''}`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-400' : 'text-neutral-400'}`} />
                </div>
                <span className="text-[10px] tracking-tight mt-0.5">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
