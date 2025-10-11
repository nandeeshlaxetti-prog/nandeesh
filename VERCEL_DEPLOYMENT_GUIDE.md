# Vercel Deployment Guide for Nandeesh Legal Application

## ✅ Prerequisites

1. GitHub account
2. Vercel account (free tier works fine)
3. Git installed locally

## 📦 Step 1: Prepare for Vercel

The application is now **Vercel-ready** with the following configurations:

### Files Created/Updated:
- ✅ `vercel.json` - Vercel configuration
- ✅ `apps/nandeesh-web/vercel.json` - Web app specific config
- ✅ `/api/cases/storage` - Serverless-compatible storage API
- ✅ Auto-save functionality for multi-user access

## 🔧 Step 2: Environment Variables

### Required Environment Variables for Vercel:

```bash
# eCourts API Key
NEXT_PUBLIC_ECOURTS_API_KEY=klc_2cef7fc42178c58211cd8b8b1d23c3206c1e778f13ed566237803d8897a9b104
ECOURTS_API_KEY=klc_2cef7fc42178c58211cd8b8b1d23c3206c1e778f13ed566237803d8897a9b104

# Application Settings
NEXT_PUBLIC_APP_NAME=Nandeesh Legal Application
NODE_ENV=production
APP_MODE=web
```

## 🚀 Step 3: Deploy to Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "feat: Add advocate search with online storage"
   git push origin master
   ```

2. **Import to Vercel:**
   - Go to https://vercel.com/new
   - Click "Import Git Repository"
   - Select your GitHub repository
   - Configure project:
     - **Framework Preset**: Next.js
     - **Root Directory**: `apps/nandeesh-web`
     - **Build Command**: `pnpm build`
     - **Output Directory**: `.next`
     - **Install Command**: `pnpm install --no-frozen-lockfile`

3. **Add Environment Variables:**
   - In Vercel dashboard → Settings → Environment Variables
   - Add the variables listed above
   - Apply to: Production, Preview, Development

4. **Deploy:**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your app will be live at: `https://your-app.vercel.app`

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
cd apps/nandeesh-web
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? nandeesh-legal-app
# - Directory? ./
# - Override settings? No

# For production deployment:
vercel --prod
```

## ⚙️ Step 4: Post-Deployment Configuration

### Update App URL:
After deployment, update the environment variable:
```bash
NEXT_PUBLIC_APP_URL=https://your-actual-app.vercel.app
```

### Verify Deployment:
1. Visit your Vercel URL
2. Test advocate number search (2271)
3. Test advocate name search (Nandeesh R Laxetti)
4. Verify cases are saved and persist

## 📊 Features Available in Production:

✅ **Advocate Number Search** - Search by registration number
✅ **Advocate Name Search** - Search by full name
✅ **CNR Lookup** - Get case details by CNR
✅ **Auto-Enrichment** - Automatically fetches complete case details
✅ **Online Storage** - Cases saved to Vercel-compatible storage
✅ **Multi-User Access** - All users see the same data
✅ **Auto-Sync** - Changes automatically saved

## 🔍 Important Notes:

### Storage Limitations:
- Current implementation uses **in-memory storage** for Vercel
- Cases persist during the serverless function lifetime
- For permanent storage, consider:
  - **Vercel KV** (Redis) - Recommended for production
  - **Vercel Postgres** - For full database features
  - **Firebase Firestore** - Already integrated, needs configuration

### To Upgrade to Vercel KV (Permanent Storage):

1. Enable Vercel KV in your project
2. Install package: `pnpm add @vercel/kv`
3. Update `/api/cases/storage/route.ts` to use KV
4. Add KV environment variables from Vercel dashboard

## 🎯 Current Status:

- ✅ Vercel Configuration: Ready
- ✅ Serverless APIs: Compatible
- ✅ Build Process: Configured
- ✅ Environment Variables: Documented
- ⚠️  Storage: In-memory (temporary)
- 💡 Recommendation: Upgrade to Vercel KV for production

## 📝 Quick Commands:

```bash
# Check git status
git status

# Add all changes
git add .

# Commit changes
git commit -m "feat: Vercel-ready advocate search with online storage"

# Push to GitHub
git push origin master

# Deploy to Vercel (if using CLI)
cd apps/nandeesh-web
vercel --prod
```

## 🔗 Useful Links:

- Vercel Dashboard: https://vercel.com/dashboard
- Vercel KV Docs: https://vercel.com/docs/storage/vercel-kv
- Next.js on Vercel: https://vercel.com/docs/frameworks/nextjs

---

**Your application is now ready for Vercel deployment!** 🚀

