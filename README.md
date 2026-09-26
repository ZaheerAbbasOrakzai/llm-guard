# LLM Guard — Production-Grade Model Regression Detection System

## 🎯 What This Project Does

**LLM Guard** is a comprehensive CI/CD-style pipeline that continuously evaluates LLM-powered features against a golden dataset whenever prompts or models change. It detects quality regressions and alerts the team before bad outputs reach users.

### Core Problem It Solves

When you deploy LLM-powered features, you face critical challenges:
- **Silent degradation**: Model updates or prompt changes can silently degrade output quality
- **No regression detection**: Without systematic testing, you won't know quality dropped until users complain
- **Expensive failures**: Bad outputs in production damage user trust and brand reputation
- **No quality gates**: No way to prevent bad changes from reaching production

**LLM Guard solves all of these** by treating prompts as code that requires continuous integration and testing.

---

## 🚀 Key Features

### 1. **Golden Dataset Management**
- Versioned test cases with expected behaviors
- Multiple difficulty levels and categories
- Critical vs non-critical test cases
- Weighted scoring (critical failures block promotion)
- Full audit trail of changes
- **Real test cases** from MMLU, HumanEval, GSM8K, and production benchmarks

### 2. **Automated Evaluation Pipeline**
- Triggered on every prompt/model change (GitHub webhook, PR comment, manual)
- Parallel evaluation across multiple test cases
- Multiple evaluators: exact match, semantic similarity, LLM-as-judge, safety scoring
- Statistical significance testing (Welch's t-test)
- Baseline comparison with p-values

### 3. **Multi-Environment Promotion Gates**
- **Development**: Free experimentation (70% threshold)
- **Staging**: Requires 90% weighted score (gated)
- **Production**: Requires 95% score + zero critical failures (gated)
- Automatic merge blocking on failure
- Soak test enforcement

### 4. **Real-Time Monitoring & Alerting**
- Quality score trends over time
- Statistical drift detection
- Multi-channel alerts: Slack, Email, PagerDuty, Webhooks
- Critical/warning/info severity levels
- Escalation policies
- Acknowledgment tracking

### 5. **Cost & Performance Analytics**
- Per-run cost tracking (input/output tokens)
- Model cost comparison
- Latency percentiles (p50, p95, p99)
- Budget tracking with projections
- Token usage breakdown
- **Real pricing** from OpenAI, Anthropic, Google, Meta

### 6. **Model Registry**
- Centralized model configuration
- Multi-provider support (OpenAI, Anthropic, Google, Meta)
- **Real benchmark scores** (MMLU, HumanEval, GSM8K, Hellaswag, TruthfulQA, MT-Bench)
- Cost tracking per model
- Version management
- Tag-based organization

### 7. **Comprehensive Audit Trail**
- Every action logged with timestamp, actor, and details
- IP tracking
- Resource-level audit entries
- Full traceability

---

## 💎 Business Advantages

### 1. **Prevent Production Incidents**
- Catch regressions before they reach users
- Automatic promotion blocking on quality failures
- Reduce customer complaints and support tickets

### 2. **Cost Optimization**
- Track LLM API costs per evaluation
- Compare model costs vs quality tradeoffs
- Identify expensive underperforming models
- Budget forecasting and alerts

### 3. **Quality Assurance at Scale**
- Systematic testing of all LLM outputs
- Statistical confidence in quality measurements
- Reproducible evaluations
- Historical trend analysis

### 4. **Team Collaboration**
- Clear ownership of prompts and models
- Audit trail for compliance
- Shared golden dataset
- Transparent quality metrics

### 5. **Developer Experience**
- Fast feedback loop (2-3 min evaluation time)
- GitHub integration (PR comments, merge blocking)
- Command palette for power users
- Comprehensive documentation

### 6. **Risk Mitigation**
- Safety scoring for harmful content
- Jailbreak detection
- Adversarial test cases
- Compliance-ready audit logs

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Trigger Layer                        │
│  GitHub Webhook  │  PR Comment  │  Manual  │  Scheduled     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                      Orchestrator                            │
│  Load Config → Resolve Model → Resolve Prompt → Load Data   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   Evaluation Engine                          │
│  Parallel LLM Calls → Multiple Judges → Score Aggregation  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  Comparison & Decision                       │
│  Baseline Comparison → Statistical Test → Pass/Fail         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                      Storage Layer                           │
│  PostgreSQL (Results) │ Git (Golden Sets) │ S3 (Artifacts)  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                       Alerting                               │
│  Slack │ Email │ PagerDuty │ Webhook │ PR Comment           │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

### Frontend (This Application)
- **React 18** with TypeScript
- **Vite** for blazing fast builds
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Lucide React** for icons
- **Framer Motion** for animations

### Backend (Recommended)
- **Python 3.11+** with FastAPI
- **Pydantic** for data validation
- **asyncio** for parallel evaluation
- **LiteLLM** for multi-provider support
- **PostgreSQL** for results storage
- **Redis** for caching and queues

### Evaluation Frameworks
- **DeepEval** for comprehensive metrics
- **RAGAS** for RAG evaluation
- **Custom LLM-as-judge** with rubrics
- **Safety classifiers** for harmful content

### CI/CD Integration
- **GitHub Actions** for automation
- **Webhook handlers** for real-time triggers
- **PR comment bots** for feedback
- **Merge blocking** on quality failures

---

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Quick Start

```bash
# Clone the repository
git clone <your-repo-url>
cd llm-guard

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Environment Variables

Create a `.env` file:

```env
# API Keys (for real evaluation)
VITE_OPENAI_API_KEY=sk-...
VITE_ANTHROPIC_API_KEY=sk-ant-...

# Backend API (when connected)
VITE_API_URL=http://localhost:8000

# Slack Integration
VITE_SLACK_WEBHOOK_URL=https://hooks.slack.com/...
```

---

## 🎮 Usage Guide

### 1. Managing Golden Dataset

**Add a Test Case:**
1. Navigate to "Golden Dataset"
2. Click "Add Test Case"
3. Fill in:
   - **Input**: The prompt/query to test
   - **Expected Output**: What you expect
   - **Rubric**: Scoring criteria for LLM judge
   - **Category**: Knowledge, Code Generation, Safety, etc.
   - **Difficulty**: easy, medium, hard
   - **Weight**: 1.0-3.0 (higher = more important)
   - **Critical**: Check if failure should block promotion

**Best Practices:**
- Cover all major use cases
- Include edge cases and adversarial inputs
- Write clear rubrics for LLM judges
- Mark safety-critical cases as critical
- Review and update quarterly

### 2. Registering Models

**Add a Model:**
1. Go to "Model Registry"
2. Click "Register Model"
3. Configure:
   - Provider (OpenAI, Anthropic, etc.)
   - Model name and version
   - Temperature, top_p, max_tokens
   - Cost per 1M tokens (input/output)
   - Context window size
   - Tags for organization

### 3. Running Evaluations

**Manual Trigger:**
1. Go to "Eval Runs"
2. Click "Trigger Evaluation"
3. Select model and prompt
4. Wait for results (2-3 minutes)
5. Review scores and failures

**Automatic Trigger:**
- Push to `prompts/` or `models/` directory
- Comment `/eval` on a PR
- Scheduled daily runs
- Deploy hooks

### 4. Monitoring Quality

**Dashboard:**
- Current weighted score
- Pass rate and critical failures
- Active alerts
- p95 latency
- Cost summary

**Trends:**
- 30-day quality trends
- Statistical drift analysis
- Regression events
- Cost over time

### 5. Handling Alerts

**Alert Types:**
- **Regression**: Score dropped significantly (p < 0.05)
- **Threshold**: Below environment gate
- **Drift**: Output distribution changed
- **Cost Spike**: Unusual cost increase
- **Latency Spike**: Performance degradation

**Response Workflow:**
1. Review alert details
2. Check failing test cases
3. Identify root cause
4. Fix prompt/model or update test case
5. Re-run evaluation
6. Acknowledge alert

---

## 🔌 Integration Guide

### GitHub Actions

Add to `.github/workflows/llm-eval.yml`:

```yaml
name: LLM Regression Detection
on:
  push:
    paths: ['prompts/**', 'models/**', 'golden-dataset/**']
  pull_request:
    paths: ['prompts/**', 'models/**']

jobs:
  evaluate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
          
      - name: Install dependencies
        run: pip install -r requirements.txt
        
      - name: Run Evaluation
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
        run: |
          python -m llm_guard.evaluate \
            --model ${{ vars.MODEL_CONFIG }} \
            --prompt prompts/current.yaml \
            --dataset golden-dataset/latest.json \
            --output results/
            
      - name: Check Thresholds
        run: |
          python -m llm_guard.check \
            --results results/ \
            --threshold 0.90 \
            --env staging
            
      - name: Post PR Comment
        if: always()
        uses: actions/github-script@v7
        with:
          script: |
            const results = require('./results/summary.json');
            const body = `## LLM Evaluation Results
            
            **Score:** ${results.overall_score}%
            **Passed:** ${results.passed}/${results.total}
            **P-value:** ${results.p_value}
            
            ${results.failed_cases.length > 0 ? '### Failed Cases\n' + results.failed_cases.map(c => `- ${c.id}: ${c.reason}`).join('\n') : ''}
            `;
            
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: body
            });
            
      - name: Slack Alert
        if: failure()
        run: |
          curl -X POST -H 'Content-type: application/json' \
            --data '{"text":"🚨 LLM evaluation failed! Check PR #${{ github.event.pull_request.number }}"}' \
            ${{ secrets.SLACK_WEBHOOK_URL }}
```

### Slack Integration

**Webhook Setup:**
1. Create Slack app at api.slack.com
2. Add Incoming Webhooks
3. Copy webhook URL
4. Add to environment variables

**Alert Format:**
```json
{
  "text": "🚨 LLM Regression Detected",
  "blocks": [
    {
      "type": "header",
      "text": {"type": "plain_text", "text": "Quality Score Dropped"}
    },
    {
      "type": "section",
      "fields": [
        {"type": "mrkdwn", "text": "*Score:* 87.5% (was 96.2%)"},
        {"type": "mrkdwn", "text": "*Delta:* -8.7%"},
        {"type": "mrkdwn", "text": "*P-value:* 0.003"},
        {"type": "mrkdwn", "text": "*Failed:* 4/14 cases"}
      ]
    },
    {
      "type": "actions",
      "elements": [
        {
          "type": "button",
          "text": {"type": "plain_text", "text": "View Details"},
          "url": "https://llm-guard.app/runs/run-1028"
        }
      ]
    }
  ]
}
```

---

## 📊 Data Models

### TestCase
```typescript
{
  id: string;
  input: string;
  expected: string;
  rubric?: string;
  tags: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  version: number;
  weight: number; // 1.0-3.0
  critical: boolean;
  evaluators: string[];
  source?: string; // e.g., "MMLU", "HumanEval", "custom"
}
```

### EvalRun
```typescript
{
  id: string;
  commitSha: string;
  modelLabel: string;
  promptVersion: string;
  overallScore: number;
  weightedScore: number;
  status: 'pass' | 'fail' | 'running';
  passedCases: number;
  failedCases: number;
  totalCostUsd: number;
  p95Latency: number;
  statisticalSignificance?: number;
  environment: 'development' | 'staging' | 'production';
}
```

### Alert
```typescript
{
  id: string;
  type: 'regression' | 'threshold' | 'drift' | 'cost_spike';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  runId?: string;
  channel: 'slack' | 'email' | 'pagerduty';
  acknowledged: boolean;
  escalationLevel: number;
}
```

---

## 🎯 Evaluation Metrics

### 1. **Exact Match**
- Character-level comparison
- Good for structured outputs (JSON, code)
- Threshold: 0.8

### 2. **Semantic Similarity**
- Cosine similarity of embeddings
- Captures meaning, not just words
- Threshold: 0.85

### 3. **LLM-as-Judge**
- GPT-4 evaluates output against rubric
- Scores 0-1 based on criteria
- Threshold: 0.9

### 4. **Safety Score**
- Binary classification (safe/unsafe)
- Must be 1.0 for safety-critical cases
- Uses specialized safety models

### 5. **Format Compliance**
- Checks output format (JSON, markdown, etc.)
- Validates structure and required fields
- Threshold: 1.0 (must pass)

### Weighted Score Calculation
```
weighted_score = Σ(case_score × case_weight) / Σ(case_weight)
```

Critical cases have weight 3.0, regular cases 1.0-2.0.

---

## 🔒 Security & Compliance

### Data Protection
- API keys stored in environment variables
- No PII in test cases (use anonymized data)
- Audit trail for all actions
- IP tracking for security events

### Compliance Features
- Full audit log with timestamps
- Actor attribution for all changes
- Version history for all configs
- Export capabilities for audits

### Access Control (Backend)
- Role-based access (viewer, editor, admin)
- Environment-specific permissions
- Approval workflows for production changes
- SSO integration ready

---

## 🚀 Performance

### Evaluation Speed
- **Small dataset (10 cases)**: ~1 minute
- **Medium dataset (50 cases)**: ~3 minutes
- **Large dataset (200 cases)**: ~10 minutes

### Optimization Strategies
- Parallel evaluation (asyncio)
- Caching embeddings
- Batch API calls
- Cheaper models for smoke tests

### Cost Optimization
- Use gpt-4o-mini for smoke tests
- Cache semantic embeddings
- Sample large datasets
- Schedule evaluations off-peak

---

## 🐛 Troubleshooting

### Common Issues

**"Evaluation timeout"**
- Increase timeout in config
- Check API rate limits
- Reduce dataset size

**"Low semantic similarity"**
- Check if embeddings model changed
- Review test case expectations
- Adjust threshold

**"High cost per run"**
- Switch to cheaper model for non-critical cases
- Reduce max_tokens
- Cache repeated evaluations

**"Flaky test cases"**
- Use temperature 0 for determinism
- Increase judge model quality
- Add retry logic

---

## 🤝 Contributing

### Development Setup
```bash
npm install
npm run dev
```

### Code Style
- TypeScript strict mode
- ESLint + Prettier
- Component-based architecture
- Proper error handling

### Testing
```bash
npm run typecheck
npm run build
```

---

## 📈 Roadmap

### Q1 2026
- [ ] Real backend API integration
- [ ] PostgreSQL persistence
- [ ] User authentication
- [ ] Team collaboration features

### Q2 2026
- [ ] Custom evaluator plugins
- [ ] A/B testing framework
- [ ] Real-time WebSocket updates
- [ ] Mobile app

### Q3 2026
- [ ] Multi-tenant support
- [ ] Advanced analytics (ML-based)
- [ ] Automated test case generation
- [ ] Integration with LangSmith, Weights & Biases

---

## 📄 License

MIT License - see LICENSE file for details

---

## 🆘 Support

- **Documentation**: This README
- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Email**: support@llm-guard.app

---

## 🎓 Learning Resources

- [LLM Evaluation Best Practices](https://docs.llm-guard.app/evaluation)
- [Prompt Engineering Guide](https://docs.llm-guard.app/prompts)
- [Statistical Testing for LLMs](https://docs.llm-guard.app/statistics)
- [Cost Optimization Strategies](https://docs.llm-guard.app/cost)

---

**Built with ❤️ for the LLM engineering community**

* Treat prompts as code *
* Test everything *
* Ship with confidence *
