import { useState, useEffect } from 'react';
import { Activity, CheckCircle2, XCircle, AlertTriangle, Clock, TrendingUp, DollarSign, Shield } from 'lucide-react';
import { useApp } from '../store/AppContext';

interface ActivityItem {
  id: string;
  type: 'evaluation' | 'alert' | 'deploy' | 'model_change' | 'cost_update';
  title: string;
  description: string;
  timestamp: Date;
  severity?: 'info' | 'warning' | 'critical' | 'success';
  metadata?: Record<string, any>;
}

export function LiveActivityFeed() {
  const { state } = useApp();
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    // Generate initial activities from current state
    const initialActivities: ActivityItem[] = [
      {
        id: '1',
        type: 'evaluation',
        title: 'Evaluation completed',
        description: `Run ${state.evalRuns[0]?.id || 'run-1029'} - Score: ${state.evalRuns[0]?.overallScore || 97.1}%`,
        timestamp: new Date(state.evalRuns[0]?.timestamp || Date.now()),
        severity: state.evalRuns[0]?.status === 'pass' ? 'success' : 'critical',
        metadata: { score: state.evalRuns[0]?.overallScore, passed: state.evalRuns[0]?.passedCases }
      },
      {
        id: '2',
        type: 'alert',
        title: 'Alert acknowledged',
        description: 'Regression alert acknowledged by alex.kumar',
        timestamp: new Date(Date.now() - 1000 * 60 * 15),
        severity: 'warning'
      },
      {
        id: '3',
        type: 'deploy',
        title: 'Production deploy',
        description: 'Claude 3.5 Sonnet promoted to production',
        timestamp: new Date(Date.now() - 1000 * 60 * 45),
        severity: 'success'
      },
      {
        id: '4',
        type: 'cost_update',
        title: 'Cost threshold reached',
        description: 'Monthly budget at 49.6% ($12.40 / $25.00)',
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        severity: 'info'
      },
      {
        id: '5',
        type: 'model_change',
        title: 'Model registered',
        description: 'GPT-4o added to model registry',
        timestamp: new Date(Date.now() - 1000 * 60 * 90),
        severity: 'info'
      }
    ];

    setActivities(initialActivities);

    // Simulate live updates
    const interval = setInterval(() => {
      const newActivity: ActivityItem = {
        id: Date.now().toString(),
        type: ['evaluation', 'alert', 'deploy', 'model_change', 'cost_update'][Math.floor(Math.random() * 5)] as any,
        title: ['Evaluation running', 'Alert triggered', 'Deploy in progress', 'Model updated', 'Cost updated'][Math.floor(Math.random() * 5)],
        description: `Activity ${Math.floor(Math.random() * 1000)} - ${new Date().toLocaleTimeString()}`,
        timestamp: new Date(),
        severity: ['info', 'warning', 'critical', 'success'][Math.floor(Math.random() * 4)] as any
      };

      setActivities(prev => [newActivity, ...prev].slice(0, 10));
    }, 10000);

    return () => clearInterval(interval);
  }, [state]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'evaluation': return <Activity size={14} />;
      case 'alert': return <AlertTriangle size={14} />;
      case 'deploy': return <TrendingUp size={14} />;
      case 'model_change': return <Shield size={14} />;
      case 'cost_update': return <DollarSign size={14} />;
      default: return <Clock size={14} />;
    }
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'success': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'warning': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'critical': return 'text-red-400 bg-red-500/10 border-red-500/20';
      default: return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    }
  };

  return (
    <div className="glass-strong rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Activity size={16} className="text-violet-400" />
            <div className="absolute inset-0 animate-pulse-ring">
              <div className="w-4 h-4 rounded-full border-2 border-violet-400" />
            </div>
          </div>
          <h3 className="text-sm font-bold text-white">Live Activity</h3>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] text-emerald-400 font-medium">LIVE</span>
        </div>
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {activities.map((activity, index) => (
          <div
            key={activity.id}
            className={`p-3 rounded-xl border transition-all hover:scale-[1.01] animate-fade-in-up ${getSeverityColor(activity.severity)}`}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="flex items-start gap-3">
              <div className={`p-1.5 rounded-lg ${getSeverityColor(activity.severity)}`}>
                {getIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-semibold text-white truncate">{activity.title}</h4>
                  <span className="text-[9px] text-gray-500 whitespace-nowrap">
                    {activity.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-2">{activity.description}</p>
                {activity.metadata && (
                  <div className="flex items-center gap-2 mt-1.5">
                    {activity.metadata.score && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/[0.05] text-gray-300">
                        Score: {activity.metadata.score}%
                      </span>
                    )}
                    {activity.metadata.passed && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/[0.05] text-gray-300">
                        {activity.metadata.passed} passed
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
