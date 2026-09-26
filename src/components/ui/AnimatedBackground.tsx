export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="aurora-blob w-[500px] h-[500px] bg-violet-600/30 -top-40 -left-40" style={{ animationDelay: '0s' }} />
      <div className="aurora-blob w-[400px] h-[400px] bg-fuchsia-600/20 top-1/3 -right-20" style={{ animationDelay: '-7s' }} />
      <div className="aurora-blob w-[450px] h-[450px] bg-cyan-600/20 bottom-0 left-1/3" style={{ animationDelay: '-14s' }} />
      <div className="aurora-blob w-[350px] h-[350px] bg-indigo-600/20 top-2/3 right-1/4" style={{ animationDelay: '-3s' }} />
      <div className="absolute inset-0 grid-bg grid-bg-fade opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#05050a]" />
    </div>
  );
}
