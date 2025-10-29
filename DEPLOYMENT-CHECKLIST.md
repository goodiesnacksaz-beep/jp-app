# Quick Deployment Checklist

Use this checklist to deploy JP Vocab to Vercel step-by-step.

## Pre-Deployment

- [ ] All code committed to GitHub
- [ ] `.env.local` is in `.gitignore` (never commit secrets!)
- [ ] Supabase database schema installed
- [ ] Stripe account created (Test mode is fine)
- [ ] Stripe product created and have Price ID

## Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Import to Vercel
- [ ] Go to [vercel.com/new](https://vercel.com/new)
- [ ] Import your GitHub repository
- [ ] Click Deploy (will fail - that's OK!)

### 3. Add Environment Variables in Vercel

Go to Settings > Environment Variables and add:

#### Supabase (3 variables)
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`

#### Stripe (4 variables)
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (pk_test_...)
- [ ] `STRIPE_SECRET_KEY` (sk_test_...)
- [ ] `STRIPE_AD_FREE_PRICE_ID` (price_...)
- [ ] `STRIPE_WEBHOOK_SECRET` (whsec_... - get after next step)

#### App
- [ ] `NEXT_PUBLIC_APP_URL` (your Vercel URL)

#### Optional
- [ ] `NEXT_PUBLIC_ADSENSE_CLIENT_ID` (if using AdSense)

### 4. Configure Stripe Webhook

- [ ] Go to Stripe Dashboard > Developers > Webhooks
- [ ] Click "Add endpoint"
- [ ] URL: `https://your-app.vercel.app/api/stripe/webhook`
- [ ] Event: `checkout.session.completed`
- [ ] Copy webhook secret
- [ ] Add to Vercel environment variables
- [ ] Redeploy in Vercel

### 5. Update Supabase Settings

- [ ] Go to Supabase Authentication settings
- [ ] Set Site URL: `https://your-app.vercel.app`
- [ ] Add Redirect URL: `https://your-app.vercel.app/auth/callback`

### 6. Create Admin User

- [ ] Sign up at your deployed app
- [ ] Run SQL in Supabase:
```sql
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

## Testing Checklist

### Authentication
- [ ] Sign up works
- [ ] Login works
- [ ] Logout works

### Admin Panel
- [ ] Can access `/admin`
- [ ] Can upload CSV
- [ ] Can publish content

### User Features
- [ ] View anime directory
- [ ] Start quiz
- [ ] Complete quiz
- [ ] View results

### Payment (CRITICAL!)
- [ ] Click "Upgrade to Ad-Free"
- [ ] Complete test payment (4242 4242 4242 4242)
- [ ] See "Payment Successful!" message
- [ ] See "Ad-Free Active!" status
- [ ] Ads no longer display
- [ ] Check Stripe webhook received event

### Database Verification
```sql
SELECT email, role, is_ad_free FROM users;
```
- [ ] Admin user exists
- [ ] is_ad_free = true after payment

## Post-Deployment

- [ ] Upload vocabulary content
- [ ] Test full user flow
- [ ] Monitor Vercel logs for errors
- [ ] Check Stripe webhook events
- [ ] Consider custom domain
- [ ] When ready, switch to Stripe Live mode

## Common Issues

**Build fails**: Check environment variables are all set

**Webhook not working**: 
- Verify URL includes `/api/stripe/webhook`
- Check webhook secret matches
- Look at Stripe Events tab

**Auth not working**:
- Check Supabase Site URL is correct
- Verify redirect URLs include /auth/callback

**Database not updating**:
- Verify SERVICE_ROLE_KEY is set (not anon key)
- Check Vercel Function logs

## Quick Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Supabase Dashboard**: https://app.supabase.com  
- **Stripe Dashboard**: https://dashboard.stripe.com
- **Full Guide**: See VERCEL-DEPLOYMENT.md

---

✅ = Done | ⏸️ = Skipped | ❌ = Failed

**Deployment Date**: _____________

**Deployed URL**: _____________

**Notes**: 
_____________________________________________________________
_____________________________________________________________
_____________________________________________________________

