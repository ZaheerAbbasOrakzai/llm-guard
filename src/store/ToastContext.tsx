import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const newToast = { ...toast, id };
    setToasts(prev => [...prev, newToast]);
    const duration = toast.duration || 4000;
    setTimeout(() => removeToast(id), duration);
  }, [removeToast]);

  const success = (title: string, message?: string) => addToast({ type: 'success', title, message });
  const error = (title: string, message?: string) => addToast({ type: 'error', title, message, duration: 6000 });
  const warning = (title: string, message?: string) => addToast({ type: 'warning', title, message });
  const info = (title: string, message?: string) => addToast({ type: 'info', title, message });

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, warning, info }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[200] flex flex-col gap-2 max-w-sm">
        {toasts.map((toast) => (
          <div key={toast.id} className="glass-strong rounded-xl p-3 shadow-2xl animate-fade-in-up">
            <div className="flex items-start gap-2 relative">
              {toast.type === 'success' && <CheckCircle2 size={16} className="text-emerald-400 mt-0.5" />}
              {toast.type === 'error' && <XCircle size={16} className="text-red-400 mt-0.5" />}
              {toast.type === 'warning' && <AlertTriangle size={16} className="text-amber-400 mt-0.5" />}
              {toast.type === 'info' && <Info size={16} className="text-blue-400 mt-0.5" />}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white">{toast.title}</p>
                {toast.message && <p className="text-[11px] text-gray-400 mt-0.5">{toast.message}</p>}
              </div>
              <button onClick={() => removeToast(toast.id)} className="shrink-0 p-0.5 hover:bg-white/[0.05] rounded text-gray-500 hover:text-gray-300 transition-colors">
                <X size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}
