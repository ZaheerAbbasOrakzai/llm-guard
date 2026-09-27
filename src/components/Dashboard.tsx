import { useState } from 'react';
import {
  Activity, CheckCircle2, XCircle, AlertTriangle, Zap,
  ArrowRight, PlayCircle, Database, GitBranch, Cpu, Timer, Loader2, Sparkles
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, ReferenceLine } from 'recharts';
import { environmentGates } from '../data/mockData';
import { useApp } from '../store/AppContext';
import { useToast } from '../store/ToastContext';
import { GlassCard, StatCard } from './ui/GlassCard';
import { GradientText, AnimatedCounter } from './ui/Primitives';
import { LiveActivityFeed } from './LiveActivityFeed';
import { InteractiveOrb } from './ui/InteractiveOrb';

interface DashboardProps {
  onNavigate: (view: 'dashboard' | 'dataset' | 'runs' | 'trends' | 'alerts' | 'pipeline' | 'models' | 'cost') => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { state, triggerEvaluation } = useApp();
  const { success, error: showError } = useToast();
  const [evaluating, setEvaluating] = useState(false);

  const evalRuns = state.evalRuns;
  const alerts = state.alerts;
  const trendData = state.trendData;
  const testCases = state.testCases;

  const latestRun = evalRuns[0] || { weightedScore: 0, deltaVsBaseline: 0, p95Latency: 0, p50Latency: 0, passedCases: 0, totalCases: 0 };
  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged);
  const criticalAlerts = alerts.filter(a => a.severity === 'critical' && !a.acknowledged);

  const totalCost30d = trendData.reduce((s, d) => s + d.costUsd, 0);

  const handleTriggerEval = async () => {
    setEvaluating(true);
    try {
      const model = state.models[0];
      const prompt = state.prompts[0];
      const run = await triggerEvaluation(model.id, prompt.id);
      success('Evaluation completed', `Score: ${run.overallScore}% · ${run.passedCases}/${run.totalCases} passed`);
    } catch (e) {
      showError('Evaluation failed');
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl">
        <GlassCard className="p-8 gradient-border" gradient>
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-violet-400" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-violet-300">Real-Time Monitoring</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
                <GradientText>Ship LLM Features</GradientText>
                <br />
                <span className="text-white">with Confidence</span>
              </h1>
              <p className="text-sm text-gray-400 max-w-xl">
                Production-grade regression detection for LLM-powered applications. 
                Catch quality issues in minutes, not days.
              </p>
            </div>
            <div className="flex flex-col items-end gap-3">
              <div className="text-right">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Current Score</p>
                <p className="text-5xl font-bold text-white text-glow-violet tabular-nums">
                  <AnimatedCounter value={latestRun.weightedScore} format={(v: number) => v.toFixed(1)} />
                  <span className="text-2xl text-gray-500">%</span>
                </p>
                <p className="text-xs text-emerald-400 mt-1 flex items-center justify-end gap-1">
                  <span>↑ 2.4%</span>
                  <span className="text-gray-600">vs baseline</span>
                </p>
              </div>
              <button
                onClick={handleTriggerEval}
                disabled={evaluating}
                className="btn-premium px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-xl text-sm font-semibold shadow-xl shadow-violet-600/40 hover:shadow-violet-500/60 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {evaluating ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Evaluating...
                  </>
                ) : (
                  <>
                    <PlayCircle size={16} />
                    Trigger Evaluation
                  </>
                )}
              </button>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="animate-fade-in-up stagger-1">
          <StatCard
            label="Weighted Score"
            value={`${latestRun.weightedScore}%`}
            sub={`Baseline: ${(latestRun.weightedScore - (latestRun.deltaVsBaseline || 0)).toFixed(1)}%`}
            icon={<Activity size={20} />}
            gradient="bg-gradient-to-br from-violet-500 to-fuchsia-600"
            delta={{ value: latestRun.deltaVsBaseline || 0, positive: (latestRun.deltaVsBaseline || 0) > 0 }}
          />
        </div>
        <div className="animate-fade-in-up stagger-2">
          <StatCard
            label="Pass Rate"
            value={`${latestRun.passedCases}/${latestRun.totalCases}`}
            sub={`${testCases.filter(tc => tc.critical).length} critical cases`}
            icon={<CheckCircle2 size={20} />}
            gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
          />
        </div>
        <div className="animate-fade-in-up stagger-3">
          <StatCard
            label="Active Alerts"
            value={unacknowledgedAlerts.length}
            sub={`${criticalAlerts.length} critical`}
            icon={<AlertTriangle size={20} />}
            gradient={criticalAlerts.length > 0 ? "bg-gradient-to-br from-red-500 to-rose-600" : "bg-gradient-to-br from-emerald-500 to-teal-600"}
          />
        </div>
        <div className="animate-fade-in-up stagger-4">
          <StatCard
            label="p95 Latency"
            value={`${(latestRun.p95Latency / 1000).toFixed(1)}s`}
            sub={`SLO: <3.0s · p50: ${(latestRun.p50Latency / 1000).toFixed(1)}s`}
            icon={<Timer size={20} />}
            gradient="bg-gradient-to-br from-cyan-500 to-blue-600"
          />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Interactive 3D Orb */}
        <GlassCard className="lg:col-span-1 p-6 animate-fade-in-up stagger-3 relative overflow-hidden">
          <div className="absolute inset-0 opacity-50">
            <InteractiveOrb />
          </div>
          <div className="relative z-10 flex flex-col items-center justify-center h-64">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20">
                <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                <span className="text-[10px] font-bold text-violet-300 uppercase tracking-wider">System Status</span>
              </div>
              <h3 className="text-2xl font-bold text-white">All Systems Operational</h3>
              <p className="text-xs text-gray-400">Real-time monitoring active</p>
              <div className="flex items-center gap-4 pt-2">
                <div className="text-center">
                  <p className="text-lg font-bold text-emerald-400 tabular-nums">99.9%</p>
                  <p className="text-[10px] text-gray-500">Uptime</p>
                </div>
                <div className="w-px h-8 bg-white/[0.06]" />
                <div className="text-center">
                  <p className="text-lg font-bold text-cyan-400 tabular-nums">2.4s</p>
                  <p className="text-[10px] text-gray-500">Avg Latency</p>
                </div>
                <div className="w-px h-8 bg-white/[0.06]" />
                <div className="text-center">
                  <p className="text-lg font-bold text-violet-400 tabular-nums">8</p>
                  <p className="text-[10px] text-gray-500">Models</p>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Quality Chart */}
        <GlassCard className="lg:col-span-2 p-6 animate-fade-in-up stagger-3">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-bold text-white">Quality Score · 30 days</h3>
              <p className="text-[10px] text-gray-500 mt-0.5">Weighted score across all evaluators</p>
            </div>
            <button onClick={() => onNavigate('trends')} className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors group">
              Details <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="gradScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4} />
                    <stop offset="50%" stopColor="#d946ef" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="timestamp" tickFormatter={v => new Date(v).toLocaleDateString('en', { month: 'short', day: 'numeric' })} stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} interval={4} />
                <YAxis domain={[60, 100]} stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} width={30} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(15,15,25,0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 11 }} />
                <ReferenceLine y={95} stroke="#ef4444" strokeDasharray="4 4" strokeOpacity={0.5} />
                <ReferenceLine y={90} stroke="#f59e0b" strokeDasharray="4 4" strokeOpacity={0.5} />
                <Area type="monotone" dataKey="weightedScore" stroke="url(#gradScore)" strokeWidth={2.5} fill="url(#gradScore)" name="Weighted Score" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Recent Alerts */}
        <GlassCard className="p-6 animate-fade-in-up stagger-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white">Recent Alerts</h3>
            <button onClick={() => onNavigate('alerts')} className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors group">
              View all <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
          <div className="space-y-2">
            {alerts.filter(a => !a.acknowledged).slice(0, 5).map((alert) => (
              <div key={alert.id} className={`p-3 rounded-xl border transition-all hover:scale-[1.02] cursor-pointer ${
                alert.severity === 'critical' ? 'bg-red-500/[0.04] border-red-500/15' :
                alert.severity === 'warning' ? 'bg-amber-500/[0.04] border-amber-500/15' :
                'bg-white/[0.02] border-white/[0.06]'
              }`} onClick={() => onNavigate('alerts')}>
                <div className="flex items-start gap-2">
                  {alert.severity === 'critical' ? <XCircle size={14} className="text-red-400 mt-0.5 shrink-0" /> :
                   alert.severity === 'warning' ? <AlertTriangle size={14} className="text-amber-400 mt-0.5 shrink-0" /> :
                   <Activity size={14} className="text-blue-400 mt-0.5 shrink-0" />}
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] text-gray-200 font-medium leading-snug">{alert.title}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{new Date(alert.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Live Activity Feed */}
      <div className="animate-fade-in-up stagger-5">
        <LiveActivityFeed />
      </div>
    </div>
  );
}
