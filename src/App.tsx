import { useState, useEffect, type ReactNode } from 'react';
import {
  LayoutDashboard, Database, PlayCircle, TrendingUp, Bell, GitBranch,
  Shield, Menu, X, Cpu, DollarSign, Search, Download, Upload, User,
  Trophy, Zap
} from 'lucide-react';
import { useApp } from './store/AppContext';
import { useToast } from './store/ToastContext';
import { AnimatedBackground } from './components/ui/AnimatedBackground';
import { CursorFollower } from './components/ui/CursorFollower';
import { ParticleField } from './components/ui/ParticleField';
import { GradientText } from './components/ui/Primitives';
import Dashboard from './components/Dashboard';
import GoldenDataset from './components/GoldenDataset';
import EvalRuns from './components/EvalRuns';
import TrendView from './components/TrendView';
import AlertsView from './components/AlertsView';
import PipelineView from './components/PipelineView';
import ModelRegistry from './components/ModelRegistry';
import CostAnalytics from './components/CostAnalytics';
import ModelLeaderboard from './components/ModelLeaderboard';
import CommandCenter from './components/CommandCenter';

type View = 'dashboard' | 'dataset' | 'runs' | 'trends' | 'alerts' | 'pipeline' | 'models' | 'cost' | 'leaderboard' | 'command';
type NavigateFn = (view: View) => void;

const navItems: { id: View; label: string; icon: ReactNode; group: string }[] = [
  { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard size={18} />, group: 'Monitor' },
  { id: 'command', label: 'Command Center', icon: <Zap size={18} />, group: 'Monitor' },
  { id: 'runs', label: 'Eval Runs', icon: <PlayCircle size={18} />, group: 'Monitor' },
  { id: 'trends', label: 'Quality Trends', icon: <TrendingUp size={18} />, group: 'Monitor' },
  { id: 'cost', label: 'Cost & Usage', icon: <DollarSign size={18} />, group: 'Monitor' },
  { id: 'alerts', label: 'Alerts', icon: <Bell size={18} />, group: 'Monitor' },
  { id: 'leaderboard', label: 'Model Leaderboard', icon: <Trophy size={18} />, group: 'Configure' },
  { id: 'dataset', label: 'Golden Dataset', icon: <Database size={18} />, group: 'Configure' },
  { id: 'models', label: 'Model Registry', icon: <Cpu size={18} />, group: 'Configure' },
  { id: 'pipeline', label: 'CI/CD Pipeline', icon: <GitBranch size={18} />, group: 'Configure' },
];

export default function App() {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cmdkOpen, setCmdkOpen] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const { state, exportData, importData } = useApp();
  const { success, error } = useToast();

  const navigate: NavigateFn = (view) => {
    setActiveView(view);
    setSidebarOpen(false);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCmdkOpen(v => !v);
      }
      if (e.key === 'Escape') setCmdkOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <Dashboard onNavigate={navigate} />;
      case 'command': return <CommandCenter />;
      case 'dataset': return <GoldenDataset />;
      case 'runs': return <EvalRuns />;
      case 'trends': return <TrendView />;
      case 'alerts': return <AlertsView />;
      case 'pipeline': return <PipelineView />;
      case 'models': return <ModelRegistry />;
      case 'cost': return <CostAnalytics />;
      case 'leaderboard': return <ModelLeaderboard />;
      default: return <Dashboard onNavigate={navigate} />;
    }
  };

  const groupedNav = navItems.reduce<Record<string, typeof navItems>>((acc, item) => {
    (acc[item.group] = acc[item.group] || []).push(item);
    return acc;
  }, {});

  const unacknowledgedAlerts = state.alerts.filter(a => !a.acknowledged).length;

  return (
    <div className="flex h-screen bg-[#05050a] text-gray-100 overflow-hidden font-sans antialiased relative">
      {/* Premium Background Effects */}
      <AnimatedBackground />
      <ParticleField />
      <CursorFollower />

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Premium Glass Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64
        glass-strong
        flex flex-col transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="h-16 px-5 border-b border-white/[0.06] flex items-center gap-3 shrink-0 relative">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-xl blur-md opacity-60" />
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/50">
              <Shield size={18} className="text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight">
              <GradientText>LLM Guard</GradientText>
            </h1>
            <p className="text-[10px] text-gray-500 -mt-0.5 font-medium">Regression Detection</p>
          </div>
          <div className="absolute top-0 right-0 w-32 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-5 overflow-y-auto">
          {Object.entries(groupedNav).map(([group, items]) => (
            <div key={group}>
              <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-gray-600">{group}</p>
              <div className="space-y-0.5">
                {items.map((item) => {
                  const isActive = activeView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => navigate(item.id)}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium
                        transition-all duration-300 relative group
                        ${isActive
                          ? 'bg-gradient-to-r from-violet-500/20 to-fuchsia-500/10 text-white shadow-lg shadow-violet-500/10'
                          : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'}
                      `}
                    >
                      {isActive && (
                        <>
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-violet-400 to-fuchsia-400 rounded-r-full" />
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </>
                      )}
                      <span className={`relative z-10 transition-transform duration-300 ${isActive ? 'text-violet-300 scale-110' : 'group-hover:scale-110'}`}>
                        {item.icon}
                      </span>
                      <span className="relative z-10 flex-1 text-left">{item.label}</span>
                      {item.id === 'alerts' && unacknowledgedAlerts > 0 && (
                        <span className="relative z-10 text-[9px] px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-300 font-bold border border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.3)]">
                          {unacknowledgedAlerts}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Status Footer */}
        <div className="p-3 border-t border-white/[0.06]">
          <div className="glass-subtle rounded-xl p-3 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent" />
            <div className="relative flex items-center gap-2">
              <div className="relative">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-400 animate-ping opacity-75" />
              </div>
              <div className="flex-1">
                <p className="text-[11px] text-emerald-300 font-semibold">All Systems Operational</p>
                <p className="text-[9px] text-gray-500">Last sync: just now</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0 relative z-10">
        {/* Premium Header */}
        <header className="h-16 border-b border-white/[0.06] flex items-center justify-between px-4 lg:px-6 glass-subtle shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-1.5 rounded-lg hover:bg-white/[0.05] text-gray-400">
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                {navItems.find(n => n.id === activeView)?.label}
              </h2>
              <p className="text-[10px] text-gray-500 -mt-0.5">
                {activeView === 'dashboard' && 'Real-time quality monitoring'}
                {activeView === 'command' && 'Live system status & metrics'}
                {activeView === 'runs' && `${state.evalRuns.length} evaluations tracked`}
                {activeView === 'trends' && 'Statistical drift analysis'}
                {activeView === 'alerts' && `${unacknowledgedAlerts} unacknowledged`}
                {activeView === 'dataset' && `${state.testCases.length} test cases`}
                {activeView === 'models' && `${state.models.length} registered models`}
                {activeView === 'leaderboard' && 'Performance ranking'}
                {activeView === 'pipeline' && 'CI/CD automation'}
                {activeView === 'cost' && 'Usage & billing analytics'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCmdkOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl glass hover:border-white/[0.15] text-gray-400 hover:text-white text-xs transition-all"
            >
              <Search size={13} />
              <span>Search...</span>
              <kbd className="px-1.5 py-0.5 rounded bg-white/[0.05] text-[9px] font-mono text-gray-500 border border-white/[0.06]">⌘K</kbd>
            </button>
            <button
              onClick={() => setShowExportModal(true)}
              className="hidden sm:flex p-2 rounded-xl glass hover:border-white/[0.15] text-gray-400 hover:text-white transition-all"
              title="Export data"
            >
              <Download size={14} />
            </button>
            <button
              onClick={() => setShowImportModal(true)}
              className="hidden sm:flex p-2 rounded-xl glass hover:border-white/[0.15] text-gray-400 hover:text-white transition-all"
              title="Import data"
            >
              <Upload size={14} />
            </button>
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl glass">
              <div className="relative">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping opacity-50" />
              </div>
              <span className="text-[11px] text-emerald-300 font-semibold tabular-nums">Prod: 96.8%</span>
            </div>
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl glass">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-violet-500/30">
                SC
              </div>
              <span className="text-[11px] text-gray-300 font-medium hidden sm:inline">{state.currentUser}</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6 max-w-[1600px] mx-auto relative">
            {renderView()}
          </div>
        </div>
      </main>

      {/* Command Palette */}
      {cmdkOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] px-4" onClick={() => setCmdkOpen(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
          <div className="relative w-full max-w-lg glass-strong rounded-2xl shadow-2xl shadow-violet-500/20 overflow-hidden animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-2 px-4 border-b border-white/[0.06]">
              <Search size={16} className="text-violet-400" />
              <input autoFocus placeholder="Search runs, test cases, models, alerts..." className="flex-1 py-4 bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none" />
              <kbd className="px-1.5 py-0.5 rounded bg-white/[0.05] text-[10px] font-mono text-gray-500 border border-white/[0.06]">ESC</kbd>
            </div>
            <div className="p-2 max-h-80 overflow-y-auto">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => { navigate(item.id); setCmdkOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-300 hover:bg-white/[0.04] transition-colors"
                >
                  <span className="text-gray-500">{item.icon}</span>
                  <span>Go to {item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-4" onClick={() => setShowExportModal(false)}>
          <div className="glass-strong rounded-2xl p-6 w-full max-w-2xl animate-scale-in" onClick={e => e.stopPropagation()}>
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <Download size={18} className="text-violet-400" />
              Export Data
            </h3>
            <p className="text-xs text-gray-400 mb-4">Copy or download the complete dataset as JSON</p>
            <textarea
              readOnly
              value={exportData()}
              className="w-full h-64 p-3 bg-black/30 border border-white/[0.06] rounded-xl text-[10px] font-mono text-gray-300 resize-none focus:outline-none"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowExportModal(false)} className="px-4 py-2 text-xs text-gray-400 hover:text-white">Cancel</button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(exportData());
                  success('Copied to clipboard');
                  setShowExportModal(false);
                }}
                className="px-4 py-2 glass hover:border-white/[0.15] text-white rounded-xl text-xs font-medium"
              >
                Copy
              </button>
              <button
                onClick={() => {
                  const blob = new Blob([exportData()], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `llm-guard-export-${new Date().toISOString().split('T')[0]}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                  success('Downloaded');
                  setShowExportModal(false);
                }}
                className="px-4 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl text-xs font-medium shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 transition-shadow"
              >
                Download JSON
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-4" onClick={() => setShowImportModal(false)}>
          <div className="glass-strong rounded-2xl p-6 w-full max-w-2xl animate-scale-in" onClick={e => e.stopPropagation()}>
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <Upload size={18} className="text-violet-400" />
              Import Data
            </h3>
            <p className="text-xs text-gray-400 mb-4">Paste JSON data. This will replace all current data.</p>
            <textarea
              id="import-textarea"
              placeholder="Paste JSON here..."
              className="w-full h-64 p-3 bg-black/30 border border-white/[0.06] rounded-xl text-[10px] font-mono text-gray-300 resize-none focus:outline-none focus:border-violet-500/40"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowImportModal(false)} className="px-4 py-2 text-xs text-gray-400 hover:text-white">Cancel</button>
              <button
                onClick={() => {
                  const textarea = document.getElementById('import-textarea') as HTMLTextAreaElement;
                  try {
                    importData(textarea.value);
                    success('Data imported successfully');
                    setShowImportModal(false);
                  } catch (e) {
                    error('Import failed', 'Invalid JSON format');
                  }
                }}
                className="px-4 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl text-xs font-medium shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 transition-shadow"
              >
                Import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
