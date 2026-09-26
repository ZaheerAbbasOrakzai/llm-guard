import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import { 
  testCases as initialTestCases, 
  models as initialModels, 
  prompts as initialPrompts,
  evalRuns as initialRuns,
  alerts as initialAlerts,
  trendData as initialTrends,
  type TestCase,
  type ModelConfig,
  type PromptTemplate,
  type EvalRun,
  type Alert,
  type TrendPoint
} from '../data/mockData';

interface AppState {
  testCases: TestCase[];
  models: ModelConfig[];
  prompts: PromptTemplate[];
  evalRuns: EvalRun[];
  alerts: Alert[];
  trendData: TrendPoint[];
  currentUser: string;
  lastUpdated: string;
}

type Action =
  | { type: 'ADD_TEST_CASE'; payload: TestCase }
  | { type: 'UPDATE_TEST_CASE'; payload: TestCase }
  | { type: 'DELETE_TEST_CASE'; payload: string }
  | { type: 'ADD_MODEL'; payload: ModelConfig }
  | { type: 'ADD_PROMPT'; payload: PromptTemplate }
  | { type: 'ADD_EVAL_RUN'; payload: EvalRun }
  | { type: 'ACKNOWLEDGE_ALERT'; payload: { id: string; user: string } }
  | { type: 'IMPORT_DATA'; payload: Partial<AppState> }
  | { type: 'SET_USER'; payload: string };

const initialState: AppState = {
  testCases: initialTestCases,
  models: initialModels,
  prompts: initialPrompts,
  evalRuns: initialRuns,
  alerts: initialAlerts,
  trendData: initialTrends,
  currentUser: 'sarah.chen',
  lastUpdated: new Date().toISOString(),
};

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ADD_TEST_CASE':
      return { ...state, testCases: [...state.testCases, action.payload], lastUpdated: new Date().toISOString() };
    case 'UPDATE_TEST_CASE':
      return { ...state, testCases: state.testCases.map(tc => tc.id === action.payload.id ? action.payload : tc), lastUpdated: new Date().toISOString() };
    case 'DELETE_TEST_CASE':
      return { ...state, testCases: state.testCases.filter(tc => tc.id !== action.payload), lastUpdated: new Date().toISOString() };
    case 'ADD_MODEL':
      return { ...state, models: [...state.models, action.payload], lastUpdated: new Date().toISOString() };
    case 'ADD_PROMPT':
      return { ...state, prompts: [...state.prompts, action.payload], lastUpdated: new Date().toISOString() };
    case 'ADD_EVAL_RUN':
      return { ...state, evalRuns: [action.payload, ...state.evalRuns], lastUpdated: new Date().toISOString() };
    case 'ACKNOWLEDGE_ALERT':
      return {
        ...state,
        alerts: state.alerts.map(a => a.id === action.payload.id ? { ...a, acknowledged: true, acknowledgedBy: action.payload.user, acknowledgedAt: new Date().toISOString() } : a),
        lastUpdated: new Date().toISOString(),
      };
    case 'IMPORT_DATA':
      return { ...state, ...action.payload, lastUpdated: new Date().toISOString() };
    case 'SET_USER':
      return { ...state, currentUser: action.payload };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  addTestCase: (tc: Omit<TestCase, 'id' | 'version' | 'createdAt' | 'updatedAt'>) => void;
  updateTestCase: (tc: TestCase) => void;
  deleteTestCase: (id: string) => void;
  addModel: (model: Omit<ModelConfig, 'id' | 'registeredAt'>) => void;
  addPrompt: (prompt: Omit<PromptTemplate, 'id' | 'createdAt' | 'updatedAt'>) => void;
  acknowledgeAlert: (id: string) => void;
  triggerEvaluation: (modelId: string, promptId: string) => Promise<EvalRun>;
  exportData: () => string;
  importData: (json: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState, (initial) => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('llm-guard-state');
      if (saved) {
        try {
          return { ...initial, ...JSON.parse(saved) };
        } catch (e) {
          console.error('Failed to load state from localStorage:', e);
        }
      }
    }
    return initial;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('llm-guard-state', JSON.stringify(state));
    }
  }, [state]);

  const addTestCase = (tc: Omit<TestCase, 'id' | 'version' | 'createdAt' | 'updatedAt'>) => {
    const newTestCase: TestCase = {
      ...tc,
      id: `tc-${String(state.testCases.length + 1).padStart(3, '0')}`,
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_TEST_CASE', payload: newTestCase });
  };

  const updateTestCase = (tc: TestCase) => {
    dispatch({ type: 'UPDATE_TEST_CASE', payload: { ...tc, updatedAt: new Date().toISOString() } });
  };

  const deleteTestCase = (id: string) => {
    dispatch({ type: 'DELETE_TEST_CASE', payload: id });
  };

  const addModel = (model: Omit<ModelConfig, 'id' | 'registeredAt'>) => {
    const newModel: ModelConfig = {
      ...model,
      id: `mdl-${model.provider}-${model.model.replace(/\./g, '-')}-${Date.now()}`,
      registeredAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_MODEL', payload: newModel });
  };

  const addPrompt = (prompt: Omit<PromptTemplate, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPrompt: PromptTemplate = {
      ...prompt,
      id: `prm-${prompt.name}-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_PROMPT', payload: newPrompt });
  };

  const acknowledgeAlert = (id: string) => {
    dispatch({ type: 'ACKNOWLEDGE_ALERT', payload: { id, user: state.currentUser } });
  };

  const triggerEvaluation = async (modelId: string, promptId: string): Promise<EvalRun> => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    const model = state.models.find(m => m.id === modelId);
    const prompt = state.prompts.find(p => p.id === promptId);
    if (!model || !prompt) throw new Error('Model or prompt not found');

    const totalCases = state.testCases.length;
    const passRate = 0.85 + Math.random() * 0.15;
    const passedCases = Math.floor(totalCases * passRate);
    const failedCases = totalCases - passedCases;
    const overallScore = 85 + Math.random() * 15;
    const totalInputTokens = 128400;
    const totalOutputTokens = 35000 + Math.floor(Math.random() * 10000);
    const totalCostUsd = (totalInputTokens / 1_000_000) * model.costPer1MInput + (totalOutputTokens / 1_000_000) * model.costPer1MOutput;

    const newRun: EvalRun = {
      id: `run-${String(state.evalRuns.length + 1000).padStart(4, '0')}`,
      commitSha: Math.random().toString(36).substring(7, 14),
      branch: 'main',
      modelConfigId: modelId,
      modelLabel: model.model,
      promptId: promptId,
      promptVersion: prompt.version,
      timestamp: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      overallScore: +overallScore.toFixed(1),
      weightedScore: +(overallScore * 0.98).toFixed(1),
      status: overallScore >= 90 ? 'pass' : 'fail',
      totalCases,
      passedCases,
      failedCases,
      skippedCases: 0,
      duration: 120 + Math.floor(Math.random() * 60),
      totalInputTokens,
      totalOutputTokens,
      totalCostUsd: +totalCostUsd.toFixed(3),
      p50Latency: 1800 + Math.floor(Math.random() * 400),
      p95Latency: 2400 + Math.floor(Math.random() * 600),
      p99Latency: 3000 + Math.floor(Math.random() * 800),
      environment: 'staging',
      triggeredBy: state.currentUser,
      triggerType: 'manual',
      tags: ['manual-trigger'],
    };

    dispatch({ type: 'ADD_EVAL_RUN', payload: newRun });

    if (newRun.status === 'fail') {
      const alert: Alert = {
        id: `alert-${Date.now()}`,
        type: 'regression',
        severity: 'critical',
        title: `Evaluation failed: ${newRun.overallScore}%`,
        message: `Overall score ${newRun.overallScore}% is below threshold. ${failedCases} test cases failed.`,
        timestamp: new Date().toISOString(),
        runId: newRun.id,
        channel: 'slack',
        acknowledged: false,
        escalationLevel: 1,
        relatedEntities: { model: model.model, prompt: `${prompt.name}:${prompt.version}`, environment: 'staging' },
      };
      dispatch({ type: 'IMPORT_DATA', payload: { alerts: [alert, ...state.alerts] } });
    }

    return newRun;
  };

  const exportData = () => JSON.stringify(state, null, 2);

  const importData = (json: string) => {
    try {
      const data = JSON.parse(json);
      dispatch({ type: 'IMPORT_DATA', payload: data });
    } catch (e) {
      throw new Error('Invalid JSON format');
    }
  };

  return (
    <AppContext.Provider value={{ state, dispatch, addTestCase, updateTestCase, deleteTestCase, addModel, addPrompt, acknowledgeAlert, triggerEvaluation, exportData, importData }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
