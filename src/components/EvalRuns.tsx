import { useState } from 'react';
import { CheckCircle2, XCircle, Clock, PlayCircle, GitCommit, Timer, DollarSign, Hash, GitBranch, AlertTriangle } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { GlassCard } from './ui/GlassCard';

export default function EvalRuns() {
  const { state } = useApp();
  const [selectedRun, setSelectedRun] = useState<typeof state.evalRuns[0] | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const evalRuns = state.evalRuns;
  const filteredRuns = evalRuns.filter(run => filterStatus === 'all' || run.status === filterStatus);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <p className="text-xs text-gray-500">
          {evalRuns.length} evaluations · {evalRuns.filter(r => r.status === 'pass').length} passed · {evalRuns.filter(r => r.status === 'fail').length} failed · ${evalRuns.reduce((s, r) => s + r.totalCostUsd, 0).toFixed(2)} total cost
        </p>
        <button className="flex items-center gap-2 px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-medium transition-colors shadow-lg shadow-violet-600/20">
          <PlayCircle size={13} />
          Trigger Evaluation
        </button>
      </div>

      <div className="flex gap-0.5 bg-white/[0.03] border border-white/[0.06] rounded-lg p-0.5">
        {['all', 'pass', 'fail', 'running'].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${filterStatus === s ? 'bg-violet-500/15 text-violet-300' : 'text-gray-500 hover:text-gray-300'}`}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <div className="xl:col-span-2 space-y-2">
          {filteredRuns.map((run) => (
            <GlassCard key={run.id} onClick={() => setSelectedRun(run)} className={`p-3.5 cursor-pointer ${selectedRun?.id === run.id ? 'border-violet-500/40 shadow-[0_0_30px_rgba(139,92,246,0.2)]' : ''}`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {run.status === 'pass' ? <CheckCircle2 size={15} className="text-emerald-400" /> :
                   run.status === 'fail' ? <XCircle size={15} className="text-red-400" /> :
                   <Clock size={15} className="text-amber-400 animate-pulse" />}
                  <span className="text-xs font-mono text-gray-400">{run.id}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${
                    run.environment === 'production' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                    run.environment === 'staging' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                    'bg-gray-500/10 text-gray-400 border-gray-500/20'
                  }`}>{run.environment}</span>
                </div>
                {run.statisticalSignificance !== undefined && run.statisticalSignificance < 0.05 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                    p={run.statisticalSignificance.toFixed(3)}
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-200 mb-2 line-clamp-1">{run.triggeredBy}</p>

              <div className="flex items-center gap-3 text-[10px] text-gray-500 mb-2">
                <span className="flex items-center gap-1"><GitCommit size={10} />{run.commitSha}</span>
                <span className="flex items-center gap-1"><GitBranch size={10} />{run.branch}</span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
                <div className="flex items-center gap-3">
                  <span className={`text-base font-bold font-mono tabular-nums ${run.status === 'pass' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {run.overallScore}%
                  </span>
                  {run.deltaVsBaseline !== undefined && (
                    <span className={`text-[10px] font-mono tabular-nums ${run.deltaVsBaseline >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {run.deltaVsBaseline >= 0 ? '↑' : '↓'}{Math.abs(run.deltaVsBaseline).toFixed(1)}%
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2.5 text-[10px] text-gray-500">
                  <span className="flex items-center gap-0.5 tabular-nums"><DollarSign size={9} />{run.totalCostUsd.toFixed(2)}</span>
                  <span className="flex items-center gap-0.5 tabular-nums"><Timer size={9} />{Math.floor(run.duration / 60)}m{run.duration % 60}s</span>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        <div className="xl:col-span-3">
          {selectedRun ? (
            <GlassCard className="p-5 gradient-border">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {selectedRun.status === 'pass' ? <CheckCircle2 size={18} className="text-emerald-400" /> : <XCircle size={18} className="text-red-400" />}
                  <h3 className="text-sm font-semibold text-white">{selectedRun.id}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    selectedRun.status === 'pass' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>{selectedRun.status.toUpperCase()}</span>
                </div>
                {selectedRun.prNumber && (
                  <span className="text-[10px] text-gray-500 flex items-center gap-1"><GitBranch size={10} />PR #{selectedRun.prNumber}</span>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                <div className="p-2.5 bg-white/[0.02] rounded-lg border border-white/[0.04]">
                  <p className="text-[10px] text-gray-500">Model</p>
                  <p className="text-xs text-white font-medium mt-0.5">{selectedRun.modelLabel}</p>
                </div>
                <div className="p-2.5 bg-white/[0.02] rounded-lg border border-white/[0.04]">
                  <p className="text-[10px] text-gray-500">Prompt</p>
                  <p className="text-xs text-white font-medium mt-0.5">{selectedRun.promptVersion}</p>
                </div>
                <div className="p-2.5 bg-white/[0.02] rounded-lg border border-white/[0.04]">
                  <p className="text-[10px] text-gray-500">Duration</p>
                  <p className="text-xs text-white font-medium mt-0.5">{Math.floor(selectedRun.duration / 60)}m {selectedRun.duration % 60}s</p>
                </div>
                <div className="p-2.5 bg-white/[0.02] rounded-lg border border-white/[0.04]">
                  <p className="text-[10px] text-gray-500">Cost</p>
                  <p className="text-xs text-white font-medium mt-0.5">${selectedRun.totalCostUsd.toFixed(3)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">
                <div className="text-center p-2.5 bg-white/[0.02] rounded-lg border border-white/[0.04]">
                  <p className="text-lg font-bold font-mono tabular-nums text-violet-400">{selectedRun.overallScore}%</p>
                  <p className="text-[10px] text-gray-500">Overall</p>
                </div>
                <div className="text-center p-2.5 bg-white/[0.02] rounded-lg border border-white/[0.04]">
                  <p className="text-lg font-bold font-mono tabular-nums text-fuchsia-400">{selectedRun.weightedScore}%</p>
                  <p className="text-[10px] text-gray-500">Weighted</p>
                </div>
                <div className="text-center p-2.5 bg-white/[0.02] rounded-lg border border-white/[0.04]">
                  <p className="text-lg font-bold font-mono tabular-nums text-emerald-400">{selectedRun.passedCases}</p>
                  <p className="text-[10px] text-gray-500">Passed</p>
                </div>
                <div className="text-center p-2.5 bg-white/[0.02] rounded-lg border border-white/[0.04]">
                  <p className="text-lg font-bold font-mono tabular-nums text-red-400">{selectedRun.failedCases}</p>
                  <p className="text-[10px] text-gray-500">Failed</p>
                </div>
                <div className="text-center p-2.5 bg-white/[0.02] rounded-lg border border-white/[0.04]">
                  <p className="text-lg font-bold font-mono tabular-nums text-cyan-400">{(selectedRun.totalInputTokens + selectedRun.totalOutputTokens) / 1000}k</p>
                  <p className="text-[10px] text-gray-500">Tokens</p>
                </div>
              </div>

              <div className="p-3 bg-white/[0.02] rounded-lg border border-white/[0.04]">
                <p className="text-[10px] text-gray-500 mb-2 uppercase tracking-wide">Latency Distribution</p>
                <div className="flex items-center gap-4">
                  {[
                    { label: 'p50', value: selectedRun.p50Latency },
                    { label: 'p95', value: selectedRun.p95Latency },
                    { label: 'p99', value: selectedRun.p99Latency },
                  ].map((l, i) => (
                    <div key={i} className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-gray-500">{l.label}</span>
                        <span className={`text-xs font-mono tabular-nums ${l.value > 3000 ? 'text-red-400' : 'text-gray-200'}`}>{(l.value / 1000).toFixed(2)}s</span>
                      </div>
                      <div className="h-1 bg-white/[0.04] rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${l.value > 3000 ? 'bg-red-500' : 'bg-violet-500'}`} style={{ width: `${Math.min(100, (l.value / 4000) * 100)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          ) : (
            <GlassCard className="p-12 text-center">
              <p className="text-sm text-gray-400">Select a run to view details</p>
              <p className="text-[11px] text-gray-600 mt-1">Click on any evaluation run from the list</p>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}
