import { useState } from 'react';
import { Bell, AlertTriangle, XCircle, Info, CheckCircle2, MessageSquare, Mail, Phone, Webhook, Clock } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { useToast } from '../store/ToastContext';
import { GlassCard } from './ui/GlassCard';

export default function AlertsView() {
  const { state, acknowledgeAlert } = useApp();
  const { success } = useToast();
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const alerts = state.alerts;
  const filteredAlerts = alerts.filter(a => filterSeverity === 'all' || a.severity === filterSeverity);
  const unacknowledged = alerts.filter(a => !a.acknowledged).length;
  const critical = alerts.filter(a => a.severity === 'critical' && !a.acknowledged).length;

  const handleAcknowledge = (id: string) => {
    acknowledgeAlert(id);
    success('Alert acknowledged');
  };

  const getChannelIcon = (c: string) => {
    switch (c) {
      case 'slack': return <MessageSquare size={11} className="text-purple-400" />;
      case 'email': return <Mail size={11} className="text-blue-400" />;
      case 'pagerduty': return <Phone size={11} className="text-green-400" />;
      case 'webhook': return <Webhook size={11} className="text-orange-400" />;
      default: return <MessageSquare size={11} className="text-gray-400" />;
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-3">
        <GlassCard className="p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-red-400"><XCircle size={14} /></span>
            <span className="text-[10px] text-red-300/80 font-medium">Critical</span>
          </div>
          <p className="text-xl font-bold text-white tabular-nums">{critical}</p>
        </GlassCard>
        <GlassCard className="p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-amber-400"><AlertTriangle size={14} /></span>
            <span className="text-[10px] text-amber-300/80 font-medium">Warnings</span>
          </div>
          <p className="text-xl font-bold text-white tabular-nums">{alerts.filter(a => a.severity === 'warning' && !a.acknowledged).length}</p>
        </GlassCard>
        <GlassCard className="p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-violet-400"><Bell size={14} /></span>
            <span className="text-[10px] text-violet-300/80 font-medium">Unacknowledged</span>
          </div>
          <p className="text-xl font-bold text-white tabular-nums">{unacknowledged}</p>
        </GlassCard>
      </div>

      <div className="flex gap-0.5 bg-white/[0.03] border border-white/[0.06] rounded-lg p-0.5 w-fit">
        {['all', 'critical', 'warning', 'info'].map(s => (
          <button key={s} onClick={() => setFilterSeverity(s)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${filterSeverity === s ? 'bg-violet-500/15 text-violet-300' : 'text-gray-500 hover:text-gray-300'}`}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filteredAlerts.map((alert) => (
          <GlassCard key={alert.id} className={`p-4 transition-all hover:scale-[1.005] ${alert.acknowledged ? 'opacity-50' : ''}`}>
            <div className="flex items-start gap-3">
              <div className="mt-0.5 shrink-0">
                {alert.severity === 'critical' ? <XCircle size={16} className="text-red-400" /> :
                 alert.severity === 'warning' ? <AlertTriangle size={16} className="text-amber-400" /> :
                 <Info size={16} className="text-blue-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full border ${
                    alert.type === 'regression' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                    alert.type === 'promotion_block' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                    alert.type === 'threshold' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                    alert.type === 'drift' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
                    alert.type === 'cost_spike' ? 'bg-violet-500/10 text-violet-400 border-violet-500/20' :
                    alert.type === 'latency_spike' ? 'bg-pink-500/10 text-pink-400 border-pink-500/20' :
                    'bg-blue-500/10 text-blue-400 border-blue-500/20'
                  }`}>
                    {alert.type.replace('_', ' ')}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-gray-500">
                    {getChannelIcon(alert.channel)} {alert.channel}
                  </span>
                </div>
                <h4 className="text-xs font-medium text-white mb-1">{alert.title}</h4>
                <p className="text-[11px] text-gray-400 leading-relaxed">{alert.message}</p>
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <span className="text-[10px] text-gray-600 flex items-center gap-1"><Clock size={9} />{new Date(alert.timestamp).toLocaleString()}</span>
                  {alert.runId && <span className="text-[10px] text-gray-600 font-mono">{alert.runId}</span>}
                  {alert.acknowledged ? (
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1"><CheckCircle2 size={10} />Ack by {alert.acknowledgedBy}</span>
                  ) : null}
                </div>
              </div>
              <div className="shrink-0">
                {!alert.acknowledged && (
                  <button onClick={() => handleAcknowledge(alert.id)}
                    className="px-2.5 py-1 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-md text-[10px] text-gray-300 transition-colors">
                    Acknowledge
                  </button>
                )}
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
