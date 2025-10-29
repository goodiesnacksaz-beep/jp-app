# JP Vocab - Japanese Vocabulary Learning Through Anime

A full-stack web application for learning Japanese vocabulary through interactive quizzes based on anime episodes.

## 🚀 Features

### User Features
- **Interactive Quizzes**: Multiple quiz types (meaning from word+reading, word from meaning, reading from word)
- **Episode-Based Learning**: Learn vocabulary from specific anime episodes
- **Immediate Feedback**: Get instant feedback on quiz answers
- **Progress Tracking**: View quiz results and track your learning journey
- **Ad-Free Upgrade**: One-time payment to remove advertisements

### Admin Features
- **CSV Upload**: Easily upload vocabulary lists via CSV files
- **Content Management**: Create and manage anime, seasons, episodes, and vocabulary
- **Editable Preview**: Preview and edit vocabulary data before publishing
- **Publish Control**: Save as draft or publish content for users

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payment**: Stripe
- **Ads**: Google AdSense
- **CSV Parsing**: PapaParse
- **Deployment**: Vercel

## 📋 Prerequisites

Before you begin, ensure you have:
- Node.js 18+ installed
- A Supabase account and project
- A Stripe account (for payments)
- A Google AdSense account (optional, for ads)

## 🔧 Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd myjp-srt
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
STRIPE_AD_FREE_PRICE_ID=your_stripe_price_id

# Google AdSense (Optional)
NEXT_PUBLIC_ADSENSE_CLIENT_ID=your_adsense_client_id

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🗄️ Database Setup

1. **Create a Supabase project** at [supabase.com](https://supabase.com)

2. **Run the database schema**
   - Open the Supabase SQL Editor
   - Copy the contents of `supabase-schema.sql`
   - Execute the SQL script

3. **Configure Row Level Security (RLS)**
   - The schema includes RLS policies
   - Ensure they're enabled in your Supabase dashboard

4. **Create an admin user**
   - Sign up through your app
   - In Supabase, update the user's role:
   ```sql
   UPDATE public.users 
   SET role = 'admin' 
   WHERE email = 'your-admin-email@example.com';
   ```

## 💳 Stripe Setup

1. **Create a Stripe account** at [stripe.com](https://stripe.com)

2. **Create a Product**
   - Go to Products in Stripe Dashboard
   - Create a new product: "Ad-Free Upgrade"
   - Set a one-time payment price (e.g., $4.99)
   - Copy the Price ID to `STRIPE_AD_FREE_PRICE_ID`

3. **Set up Webhook**
   - Go to Developers > Webhooks
   - Add endpoint: `https://your-domain.com/api/stripe/webhook`
   - Select event: `checkout.session.completed`
   - Copy the webhook secret to `STRIPE_WEBHOOK_SECRET`

## 📺 Google AdSense Setup (Optional)

1. **Apply for AdSense** at [adsense.google.com](https://www.google.com/adsense/)

2. **Get your Client ID**
   - Once approved, find your publisher ID (ca-pub-XXXXXXXXXXXXXXXX)
   - Add it to `NEXT_PUBLIC_ADSENSE_CLIENT_ID`

3. **Ad placement**
   - Ads are automatically displayed on quiz pages
   - Users with ad-free upgrade won't see ads

## 🚀 Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Building for Production

```bash
npm run build
npm start
```

## 🌐 Deployment

### Deploy to Vercel

1. **Push your code to GitHub**

2. **Import project in Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add all environment variables
   - Deploy

3. **Update Stripe webhook URL**
   - Update webhook endpoint to your production URL
   - Update `NEXT_PUBLIC_APP_URL` to your production domain

## 📝 CSV Format

When uploading vocabulary, use this CSV format:

```csv
word,reading,meaning
進撃,しんげき,advance/attack
巨人,きょじん,giant/titan
壁,かべ,wall
調査,ちょうさ,investigation
兵団,へいだん,corps
```

- **word**: Japanese word (kanji/kana/katakana)
- **reading**: Hiragana reading
- **meaning**: English translation

## 🔐 Security

- Passwords are hashed using Supabase Auth
- Row Level Security (RLS) enabled on all tables
- API routes protected with authentication
- Stripe webhook signature verification
- Environment variables for sensitive data

## 📱 Features by Role

### Regular Users
- Browse anime directory
- Take quizzes on episodes
- View quiz results
- Track progress
- Upgrade to ad-free

### Admin Users
- All user features
- Upload vocabulary via CSV
- Create/manage anime, seasons, episodes
- Edit vocabulary lists
- Publish/unpublish content
- Delete vocabulary lists

## 🐛 Troubleshooting

### Database Connection Issues
- Verify Supabase URL and keys
- Check RLS policies are correctly set
- Ensure database schema is properly installed

### Stripe Webhook Not Working
- Verify webhook secret is correct
- Check webhook endpoint URL
- Test with Stripe CLI: `stripe listen --forward-to localhost:3000/api/stripe/webhook`

### AdSense Not Showing
- Ensure client ID is correct
- Check ad blocker is disabled
- AdSense approval can take time

## 📄 License

This project is licensed under the ISC License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support, please open an issue in the GitHub repository.

---

Built with ❤️ using Next.js and Supabase

