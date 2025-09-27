#!/bin/bash
# Simple deployment script for small team
# Total cost: $0/month

echo "🚀 Deploying LNN Legal Desktop for Small Team"
echo "💰 Cost: $0/month (using free tiers)"
echo "👥 Users: Up to 10 people"
echo ""

# Check if required tools are installed
check_tool() {
    if ! command -v $1 &> /dev/null; then
        echo "❌ $1 is not installed. Please install it first."
        exit 1
    fi
}

echo "🔍 Checking required tools..."
check_tool "node"
check_tool "pnpm"
check_tool "git"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

echo "✅ All tools are available"
echo ""

# Step 1: Install dependencies
echo "📦 Installing dependencies..."
pnpm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi
echo "✅ Dependencies installed"
echo ""

# Step 2: Build the application
echo "🔨 Building application..."
pnpm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi
echo "✅ Application built successfully"
echo ""

# Step 3: Check environment variables
echo "🔧 Checking environment configuration..."
if [ ! -f "apps/web/.env.local" ]; then
    echo "⚠️  No .env.local file found. Creating from example..."
    cp production.env.example apps/web/.env.local
    echo "📝 Please update apps/web/.env.local with your actual values"
    echo "   Required: DATABASE_URL, NEXTAUTH_SECRET, JWT_SECRET, ENCRYPTION_KEY"
    echo ""
fi

# Step 4: Deploy to Vercel (if vercel CLI is available)
if command -v vercel &> /dev/null; then
    echo "🚀 Deploying to Vercel..."
    cd apps/web
    vercel --prod
    if [ $? -eq 0 ]; then
        echo "✅ Successfully deployed to Vercel!"
        echo "🌐 Your app is now live at the URL shown above"
    else
        echo "❌ Vercel deployment failed"
        echo "💡 You can also deploy manually by:"
        echo "   1. Push code to GitHub"
        echo "   2. Connect repository to Vercel"
        echo "   3. Add environment variables in Vercel dashboard"
    fi
    cd ../..
else
    echo "⚠️  Vercel CLI not found. Manual deployment required:"
    echo "   1. Install Vercel CLI: npm i -g vercel"
    echo "   2. Run: vercel --prod"
    echo "   3. Or deploy via Vercel dashboard"
fi

echo ""
echo "🎉 Deployment process completed!"
echo ""
echo "📋 Next steps:"
echo "   1. Set up Supabase database (free tier)"
echo "   2. Configure environment variables"
echo "   3. Add team members"
echo "   4. Test the application"
echo ""
echo "💰 Cost breakdown:"
echo "   - Vercel hosting: $0/month"
echo "   - Supabase database: $0/month"
echo "   - Firebase features: $0/month"
echo "   - Total: $0/month"
echo ""
echo "📚 For detailed setup instructions, see DEPLOYMENT_GUIDE.md"




