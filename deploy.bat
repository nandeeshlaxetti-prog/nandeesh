@echo off
REM Simple deployment script for small team (Windows)
REM Total cost: $0/month

echo 🚀 Deploying LNN Legal Desktop for Small Team
echo 💰 Cost: $0/month (using free tiers)
echo 👥 Users: Up to 10 people
echo.

REM Check if required tools are installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install it first.
    exit /b 1
)

where pnpm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ pnpm is not installed. Please install it first.
    exit /b 1
)

where git >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Git is not installed. Please install it first.
    exit /b 1
)

echo ✅ All tools are available
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Please run this script from the project root directory
    exit /b 1
)

REM Step 1: Install dependencies
echo 📦 Installing dependencies...
pnpm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    exit /b 1
)
echo ✅ Dependencies installed
echo.

REM Step 2: Build the application
echo 🔨 Building application...
pnpm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed
    exit /b 1
)
echo ✅ Application built successfully
echo.

REM Step 3: Check environment variables
echo 🔧 Checking environment configuration...
if not exist "apps\nandeesh-web\.env.local" (
    echo ⚠️  No .env.local file found. Creating from example...
    copy production.env.example apps\nandeesh-web\.env.local
    echo 📝 Please update apps\nandeesh-web\.env.local with your actual values
    echo    Required: DATABASE_URL, NEXTAUTH_SECRET, JWT_SECRET, ENCRYPTION_KEY
    echo.
)

REM Step 4: Deploy to Vercel (if vercel CLI is available)
where vercel >nul 2>nul
if %errorlevel% equ 0 (
    echo 🚀 Deploying to Vercel...
    cd apps\nandeesh-web
    vercel --prod
    if %errorlevel% equ 0 (
        echo ✅ Successfully deployed to Vercel!
        echo 🌐 Your app is now live at the URL shown above
    ) else (
        echo ❌ Vercel deployment failed
        echo 💡 You can also deploy manually by:
        echo    1. Push code to GitHub
        echo    2. Connect repository to Vercel
        echo    3. Add environment variables in Vercel dashboard
    )
    cd ..\..
) else (
    echo ⚠️  Vercel CLI not found. Manual deployment required:
    echo    1. Install Vercel CLI: npm i -g vercel
    echo    2. Run: vercel --prod
    echo    3. Or deploy via Vercel dashboard
)

echo.
echo 🎉 Deployment process completed!
echo.
echo 📋 Next steps:
echo    1. Set up Supabase database (free tier)
echo    2. Configure environment variables
echo    3. Add team members
echo    4. Test the application
echo.
echo 💰 Cost breakdown:
echo    - Vercel hosting: $0/month
echo    - Supabase database: $0/month
echo    - Firebase features: $0/month
echo    - Total: $0/month
echo.
echo 📚 For detailed setup instructions, see DEPLOYMENT_GUIDE.md
pause








