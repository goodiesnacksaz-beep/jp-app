# Quick Payment Testing Guide

## The Problem You Experienced

When you completed a test payment, two things should have happened:
1. ✅ Stripe processed the payment successfully
2. ❌ **The webhook didn't update your database** (this is why nothing changed)

## Why It Didn't Work

The **webhook** is the key piece that's missing. Here's what happens:

```
User clicks "Upgrade" 
  ↓
Goes to Stripe checkout
  ↓
Enters card and pays
  ↓
Stripe charges card ✅
  ↓
Stripe sends webhook to your app ❌ (THIS FAILED)
  ↓
Your app updates database (never happened)
  ↓
User returns to settings
  ↓
Still shows upgrade button (because database wasn't updated)
```

## Quick Fix for Local Testing

### Step 1: Install Stripe CLI

**Windows:**
```powershell
# Using Scoop
scoop install stripe

# Or download from: https://github.com/stripe/stripe-cli/releases
```

**Mac:**
```bash
brew install stripe/stripe-cli/stripe
```

**Linux:**
```bash
# Download and extract from: https://github.com/stripe/stripe-cli/releases
```

### Step 2: Login to Stripe

```bash
stripe login
```

This will open your browser to authorize the CLI.

### Step 3: Start Webhook Forwarding

**Open a NEW terminal** (keep your dev server running in the first one):

```bash
cd C:\Development\myjp-srt
stripe listen --forward-to http://localhost:3000/api/stripe/webhook
```

You'll see:
```
> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx
```

### Step 4: Copy the Webhook Secret

Copy the `whsec_` secret shown in the terminal.

### Step 5: Update .env.local

Add or update this line in your `.env.local` file:

```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

(Use the actual secret from Step 4)

### Step 6: Restart Your Dev Server

In your **first terminal** (where `npm run dev` is running):
```bash
# Press Ctrl+C to stop
npm run dev
```

### Step 7: Test Again

1. Go to http://localhost:3000/settings
2. Click "Upgrade to Ad-Free"
3. Use test card: `4242 4242 4242 4242`
4. Use expiry: `12/34`, CVC: `123`, ZIP: `12345`
5. Click "Pay"

### Step 8: Watch the Webhooks!

In your **second terminal** (where Stripe CLI is running), you should see:

```
[200] POST http://localhost:3000/api/stripe/webhook [evt_xxxxx]
✅ Checkout session completed: {...}
🔄 Updating user xxx to ad-free...
✅ User upgraded successfully: [...]
```

### Step 9: Verify It Worked

After payment, you should:
1. See a green "Payment Successful!" message
2. See "Ad-Free Active!" status
3. No longer see ads on quiz pages

## Manual Verification

If you want to check the database directly:

1. Go to your Supabase project
2. Open Table Editor
3. Select `users` table
4. Find your user by email
5. Check that `is_ad_free` column is `true`

## Quick Manual Fix (For Testing Only)

If you just want to test the ad-free experience without payment:

1. Go to Supabase SQL Editor
2. Run:
```sql
UPDATE users 
SET is_ad_free = true 
WHERE email = 'your-test-email@example.com';
```
3. Refresh the settings page
4. Log out and log back in if needed

## Common Issues

### "Webhook signature verification failed"

**Cause:** Wrong webhook secret in `.env.local`

**Fix:**
1. Check the secret in your Stripe CLI terminal
2. Copy it exactly (including `whsec_`)
3. Update `.env.local`
4. Restart dev server

### Webhook terminal shows nothing

**Cause:** Stripe CLI not running or not forwarding

**Fix:**
1. Make sure `stripe listen` is running
2. Check it says "Ready!" and shows the forward URL
3. Try stopping and starting it again

### Database not updating

**Cause:** Supabase credentials wrong

**Fix:**
1. Check `.env.local` has:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY` (NOT the anon key!)
2. Restart dev server

### "Payment Successful" message but still showing upgrade button

**Cause:** User data not refreshing

**Fix:**
1. Hard refresh the page (Ctrl+Shift+R)
2. Or log out and log back in
3. Check database to confirm `is_ad_free` is `true`

## Testing Checklist

- [ ] Stripe CLI installed
- [ ] `stripe login` completed
- [ ] `stripe listen` running in separate terminal
- [ ] Webhook secret copied to `.env.local`
- [ ] Dev server restarted after adding secret
- [ ] Test payment completed
- [ ] Webhook received (visible in Stripe CLI terminal)
- [ ] Database updated (`is_ad_free = true`)
- [ ] Settings page shows "Ad-Free Active!"
- [ ] Ads no longer display

## For Production

See **STRIPE-SETUP.md** for production webhook configuration (you'll set up a webhook endpoint in Stripe Dashboard instead of using the CLI).

---

**Still having issues?** Check the terminal logs carefully - they now show emoji indicators (✅ ❌ 🔄) to help you debug!

