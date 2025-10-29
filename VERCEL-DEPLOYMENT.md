# Deploy JP Vocab to Vercel

## Prerequisites Checklist

Before deploying, ensure you have:
- [ ] GitHub account
- [ ] Vercel account (sign up at [vercel.com](https://vercel.com))
- [ ] Supabase project with database schema installed
- [ ] Stripe account (can use Test mode initially)
- [ ] All environment variable values ready

## Step 1: Prepare Your Code

### 1.1 Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial deployment"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### 1.2 Verify .gitignore

Make sure your `.gitignore` includes:
```
.env*.local
.env
node_modules
.next
```

✅ **Important**: Never commit `.env.local` to GitHub!

## Step 2: Deploy to Vercel

### 2.1 Import Project

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. Select your GitHub repository
4. Click "Import"

### 2.2 Configure Build Settings

Vercel should auto-detect Next.js. Verify:
- **Framework Preset**: Next.js
- **Build Command**: `next build` (default)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (default)

Click "Deploy" (it will fail without environment variables, that's okay!)

## Step 3: Configure Environment Variables

### 3.1 Go to Project Settings

1. Click on your deployed project
2. Go to "Settings" tab
3. Click "Environment Variables" in sidebar

### 3.2 Add All Environment Variables

Add these one by one:

#### Supabase Variables (REQUIRED)
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://your-project.supabase.co
```

```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: your_supabase_anon_key_here
```

```
Name: SUPABASE_SERVICE_ROLE_KEY
Value: your_supabase_service_role_key_here
```

#### Stripe Variables (REQUIRED for payments)

**For Testing:**
```
Name: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
Value: pk_test_your_key_here
```

```
Name: STRIPE_SECRET_KEY
Value: sk_test_your_key_here
```

```
Name: STRIPE_AD_FREE_PRICE_ID
Value: price_your_price_id_here
```

```
Name: STRIPE_WEBHOOK_SECRET
Value: whsec_your_webhook_secret_here (we'll get this in Step 4)
```

**For Production (later):**
- Replace `pk_test_` with `pk_live_`
- Replace `sk_test_` with `sk_live_`
- Get production webhook secret

#### App URL (REQUIRED)
```
Name: NEXT_PUBLIC_APP_URL
Value: https://your-app.vercel.app
```

**Note**: You'll update this after first deployment with your actual Vercel URL.

#### Google AdSense (OPTIONAL)
```
Name: NEXT_PUBLIC_ADSENSE_CLIENT_ID
Value: ca-pub-your_id_here
```

### 3.3 Apply to All Environments

For each variable, select:
- ✅ Production
- ✅ Preview
- ✅ Development

## Step 4: Configure Stripe Webhook (CRITICAL!)

### 4.1 Get Your Vercel URL

After deployment, your app will be at:
```
https://your-app-name.vercel.app
```

Or use a custom domain if you have one.

### 4.2 Create Webhook in Stripe

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Make sure you're in **Test mode** (toggle at top right)
3. Go to **Developers** > **Webhooks**
4. Click **"Add endpoint"**

5. Enter webhook details:
   - **Endpoint URL**: `https://your-app-name.vercel.app/api/stripe/webhook`
   - **Description**: "JP Vocab Payment Webhook"
   
6. Select events to listen to:
   - Click "Select events"
   - Find and check: `checkout.session.completed`
   - Click "Add events"

7. Click **"Add endpoint"**

### 4.3 Get Webhook Signing Secret

1. Click on your newly created webhook
2. Click "Reveal" under "Signing secret"
3. Copy the secret (starts with `whsec_`)

### 4.4 Update Vercel Environment Variable

1. Back in Vercel, go to Settings > Environment Variables
2. Find `STRIPE_WEBHOOK_SECRET`
3. Click "Edit"
4. Paste the webhook secret
5. Save

### 4.5 Redeploy

1. Go to "Deployments" tab
2. Click "..." on the latest deployment
3. Click "Redeploy"

## Step 5: Update App URL

Now that you know your Vercel URL:

1. Go to Vercel Settings > Environment Variables
2. Update `NEXT_PUBLIC_APP_URL` to your actual URL:
   ```
   https://your-actual-app.vercel.app
   ```
3. Save and redeploy

### ⚠️ CRITICAL: Update Supabase URLs

**Without this, email confirmation links will redirect to localhost!**

1. Go to **Supabase Dashboard**: https://app.supabase.com
2. Select your project
3. Navigate to **Authentication** → **URL Configuration**
4. Update these settings:

   **Site URL**:
   ```
   https://your-actual-app.vercel.app
   ```
   
   **Redirect URLs** (add both, one per line):
   ```
   https://your-actual-app.vercel.app/auth/callback
   http://localhost:3000/auth/callback
   ```
   *(Keep localhost for local development)*

5. Click **Save**

**What this fixes**: Email confirmation, password reset, and magic link emails will now use your production URL instead of localhost.

## Step 6: Create Admin User

### 6.1 Sign Up

1. Go to `https://your-app.vercel.app/signup`
2. Create your account

### 6.2 Make Yourself Admin

1. Go to Supabase SQL Editor
2. Run:
```sql
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'your-admin-email@example.com';
```

3. Log out and log back in to your app

## Step 7: Test Everything

### 7.1 Test Authentication
- [ ] Sign up works
- [ ] Login works
- [ ] Logout works

### 7.2 Test Admin Features
- [ ] Can access `/admin` page
- [ ] Can upload CSV vocabulary
- [ ] Can publish/unpublish content

### 7.3 Test User Features
- [ ] Can view anime directory
- [ ] Can start quiz
- [ ] Quiz works correctly
- [ ] Results page displays

### 7.4 Test Payment (Critical!)

1. Go to `/settings`
2. Click "Upgrade to Ad-Free"
3. Use Stripe test card: `4242 4242 4242 4242`
4. Complete payment
5. Should return to settings with success message
6. Should show "Ad-Free Active!"
7. Ads should not display on quiz pages

**Check Stripe webhook:**
1. Go to Stripe Dashboard > Developers > Webhooks
2. Click on your webhook
3. Check "Events" tab - should show successful `checkout.session.completed` event

### 7.5 Check Database

In Supabase, verify:
```sql
SELECT email, role, is_ad_free FROM users;
```

Should show your admin user with `is_ad_free = true` after payment.

## Step 8: Custom Domain (Optional)

### 8.1 Add Domain in Vercel

1. Go to Project Settings > Domains
2. Enter your domain name
3. Click "Add"

### 8.2 Configure DNS

Vercel will show you DNS records to add. Common options:

**For root domain (example.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For subdomain (www.example.com):**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 8.3 Update Environment Variables

After domain is verified:

1. Update `NEXT_PUBLIC_APP_URL` to your custom domain
2. Update Stripe webhook URL to your custom domain
3. Update Supabase redirect URLs to your custom domain
4. Redeploy

## Step 9: Switch to Production Mode (When Ready)

### 9.1 Get Stripe Live Keys

1. In Stripe Dashboard, toggle to **Live mode**
2. Go to Developers > API keys
3. Copy Live keys (start with `pk_live_` and `sk_live_`)

### 9.2 Create Live Webhook

1. Go to Developers > Webhooks
2. Create new endpoint with your production URL
3. Select `checkout.session.completed` event
4. Copy the Live webhook secret

### 9.3 Update Vercel Environment Variables

Update these to Live values:
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

**Note**: Keep your test mode keys saved somewhere in case you need to debug!

### 9.4 Final Test

Do a **real payment test** with a real card (use a small amount or refund immediately):
1. Complete a real payment
2. Verify webhook received
3. Verify database updated
4. Verify ad-free works
5. Refund the test payment if needed

## Troubleshooting

### Build Fails

**Error**: Missing environment variables
**Fix**: Make sure all REQUIRED env vars are set in Vercel

**Error**: TypeScript errors
**Fix**: Run `npm run build` locally first to catch errors

### Webhook Not Working

**Check**:
1. Stripe Dashboard > Webhooks > Events tab
2. Look for failed deliveries
3. Click to see error details

**Common fixes**:
- Wrong URL (must include `/api/stripe/webhook`)
- Wrong webhook secret in Vercel
- Webhook created in wrong mode (Test vs Live)

### Auth Not Working

**Check**:
- Supabase Site URL matches your Vercel URL
- Redirect URLs include `/auth/callback`
- Environment variables are correct

### Database Not Updating

**Check**:
- `SUPABASE_SERVICE_ROLE_KEY` is set (not anon key!)
- Webhook is receiving events
- Check Vercel Function Logs for errors

## Monitoring

### Vercel Logs

1. Go to your project
2. Click "Logs" tab
3. Filter by "Errors" to see issues

### Stripe Events

1. Stripe Dashboard > Events
2. View all webhook events and their status

### Supabase Logs

1. Supabase Dashboard > Logs
2. Check for authentication or database errors

## Performance Tips

1. **Enable Vercel Analytics** (Settings > Analytics)
2. **Set up error monitoring** (Sentry, LogRocket, etc.)
3. **Monitor webhook delivery** in Stripe regularly
4. **Set up uptime monitoring** (UptimeRobot, etc.)

## Security Checklist

- [ ] All sensitive keys in environment variables (not code)
- [ ] `.env.local` in `.gitignore`
- [ ] RLS policies enabled in Supabase
- [ ] Webhook signature verification working
- [ ] Admin routes protected
- [ ] HTTPS enabled (automatic with Vercel)

## Quick Reference

**Your URLs:**
- App: `https://your-app.vercel.app`
- Webhook: `https://your-app.vercel.app/api/stripe/webhook`
- Admin: `https://your-app.vercel.app/admin`

**Important Pages:**
- Vercel: https://vercel.com/dashboard
- Supabase: https://app.supabase.com
- Stripe: https://dashboard.stripe.com
- GitHub: https://github.com

---

## Next Steps After Deployment

1. Upload some vocabulary content via admin panel
2. Test the full user flow
3. Consider adding more anime/episodes
4. Set up custom domain
5. Configure Google AdSense
6. Switch to Stripe Live mode
7. Launch! 🚀

Need help? Check:
- **README.md** - Project overview
- **STRIPE-SETUP.md** - Detailed Stripe configuration
- **PAYMENT-TEST-GUIDE.md** - Local payment testing
- **DEPLOYMENT.md** - General deployment guide

