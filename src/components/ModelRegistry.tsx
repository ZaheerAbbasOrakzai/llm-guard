import { useState } from 'react';
import { Cpu, Plus, Search, Tag } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { GlassCard } from './ui/GlassCard';

export default function ModelRegistry() {
  const { state } = useApp();
  const [search, setSearch] = useState('');
  const [filterProvider, setFilterProvider] = useState<string>('all');
  const [selectedModel, setSelectedModel] = useState<typeof state.models[0] | null>(null);

  const models = state.models;
  const providers = ['all', ...new Set(models.map(m => m.provider))];
  const filtered = models.filter(m => {
    const matchesSearch = m.model.toLowerCase().includes(search.toLowerCase()) || m.version.toLowerCase().includes(search.toLowerCase());
    const matchesProvider = filterProvider === 'all' || m.provider === filterProvider;
    return matchesSearch && matchesProvider;
  });

  const getProviderColor = (p: string) => {
    switch (p) {
      case 'openai': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'anthropic': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'google': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'meta': return 'bg-violet-500/10 text-violet-400 border-violet-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <p className="text-xs text-gray-500">{models.length} registered models across {providers.length - 1} providers</p>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-medium transition-colors shadow-lg shadow-violet-600/20">
          <Plus size={13} />
          Register Model
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
          <input type="text" placeholder="Search models..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-violet-500/40" />
        </div>
        <div className="flex gap-0.5 bg-white/[0.03] border border-white/[0.06] rounded-lg p-0.5">
          {providers.map(p => (
            <button key={p} onClick={() => setFilterProvider(p)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${filterProvider === p ? 'bg-violet-500/15 text-violet-300' : 'text-gray-500 hover:text-gray-300'}`}>
              {p === 'all' ? 'All' : p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {filtered.map((model) => (
          <GlassCard key={model.id} onClick={() => setSelectedModel(model)} tilt glow="cyan"
            className={`p-4 cursor-pointer ${selectedModel?.id === model.id ? 'border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.2)]' : ''}`}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Cpu size={14} className="text-gray-400" />
                  <h4 className="text-sm font-medium text-white">{model.model}</h4>
                </div>
                <p className="text-[10px] text-gray-500 mt-0.5 font-mono">{model.version}</p>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getProviderColor(model.provider)}`}>{model.provider}</span>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="p-2 bg-white/[0.02] rounded-md">
                <p className="text-[9px] text-gray-600 uppercase tracking-wide">Cost/1M in</p>
                <p className="text-xs font-mono text-white tabular-nums">${(model.costPer1MInput || 0).toFixed(2)}</p>
              </div>
              <div className="p-2 bg-white/[0.02] rounded-md">
                <p className="text-[9px] text-gray-600 uppercase tracking-wide">Cost/1M out</p>
                <p className="text-xs font-mono text-white tabular-nums">${(model.costPer1MOutput || 0).toFixed(2)}</p>
              </div>
              <div className="p-2 bg-white/[0.02] rounded-md">
                <p className="text-[9px] text-gray-600 uppercase tracking-wide">Context</p>
                <p className="text-xs font-mono text-white tabular-nums">{((model.contextWindow || 0) / 1000).toFixed(0)}k</p>
              </div>
            </div>

            {model.benchmarks && (
              <div className="mb-3">
                <p className="text-[9px] text-gray-600 uppercase tracking-wide mb-1">Benchmarks</p>
                <div className="flex flex-wrap gap-1">
                  {Object.entries(model.benchmarks).slice(0, 4).map(([key, value]) => (
                    <span key={key} className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                      {key}: {value}%
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-1 flex-wrap">
              {model.tags.slice(0, 3).map(tag => (
                <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/[0.04] text-gray-500 border border-white/[0.06]">{tag}</span>
              ))}
              <span className="text-[10px] text-gray-600 ml-auto">by {model.owner}</span>
            </div>
          </GlassCard>
        ))}
      </div>

      {selectedModel && (
        <GlassCard className="p-5 gradient-border animate-scale-in">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Cpu size={16} className="text-cyan-400" />
              <h3 className="text-sm font-semibold text-white">{selectedModel.model}</h3>
              <span className="text-[10px] font-mono text-gray-500">{selectedModel.version}</span>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getProviderColor(selectedModel.provider)}`}>{selectedModel.provider}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-2.5 bg-white/[0.02] rounded-lg border border-white/[0.04]">
              <p className="text-[9px] text-gray-600 uppercase tracking-wide">Temperature</p>
              <p className="text-xs text-white font-medium mt-0.5">{selectedModel.temperature}</p>
            </div>
            <div className="p-2.5 bg-white/[0.02] rounded-lg border border-white/[0.04]">
              <p className="text-[9px] text-gray-600 uppercase tracking-wide">Top P</p>
              <p className="text-xs text-white font-medium mt-0.5">{selectedModel.topP}</p>
            </div>
            <div className="p-2.5 bg-white/[0.02] rounded-lg border border-white/[0.04]">
              <p className="text-[9px] text-gray-600 uppercase tracking-wide">Max Tokens</p>
              <p className="text-xs text-white font-medium mt-0.5">{(selectedModel.maxTokens || 0).toLocaleString()}</p>
            </div>
            <div className="p-2.5 bg-white/[0.02] rounded-lg border border-white/[0.04]">
              <p className="text-[9px] text-gray-600 uppercase tracking-wide">Context Window</p>
              <p className="text-xs text-white font-medium mt-0.5">{((selectedModel.contextWindow || 0) / 1000).toFixed(0)}k</p>
            </div>
          </div>

          {selectedModel.benchmarks && (
            <div className="mt-4 pt-4 border-t border-white/[0.04]">
              <p className="text-[10px] text-gray-500 mb-2">Benchmark Scores</p>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {Object.entries(selectedModel.benchmarks).map(([key, value]) => (
                  <div key={key} className="p-2 bg-cyan-500/[0.05] rounded-lg border border-cyan-500/10">
                    <p className="text-[9px] text-gray-500 uppercase">{key}</p>
                    <p className="text-sm font-bold text-cyan-300 tabular-nums">{value}%</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-white/[0.04]">
            <p className="text-[10px] text-gray-500 mb-2">Tags</p>
            <div className="flex items-center gap-1.5 flex-wrap">
              {selectedModel.tags.map(t => (
                <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">{t}</span>
              ))}
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
