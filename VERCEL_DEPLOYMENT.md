# Deploy to Vercel

Your Travel Roadmap app is ready for deployment to Vercel! Here's how to deploy it:

## Method 1: Deploy via Vercel Dashboard (Recommended)

### Step 1: Push to GitHub
Your code is already in GitHub at: `https://github.com/Syren0914/Road-trip.git`

### Step 2: Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click "New Project"
4. Import your repository: `Syren0914/Road-trip`

### Step 3: Configure Environment Variables
In the Vercel dashboard, add these environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
```

### Step 4: Deploy
1. Click "Deploy"
2. Wait for the deployment to complete
3. Your app will be live at `https://your-app-name.vercel.app`

## Method 2: Deploy via Vercel CLI

### Step 1: Install Vercel CLI
```bash
npm i -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Deploy
```bash
vercel
```

### Step 4: Set Environment Variables
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add NEXT_PUBLIC_APP_URL
```

## Environment Variables Required

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://xyz.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `NEXT_PUBLIC_APP_URL` | Your Vercel app URL | `https://road-trip.vercel.app` |

## Post-Deployment Steps

### 1. Update Supabase Settings
1. Go to your Supabase project settings
2. Update the site URL to your Vercel domain
3. Add your Vercel domain to allowed origins

### 2. Test Your Deployment
- Visit your deployed app
- Test all CRUD operations
- Verify real-time updates work
- Check mobile responsiveness

## Troubleshooting

### Build Errors
- Check that all environment variables are set
- Verify Supabase connection
- Check for TypeScript errors

### Runtime Errors
- Verify Supabase RLS policies
- Check environment variables
- Review browser console for errors

### Performance
- Enable Vercel Analytics
- Optimize images
- Use Vercel's edge functions if needed

## Your App Features

✅ **Fully Functional CRUD Operations**
- Create, edit, delete roadmaps
- Add, edit, delete roadmap items
- Track expenses with categories

✅ **Real-time Updates**
- Live synchronization across devices
- Instant updates without refresh

✅ **Mobile Responsive**
- Optimized for all screen sizes
- Touch-friendly interface

✅ **Production Ready**
- Error handling
- Loading states
- Security headers
- Performance optimized

## Support

If you encounter any issues:
1. Check the Vercel deployment logs
2. Review the browser console
3. Verify Supabase configuration
4. Check environment variables

Your Travel Roadmap app is ready for production! 🚀
