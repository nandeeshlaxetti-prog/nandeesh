# 🔧 Fix Vercel Root Directory Error

## Error Message
```
The specified Root Directory "apps/web" does not exist. 
Please update your Project Settings.
```

## Problem
Vercel's project settings are configured to use `apps/web` as the root directory, but the actual directory is `apps/nandeesh-web`.

---

## Solution: Update Vercel Project Settings

### Option 1: Via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Open https://vercel.com/dashboard
   - Select your project: `nandeesh` or `web`

2. **Open Project Settings**
   - Click on the project name
   - Click "Settings" in the top navigation

3. **Update Root Directory**
   - In the left sidebar, click "General"
   - Scroll down to "Root Directory"
   - Change from: `apps/web`
   - Change to: `apps/nandeesh-web`
   - Click "Save"

4. **Redeploy**
   - Go to "Deployments" tab
   - Click on the latest deployment
   - Click "Redeploy" button

### Option 2: Remove Root Directory Setting

If the above doesn't work, try removing the root directory entirely:

1. **Go to Project Settings → General**
2. **Clear the Root Directory field** (leave it empty)
3. **Save**
4. The `vercel.json` file in the repository root will handle the paths

---

## Alternative: Deploy from Correct Directory

If you can't access the dashboard, you can deploy directly:

```bash
cd E:\Application
vercel --prod
```

When prompted:
- Set up and deploy "E:\Application"? → **Yes**
- Which scope? → Select your account
- Link to existing project? → **Yes**
- What's the name of your existing project? → Enter project name
- In which directory is your code located? → **apps/nandeesh-web**

---

## Verify Fix

After making the change, check:

1. **Deployment should succeed**
   ```bash
   git add -A
   git commit -m "fix: Update Vercel configuration" --no-verify
   git push origin master
   ```

2. **Check deployment status**
   - Go to https://vercel.com/dashboard
   - Check the "Deployments" tab
   - Latest deployment should show "Ready" status

3. **Test the live site**
   ```bash
   node test-vercel-deployment.js
   ```

---

## Current vercel.json Configuration

The root `vercel.json` is correctly configured:
```json
{
  "buildCommand": "pnpm install && cd apps/nandeesh-web && pnpm build",
  "outputDirectory": "apps/nandeesh-web/.next",
  "installCommand": "pnpm install --no-frozen-lockfile",
  "framework": "nextjs"
}
```

This tells Vercel:
- Install dependencies from root
- Build from `apps/nandeesh-web`
- Output is in `apps/nandeesh-web/.next`

---

## Important Notes

⚠️ **Don't set rootDirectory in vercel.json if using monorepo**
- The `rootDirectory` field in `vercel.json` is for simple projects
- For monorepos, use `buildCommand` and `outputDirectory` instead
- Only set Root Directory in Vercel dashboard if needed

✅ **Current setup is correct for monorepo**
- Root `vercel.json` handles paths
- Build command navigates to correct directory
- Output directory is specified

---

## Need Help?

If you're still having issues:

1. **Check the exact error message** in Vercel deployment logs
2. **Verify directory exists** in your repository:
   - Check https://github.com/nandeeshlaxetti-prog/nandeesh
   - Navigate to `apps/nandeesh-web`
   - Should see `package.json`, `next.config.js`, etc.

3. **Contact Vercel Support** if dashboard settings are locked

---

*Last Updated: October 11, 2025*

