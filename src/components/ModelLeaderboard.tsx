import { useState } from 'react';
import { Trophy, TrendingUp, DollarSign, Zap, Award, ChevronDown } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { GlassCard } from './ui/GlassCard';
import { GradientText } from './ui/Primitives';

export default function ModelLeaderboard() {
  const { state } = useApp();
  const [sortBy, setSortBy] = useState<'score' | 'cost' | 'speed'>('score');

  const models = state.models;
  const evalRuns = state.evalRuns;

  // Calculate model performance metrics
  const modelStats = models.map(model => {
    const modelRuns = evalRuns.filter(r => r.modelConfigId === model.id);
    const avgScore = modelRuns.length > 0 
      ? modelRuns.reduce((sum, r) => sum + r.overallScore, 0) / modelRuns.length 
      : model.benchmarks.mmlu || 0;
    const avgCost = modelRuns.length > 0
      ? modelRuns.reduce((sum, r) => sum + r.totalCostUsd, 0) / modelRuns.length
      : (model.costPer1MInput + model.costPer1MOutput) / 2;
    const avgLatency = modelRuns.length > 0
      ? modelRuns.reduce((sum, r) => sum + r.p95Latency, 0) / modelRuns.length
      : 2500;
    const totalRuns = modelRuns.length;

    return {
      ...model,
      avgScore: +avgScore.toFixed(1),
      avgCost: +avgCost.toFixed(3),
      avgLatency: Math.round(avgLatency),
      totalRuns,
      valueScore: +((avgScore / (avgCost * 100)) * 10).toFixed(1), // Score per dollar
    };
  });

  const sorted = [...modelStats].sort((a, b) => {
    if (sortBy === 'score') return b.avgScore - a.avgScore;
    if (sortBy === 'cost') return a.avgCost - b.avgCost;
    return a.avgLatency - b.avgLatency;
  });

  const getRankBadge = (index: number) => {
    if (index === 0) return <Trophy size={16} className="text-yellow-400" />;
    if (index === 1) return <Award size={16} className="text-gray-300" />;
    if (index === 2) return <Award size={16} className="text-amber-600" />;
    return <span className="text-xs text-gray-500 w-4 text-center">#{index + 1}</span>;
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Trophy size={22} className="text-yellow-400" />
            <GradientText>Model Leaderboard</GradientText>
          </h2>
          <p className="text-xs text-gray-500 mt-1">Performance ranking across all evaluations</p>
        </div>
        <div className="flex gap-0.5 bg-white/[0.03] border border-white/[0.06] rounded-lg p-0.5">
          {[
            { id: 'score', label: 'Score', icon: <TrendingUp size={12} /> },
            { id: 'cost', label: 'Cost', icon: <DollarSign size={12} /> },
            { id: 'speed', label: 'Speed', icon: <Zap size={12} /> },
          ].map(s => (
            <button
              key={s.id}
              onClick={() => setSortBy(s.id as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                sortBy === s.id ? 'bg-violet-500/15 text-violet-300' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {s.icon}
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sorted.slice(0, 3).map((model, i) => (
          <GlassCard key={model.id} tilt glow={i === 0 ? 'violet' : i === 1 ? 'cyan' : 'fuchsia'} className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  i === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                  i === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                  'bg-gradient-to-br from-amber-600 to-amber-800'
                }`}>
                  {getRankBadge(i)}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{model.model}</h3>
                  <p className="text-[10px] text-gray-500">{model.provider}</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Avg Score</span>
                <span className="text-lg font-bold text-white tabular-nums">{model.avgScore}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Avg Cost</span>
                <span className="text-sm font-mono text-white tabular-nums">${model.avgCost}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">p95 Latency</span>
                <span className="text-sm font-mono text-white tabular-nums">{(model.avgLatency / 1000).toFixed(2)}s</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Total Runs</span>
                <span className="text-sm font-mono text-white tabular-nums">{model.totalRuns}</span>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Full Leaderboard Table */}
      <GlassCard className="p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Complete Ranking</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left py-2 px-2 text-[10px] text-gray-500 font-medium uppercase tracking-wide">Rank</th>
                <th className="text-left py-2 px-2 text-[10px] text-gray-500 font-medium uppercase tracking-wide">Model</th>
                <th className="text-right py-2 px-2 text-[10px] text-gray-500 font-medium uppercase tracking-wide">Score</th>
                <th className="text-right py-2 px-2 text-[10px] text-gray-500 font-medium uppercase tracking-wide">Cost/Run</th>
                <th className="text-right py-2 px-2 text-[10px] text-gray-500 font-medium uppercase tracking-wide">Latency</th>
                <th className="text-right py-2 px-2 text-[10px] text-gray-500 font-medium uppercase tracking-wide">Runs</th>
                <th className="text-right py-2 px-2 text-[10px] text-gray-500 font-medium uppercase tracking-wide">Value</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((model, i) => (
                <tr key={model.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      {getRankBadge(i)}
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <div>
                      <p className="text-gray-200 font-medium">{model.model}</p>
                      <p className="text-[10px] text-gray-500">{model.provider}</p>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <span className="text-sm font-bold text-white tabular-nums">{model.avgScore}%</span>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <span className="text-xs font-mono text-gray-300 tabular-nums">${model.avgCost}</span>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <span className="text-xs font-mono text-gray-300 tabular-nums">{(model.avgLatency / 1000).toFixed(2)}s</span>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <span className="text-xs font-mono text-gray-300 tabular-nums">{model.totalRuns}</span>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <span className={`text-xs font-bold tabular-nums ${
                      model.valueScore > 50 ? 'text-emerald-400' : model.valueScore > 30 ? 'text-amber-400' : 'text-gray-400'
                    }`}>
                      {model.valueScore}
                    </span>
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
