import { TrendingUp, Target, AlertTriangle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts';
import { useApp } from '../store/AppContext';
import { GlassCard } from './ui/GlassCard';
import { driftMetrics } from '../data/mockData';

export default function TrendView() {
  const { state } = useApp();
  const trendData = state.trendData;
  const evalRuns = state.evalRuns;

  const latest = trendData[trendData.length - 1];
  const avgScore = trendData.reduce((s, d) => s + d.overallScore, 0) / trendData.length;
  const regressionCount = evalRuns.filter(r => r.status === 'fail').length;
  const totalCost = trendData.reduce((s, d) => s + d.costUsd, 0);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { label: 'Current Score', value: `${latest.overallScore}%`, sub: `Avg: ${avgScore.toFixed(1)}%`, icon: <Target size={14} /> },
          { label: 'Safety Score', value: `${latest.safetyScore}%`, sub: 'Target: ≥99%', icon: <Target size={14} /> },
          { label: 'Pass Rate', value: `${latest.passRate}%`, sub: `${evalRuns.length} runs tracked`, icon: <TrendingUp size={14} /> },
          { label: 'Regressions', value: regressionCount.toString(), sub: 'Last 30 days', icon: <AlertTriangle size={14} /> },
          { label: '30d Cost', value: `$${totalCost.toFixed(2)}`, sub: `$${(totalCost / trendData.length).toFixed(2)}/run avg`, icon: <TrendingUp size={14} /> },
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
        <h3 className="text-sm font-semibold text-white mb-4">Quality Metrics Over Time</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="g-overall" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
              <XAxis dataKey="timestamp" tickFormatter={v => new Date(v).toLocaleDateString('en', { month: 'short', day: 'numeric' })} stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} interval={3} />
              <YAxis domain={[60, 100]} stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} width={30} />
              <Tooltip contentStyle={{ backgroundColor: 'rgba(15,15,25,0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 11 }} />
              <ReferenceLine y={95} stroke="#ef4444" strokeDasharray="4 4" strokeOpacity={0.4} />
              <ReferenceLine y={90} stroke="#f59e0b" strokeDasharray="4 4" strokeOpacity={0.4} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Area type="monotone" dataKey="weightedScore" stroke="#8b5cf6" strokeWidth={2} fill="url(#g-overall)" name="Weighted Score" />
              <Area type="monotone" dataKey="safetyScore" stroke="#10b981" strokeWidth={2} fill="transparent" name="Safety Score" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      <GlassCard className="p-5">
        <h3 className="text-sm font-semibold text-white mb-1">Statistical Drift Analysis</h3>
        <p className="text-[10px] text-gray-500 mb-4">Comparison of current run vs 7-day baseline. Significant drift (p &lt; 0.05) flagged.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left py-2 px-2 text-[10px] text-gray-500 font-medium uppercase tracking-wide">Metric</th>
                <th className="text-right py-2 px-2 text-[10px] text-gray-500 font-medium uppercase tracking-wide">Current</th>
                <th className="text-right py-2 px-2 text-[10px] text-gray-500 font-medium uppercase tracking-wide">Baseline</th>
                <th className="text-right py-2 px-2 text-[10px] text-gray-500 font-medium uppercase tracking-wide">Δ</th>
                <th className="text-right py-2 px-2 text-[10px] text-gray-500 font-medium uppercase tracking-wide">p-value</th>
                <th className="text-right py-2 px-2 text-[10px] text-gray-500 font-medium uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody>
              {driftMetrics.map((d, i) => (
                <tr key={i} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                  <td className="py-2 px-2 text-gray-200 font-medium">{d.name}</td>
                  <td className="py-2 px-2 text-right font-mono tabular-nums text-gray-300">{d.currentValue}</td>
                  <td className="py-2 px-2 text-right font-mono tabular-nums text-gray-500">{d.baselineValue}</td>
                  <td className="py-2 px-2 text-right">
                    <span className={`inline-flex items-center gap-0.5 font-mono tabular-nums ${
                      d.direction === 'improving' ? 'text-emerald-400' : d.direction === 'degrading' ? 'text-red-400' : 'text-gray-400'
                    }`}>
                      {d.direction === 'improving' ? <ArrowUpRight size={10} /> : d.direction === 'degrading' ? <ArrowDownRight size={10} /> : null}
                      {d.deltaPercent > 0 ? '+' : ''}{d.deltaPercent.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-2 px-2 text-right font-mono tabular-nums text-gray-400">{d.pValue.toFixed(3)}</td>
                  <td className="py-2 px-2 text-right">
                    {d.significant ? (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        d.direction === 'degrading' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>Significant</span>
                    ) : (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/[0.03] text-gray-500 border border-white/[0.06]">Stable</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
