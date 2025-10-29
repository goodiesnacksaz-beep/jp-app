# Quick Start Guide

Get up and running with JP Vocab in 5 minutes!

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create `.env.local`:

```env
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe (Required for payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_AD_FREE_PRICE_ID=price_xxx

# Optional
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-xxx
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Set Up Supabase Database

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Go to SQL Editor
3. Copy and run the SQL from `supabase-schema.sql`

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🎯 First Steps

### Create an Admin Account

1. Sign up at `/signup`
2. In Supabase SQL Editor, run:
```sql
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```
3. Log out and log back in

### Upload Sample Vocabulary

1. Go to `/admin/upload`
2. Use the provided `sample-vocabulary.csv`
3. Create:
   - Anime: "Attack on Titan"
   - Season: 1
   - Episode: 1
4. Upload CSV and publish

### Take a Quiz

1. Go to `/dashboard`
2. Expand "Attack on Titan" > Season 1 > Episode 1
3. Click "Start Quiz"
4. Configure quiz and begin!

## 📁 Project Structure

```
myjp-srt/
├── app/                          # Next.js app directory
│   ├── (auth)/                   # Auth pages (login, signup)
│   ├── (dashboard)/              # Protected user pages
│   │   ├── dashboard/            # Main dashboard
│   │   ├── quiz/                 # Quiz pages
│   │   └── settings/             # User settings
│   ├── admin/                    # Admin pages
│   │   ├── upload/               # Upload vocabulary
│   │   └── manage/               # Manage content
│   ├── api/                      # API routes
│   │   └── stripe/               # Stripe endpoints
│   ├── auth/                     # Auth callback
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page
│   └── globals.css               # Global styles
├── components/                   # Reusable components
│   └── ui/                       # UI components
├── lib/                          # Utilities & config
│   ├── context/                  # React contexts
│   ├── supabase/                 # Supabase clients
│   ├── types/                    # TypeScript types
│   ├── quiz-logic.ts             # Quiz generation
│   └── utils.ts                  # Helper functions
├── supabase-schema.sql           # Database schema
├── sample-vocabulary.csv         # Sample CSV file
├── .env.local                    # Environment variables
└── README.md                     # Full documentation
```

## 🔧 Common Commands

```bash
# Development
npm run dev

# Build
npm run build

# Start production server
npm start

# Lint
npm run lint
```

## 🐛 Common Issues

### "Invalid API key"
- Check your `.env.local` file
- Verify Supabase keys are correct
- Restart dev server after changing env vars

### "Database connection failed"
- Ensure `supabase-schema.sql` was executed
- Check Supabase project is active
- Verify RLS policies are enabled

### "Cannot find module"
- Run `npm install` again
- Delete `node_modules` and `.next`, then reinstall

### Quiz not showing
- Ensure vocabulary list is published
- Check episode has vocabulary data
- Verify you're logged in

## 📚 Next Steps

1. **Read the full README**: Detailed setup instructions
2. **Check DEPLOYMENT.md**: Production deployment guide
3. **Customize**: Update branding, colors, content
4. **Add content**: Upload more anime and vocabulary
5. **Go live**: Deploy to Vercel

## 🆘 Need Help?

- Check the [README.md](README.md) for detailed documentation
- Review [DEPLOYMENT.md](DEPLOYMENT.md) for deployment help
- Open an issue on GitHub
- Check Supabase/Next.js documentation

## ✅ Development Checklist

- [ ] Supabase project created
- [ ] Database schema installed
- [ ] Environment variables set
- [ ] Dependencies installed
- [ ] Dev server running
- [ ] Admin account created
- [ ] Sample vocabulary uploaded
- [ ] Quiz tested successfully

---

Happy coding! 🎉

