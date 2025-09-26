# Deployment Guide

This guide will help you deploy the Travel Roadmap App to production.

## Prerequisites

- Supabase account and project
- Vercel account (recommended) or another hosting platform
- Domain name (optional)

## Step 1: Set up Supabase

1. **Create a Supabase project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Wait for the project to be ready

2. **Set up the database**
   - Go to the SQL Editor in your Supabase dashboard
   - Copy and paste the contents of `supabase/schema.sql`
   - Run the SQL to create tables and policies

3. **Configure authentication**
   - Go to Authentication > Settings
   - Enable email authentication
   - Configure OAuth providers (Google, GitHub, etc.) if desired
   - Set up redirect URLs for your domain

4. **Get your credentials**
   - Go to Settings > API
   - Copy your Project URL and anon key
   - Copy your service role key (keep this secret!)

## Step 2: Deploy to Vercel

### Option A: Deploy from GitHub (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository

3. **Configure environment variables**
   - In Vercel dashboard, go to your project settings
   - Add these environment variables:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
     NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
     ```

4. **Deploy**
   - Click "Deploy"
   - Wait for the deployment to complete

### Option B: Deploy with Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Set environment variables**
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
   vercel env add SUPABASE_SERVICE_ROLE_KEY
   vercel env add NEXT_PUBLIC_APP_URL
   ```

## Step 3: Configure Custom Domain (Optional)

1. **Add domain in Vercel**
   - Go to your project settings
   - Add your domain in the "Domains" section

2. **Update DNS**
   - Add a CNAME record pointing to your Vercel deployment
   - Wait for DNS propagation

3. **Update environment variables**
   - Update `NEXT_PUBLIC_APP_URL` to your custom domain
   - Update Supabase redirect URLs

## Step 4: Configure Supabase for Production

1. **Update redirect URLs**
   - Go to Authentication > URL Configuration
   - Add your production domain to allowed origins
   - Update redirect URLs for OAuth providers

2. **Set up RLS policies**
   - Ensure Row Level Security is enabled
   - Verify policies are working correctly

3. **Configure storage (if needed)**
   - Set up storage buckets for file uploads
   - Configure access policies

## Step 5: Test Your Deployment

1. **Test authentication**
   - Try signing up with a new account
   - Test email verification
   - Test OAuth providers

2. **Test core features**
   - Create a roadmap
   - Add roadmap items
   - Add expenses
   - Test real-time updates

3. **Test mobile responsiveness**
   - Check on different screen sizes
   - Test touch interactions

## Alternative Deployment Platforms

### Netlify

1. **Build settings**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

2. **Environment variables**
   - Add the same environment variables as Vercel

### Railway

1. **Connect GitHub repository**
2. **Set environment variables**
3. **Deploy automatically**

### DigitalOcean App Platform

1. **Create new app**
2. **Connect GitHub repository**
3. **Configure build settings**
4. **Set environment variables**

## Monitoring and Maintenance

### Performance Monitoring

- Set up Vercel Analytics
- Monitor Supabase usage and performance
- Set up error tracking (Sentry, LogRocket)

### Security

- Regularly update dependencies
- Monitor for security vulnerabilities
- Review and update RLS policies
- Use strong passwords and 2FA

### Backups

- Supabase automatically backs up your database
- Consider additional backup strategies for critical data

## Troubleshooting

### Common Issues

1. **Authentication not working**
   - Check redirect URLs in Supabase
   - Verify environment variables
   - Check browser console for errors

2. **Database connection issues**
   - Verify Supabase URL and keys
   - Check RLS policies
   - Review database logs

3. **Build failures**
   - Check for TypeScript errors
   - Verify all dependencies are installed
   - Review build logs

### Getting Help

- Check the [Next.js documentation](https://nextjs.org/docs)
- Review [Supabase documentation](https://supabase.com/docs)
- Open an issue on GitHub
- Check Vercel deployment logs

## Production Checklist

- [ ] Environment variables configured
- [ ] Database schema deployed
- [ ] Authentication working
- [ ] RLS policies tested
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] Performance monitoring set up
- [ ] Error tracking configured
- [ ] Backup strategy in place
- [ ] Security headers configured
- [ ] Mobile responsiveness tested
- [ ] Real-time features working
- [ ] OAuth providers configured (if applicable)

## Scaling Considerations

- Monitor Supabase usage limits
- Consider database connection pooling
- Implement caching strategies
- Set up CDN for static assets
- Monitor and optimize database queries
- Consider implementing rate limiting
