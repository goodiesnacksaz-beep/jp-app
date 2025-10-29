# Deployment Guide

This guide will help you deploy the JP Vocab application to production.

## Prerequisites

Before deploying, ensure you have:
- ✅ A Supabase project with the database schema installed
- ✅ A Stripe account with products configured
- ✅ (Optional) Google AdSense account approved
- ✅ A GitHub repository with your code
- ✅ A Vercel account

## Step 1: Prepare Supabase

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose organization and project name
4. Select region closest to your users
5. Set a strong database password
6. Wait for project to be created

### 1.2 Install Database Schema

1. In your Supabase project, go to SQL Editor
2. Click "New Query"
3. Copy entire contents of `supabase-schema.sql`
4. Paste and click "Run"
5. Verify all tables are created in Table Editor

### 1.3 Get API Keys

1. Go to Project Settings > API
2. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)

### 1.4 Configure Authentication

1. Go to Authentication > Settings
2. Set Site URL to your production domain (e.g., `https://jpvocab.com`)
3. Add Redirect URLs:
   - `https://yourdomain.com/auth/callback`
   - `http://localhost:3000/auth/callback` (for local dev)
4. Enable Email provider (or configure others as needed)

### 1.5 Create Admin User

After deploying and signing up through your app:

```sql
-- Run this in Supabase SQL Editor
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'your-admin-email@example.com';
```

## Step 2: Configure Stripe

### 2.1 Create Stripe Account

1. Go to [stripe.com](https://stripe.com)
2. Sign up and complete account setup
3. Activate your account

### 2.2 Create Product

1. Go to Products > Add Product
2. Product details:
   - Name: "Ad-Free Upgrade"
   - Description: "Remove all advertisements"
3. Pricing:
   - Type: One-time
   - Price: $4.99 (or your chosen amount)
   - Currency: USD
4. Click "Save product"
5. Copy the Price ID → `STRIPE_AD_FREE_PRICE_ID`

### 2.3 Get API Keys

1. Go to Developers > API keys
2. Copy:
   - Publishable key → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Secret key → `STRIPE_SECRET_KEY` (keep secret!)

### 2.4 Set Up Webhook

**Important**: Do this AFTER deploying to Vercel

1. Go to Developers > Webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://yourdomain.com/api/stripe/webhook`
4. Events to send:
   - Select `checkout.session.completed`
5. Click "Add endpoint"
6. Copy Signing secret → `STRIPE_WEBHOOK_SECRET`

### 2.5 Test Mode vs Live Mode

- Use Test mode for development
- Switch to Live mode for production
- Get separate keys for each mode

## Step 3: Google AdSense (Optional)

### 3.1 Apply for AdSense

1. Go to [google.com/adsense](https://www.google.com/adsense/)
2. Sign up with your Google account
3. Enter your website URL
4. Complete application
5. Wait for approval (can take 1-2 weeks)

### 3.2 Get Client ID

After approval:
1. Go to Ads > Overview
2. Click "Get Code"
3. Copy your publisher ID (format: `ca-pub-XXXXXXXXXXXXXXXX`)
4. Add to `NEXT_PUBLIC_ADSENSE_CLIENT_ID`

### 3.3 Create Ad Units (Optional)

For better control:
1. Go to Ads > By ad unit
2. Create display ad units
3. Use the ad slot IDs in `AdSense` component

## Step 4: Deploy to Vercel

### 4.1 Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/your-repo.git
git push -u origin main
```

### 4.2 Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up/login (connect GitHub)
3. Click "Add New" > "Project"
4. Import your repository
5. Configure project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: (leave default)

### 4.3 Add Environment Variables

In Vercel project settings > Environment Variables, add:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key

# Stripe (use Live mode keys for production)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
STRIPE_AD_FREE_PRICE_ID=price_xxxxx

# Google AdSense (optional)
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-xxxxx

# App URL (update after deployment)
NEXT_PUBLIC_APP_URL=https://your-vercel-domain.vercel.app
```

### 4.4 Deploy

1. Click "Deploy"
2. Wait for build to complete
3. Visit your deployed site

### 4.5 Update App URL

After first deployment:
1. Copy your Vercel URL
2. Update `NEXT_PUBLIC_APP_URL` in environment variables
3. Redeploy (Vercel will auto-redeploy on env change)

## Step 5: Post-Deployment Setup

### 5.1 Update Stripe Webhook

1. Go back to Stripe > Webhooks
2. Update endpoint URL with your production domain
3. Update `STRIPE_WEBHOOK_SECRET` in Vercel if changed

### 5.2 Update Supabase URLs

1. Go to Supabase Authentication settings
2. Update Site URL to your production domain
3. Update Redirect URLs

### 5.3 Test Everything

- [ ] Sign up with a test email
- [ ] Verify email confirmation works
- [ ] Login successfully
- [ ] Create admin user in Supabase
- [ ] Login as admin
- [ ] Upload sample vocabulary CSV
- [ ] Publish a vocabulary list
- [ ] Test quiz functionality
- [ ] Test Stripe payment (use test card)
- [ ] Verify user becomes ad-free after payment
- [ ] Check ads display for non-paying users

### 5.4 Custom Domain (Optional)

1. Buy domain from provider (Namecheap, Google Domains, etc.)
2. In Vercel, go to Settings > Domains
3. Add your custom domain
4. Update DNS records as instructed
5. Wait for DNS propagation (can take 24-48 hours)
6. Update all URLs in environment variables

## Step 6: Monitoring & Maintenance

### 6.1 Set Up Monitoring

- Enable Vercel Analytics (built-in)
- Set up error tracking (Sentry, LogRocket)
- Monitor Supabase usage

### 6.2 Regular Backups

- Supabase automatically backs up your database
- Consider manual backups for critical data
- Export important tables regularly

### 6.3 Updates

```bash
# Update dependencies
npm update

# Test locally
npm run dev

# Deploy
git add .
git commit -m "Update dependencies"
git push
```

Vercel will automatically redeploy on push to main branch.

## Troubleshooting

### Build Fails on Vercel

1. Check build logs in Vercel dashboard
2. Ensure all dependencies are in `package.json`
3. Verify TypeScript types are correct
4. Test build locally: `npm run build`

### Database Connection Issues

1. Verify Supabase URL and keys
2. Check RLS policies in Supabase
3. Verify database schema is installed

### Stripe Webhook Not Working

1. Test webhook with Stripe CLI:
   ```bash
   stripe listen --forward-to https://yourdomain.com/api/stripe/webhook
   stripe trigger checkout.session.completed
   ```
2. Check webhook signature is correct
3. Verify endpoint URL is correct

### Ads Not Showing

1. Verify AdSense account is approved
2. Check client ID is correct
3. Ads may take 24-48 hours to start showing
4. Test with ad-free set to false

## Security Checklist

- [ ] All sensitive keys in environment variables
- [ ] Service role key never exposed to client
- [ ] RLS policies enabled on all tables
- [ ] Stripe webhook signature verified
- [ ] CORS properly configured
- [ ] Rate limiting enabled (consider Vercel Edge Config)
- [ ] SQL injection prevention (Supabase handles this)
- [ ] XSS protection (Next.js handles this)

## Performance Optimization

- [ ] Enable Vercel Analytics
- [ ] Use Vercel Edge Functions where applicable
- [ ] Optimize images with Next.js Image component
- [ ] Enable caching headers
- [ ] Monitor Core Web Vitals
- [ ] Use Vercel Speed Insights

## Cost Estimation

### Free Tier Limits

**Supabase**:
- 500 MB database
- 1 GB file storage
- 2 GB bandwidth

**Vercel**:
- 100 GB bandwidth
- Unlimited deployments
- Serverless function execution

**Stripe**:
- 2.9% + $0.30 per transaction

### When to Upgrade

Upgrade when you reach:
- 500+ active users (Supabase)
- 100 GB bandwidth/month (Vercel)
- Need custom domain email

## Support Resources

- **Next.js**: [nextjs.org/docs](https://nextjs.org/docs)
- **Supabase**: [supabase.com/docs](https://supabase.com/docs)
- **Stripe**: [stripe.com/docs](https://stripe.com/docs)
- **Vercel**: [vercel.com/docs](https://vercel.com/docs)

---

🎉 Congratulations! Your JP Vocab app is now live!

