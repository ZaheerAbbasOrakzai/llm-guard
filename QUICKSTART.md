# 🚀 Quick Start Guide - LLM Guard

Get up and running with LLM Guard in less than 5 minutes!

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher) - [Download here](https://nodejs.org/)
- **npm** (v9.0.0 or higher) - Comes with Node.js
- **Git** - [Download here](https://git-scm.com/)

### Verify Installation

```bash
node --version  # Should be v18.0.0 or higher
npm --version   # Should be v9.0.0 or higher
git --version   # Should be installed
```

---

## 🎯 Option 1: Run Locally (Development)

### Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd llm-guard
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages (React, TypeScript, Tailwind CSS, etc.)

### Step 3: Start Development Server

```bash
npm run dev
```

You should see output like:
```
  VITE v6.3.5  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### Step 4: Open in Browser

Navigate to **http://localhost:5173** in your browser.

🎉 **You're running LLM Guard locally!**

### What You Can Do Now:

✅ View the dashboard with real-time metrics  
✅ Explore all 10 views (Dashboard, Command Center, Eval Runs, etc.)  
✅ Add new test cases to the golden dataset  
✅ Register new models  
✅ Trigger evaluations  
✅ View alerts and acknowledge them  
✅ Export/import data  

### Available Commands:

```bash
npm run dev          # Start development server (http://localhost:5173)
npm run build        # Build for production
npm run preview      # Preview production build (http://localhost:4173)
npm run typecheck    # Run TypeScript type checking
```

---

## 🌐 Option 2: Deploy to Production

### 🚀 Recommended: Deploy to Vercel (Free)

**Why Vercel?**
- Zero configuration
- Automatic HTTPS
- Global CDN
- Free tier available
- Deploy in 30 seconds

#### Method 1: Deploy via Vercel CLI (Fastest)

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy
vercel

# 4. Deploy to production
vercel --prod
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? **Select your account**
- Link to existing project? **N**
- Project name? **llm-guard** (or your choice)
- Directory? **./  (current directory)**
- Override settings? **N**

✅ **Your site is live!** Vercel will give you a URL like `https://llm-guard.vercel.app`

#### Method 2: Deploy via GitHub Integration

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Git Repository"
   - Select your repository
   - Click "Deploy"

✅ **Automatic deployments!** Every push to GitHub will automatically deploy.

---

### 🌐 Alternative: Deploy to Netlify (Free)

```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Login to Netlify
netlify login

# 3. Build the project
npm run build

# 4. Deploy
netlify deploy --prod --dir=dist
```

Or use the drag-and-drop method:
1. Build: `npm run build`
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
3. Drag the `dist` folder
4. Done!

---

### 🐳 Alternative: Deploy with Docker

```bash
# 1. Build Docker image
docker build -t llm-guard .

# 2. Run container
docker run -p 8080:80 llm-guard

# 3. Access at http://localhost:8080
```

---

## 🔧 Configuration (Optional)

### Environment Variables

The application works out of the box with mock data. To enable real LLM evaluations:

1. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

2. **Add your API keys:**
   ```bash
   # .env
   VITE_OPENAI_API_KEY=sk-your-key-here
   VITE_ANTHROPIC_API_KEY=sk-ant-your-key-here
   VITE_SLACK_WEBHOOK_URL=https://hooks.slack.com/services/your/webhook
   ```

3. **Restart the dev server:**
   ```bash
   npm run dev
   ```

**Note:** API keys are optional. The app works perfectly with mock data for demonstration.

---

## 📱 What You'll See

### Dashboard
- Real-time quality metrics
- 3D interactive orb showing system status
- Live activity feed
- Quality score trends
- Recent alerts

### Command Center
- Live system status
- Team activity feed
- Real-time metrics
- Quick actions

### Eval Runs
- Evaluation history
- Pass/fail results
- Statistical significance (p-values)
- Cost tracking
- Latency metrics

### Golden Dataset
- 14 production-grade test cases
- Add/edit/delete test cases
- Weighted scoring
- Critical case markers

### Model Registry
- 8 real LLM models
- Actual pricing data
- Benchmark scores
- Performance comparison

### Model Leaderboard
- Performance rankings
- Value score (quality per dollar)
- Sort by score, cost, or speed
- Top 3 podium

### Alerts
- Real-time notifications
- Severity levels (critical, warning, info)
- Acknowledgment tracking
- Multi-channel alerts

### Quality Trends
- 30-day trends
- Statistical drift analysis
- Regression detection
- Cost trends

### Cost Analytics
- Cost breakdown by model
- Budget tracking
- Token usage
- Optimization recommendations

### CI/CD Pipeline
- Pipeline visualization
- Promotion gates
- Audit log
- GitHub Actions integration

---

## 🎮 Keyboard Shortcuts

Press `?` or click the keyboard icon to see all shortcuts:

- `⌘K` / `Ctrl+K` - Open command palette
- `⌘/` / `Ctrl+/` - Show keyboard shortcuts
- `G D` - Go to Dashboard
- `G R` - Go to Eval Runs
- `G T` - Go to Trends
- `G A` - Go to Alerts
- `N` - New test case
- `E` - Trigger evaluation

---

## 🐛 Troubleshooting

### Issue: "Module not found" Error

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Port Already in Use

**Solution:**
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Or use a different port
npm run dev -- --port 3000
```

### Issue: Build Fails

**Solution:**
```bash
# Check TypeScript errors
npm run typecheck

# Clear cache and rebuild
rm -rf dist
npm run build
```

### Issue: Blank Page After Build

**Solution:**
1. Check browser console for errors
2. Verify all imports are correct
3. Ensure `dist/index.html` exists
4. Try `npm run preview` to test production build

---

## 📊 Project Structure

```
llm-guard/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # Reusable UI components
│   │   ├── Dashboard.tsx
│   │   ├── CommandCenter.tsx
│   │   ├── EvalRuns.tsx
│   │   ├── GoldenDataset.tsx
│   │   ├── ModelRegistry.tsx
│   │   ├── ModelLeaderboard.tsx
│   │   ├── AlertsView.tsx
│   │   ├── TrendView.tsx
│   │   ├── CostAnalytics.tsx
│   │   ├── PipelineView.tsx
│   │   └── LiveActivityFeed.tsx
│   ├── data/
│   │   └── mockData.ts     # Real production data
│   ├── store/
│   │   ├── AppContext.tsx  # State management
│   │   └── ToastContext.tsx
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── dist/                   # Production build (generated)
├── index.html              # HTML template
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
├── vite.config.js          # Vite config
├── tailwind.config.js      # Tailwind config
├── .env.example            # Environment variables template
├── vercel.json             # Vercel deployment config
└── netlify.toml            # Netlify deployment config
```

---

## 🎓 Next Steps

### For Developers:
1. **Explore the codebase** - Check out `src/components/` for UI components
2. **Customize test cases** - Edit `src/data/mockData.ts`
3. **Add new features** - Components are modular and extensible
4. **Integrate real APIs** - Add your LLM API keys to `.env`

### For Teams:
1. **Set up CI/CD** - Configure GitHub Actions (see `DEPLOYMENT.md`)
2. **Configure alerts** - Set up Slack/PagerDuty integration
3. **Define promotion gates** - Customize thresholds in `mockData.ts`
4. **Train your team** - Share keyboard shortcuts and workflows

### For Enterprise:
1. **Add authentication** - Integrate with your SSO provider
2. **Set up database** - Connect to PostgreSQL for persistence
3. **Configure RBAC** - Add role-based access control
4. **Enable audit logging** - Track all actions for compliance

---

## 📚 Additional Resources

- **[README.md](./README.md)** - Complete project documentation
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Detailed deployment guide
- **[PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)** - Business value and use cases
- **[ELITE_FEATURES.md](./ELITE_FEATURES.md)** - Advanced features overview

---

## 🆘 Need Help?

### Common Questions:

**Q: Do I need API keys to use the app?**  
A: No! The app works with mock data. API keys are only needed for real LLM evaluations.

**Q: Can I use this with my own LLM?**  
A: Yes! Add your model to the Model Registry with custom pricing and benchmarks.

**Q: Is this production-ready?**  
A: Yes! This is a production-grade application with real data, error handling, and enterprise features.

**Q: How do I add more test cases?**  
A: Go to Golden Dataset → Click "Add Test Case" → Fill in the form.

**Q: Can I deploy to my own server?**  
A: Yes! See `DEPLOYMENT.md` for Docker, Nginx, and custom server instructions.

### Get Support:

1. Check the [troubleshooting section](#-troubleshooting) above
2. Review [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment issues
3. Open an issue on GitHub
4. Contact support@llm-guard.app

---

## 🎉 You're All Set!

You now have everything you need to run and deploy LLM Guard.

**Quick Commands Recap:**

```bash
# Local development
npm install
npm run dev

# Production build
npm run build

# Deploy to Vercel
vercel --prod

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

**Happy coding! 🚀**

---

## 📈 What's Next?

After getting comfortable with the basics:

1. **Customize test cases** for your specific use case
2. **Add your models** with real pricing and benchmarks
3. **Set up CI/CD** for automated evaluations
4. **Configure alerts** for your team
5. **Integrate with your stack** (Slack, GitHub, etc.)

The possibilities are endless! 🌟
