# Vercel KV Setup Guide - Persistent Online Storage

## 🎯 What is Vercel KV?

Vercel KV is a **Redis-based key-value database** that provides:
- ✅ **Persistent storage** (data doesn't disappear on cold starts)
- ✅ **Multi-user access** (all users see the same data)
- ✅ **Serverless compatible** (works perfectly with Vercel)
- ✅ **Free tier available** (up to 256 MB, 3000 commands/day)

## 📦 Current Status

✅ **Code Updated**: The storage API now supports Vercel KV
✅ **Package Added**: `@vercel/kv` added to dependencies
✅ **Fallback Ready**: Uses in-memory cache if KV not configured

## 🚀 How to Enable Vercel KV (5 minutes)

### Step 1: Enable KV in Vercel Dashboard

1. **Go to your project:**
   ```
   https://vercel.com/nandeeshs-projects-8f92dec2/web
   ```

2. **Click on "Storage" tab** (top navigation)

3. **Click "Create Database"**

4. **Select "KV (Durable Redis)"**

5. **Configure:**
   - Database Name: `legal-cases-kv`
   - Region: Choose closest to you (e.g., `iad1` for US East)
   - Click **"Create"**

### Step 2: Connect to Your Project

1. After creating, click **"Connect to Project"**
2. Select your project: **"web"**
3. Select environment: ✅ Production ✅ Preview ✅ Development
4. Click **"Connect"**

### Step 3: Verify Environment Variables

Vercel will automatically add these environment variables:
```
KV_REST_API_URL=https://...
KV_REST_API_TOKEN=...
KV_REST_API_READ_ONLY_TOKEN=...
KV_URL=...
```

### Step 4: Redeploy

```bash
cd E:\Application\apps\nandeesh-web
vercel --prod
```

## ✅ That's It!

Once deployed, your storage will automatically use Vercel KV, and:
- ✅ All advocate search cases will be saved permanently
- ✅ Data persists across deployments and cold starts
- ✅ All users accessing the app will see the same cases
- ✅ No data loss on server restarts

## 🔍 How to Verify It's Working

After deployment with KV enabled, check the Vercel logs:

```bash
vercel logs --prod
```

You should see:
```
✅ Saved to Vercel KV: 19 cases
```

Instead of:
```
KV unavailable, using memory cache
```

## 📊 Alternative: Use Vercel Postgres

If you prefer a full SQL database:

1. In Vercel Dashboard → Storage → Create Database
2. Select **"Postgres"**
3. Follow similar connection steps
4. Update the storage API to use Postgres instead of KV

## 💡 Current Behavior

**Without KV configured:**
- Uses in-memory cache (temporary)
- Cases lost on cold starts
- Works for testing

**With KV configured:**
- Uses Redis (permanent)
- Cases persist forever
- Production-ready for multiple users

---

**To enable persistent storage, follow the steps above to create and connect Vercel KV!** 🚀

