import { CheckCircle2, ArrowRight, ArrowDown, GitCommit, Database, BarChart3, Shield, Bell, Zap, Lock, Unlock } from 'lucide-react';
import { environmentGates, auditLog } from '../data/mockData';
import { GlassCard } from './ui/GlassCard';

const pipelineStages = [
  { id: 'trigger', name: 'Trigger', desc: 'Webhook / PR / Manual', icon: <Zap size={14} /> },
  { id: 'load', name: 'Load Config', desc: 'Golden set + model + prompt', icon: <Database size={14} /> },
  { id: 'evaluate', name: 'Evaluate', desc: 'LLM calls + judges', icon: <BarChart3 size={14} /> },
  { id: 'compare', name: 'Compare', desc: 'Baseline + statistical test', icon: <GitCommit size={14} /> },
  { id: 'decide', name: 'Gate Check', desc: 'Threshold + promotion', icon: <Shield size={14} /> },
  { id: 'alert', name: 'Notify', desc: 'Slack + PR comment', icon: <Bell size={14} /> },
];

export default function PipelineView() {
  return (
    <div className="space-y-5">
      <GlassCard className="p-5 gradient-border">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-semibold text-white">Pipeline Stages</h3>
          <div className="flex items-center gap-2 text-[10px] text-gray-500">
            <span>Total: 2m 34s</span>
            <span>·</span>
            <span>14 test cases</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2 lg:gap-0">
          {pipelineStages.map((stage, i) => (
            <div key={stage.id} className="flex items-center w-full lg:w-auto">
              <div className="flex-1 lg:flex-initial">
                <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.03]">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 size={14} className="text-emerald-400" />
                    <span className="text-xs font-medium text-white">{stage.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                    {stage.icon}
                    {stage.desc}
                  </div>
                </div>
              </div>
              {i < pipelineStages.length - 1 && (
                <>
                  <div className="hidden lg:flex items-center px-2"><ArrowRight size={14} className="text-gray-700" /></div>
                  <div className="lg:hidden flex justify-center py-0.5"><ArrowDown size={14} className="text-gray-700" /></div>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="mt-5 pt-4 border-t border-white/[0.04]">
          <div className="flex gap-0.5 h-2 rounded-full overflow-hidden">
            <div className="bg-violet-500/40 rounded-l-full" style={{ width: '3%' }} />
            <div className="bg-violet-500/40" style={{ width: '5%' }} />
            <div className="bg-violet-500/70" style={{ width: '72%' }} />
            <div className="bg-violet-500/40" style={{ width: '8%' }} />
            <div className="bg-violet-500/40" style={{ width: '7%' }} />
            <div className="bg-violet-500/40 rounded-r-full" style={{ width: '5%' }} />
          </div>
          <div className="flex justify-between mt-1.5 text-[9px] text-gray-600">
            <span>Trigger 1s</span><span>Load 4s</span><span>Evaluate 2m 10s</span><span>Compare 5s</span><span>Gate 3s</span><span>Alert 2s</span>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-5">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Shield size={14} className="text-violet-400" />
          Environment Promotion Gates
        </h3>
        <div className="space-y-3">
          {environmentGates.map((gate) => {
            const passing = gate.currentScore >= gate.threshold;
            return (
              <div key={gate.environment} className={`p-4 rounded-xl border ${passing ? 'bg-emerald-500/[0.03] border-emerald-500/15' : 'bg-red-500/[0.03] border-red-500/15'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {passing ? <Unlock size={16} className="text-emerald-400" /> : <Lock size={16} className="text-red-400" />}
                    <div>
                      <h4 className="text-xs font-medium text-white">{gate.environment}</h4>
                      <p className="text-[10px] text-gray-500">{gate.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold font-mono tabular-nums ${passing ? 'text-emerald-400' : 'text-red-400'}`}>{gate.currentScore}%</p>
                    <p className="text-[10px] text-gray-500">Threshold: {gate.threshold}%</p>
                  </div>
                </div>
                <div className="relative h-2 bg-white/[0.04] rounded-full overflow-hidden">
                  <div className={`absolute inset-y-0 left-0 rounded-full ${passing ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${gate.currentScore}%` }} />
                  <div className="absolute inset-y-0 w-px bg-white/40" style={{ left: `${gate.threshold}%` }} />
                </div>
                <div className="mt-2 flex items-center gap-3 text-[10px] text-gray-500 flex-wrap">
                  <span>Min cases: {gate.minCases}</span>
                  <span>Required evaluators: {gate.requiredEvaluators.length}</span>
                  <span>Owner: {gate.owner}</span>
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>

      <GlassCard className="p-5">
        <h3 className="text-sm font-semibold text-white mb-3">Audit Log</h3>
        <div className="space-y-1">
          {auditLog.slice(0, 8).map((entry) => (
            <div key={entry.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-white/[0.02] transition-colors">
              <span className="text-[10px] text-gray-600 font-mono tabular-nums w-28 shrink-0">{new Date(entry.timestamp).toLocaleString()}</span>
              <span className="text-[10px] text-gray-300 w-24 shrink-0">{entry.actor}</span>
              <span className="text-[10px] text-violet-400 w-32 shrink-0">{entry.action.replace(/_/g, ' ')}</span>
              <span className="text-[10px] text-gray-500 truncate">{entry.details}</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
