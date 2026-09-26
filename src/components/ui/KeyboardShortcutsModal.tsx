import { useState, useEffect } from 'react';
import { Keyboard, X } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible && !isOpen) return null;

  const shortcuts = [
    { category: 'Navigation', items: [
      { keys: ['⌘', 'K'], description: 'Open command palette' },
      { keys: ['G', 'D'], description: 'Go to Dashboard' },
      { keys: ['G', 'R'], description: 'Go to Eval Runs' },
      { keys: ['G', 'T'], description: 'Go to Trends' },
      { keys: ['G', 'A'], description: 'Go to Alerts' },
      { keys: ['G', 'M'], description: 'Go to Models' },
      { keys: ['G', 'P'], description: 'Go to Pipeline' },
    ]},
    { category: 'Actions', items: [
      { keys: ['N'], description: 'New test case' },
      { keys: ['E'], description: 'Trigger evaluation' },
      { keys: ['⌘', 'E'], description: 'Export data' },
      { keys: ['⌘', 'I'], description: 'Import data' },
      { keys: ['⌘', 'S'], description: 'Save changes' },
    ]},
    { category: 'View', items: [
      { keys: ['⌘', 'B'], description: 'Toggle sidebar' },
      { keys: ['⌘', 'F'], description: 'Search' },
      { keys: ['⌘', '/'], description: 'Show shortcuts' },
      { keys: ['ESC'], description: 'Close modal' },
    ]},
    { category: 'Alerts', items: [
      { keys: ['A', 'A'], description: 'Acknowledge all alerts' },
      { keys: ['A', 'N'], description: 'Go to next alert' },
      { keys: ['A', 'P'], description: 'Go to previous alert' },
    ]},
  ];

  return (
    <div 
      className={`fixed inset-0 z-[200] flex items-center justify-center p-4 transition-all duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
      
      <div 
        className={`relative glass-strong rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto transition-all duration-300 ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/20">
              <Keyboard size={20} className="text-violet-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Keyboard Shortcuts</h2>
              <p className="text-xs text-gray-400">Master LLM Guard with these shortcuts</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/[0.05] text-gray-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-6">
          {shortcuts.map((section) => (
            <div key={section.category}>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                {section.category}
              </h3>
              <div className="space-y-2">
                {section.items.map((shortcut, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-all"
                  >
                    <span className="text-sm text-gray-300">{shortcut.description}</span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, keyIdx) => (
                        <span key={keyIdx} className="flex items-center gap-1">
                          <kbd className="px-2 py-1 rounded-lg bg-white/[0.05] border border-white/[0.1] text-xs font-mono text-gray-300 min-w-[28px] text-center">
                            {key}
                          </kbd>
                          {keyIdx < shortcut.keys.length - 1 && (
                            <span className="text-gray-600 text-xs">+</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-white/[0.06]">
          <p className="text-xs text-gray-500 text-center">
            Press <kbd className="px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/[0.1] text-gray-300 font-mono">⌘</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/[0.1] text-gray-300 font-mono">/</kbd> to toggle this help
          </p>
        </div>
      </div>
    </div>
  );
}
