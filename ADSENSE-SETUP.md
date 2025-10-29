# Google AdSense Setup and Verification

## Prerequisites

1. Google AdSense account
2. Your site deployed on Vercel and accessible
3. `NEXT_PUBLIC_ADSENSE_CLIENT_ID` set in Vercel environment variables

## Step 1: Add Your Site to AdSense

1. Go to [Google AdSense](https://www.google.com/adsense/)
2. Navigate to **Sites** in the left sidebar
3. Click **Add Site**
4. Enter your Vercel URL: `https://your-app.vercel.app`
5. Click **Save and Continue**

## Step 2: Verify AdSense Code is Present

The AdSense code is already integrated in your app:

### Main Script (in `app/layout.tsx`):
```jsx
<Script
  async
  src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
  crossOrigin="anonymous"
  strategy="lazyOnload"
/>
```

### Ad Unit on Landing Page (in `app/page.tsx`):
There's a display ad on your homepage that Google can verify.

## Step 3: Verify Your Site in AdSense

### Method 1: Automatic Verification (Recommended)
1. After adding your site, wait 24-48 hours
2. Google will automatically crawl your site
3. If the AdSense code is detected, you'll be verified automatically

### Method 2: Manual Verification
1. In AdSense, go to **Sites** → Your Site
2. Click **Get Code** or **Verify**
3. Follow the instructions (the code snippet should already be in your site)
4. Click **Request Review**

## Step 4: Update Ad Slot IDs

Once verified, create ad units and update the slot IDs in your code:

### Create Ad Units in AdSense:
1. Go to **Ads** → **Overview**
2. Click **By ad unit**
3. Create display ads for:
   - Landing page (responsive display ad)
   - Quiz page top (horizontal banner)
   - Quiz page bottom (horizontal banner)

### Update Your Code:

**In `app/page.tsx`** (line 65):
```jsx
data-ad-slot="YOUR_LANDING_PAGE_AD_SLOT_ID"
```

**In `app/(dashboard)/quiz/page.tsx`**:
- Top ad (around line 220): `data-ad-slot="YOUR_QUIZ_TOP_AD_SLOT_ID"`
- Bottom ad (around line 287): `data-ad-slot="YOUR_QUIZ_BOTTOM_AD_SLOT_ID"`

## Troubleshooting

### "Couldn't verify your site" Error

**Possible causes:**
1. **AdSense script not accessible**: Make sure your site is deployed and public
2. **Waiting period**: Google can take 24-48 hours to crawl your site
3. **robots.txt blocking**: Make sure you're not blocking Google's crawler
4. **HTTPS required**: AdSense requires HTTPS (Vercel provides this by default)

**Solutions:**
1. Wait 24-48 hours after deployment
2. Make sure `NEXT_PUBLIC_ADSENSE_CLIENT_ID` is set in Vercel
3. Visit your site's homepage to ensure the AdSense code is in the HTML source
4. Check browser console for any AdSense errors
5. Try the manual verification method

### How to Check if AdSense Code is Present

1. Go to your site's homepage: `https://your-app.vercel.app`
2. Right-click → **View Page Source**
3. Search for: `pagead2.googlesyndication.com`
4. You should see the AdSense script in the `<head>` section

### Ads Not Showing

**During verification:**
- Ads may show as blank spaces
- This is normal before account approval

**After approval:**
- Clear your browser cache
- Check that `is_ad_free` is `false` in your user profile
- Make sure you're testing while logged in (for quiz pages)
- Check browser console for errors

## Step 5: Test Ad Display

### For Free Users (Non-Ad-Free):
1. Sign up for a new account
2. Go to Dashboard → Select an episode → Take a quiz
3. You should see ads at the top and bottom of the quiz page

### For Ad-Free Users:
- No ads should appear after payment

## Important Notes

1. **Test Mode**: Use AdSense test mode during development
2. **Click Fraud**: Never click your own ads (can get you banned)
3. **Ad Placement**: Don't place too many ads or ads too close together
4. **Content Policy**: Ensure your content complies with AdSense policies
5. **Payment Threshold**: You need to earn $100 before AdSense pays out

## Vercel Environment Variable

Make sure this is set in Vercel:

```
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX
```

**To add/update:**
1. Go to Vercel Dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add or edit `NEXT_PUBLIC_ADSENSE_CLIENT_ID`
5. Redeploy your app

## Ad Revenue Settings

### In Settings Page (`app/(dashboard)/settings/page.tsx`):
Users can:
- See their ad-free status
- Purchase ad-free experience for $4.99
- After payment, `is_ad_free` is set to `true` and ads stop showing

## Next Steps

1. ✅ Deploy your site to Vercel
2. ✅ Add site to AdSense
3. ⏳ Wait for verification (24-48 hours)
4. ✅ Get approved
5. 📝 Create ad units and update slot IDs
6. 🎉 Start earning revenue!

## Support

If you're still having issues:
- [AdSense Help Center](https://support.google.com/adsense/)
- [AdSense Community](https://support.google.com/adsense/community)

