import { Activity, Users, Zap, Clock, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { GlassCard } from './ui/GlassCard';
import { GradientText, AnimatedCounter } from './ui/Primitives';

export default function CommandCenter() {
  const { state } = useApp();
  
  const evalRuns = state.evalRuns;
  const alerts = state.alerts;
  const trendData = state.trendData;
  const testCases = state.testCases;

  // Real-time stats
  const latestRun = evalRuns[0];
  const activeAlerts = alerts.filter(a => !a.acknowledged).length;
  const criticalAlerts = alerts.filter(a => a.severity === 'critical' && !a.acknowledged).length;
  const passRate24h = evalRuns.length > 0 ? evalRuns.slice(0, 10).reduce((sum, r) => sum + (r.passedCases / r.totalCases), 0) / Math.min(10, evalRuns.length) * 100 : 0;
  const avgLatency = evalRuns.length > 0 ? evalRuns.slice(0, 10).reduce((sum, r) => sum + r.p95Latency, 0) / Math.min(10, evalRuns.length) : 0;
  const costToday = evalRuns.slice(0, 5).reduce((sum, r) => sum + r.totalCostUsd, 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Zap size={22} className="text-violet-400" />
          <GradientText>Command Center</GradientText>
        </h2>
        <p className="text-xs text-gray-500 mt-1">Real-time system status and metrics</p>
      </div>

      {/* Live Status Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-4" tilt>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center">
              <Activity size={16} className="text-white" />
            </div>
            <span className="text-[10px] text-gray-500 uppercase tracking-wide">System Status</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-400 animate-ping opacity-75" />
            </div>
            <span className="text-sm font-semibold text-emerald-400">Operational</span>
          </div>
          <p className="text-[10px] text-gray-500 mt-1">All systems normal</p>
        </GlassCard>

        <GlassCard className="p-4" tilt>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <CheckCircle2 size={16} className="text-white" />
            </div>
            <span className="text-[10px] text-gray-500 uppercase tracking-wide">Pass Rate (24h)</span>
          </div>
          <p className="text-2xl font-bold text-white tabular-nums">
            <AnimatedCounter value={passRate24h || 0} format={(v: number) => `${(v || 0).toFixed(1)}%`} />
          </p>
          <p className="text-[10px] text-gray-500 mt-1">Last 10 evaluations</p>
        </GlassCard>

        <GlassCard className="p-4" tilt>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Clock size={16} className="text-white" />
            </div>
            <span className="text-[10px] text-gray-500 uppercase tracking-wide">Avg Latency</span>
          </div>
          <p className="text-2xl font-bold text-white tabular-nums">
            <AnimatedCounter value={(avgLatency || 0) / 1000} format={(v: number) => `${(v || 0).toFixed(2)}s`} />
          </p>
          <p className="text-[10px] text-gray-500 mt-1">p95 response time</p>
        </GlassCard>

        <GlassCard className="p-4" tilt>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <AlertTriangle size={16} className="text-white" />
            </div>
            <span className="text-[10px] text-gray-500 uppercase tracking-wide">Active Alerts</span>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-white tabular-nums">{activeAlerts}</p>
            {criticalAlerts > 0 && (
              <span className="text-xs text-red-400 font-medium">{criticalAlerts} critical</span>
            )}
          </div>
          <p className="text-[10px] text-gray-500 mt-1">Requires attention</p>
        </GlassCard>
      </div>

      {/* Real-time Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GlassCard className="p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Activity size={14} className="text-violet-400" />
            Recent Activity
          </h3>
          <div className="space-y-2">
            {evalRuns.slice(0, 6).map((run, i) => (
              <div key={run.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/[0.02] transition-colors">
                <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  run.status === 'pass' ? 'bg-emerald-400' : run.status === 'fail' ? 'bg-red-400' : 'bg-amber-400 animate-pulse'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-200 truncate">{run.triggeredBy}</p>
                  <p className="text-[10px] text-gray-500">{run.modelLabel} · {run.environment}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className={`text-xs font-mono font-semibold tabular-nums ${
                    run.status === 'pass' ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {run.overallScore}%
                  </p>
                  <p className="text-[10px] text-gray-500">{new Date(run.timestamp).toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp size={14} className="text-emerald-400" />
            Performance Trend
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Current Score</span>
              <span className="text-sm font-bold text-white tabular-nums">{latestRun?.weightedScore || 0}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">24h Change</span>
              <span className="text-sm font-bold text-emerald-400 tabular-nums">+2.4%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Cost Today</span>
              <span className="text-sm font-mono text-white tabular-nums">${(costToday || 0).toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Test Coverage</span>
              <span className="text-sm font-mono text-white tabular-nums">{testCases.length} cases</span>
            </div>
            <div className="pt-2 border-t border-white/[0.04]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-gray-500">Quality Score</span>
                <span className="text-[10px] text-gray-500 tabular-nums">{latestRun?.weightedScore || 0}%</span>
              </div>
              <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full shadow-[0_0_10px_rgba(139,92,246,0.5)]" style={{ width: `${latestRun?.weightedScore || 0}%` }} />
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Team Activity */}
      <GlassCard className="p-5">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Users size={14} className="text-cyan-400" />
          Team Activity
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { name: 'sarah.chen', role: 'ML Engineer', actions: 12, color: 'from-violet-500 to-fuchsia-600' },
            { name: 'alex.kumar', role: 'Platform Eng', actions: 8, color: 'from-cyan-500 to-blue-600' },
            { name: 'marcus.johnson', role: 'NLP Engineer', actions: 6, color: 'from-emerald-500 to-teal-600' },
            { name: 'security-team', role: 'Security', actions: 4, color: 'from-amber-500 to-orange-600' },
          ].map((member, i) => (
            <div key={i} className="p-3 bg-white/[0.02] rounded-lg border border-white/[0.04]">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${member.color} flex items-center justify-center text-[10px] font-bold text-white`}>
                  {member.name.split('.').map(n => n[0]).join('').toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white font-medium truncate">{member.name}</p>
                  <p className="text-[10px] text-gray-500">{member.role}</p>
                </div>
              </div>
              <p className="text-[10px] text-gray-400">{member.actions} actions today</p>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
