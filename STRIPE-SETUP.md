# Stripe Payment Setup & Troubleshooting

## Initial Setup

### 1. Create Stripe Account
1. Go to [stripe.com](https://stripe.com)
2. Sign up for an account
3. Complete verification

### 2. Get API Keys

**For Testing (Sandbox Mode):**
1. In Stripe Dashboard, toggle to "Test mode" (top right)
2. Go to Developers > API keys
3. Copy:
   - **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (starts with `pk_test_`)
   - **Secret key** → `STRIPE_SECRET_KEY` (starts with `sk_test_`)

### 3. Create Product & Price

1. Go to Products > Add Product
2. Fill in:
   - **Name**: "Ad-Free Upgrade"
   - **Description**: "Remove all advertisements"
3. Pricing:
   - **Type**: One-time
   - **Price**: $4.99 (or your amount)
   - **Currency**: USD
4. Click "Save product"
5. Copy the **Price ID** (starts with `price_`) → `STRIPE_AD_FREE_PRICE_ID`

### 4. Set Up Webhook (CRITICAL!)

**This is why your payment didn't update the database!**

#### Option A: Production (Deployed on Vercel)
1. Go to Developers > Webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://your-domain.com/api/stripe/webhook`
4. Events to listen for: Select `checkout.session.completed`
5. Click "Add endpoint"
6. Copy the **Signing secret** (starts with `whsec_`) → `STRIPE_WEBHOOK_SECRET`

#### Option B: Local Development (Using Stripe CLI)
1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login: `stripe login`
3. Forward events to local:
   ```bash
   stripe listen --forward-to http://localhost:3000/api/stripe/webhook
   ```
4. Copy the webhook signing secret shown → `STRIPE_WEBHOOK_SECRET`
5. Keep this terminal running while testing

## Testing the Payment Flow

### Test with Stripe Test Cards

Use these test card numbers in **Test Mode**:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- Use any future expiry date (e.g., 12/34)
- Use any 3-digit CVC (e.g., 123)
- Use any ZIP code (e.g., 12345)

### Step-by-Step Test

1. **Start your app**: `npm run dev`

2. **If testing locally, start Stripe webhook listener** (in new terminal):
   ```bash
   stripe listen --forward-to http://localhost:3000/api/stripe/webhook
   ```

3. **Make a test payment**:
   - Go to `/settings`
   - Click "Upgrade to Ad-Free"
   - Use test card: `4242 4242 4242 4242`
   - Complete payment

4. **Check webhook received** (in Stripe CLI terminal):
   ```
   ✔ Ready! Your webhook signing secret is whsec_xxxxx
   → POST /api/stripe/webhook [200]
   ```

5. **Verify in Supabase**:
   - Go to Supabase Table Editor
   - Open `users` table
   - Find your user
   - Check `is_ad_free` is now `true`

6. **Return to app**:
   - You should see "Payment Successful!" message
   - Ad-Free status should show as active
   - Ads should not display

## Troubleshooting

### Issue: Payment successful but user not upgraded

**Symptoms:**
- Payment goes through in Stripe
- User returns to settings page
- Still shows upgrade button
- `is_ad_free` is still `false` in database

**Causes & Solutions:**

#### 1. Webhook Not Set Up
**Check:**
```bash
# Look in your terminal for webhook events
# You should see: → POST /api/stripe/webhook [200]
```

**Fix:**
- Follow "Set Up Webhook" instructions above
- Make sure `STRIPE_WEBHOOK_SECRET` is in `.env.local`
- Restart your dev server after adding the secret

#### 2. Webhook Secret Mismatch
**Check:**
```bash
# Check your .env.local file
cat .env.local | grep STRIPE_WEBHOOK_SECRET
```

**Fix:**
- Get the correct secret from Stripe CLI or Stripe Dashboard
- Update `.env.local`
- Restart dev server

#### 3. Supabase Admin Client Not Working
**Check:** Look for errors in your terminal

**Fix:**
```bash
# Verify these are set in .env.local
NEXT_PUBLIC_SUPABASE_URL=your_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

#### 4. RLS Policies Blocking Update
**Check:** In Supabase SQL Editor, run:
```sql
SELECT * FROM users WHERE email = 'your-email@example.com';
```

**Fix:** The webhook uses the service role key which bypasses RLS, so this shouldn't be an issue. If it is, check that `supabaseAdmin` is properly configured.

### Issue: Ads still showing after upgrade

**Check:**
1. Is `user.is_ad_free` true in the database?
   ```sql
   SELECT is_ad_free FROM users WHERE email = 'your@email.com';
   ```

2. Is the user context loading the updated data?
   - Refresh the page
   - Check browser console for errors

**Fix:**
- The settings page now auto-refreshes user data
- If still showing, try logging out and back in

### Issue: Webhook returns 400 error

**Symptoms:**
```
✘ Error: webhook signature verification failed
```

**Fix:**
- Make sure you're using the webhook secret from Stripe CLI (when testing locally)
- Don't mix production and test mode secrets
- Check that `STRIPE_WEBHOOK_SECRET` matches exactly (no extra spaces)

## Manual Database Update (For Testing)

If you need to manually set a user as ad-free for testing:

```sql
-- In Supabase SQL Editor
UPDATE users 
SET is_ad_free = true 
WHERE email = 'your-email@example.com';
```

Then refresh the settings page to see the change.

## Verification Checklist

Before going live, verify:

- [ ] Webhook endpoint is accessible from Stripe
- [ ] Webhook secret is correctly set in environment variables
- [ ] Test payment completes successfully
- [ ] Webhook receives `checkout.session.completed` event
- [ ] User's `is_ad_free` field updates to `true` in database
- [ ] Settings page shows "Ad-Free Active!" after payment
- [ ] Ads no longer display on quiz pages
- [ ] Success URL redirects properly to `/settings?success=true`

## Production Deployment

1. **Switch to Live Mode** in Stripe
2. **Get Live API Keys**:
   - Publishable key (starts with `pk_live_`)
   - Secret key (starts with `sk_live_`)
3. **Update webhook endpoint** to production URL
4. **Get Live webhook secret** (starts with `whsec_`)
5. **Update environment variables** in Vercel
6. **Test with real card** (use small amount first!)

## Support

If issues persist:
1. Check Stripe Dashboard > Logs for webhook delivery status
2. Check your application logs for errors
3. Verify all environment variables are set correctly
4. Test webhook manually using Stripe CLI `stripe trigger`

---

**Need Help?** Check the main README.md or DEPLOYMENT.md for more information.

