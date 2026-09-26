import { DollarSign, TrendingUp, Cpu, Timer } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useApp } from '../store/AppContext';
import { GlassCard } from './ui/GlassCard';

export default function CostAnalytics() {
  const { state } = useApp();
  const trendData = state.trendData;
  const evalRuns = state.evalRuns;

  const totalCost = trendData.reduce((s, d) => s + d.costUsd, 0);
  const avgCostPerRun = totalCost / trendData.length;
  const totalTokens = trendData.reduce((s, d) => s + d.totalTokens, 0);
  const avgLatency = trendData.reduce((s, d) => s + d.p95Latency, 0) / trendData.length;

  const costByModel = evalRuns.reduce<Record<string, { cost: number; runs: number }>>((acc, run) => {
    if (!acc[run.modelLabel]) acc[run.modelLabel] = { cost: 0, runs: 0 };
    acc[run.modelLabel].cost += run.totalCostUsd;
    acc[run.modelLabel].runs += 1;
    return acc;
  }, {});

  const modelCostData = Object.entries(costByModel).map(([model, data]) => ({
    model: model.length > 20 ? model.slice(0, 20) + '...' : model,
    cost: +data.cost.toFixed(3),
    runs: data.runs,
  })).sort((a, b) => b.cost - a.cost);

  const dailyCost = trendData.map(d => ({
    date: new Date(d.timestamp).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
    cost: d.costUsd,
    tokens: d.totalTokens / 1000,
  }));

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: '30-Day Total', value: `$${totalCost.toFixed(2)}`, sub: 'Across all evaluations', icon: <DollarSign size={14} /> },
          { label: 'Avg per Run', value: `$${avgCostPerRun.toFixed(3)}`, sub: `${evalRuns.length} runs`, icon: <TrendingUp size={14} /> },
          { label: 'Total Tokens', value: `${(totalTokens / 1000000).toFixed(2)}M`, sub: 'Input + Output', icon: <Cpu size={14} /> },
          { label: 'Avg p95 Latency', value: `${(avgLatency / 1000).toFixed(2)}s`, sub: 'Across all runs', icon: <Timer size={14} /> },
        ].map((s, i) => (
          <GlassCard key={i} className="p-3">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-gray-500">{s.icon}</span>
              <span className="text-[10px] text-gray-500">{s.label}</span>
            </div>
            <p className="text-lg font-bold text-white tabular-nums">{s.value}</p>
            <p className="text-[10px] text-gray-500">{s.sub}</p>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Daily Cost & Token Usage</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyCost}>
              <defs>
                <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
              <XAxis dataKey="date" stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} interval={3} />
              <YAxis yAxisId="cost" stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} width={40} tickFormatter={v => `$${v}`} />
              <YAxis yAxisId="tokens" orientation="right" stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} width={40} tickFormatter={v => `${v}k`} />
              <Tooltip contentStyle={{ backgroundColor: 'rgba(15,15,25,0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 11 }} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Area yAxisId="cost" type="monotone" dataKey="cost" stroke="#8b5cf6" strokeWidth={2} fill="url(#costGrad)" name="Cost ($)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      <GlassCard className="p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Cost by Model</h3>
        <div className="space-y-3">
          {modelCostData.map((m, i) => {
            const pct = (m.cost / totalCost) * 100;
            return (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-300 truncate">{m.model}</span>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="text-gray-500">{m.runs} runs</span>
                    <span className="font-mono text-white tabular-nums">${m.cost.toFixed(3)}</span>
                    <span className="text-gray-500 tabular-nums">{pct.toFixed(1)}%</span>
                  </div>
                </div>
                <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full shadow-[0_0_10px_rgba(139,92,246,0.5)]" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
}
