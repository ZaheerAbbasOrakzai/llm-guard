import { useState } from 'react';
import { Search, Edit3, Trash2, ChevronDown, Database, Layers, Plus, Shield, Star } from 'lucide-react';
import { prompts } from '../data/mockData';
import { useApp } from '../store/AppContext';
import { useToast } from '../store/ToastContext';
import { GlassCard } from './ui/GlassCard';
import { GradientText } from './ui/Primitives';

export default function GoldenDataset() {
  const { state, addTestCase, deleteTestCase } = useApp();
  const { success } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedCase, setSelectedCase] = useState<typeof state.testCases[0] | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [tab, setTab] = useState<'cases' | 'prompts'>('cases');

  const testCases = state.testCases;
  const categories = ['all', ...new Set(testCases.map(tc => tc.category))];
  const difficulties = ['all', 'easy', 'medium', 'hard'];

  const filteredCases = testCases.filter(tc => {
    const matchesSearch = tc.input.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tc.expected.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tc.tags.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || tc.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || tc.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getDifficultyColor = (d: string) => {
    switch (d) {
      case 'easy': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'medium': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'hard': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex gap-1 bg-white/[0.03] border border-white/[0.06] rounded-lg p-0.5">
          <button onClick={() => setTab('cases')} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${tab === 'cases' ? 'bg-violet-500/15 text-violet-300' : 'text-gray-500 hover:text-gray-300'}`}>
            Test Cases ({testCases.length})
          </button>
          <button onClick={() => setTab('prompts')} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${tab === 'prompts' ? 'bg-violet-500/15 text-violet-300' : 'text-gray-500 hover:text-gray-300'}`}>
            Prompt Templates ({prompts.length})
          </button>
        </div>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-medium transition-colors shadow-lg shadow-violet-600/20">
          <Plus size={13} />
          {tab === 'cases' ? 'Add Test Case' : 'Add Prompt'}
        </button>
      </div>

      {tab === 'cases' ? (
        <>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
              <input type="text" placeholder="Search test cases, tags, expected outputs..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-violet-500/40" />
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none pl-3 pr-7 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg text-xs text-gray-300 focus:outline-none focus:border-violet-500/40">
                  {categories.map(c => <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>)}
                </select>
                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
              </div>
              <div className="relative">
                <select value={selectedDifficulty} onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="appearance-none pl-3 pr-7 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg text-xs text-gray-300 focus:outline-none focus:border-violet-500/40">
                  {difficulties.map(d => <option key={d} value={d}>{d === 'all' ? 'All Difficulties' : d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
                </select>
                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {filteredCases.map((tc) => (
              <GlassCard 
                key={tc.id} 
                onClick={() => setSelectedCase(tc)}
                tilt
                glow="violet"
                className={`p-3.5 cursor-pointer ${selectedCase?.id === tc.id ? 'border-violet-500/40 shadow-[0_0_30px_rgba(139,92,246,0.2)]' : ''}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-gray-600">{tc.id}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${getDifficultyColor(tc.difficulty)}`}>{tc.difficulty}</span>
                    {tc.critical && <Shield size={11} className="text-red-400" />}
                    {tc.weight > 2 && <Star size={11} className="text-amber-400 fill-amber-400" />}
                  </div>
                  <span className="text-[10px] text-gray-600">v{tc.version} · w:{tc.weight.toFixed(1)}</span>
                </div>
                <p className="text-xs text-gray-200 line-clamp-2 mb-2">{tc.input}</p>
                <p className="text-[10px] text-gray-500 line-clamp-1 mb-2">Expected: {tc.expected}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 flex-wrap">
                    {tc.tags.slice(0, 3).map((tag: string) => (
                      <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/[0.04] text-gray-500 border border-white/[0.06]">{tag}</span>
                    ))}
                  </div>
                  <span className="text-[10px] text-gray-600">{tc.category}</span>
                </div>
              </GlassCard>
            ))}
          </div>

          {selectedCase && (
            <GlassCard className="p-5 gradient-border animate-scale-in">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Layers size={16} className="text-violet-400" />
                  <GradientText>{selectedCase.id} · {selectedCase.category}</GradientText>
                </h3>
                <div className="flex items-center gap-1">
                  <button className="p-1.5 rounded-md hover:bg-white/[0.05] text-gray-500 hover:text-white transition-colors"><Edit3 size={13} /></button>
                  <button onClick={() => { if (selectedCase && confirm(`Delete test case ${selectedCase.id}?`)) { deleteTestCase(selectedCase.id); setSelectedCase(null); success('Test case deleted'); } }}
                    className="p-1.5 rounded-md hover:bg-white/[0.05] text-gray-500 hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-gray-500 uppercase tracking-wide">Input</label>
                  <div className="mt-1 p-2.5 bg-black/20 rounded-lg border border-white/[0.04]"><p className="text-xs text-gray-200">{selectedCase.input}</p></div>
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 uppercase tracking-wide">Expected Output</label>
                  <div className="mt-1 p-2.5 bg-black/20 rounded-lg border border-white/[0.04]"><p className="text-xs text-gray-200">{selectedCase.expected}</p></div>
                </div>
              </div>
              {selectedCase.rubric && (
                <div className="mt-3">
                  <label className="text-[10px] text-gray-500 uppercase tracking-wide">Rubric</label>
                  <div className="mt-1 p-2.5 bg-violet-500/[0.04] rounded-lg border border-violet-500/10"><p className="text-xs text-gray-300">{selectedCase.rubric}</p></div>
                </div>
              )}
              <div className="mt-3 pt-3 border-t border-white/[0.04] flex items-center gap-4 text-[10px] text-gray-500">
                <span>Author: {selectedCase.author}</span>
                <span>v{selectedCase.version}</span>
                <span>Updated: {new Date(selectedCase.updatedAt).toLocaleDateString()}</span>
                {selectedCase.source && <span>Source: {selectedCase.source}</span>}
              </div>
            </GlassCard>
          )}
        </>
      ) : (
        <div className="space-y-3">
          {prompts.map((p) => (
            <GlassCard key={p.id} className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium text-white">{p.name}</h4>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">v{p.version}</span>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-0.5">by {p.author} · Updated {new Date(p.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                <div>
                  <p className="text-[9px] text-gray-600 uppercase tracking-wide mb-1">System Prompt</p>
                  <p className="text-[11px] text-gray-300 bg-black/20 p-2 rounded border border-white/[0.04] line-clamp-2 font-mono">{p.systemPrompt}</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-600 uppercase tracking-wide mb-1">User Template</p>
                  <p className="text-[11px] text-gray-300 bg-black/20 p-2 rounded border border-white/[0.04] line-clamp-2 font-mono">{p.userTemplate}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 flex-wrap">
                {p.variables.map(v => (
                  <span key={v} className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">{`{{${v}}}`}</span>
                ))}
                <span className="text-[10px] text-gray-600 ml-auto">~{p.tokensPerCall} tokens/call</span>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="glass-strong rounded-2xl p-5 w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <h3 className="text-sm font-semibold text-white mb-4">Add New Test Case</h3>
            <form id="add-test-case-form" className="space-y-3" onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              addTestCase({
                input: formData.get('input') as string,
                expected: formData.get('expected') as string,
                rubric: formData.get('rubric') as string || undefined,
                tags: (formData.get('tags') as string || '').split(',').map(t => t.trim()).filter(Boolean),
                difficulty: (formData.get('difficulty') as 'easy' | 'medium' | 'hard') || 'medium',
                category: formData.get('category') as string || 'General',
                author: state.currentUser,
                weight: parseFloat(formData.get('weight') as string) || 1.0,
                evaluators: ['semanticSimilarity', 'llmJudge'],
                critical: formData.get('critical') === 'on',
              });
              success('Test case added successfully');
              setShowAddModal(false);
            }}>
              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-wide">Input</label>
                <textarea name="input" required className="w-full mt-1 p-2.5 bg-black/20 border border-white/[0.06] rounded-lg text-xs text-gray-200 focus:outline-none focus:border-violet-500/40" rows={3} placeholder="Enter the test input..." />
              </div>
              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-wide">Expected Output</label>
                <textarea name="expected" required className="w-full mt-1 p-2.5 bg-black/20 border border-white/[0.06] rounded-lg text-xs text-gray-200 focus:outline-none focus:border-violet-500/40" rows={2} placeholder="Describe expected behavior..." />
              </div>
              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-wide">Rubric (optional)</label>
                <textarea name="rubric" className="w-full mt-1 p-2.5 bg-black/20 border border-white/[0.06] rounded-lg text-xs text-gray-200 focus:outline-none focus:border-violet-500/40" rows={2} placeholder="Scoring rubric for LLM judge..." />
              </div>
              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-wide">Tags (comma-separated)</label>
                <input name="tags" type="text" className="w-full mt-1 p-2 bg-black/20 border border-white/[0.06] rounded-lg text-xs text-gray-200 focus:outline-none focus:border-violet-500/40" placeholder="factual, knowledge, smoke-test" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] text-gray-500 uppercase tracking-wide">Category</label>
                  <input name="category" type="text" required className="w-full mt-1 p-2 bg-black/20 border border-white/[0.06] rounded-lg text-xs text-gray-200 focus:outline-none focus:border-violet-500/40" placeholder="Knowledge" />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 uppercase tracking-wide">Difficulty</label>
                  <select name="difficulty" className="w-full mt-1 p-2 bg-black/20 border border-white/[0.06] rounded-lg text-xs text-gray-200 focus:outline-none focus:border-violet-500/40">
                    <option value="easy">easy</option><option value="medium">medium</option><option value="hard">hard</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 uppercase tracking-wide">Weight</label>
                  <input name="weight" type="number" step="0.5" min="1" max="3" defaultValue="1" className="w-full mt-1 p-2 bg-black/20 border border-white/[0.06] rounded-lg text-xs text-gray-200 focus:outline-none focus:border-violet-500/40" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" name="critical" id="critical" className="rounded border-white/[0.1] bg-black/20" />
                <label htmlFor="critical" className="text-xs text-gray-300">Critical (failure blocks promotion)</label>
              </div>
              <div className="flex justify-end gap-2 mt-5">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-3 py-1.5 text-xs text-gray-400 hover:text-white transition-colors">Cancel</button>
                <button type="submit" className="px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-medium transition-colors">Add Test Case</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
