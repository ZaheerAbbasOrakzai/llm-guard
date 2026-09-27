# 🚀 Complete Deployment Guide - LLM Guard

## 📋 Table of Contents
1. [Local Development Setup](#local-development-setup)
2. [Production Build](#production-build)
3. [Deployment Options](#deployment-options)
   - [Vercel (Recommended)](#vercel-recommended)
   - [Netlify](#netlify)
   - [GitHub Pages](#github-pages)
   - [Docker](#docker)
   - [Custom Server](#custom-server)
4. [Environment Variables](#environment-variables)
5. [Post-Deployment Checklist](#post-deployment-checklist)
6. [Troubleshooting](#troubleshooting)

---

## 🛠️ Local Development Setup

### Prerequisites
- **Node.js** 18.0.0 or higher
- **npm** 9.0.0 or higher (comes with Node.js)
- **Git** (optional, for version control)

### Step 1: Clone the Repository
```bash
git clone <your-repository-url>
cd llm-guard
```

### Step 2: Install Dependencies
```bash
npm install
```

This will install all required packages including:
- React 18.2.0
- TypeScript 5.7.0
- Vite 6.3.5
- Tailwind CSS 4.1.7
- Recharts (for charts)
- Lucide React (for icons)
- Framer Motion (for animations)

### Step 3: Configure Environment Variables (Optional)
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your API keys (if needed)
```

**Note**: The application works without API keys using mock data. API keys are only needed for real LLM evaluations.

### Step 4: Start Development Server
```bash
npm run dev
```

The application will start at **http://localhost:5173** (or the next available port).

**Features of dev server:**
- ✅ Hot Module Replacement (HMR)
- ✅ Fast refresh on code changes
- ✅ Source maps for debugging
- ✅ TypeScript error checking

### Step 5: Open in Browser
Navigate to **http://localhost:5173** in your browser.

### Available Scripts

```bash
# Development
npm run dev          # Start dev server with HMR

# Production
npm run build        # Build for production
npm run preview      # Preview production build locally

# Code Quality
npm run typecheck    # Run TypeScript type checking
```

---

## 🏗️ Production Build

### Build the Application
```bash
npm run build
```

This will:
1. Run TypeScript type checking
2. Bundle and minify all code
3. Optimize assets (images, fonts, etc.)
4. Generate source maps
5. Output to `dist/` directory

**Build Output:**
```
dist/
├── index.html              # Main HTML file
├── assets/
│   ├── index-[hash].js     # Bundled JavaScript
│   ├── index-[hash].css    # Bundled CSS
│   └── [other assets]      # Images, fonts, etc.
└── [other files]
```

**Typical Build Size:**
- JavaScript: ~200KB (gzipped: ~60KB)
- CSS: ~50KB (gzipped: ~10KB)
- Total: ~250KB (gzipped: ~70KB)

### Preview Production Build Locally
```bash
npm run preview
```

This serves the production build at **http://localhost:4173** for testing.

---

## 🌐 Deployment Options

### Option 1: Vercel (Recommended) ⭐

**Why Vercel?**
- Zero configuration deployment
- Automatic HTTPS
- Global CDN
- Preview deployments for PRs
- Free tier available

#### Method A: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? **Select your account**
   - Link to existing project? **N**
   - Project name? **llm-guard** (or your choice)
   - Directory? **./  (current directory)**
   - Override settings? **N**

4. **Deploy to Production**
   ```bash
   vercel --prod
   ```

#### Method B: Deploy via GitHub Integration

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel auto-detects Vite configuration
   - Click "Deploy"

3. **Automatic Deployments**
   - Every push to `main` → Production deployment
   - Every PR → Preview deployment
   - Every branch → Preview deployment

#### Method C: Deploy via Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your Git repository
3. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
4. Click "Deploy"

---

### Option 2: Netlify

**Why Netlify?**
- Easy deployment
- Automatic HTTPS
- Form handling
- Serverless functions
- Free tier available

#### Method A: Deploy via Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Build the project**
   ```bash
   npm run build
   ```

4. **Deploy**
   ```bash
   netlify deploy --prod --dir=dist
   ```

#### Method B: Deploy via GitHub Integration

1. **Push to GitHub** (see Vercel section above)

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository
   - Configure:
     - **Build command**: `npm run build`
     - **Publish directory**: `dist`
   - Click "Deploy site"

#### Method C: Drag and Drop

1. Build the project: `npm run build`
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
3. Drag the `dist` folder to the upload area
4. Done! Your site is live.

---

### Option 3: GitHub Pages

**Why GitHub Pages?**
- Free hosting for public repositories
- Integrated with GitHub
- Automatic deployments

#### Steps:

1. **Install gh-pages package**
   ```bash
   npm install -D gh-pages
   ```

2. **Update package.json**
   ```json
   {
     "scripts": {
       "deploy": "npm run build && gh-pages -d dist"
     },
     "homepage": "https://<your-username>.github.io/<your-repo-name>"
   }
   ```

3. **Update vite.config.js**
   ```javascript
   export default defineConfig({
     base: '/<your-repo-name>/',
     // ... other config
   })
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

5. **Configure GitHub Repository**
   - Go to repository Settings → Pages
   - Source: Deploy from branch
   - Branch: `gh-pages` / `root`
   - Save

6. **Access your site**
   ```
   https://<your-username>.github.io/<your-repo-name>
   ```

---

### Option 4: Docker

**Why Docker?**
- Consistent environments
- Easy to scale
- Works with any container platform

#### Create Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

#### Create nginx.conf

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;
}
```

#### Build and Run

```bash
# Build Docker image
docker build -t llm-guard .

# Run container
docker run -p 8080:80 llm-guard

# Access at http://localhost:8080
```

#### Deploy to Docker Hub

```bash
# Login to Docker Hub
docker login

# Tag image
docker tag llm-guard <your-username>/llm-guard:latest

# Push to Docker Hub
docker push <your-username>/llm-guard:latest
```

---

### Option 5: Custom Server (Nginx/Apache)

#### Nginx Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/llm-guard/dist;
    index index.html;

    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;
}
```

#### Deployment Steps

```bash
# Build locally
npm run build

# Upload to server
scp -r dist/* user@yourserver.com:/var/www/llm-guard/

# Or use rsync
rsync -avz dist/ user@yourserver.com:/var/www/llm-guard/

# Restart nginx
sudo systemctl restart nginx
```

---

## 🔐 Environment Variables

### Required for Production (Optional)

Create a `.env.production` file:

```bash
# LLM API Keys (for real evaluations)
VITE_OPENAI_API_KEY=your_production_openai_key
VITE_ANTHROPIC_API_KEY=your_production_anthropic_key
VITE_GOOGLE_API_KEY=your_production_google_key

# Backend API
VITE_API_URL=https://api.yourdomain.com

# Slack Integration
VITE_SLACK_WEBHOOK_URL=https://hooks.slack.com/services/your/webhook/url

# Environment
VITE_ENVIRONMENT=production
```

### Setting Environment Variables on Deployment Platforms

#### Vercel
```bash
vercel env add VITE_OPENAI_API_KEY
# Enter value when prompted
```

Or via Dashboard:
- Project Settings → Environment Variables
- Add variables for Production/Preview/Development

#### Netlify
```bash
netlify env:set VITE_OPENAI_API_KEY your_value
```

Or via Dashboard:
- Site settings → Environment variables
- Add variables

#### Docker
```bash
docker run -p 8080:80 \
  -e VITE_OPENAI_API_KEY=your_key \
  -e VITE_ANTHROPIC_API_KEY=your_key \
  llm-guard
```

---

## ✅ Post-Deployment Checklist

### 1. Verify Deployment
- [ ] Site loads without errors
- [ ] All pages are accessible
- [ ] Navigation works correctly
- [ ] No console errors
- [ ] Assets load correctly (CSS, JS, images)

### 2. Performance Check
- [ ] Page load time < 3 seconds
- [ ] No large bundle warnings
- [ ] Images are optimized
- [ ] Gzip compression enabled
- [ ] Cache headers set correctly

### 3. Security Check
- [ ] HTTPS enabled
- [ ] Security headers present
- [ ] No sensitive data in client bundle
- [ ] API keys are in environment variables (not hardcoded)
- [ ] CORS configured correctly (if using API)

### 4. SEO Check
- [ ] Meta tags present
- [ ] Title and description set
- [ ] Favicon configured
- [ ] Open Graph tags (optional)
- [ ] Sitemap generated (optional)

### 5. Analytics (Optional)
- [ ] Google Analytics or similar configured
- [ ] Error tracking setup (Sentry, LogRocket)
- [ ] Performance monitoring enabled

### 6. Custom Domain (Optional)
- [ ] Domain purchased
- [ ] DNS configured
- [ ] SSL certificate issued
- [ ] Domain verified in deployment platform

---

## 🐛 Troubleshooting

### Issue: "Module not found" Error

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Build Fails with TypeScript Errors

**Solution:**
```bash
# Check TypeScript errors
npm run typecheck

# Fix errors and rebuild
npm run build
```

### Issue: Blank Page After Deployment

**Solution:**
1. Check browser console for errors
2. Verify `base` path in `vite.config.js` matches deployment URL
3. Ensure `dist/index.html` exists
4. Check server routing configuration (should serve `index.html` for all routes)

### Issue: Assets Not Loading (404)

**Solution:**
1. Check `base` path in `vite.config.js`
2. Verify asset paths in built files
3. Check server MIME types configuration
4. Ensure `dist/assets/` directory exists

### Issue: Client-Side Routing Not Working

**Solution:**
Configure server to redirect all requests to `index.html`:

**Nginx:**
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

**Apache (.htaccess):**
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>
```

### Issue: Environment Variables Not Working

**Solution:**
1. Variables must start with `VITE_` to be exposed to client
2. Rebuild after changing environment variables
3. Check variable names are correct (case-sensitive)
4. Verify variables are set in deployment platform

### Issue: CORS Errors

**Solution:**
If using a backend API, configure CORS:

**Backend (Express example):**
```javascript
app.use(cors({
  origin: ['https://yourdomain.com', 'http://localhost:5173'],
  credentials: true
}));
```

---

## 📊 Deployment Platform Comparison

| Feature | Vercel | Netlify | GitHub Pages | Docker |
|---------|--------|---------|--------------|--------|
| **Ease of Setup** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **Free Tier** | ✅ | ✅ | ✅ | ✅ |
| **Custom Domain** | ✅ | ✅ | ✅ | ✅ |
| **HTTPS** | ✅ | ✅ | ✅ | ⚙️ |
| **CDN** | ✅ | ✅ | ✅ | ⚙️ |
| **Preview Deploys** | ✅ | ✅ | ❌ | ❌ |
| **Serverless Functions** | ✅ | ✅ | ❌ | ⚙️ |
| **Auto Scaling** | ✅ | ✅ | ✅ | ⚙️ |
| **Build Minutes** | 100/month | 300/month | Unlimited | Unlimited |

---

## 🚀 Quick Deploy Commands

### Vercel
```bash
npm install -g vercel
vercel --prod
```

### Netlify
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

### GitHub Pages
```bash
npm install -D gh-pages
npm run deploy
```

### Docker
```bash
docker build -t llm-guard .
docker run -p 8080:80 llm-guard
```

---

## 📞 Support

If you encounter any issues:

1. **Check the troubleshooting section** above
2. **Review browser console** for errors
3. **Check deployment platform logs**
4. **Open an issue** on GitHub with:
   - Error message
   - Steps to reproduce
   - Deployment platform
   - Browser version

---

## 🎯 Recommended Deployment Flow

### For Development Team:

1. **Local Development**
   ```bash
   npm run dev
   ```

2. **Push to GitHub**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   git push origin feature-branch
   ```

3. **Create Pull Request**
   - Vercel/Netlify creates preview deployment
   - Team reviews preview URL
   - Tests pass on preview

4. **Merge to Main**
   - Automatic production deployment
   - Verify production deployment
   - Monitor for issues

### For Solo Developer:

1. **Develop locally**
   ```bash
   npm run dev
   ```

2. **Test production build**
   ```bash
   npm run build
   npm run preview
   ```

3. **Deploy to production**
   ```bash
   vercel --prod
   ```

4. **Verify deployment**
   - Check all features work
   - Monitor for errors
   - Share with users

---

## 🎉 You're Ready!

Your LLM Guard application is now ready for deployment! Choose the platform that best fits your needs and follow the steps above.

**Happy deploying! 🚀**
