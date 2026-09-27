import { useRef, useState, type ReactNode, type MouseEvent } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  tilt?: boolean;
  glow?: 'violet' | 'cyan' | 'fuchsia' | 'emerald' | 'amber' | 'red' | 'none';
  hover?: boolean;
  gradient?: boolean;
  onClick?: () => void;
}

export function GlassCard({ children, className, tilt = false, glow = 'none', hover = true, gradient = false, onClick }: GlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg)');
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!tilt || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
    setMousePos({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  };

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl glass ${hover ? 'transition-all duration-500 hover:border-white/[0.15]' : ''} ${gradient ? 'holo' : ''} ${onClick ? 'cursor-pointer' : ''} ${className || ''}`}
      style={tilt ? { transform, transition: 'transform 0.4s cubic-bezier(0.03, 0.98, 0.52, 0.99)', transformStyle: 'preserve-3d' } : {}}
    >
      {tilt && (
        <div className="absolute inset-0 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-500" style={{ background: `radial-gradient(600px circle at ${mousePos.x}% ${mousePos.y}%, rgba(255,255,255,0.08), transparent 40%)` }} />
      )}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export function StatCard({ label, value, sub, icon, gradient, delta }: { label: string; value: string | number; sub?: string; icon: ReactNode; gradient: string; delta?: { value: number; positive: boolean } }) {
  return (
    <GlassCard tilt glow="violet" className="p-5 group">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl ${gradient} flex items-center justify-center text-white shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
          {icon}
        </div>
        {delta && (
          <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg backdrop-blur-sm ${delta.positive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
            <span>{delta.positive ? '↑' : '↓'}</span>
            <span className="tabular-nums">{Math.abs(delta.value || 0).toFixed(1)}%</span>
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-3xl font-bold text-white tracking-tight tabular-nums text-glow-violet">{value}</p>
        <p className="text-xs text-gray-400 font-medium">{label}</p>
        {sub && <p className="text-[10px] text-gray-600">{sub}</p>}
      </div>
      <div className={`absolute -right-8 -bottom-8 w-32 h-32 rounded-full ${gradient} opacity-10 blur-2xl transition-opacity duration-500 group-hover:opacity-20`} />
    </GlassCard>
  );
}
