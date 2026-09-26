import { type ReactNode, useEffect, useState, useRef } from 'react';

export function GradientText({ children, className = '', colors = 'from-violet-400 via-fuchsia-400 to-cyan-400' }: { children: ReactNode; className?: string; colors?: string }) {
  return (
    <span className={`bg-gradient-to-r ${colors} bg-clip-text text-transparent animated-gradient ${className}`}>
      {children}
    </span>
  );
}

export function AnimatedCounter({ value, duration = 1000, format = (v: number) => v.toString(), className = '' }: { value: number; duration?: number; format?: (v: number) => string; className?: string }) {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValue = useRef(value);

  useEffect(() => {
    const startValue = prevValue.current;
    const endValue = value;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (endValue - startValue) * eased;
      setDisplayValue(currentValue);
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        prevValue.current = endValue;
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span className={`tabular-nums ${className}`}>{format(displayValue)}</span>;
}

export function GlowButton({ children, variant = 'primary', size = 'md', glow = true, icon, className = '', ...props }: { children: ReactNode; variant?: 'primary' | 'secondary' | 'ghost' | 'danger'; size?: 'sm' | 'md' | 'lg'; glow?: boolean; icon?: ReactNode; className?: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const variants = {
    primary: 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white shadow-lg shadow-violet-600/30',
    secondary: 'bg-white/[0.05] hover:bg-white/[0.08] text-white border border-white/[0.1] hover:border-white/[0.2]',
    ghost: 'bg-transparent hover:bg-white/[0.05] text-gray-300 hover:text-white',
    danger: 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-lg shadow-red-600/30',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
  };

  return (
    <button className={`btn-premium relative inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 ${variants[variant]} ${sizes[size]} ${glow && variant === 'primary' ? 'hover:shadow-violet-600/50 hover:scale-[1.02]' : ''} active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${className}`} {...props}>
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}

export function PillBadge({ children, color = 'violet', glow = false }: { children: ReactNode; color?: 'violet' | 'emerald' | 'amber' | 'red' | 'cyan' | 'blue' | 'gray'; glow?: boolean }) {
  const colors = {
    violet: 'bg-violet-500/10 text-violet-300 border-violet-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    red: 'bg-red-500/10 text-red-300 border-red-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
    blue: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
    gray: 'bg-white/[0.05] text-gray-300 border-white/[0.1]',
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border backdrop-blur-sm ${colors[color]}`}>
      {children}
    </span>
  );
}
