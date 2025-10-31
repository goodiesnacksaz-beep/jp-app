# KOTOBAnime - Project Logic Documentation

**Version:** 1.0  
**Last Updated:** October 30, 2025  
**Project:** Japanese Vocabulary Learning Platform

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture & Tech Stack](#2-architecture--tech-stack)
3. [Database Schema & Relationships](#3-database-schema--relationships)
4. [Authentication & Authorization](#4-authentication--authorization)
5. [User Flow & Journey](#5-user-flow--journey)
6. [Quiz System Logic](#6-quiz-system-logic)
7. [Admin Content Management](#7-admin-content-management)
8. [Payment Integration](#8-payment-integration)
9. [Advertisement System](#9-advertisement-system)
10. [Security Implementation](#10-security-implementation)
11. [Key Components & Their Logic](#11-key-components--their-logic)
12. [Data Flow Diagrams](#12-data-flow-diagrams)

---

## 1. Project Overview

### Purpose
KOTOBAnime is a full-stack web application designed to help users learn Japanese vocabulary through interactive quizzes based on anime episodes they watch. The platform bridges entertainment and education by contextualizing vocabulary within familiar anime content.

### Core Concept
- **Problem:** Traditional vocabulary learning is disconnected from real-world usage
- **Solution:** Learn vocabulary from specific anime episodes you've watched
- **Method:** Interactive quizzes with immediate feedback
- **Monetization:** One-time payment for ad-free experience

### Key Features
1. **Episode-Based Learning:** Vocabulary organized by anime, season, and episode
2. **Multiple Quiz Types:** Test different aspects of vocabulary knowledge
3. **Progress Tracking:** Monitor learning journey through quiz attempts
4. **Admin Portal:** Content management system for uploading and managing vocabulary
5. **Payment System:** Stripe integration for ad-free upgrades
6. **Demo Mode:** Try before signing up

---

## 2. Architecture & Tech Stack

### Frontend Architecture
```
Next.js 14 (App Router) + TypeScript + Tailwind CSS
├── App Router Structure
│   ├── (auth) - Authentication pages
│   ├── (dashboard) - Authenticated user pages
│   ├── admin - Admin-only pages
│   ├── demo - Public demo pages
│   └── api - API routes
```

### Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 14 | Server-side rendering, routing, API routes |
| **Language** | TypeScript | Type safety, better DX |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **Database** | Supabase (PostgreSQL) | Data storage, real-time capabilities |
| **Auth** | Supabase Auth | User authentication & session management |
| **Payment** | Stripe | Payment processing |
| **Ads** | Google AdSense | Monetization through ads |
| **CSV Parsing** | PapaParse | Vocabulary file parsing |
| **Deployment** | Vercel | Serverless deployment |

### Project Structure
```
jp-app/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth group (login, signup)
│   ├── (dashboard)/       # Protected routes (quiz, settings)
│   ├── admin/             # Admin-only routes
│   ├── api/               # API endpoints
│   ├── demo/              # Public demo
│   └── layout.tsx         # Root layout
├── components/            # React components
│   └── ui/               # Reusable UI components
├── lib/                   # Utility libraries
│   ├── context/          # React contexts
│   ├── supabase/         # Database clients
│   └── types/            # TypeScript types
└── public/               # Static assets
```

---

## 3. Database Schema & Relationships

### Entity Relationship Diagram

```
auth.users (Supabase Auth)
    ↓ (1:1)
users
    ↓ (1:many)
quiz_attempts
    ↓
vocabulary_lists

animes
    ↓ (1:many)
seasons
    ↓ (1:many)
episodes
    ↓ (1:many)
vocabulary_lists
    ↓ (1:many)
vocabulary_words
```

### Table Descriptions

#### 1. **users** (extends auth.users)
```typescript
{
  id: UUID (FK to auth.users)
  email: string
  role: 'user' | 'admin'
  is_ad_free: boolean
  stripe_payment_id: string | null
  created_at: timestamp
  updated_at: timestamp
}
```
**Purpose:** Store user-specific data and permissions
**Logic:** Created automatically via trigger when Supabase auth user signs up

#### 2. **animes**
```typescript
{
  id: UUID
  name: string
  slug: string (unique)
  created_at: timestamp
  updated_at: timestamp
}
```
**Purpose:** Top-level content organization
**Example:** "Attack on Titan", "Death Note"

#### 3. **seasons**
```typescript
{
  id: UUID
  anime_id: UUID (FK)
  season_number: integer
  created_at: timestamp
}
```
**Purpose:** Organize episodes by season
**Relationship:** One anime has many seasons

#### 4. **episodes**
```typescript
{
  id: UUID
  season_id: UUID (FK)
  episode_number: integer
  created_at: timestamp
  updated_at: timestamp
}
```
**Purpose:** Individual episode identification
**Relationship:** One season has many episodes

#### 5. **vocabulary_lists**
```typescript
{
  id: UUID
  episode_id: UUID (FK)
  csv_filename: string | null
  uploaded_by: UUID (FK to users)
  is_published: boolean
  created_at: timestamp
  updated_at: timestamp
}
```
**Purpose:** Container for episode vocabulary
**Logic:** 
- Only published lists visible to regular users
- Can be saved as draft before publishing
- One episode can have one vocabulary list

#### 6. **vocabulary_words**
```typescript
{
  id: UUID
  vocabulary_list_id: UUID (FK)
  word: string (kanji/kana)
  reading: string (hiragana)
  meaning: string (English)
  order_index: integer
  created_at: timestamp
  updated_at: timestamp
}
```
**Purpose:** Individual vocabulary entries
**Logic:** 
- order_index maintains CSV upload order
- Deleted when parent list is deleted (CASCADE)

#### 7. **quiz_attempts**
```typescript
{
  id: UUID
  user_id: UUID (FK)
  vocabulary_list_id: UUID (FK, nullable)
  quiz_type: string
  total_questions: integer
  correct_answers: integer
  completed_at: timestamp
}
```
**Purpose:** Track user quiz performance
**Logic:** 
- Created when user completes a quiz
- Used for progress tracking
- Nullable vocabulary_list_id (in case list deleted)

### Data Integrity

#### Cascading Deletes
```
anime → season → episode → vocabulary_list → vocabulary_words
  ↓       ↓         ↓            ↓
DELETE cascades down the hierarchy
```

#### Row Level Security (RLS)
Every table has RLS enabled with specific policies:
- **Public Read:** animes, seasons, episodes, published vocabulary
- **User-Specific:** quiz_attempts (only own data)
- **Admin-Only Write:** Content management tables
- **Self-Update:** User profile updates

---

## 4. Authentication & Authorization

### Authentication Flow

#### Sign Up Process
```
1. User enters email/password → Supabase Auth
2. Supabase creates auth.users record
3. Database trigger fires → creates public.users record
4. Default role: 'user', is_ad_free: false
5. User redirected to dashboard
```

#### Login Process
```
1. User enters credentials → Supabase Auth
2. Supabase validates and creates session
3. Session stored in cookies (httpOnly)
4. JWT token contains user ID
5. User redirected to dashboard
```

#### Session Management
- **Storage:** HTTP-only cookies
- **Duration:** Configurable in Supabase
- **Refresh:** Automatic token refresh
- **Validation:** Middleware checks on protected routes

### Authorization Levels

#### 1. Public (Unauthenticated)
**Access:**
- Landing page
- Demo quiz
- Login/Signup pages

**Restrictions:**
- Cannot save progress
- Cannot access dashboard
- Cannot take full quizzes

#### 2. User (Authenticated)
**Access:**
- Dashboard
- Browse anime/episodes
- Take quizzes
- View own quiz results
- Settings page
- Payment for ad-free

**Restrictions:**
- Cannot access admin panel
- Cannot upload content
- Cannot publish/unpublish
- Cannot see unpublished content

#### 3. Admin (Authenticated + role='admin')
**Access:**
- All user features
- Admin panel
- Upload vocabulary via CSV
- Create/edit/delete content
- Publish/unpublish lists
- View all quiz attempts
- See unpublished content

**Assignment:**
```sql
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'admin@example.com';
```

### Middleware Protection

File: `middleware.ts`

```typescript
Logic:
1. Check if route requires authentication
2. Verify Supabase session exists
3. If protected route + no session → redirect to /login
4. If admin route + not admin → redirect to /dashboard
5. Allow request to proceed
```

Protected Routes:
- `/dashboard/*` → Requires authentication
- `/quiz/*` → Requires authentication
- `/settings` → Requires authentication
- `/admin/*` → Requires authentication + admin role

---

## 5. User Flow & Journey

### New User Journey

#### 1. Landing Page (`/`)
```
User arrives → Sees features → Has 3 options:
├── "Try Demo Quiz" → /demo
├── "Sign Up" → /signup
└── "Login" → /login
```

#### 2. Demo Experience (`/demo`)
```
Demo Quiz Flow:
1. 10 pre-loaded vocabulary words (Attack on Titan)
2. meaning-from-word-reading quiz type
3. No authentication required
4. Results shown with sign-up CTA
5. Cannot save progress

Purpose: Convert visitors to users
```

#### 3. Sign Up (`/signup`)
```
Registration:
1. Enter email + password (min 6 chars)
2. Confirm password
3. Supabase creates account
4. Auto-login + redirect to dashboard
5. Welcome shown
```

### Authenticated User Journey

#### 4. Dashboard (`/dashboard`)
```
Main Hub:
1. Browse anime directory
2. Select anime → View seasons
3. Select season → View episodes
4. Select episode → Setup quiz
5. View recent quiz attempts
```

#### 5. Quiz Setup (`/quiz/setup`)
```
Configuration:
1. Selected episode vocabulary displayed
2. Choose quiz type:
   ├── Meaning from Word+Reading
   ├── Word from Meaning
   └── Reading from Word
3. Choose number of questions (5, 10, 15, 20, or All)
4. Click "Start Quiz"
5. Navigate to /quiz with parameters
```

#### 6. Quiz Taking (`/quiz`)
```
Quiz Flow:
1. Load vocabulary words from database
2. Generate questions using quiz logic
3. Shuffle options
4. Present one question at a time
5. User selects answer
6. Immediate feedback (correct/incorrect)
7. Show word details
8. "Next Question" or "View Results"
9. Save attempt to database
10. Navigate to /quiz/results
```

#### 7. Results Page (`/quiz/results`)
```
Results Display:
1. Show score (correct/total)
2. Calculate percentage
3. Grade message based on score
4. List all incorrect answers with corrections
5. Word details for review
6. Options:
   ├── "Back to Dashboard"
   └── "Retake Quiz"
```

### Admin Journey

#### 8. Admin Panel (`/admin`)
```
Admin Hub:
├── Upload Vocabulary
└── Manage Content
```

#### 9. Upload Flow (`/admin/upload`)
```
CSV Upload Process:
1. Select/Create Anime
2. Select/Create Season
3. Select/Create Episode
4. Upload CSV file
5. Parse CSV → Preview table
6. Edit vocabulary if needed
7. Choose:
   ├── Save as Draft
   └── Publish Now
8. Save to database
9. Success confirmation
```

#### 10. Manage Content (`/admin/manage`)
```
Management Options:
1. View all vocabulary lists
2. Filter by anime/season/episode
3. Toggle publish/unpublish
4. Edit vocabulary
5. Delete lists
6. View upload history
```

---

## 6. Quiz System Logic

### Quiz Generation Process

File: `lib/quiz-logic.ts`

#### Step 1: Fetch Vocabulary
```typescript
Input: episode_id
Query: Get all vocabulary_words for episode's list
Filter: Only published lists
Order: By order_index
```

#### Step 2: Select Words
```typescript
Available words: vocabularyWords[]
User choice: questionCount (5, 10, 15, 20, or all)
Selection: Shuffle words → Take first N words
Result: selectedWords[]
```

#### Step 3: Generate Questions
```typescript
For each selectedWord:
  1. Create question based on quiz type
  2. Generate 3 distractors
  3. Combine correct answer + distractors
  4. Shuffle options
  5. Track correct answer index
  6. Return QuizQuestion object
```

### Quiz Types

#### 1. Meaning from Word+Reading
```
Question: "What is the meaning of: 進撃 (しんげき)?"
Correct Answer: "advance/attack"
Distractors: 3 random meanings from other words
Logic: Test comprehension
```

#### 2. Word from Meaning
```
Question: "Which word means: advance/attack?"
Correct Answer: "進撃"
Distractors: 3 random words from list
Logic: Test production/recall
```

#### 3. Reading from Word
```
Question: "What is the reading of: 進撃?"
Correct Answer: "しんげき"
Distractors: 3 random readings from list
Logic: Test reading ability
```

### Distractor Generation

```typescript
function generateDistractors(
  allWords: VocabularyWord[],
  currentWordId: string,
  extractField: (word) => string,
  count: 3
): string[] {
  Logic:
  1. Filter out current word
  2. Shuffle remaining words
  3. Extract target field (word/reading/meaning)
  4. Ensure uniqueness (no duplicates)
  5. Take first 3 unique values
  6. If insufficient, pad with placeholders
  7. Return distractors[]
}
```

### Answer Validation

```typescript
Client-side:
1. User clicks option
2. Compare with correctAnswer
3. Create QuizAnswer object:
   {
     questionId: string
     selectedAnswer: string
     isCorrect: boolean
     correctAnswer: string
     vocabularyWord: VocabularyWord
   }
4. Add to answers array
5. Display feedback
6. Show "Next Question" button

Server-side (on finish):
1. Calculate correct count
2. Save to quiz_attempts table
3. Store results in sessionStorage
4. Redirect to results page
```

### Score Calculation

```typescript
Inputs: answers: QuizAnswer[]
Process:
  correct = answers.filter(a => a.isCorrect).length
  total = answers.length
  percentage = Math.round((correct / total) * 100)
  
Grade Determination:
  >= 90%: "Outstanding!"
  >= 80%: "Great Job!"
  >= 70%: "Good Work!"
  >= 60%: "Keep Practicing!"
  < 60%: "Keep Trying!"
```

---

## 7. Admin Content Management

### Vocabulary Upload Flow

File: `app/admin/upload/page.tsx`

#### Phase 1: Content Setup
```typescript
Process:
1. Fetch existing animes from database
2. Display anime selection dropdown
3. Option to create new anime
4. On anime select → Fetch seasons
5. Display season selection
6. Option to create new season
7. On season select → Fetch episodes
8. Display episode selection
9. Option to create new episode
```

#### Phase 2: CSV Upload
```typescript
Requirements:
- Format: CSV with headers: word,reading,meaning
- Encoding: UTF-8
- Example:
  word,reading,meaning
  進撃,しんげき,advance/attack
  巨人,きょじん,giant/titan

Processing:
1. User selects CSV file
2. PapaParse.parse(file)
3. Validate headers
4. Parse rows into array
5. Add order_index to each row
6. Display preview table
```

#### Phase 3: Preview & Edit
```typescript
Preview Features:
1. Editable table showing all words
2. Columns: Word, Reading, Meaning
3. Edit any cell inline
4. Delete rows
5. Add new rows
6. Reorder (via order_index)
7. Validation on each cell
```

#### Phase 4: Save to Database
```typescript
Save Process:
1. Create vocabulary_list record
   - episode_id
   - csv_filename
   - uploaded_by (admin user ID)
   - is_published (based on user choice)
2. Bulk insert vocabulary_words
   - One record per row
   - Maintain order_index
3. Transaction to ensure atomicity
4. On success → Redirect to manage page
5. On error → Display error message
```

### Content Management Operations

File: `app/admin/manage/page.tsx`

#### View All Lists
```typescript
Query:
  SELECT vocabulary_lists
  JOIN episodes ON vocabulary_lists.episode_id = episodes.id
  JOIN seasons ON episodes.season_id = seasons.id
  JOIN animes ON seasons.anime_id = animes.id
  ORDER BY created_at DESC

Display:
  - Anime name
  - Season number
  - Episode number
  - Filename
  - Published status
  - Actions
```

#### Publish/Unpublish
```typescript
Toggle Logic:
1. Find vocabulary_list by ID
2. Toggle is_published boolean
3. UPDATE database
4. Refresh list

Effect:
  - Published → Visible to all users
  - Unpublished → Only admins can see
```

#### Delete List
```typescript
Delete Process:
1. Confirm deletion (prevent accidents)
2. DELETE vocabulary_list record
3. CASCADE deletes all vocabulary_words
4. CASCADE sets quiz_attempts.vocabulary_list_id to NULL
5. Refresh list

Warning: Cannot be undone
```

#### Edit Vocabulary
```typescript
Edit Flow:
1. Click "Edit" on list
2. Fetch all vocabulary_words
3. Display in editable table
4. Allow inline edits
5. Add/remove words
6. Save changes via UPDATE queries
7. Maintain order_index consistency
```

---

## 8. Payment Integration

### Stripe Integration Architecture

Files:
- `app/api/stripe/create-checkout/route.ts`
- `app/api/stripe/webhook/route.ts`
- `app/(dashboard)/settings/page.tsx`

### Payment Flow

#### Step 1: User Initiates Payment
```typescript
Location: Settings Page

Process:
1. User clicks "Upgrade to Ad-Free"
2. Check if already ad-free (prevent duplicate payment)
3. POST to /api/stripe/create-checkout
4. Payload: { userId: string }
```

#### Step 2: Create Checkout Session
```typescript
API: POST /api/stripe/create-checkout

Logic:
1. Verify user authentication
2. Check user not already ad-free
3. Create Stripe Checkout Session:
   {
     mode: 'payment'
     line_items: [{
       price: STRIPE_AD_FREE_PRICE_ID
       quantity: 1
     }]
     success_url: APP_URL/settings?success=true
     cancel_url: APP_URL/settings?canceled=true
     metadata: { userId: string }
   }
4. Return session URL
5. Redirect user to Stripe Checkout
```

#### Step 3: User Completes Payment
```
User Experience:
1. Redirected to Stripe Checkout page
2. Enter payment details
3. Click "Pay"
4. Stripe processes payment
5. Redirected back to success_url
```

#### Step 4: Webhook Processing
```typescript
API: POST /api/stripe/webhook

Trigger: checkout.session.completed event

Process:
1. Receive webhook from Stripe
2. Verify webhook signature (security)
3. Extract event data
4. If event.type === 'checkout.session.completed':
   a. Get session data
   b. Extract userId from metadata
   c. Extract payment_intent ID
   d. UPDATE users SET:
      - is_ad_free = true
      - stripe_payment_id = payment_intent
   e. Return 200 OK
5. Stripe marks webhook as successful
```

#### Step 5: User Sees Results
```typescript
Settings Page:

On Load:
1. Check URL params for success/canceled
2. Display appropriate message
3. Fetch user data
4. Show updated ad-free status
5. If ad-free → Hide payment button
```

### Ad-Free Logic

```typescript
Condition Check (throughout app):

if (user.is_ad_free) {
  // Hide AdSense components
  // No ads displayed
} else {
  // Show AdSense ads
  // Display ads on quiz pages
}

Implementation:
- Checked in layout components
- Conditional rendering of <AdSense />
- Real-time update after payment
```

### Payment Security

1. **Webhook Signature Verification**
   ```typescript
   stripe.webhooks.constructEvent(
     body,
     signature,
     webhookSecret
   )
   // Ensures webhook came from Stripe
   ```

2. **User Verification**
   - Verify authenticated user
   - Check user exists in database
   - Validate user isn't already ad-free

3. **Idempotency**
   - Check payment_id before processing
   - Prevent duplicate upgrades
   - Handle webhook retries

4. **Error Handling**
   - Try-catch all operations
   - Return appropriate HTTP codes
   - Log errors for debugging

---

## 9. Advertisement System

### Google AdSense Integration

File: `components/AdSense.tsx`

### Implementation

#### AdSense Component
```typescript
interface Props {
  adSlot: string
  className?: string
}

Component Logic:
1. Check user is NOT ad-free
2. Only render in production
3. Initialize AdSense script
4. Display ad unit with proper slot ID
```

#### Ad Placement
```
Locations:
1. Quiz Setup Page (top & bottom)
2. Quiz Results Page (top & bottom)
3. Demo Pages (for non-users)

NOT shown:
- Dashboard (clean UX)
- Admin panel
- To ad-free users
```

#### Ad Loading
```typescript
Root Layout (app/layout.tsx):

<Script>
  async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
  data-ad-client={ADSENSE_CLIENT_ID}
  strategy="afterInteractive"
</Script>

Effect:
- Loads AdSense globally
- Once per session
- Non-blocking
```

### Ad-Free Feature Value

**User Benefits:**
- No interruptions during learning
- Faster page loads
- Better user experience
- One-time payment (not subscription)

**Business Benefits:**
- Revenue from ad-free upgrades
- User retention incentive
- Premium experience option
- Complements ad revenue

---

## 10. Security Implementation

### Row Level Security (RLS)

#### User Data Protection
```sql
Policy: "Users can view their own profile"
Rule: auth.uid() = users.id
Effect: Users can only access their own data
```

#### Content Visibility
```sql
Policy: "Users can view published vocabulary lists"
Rule: is_published = true OR user.role = 'admin'
Effect: Unpublished content hidden from regular users
```

#### Quiz Attempts Privacy
```sql
Policy: "Users can view their own quiz attempts"
Rule: auth.uid() = quiz_attempts.user_id
Effect: Cannot see other users' quiz results
```

#### Admin-Only Operations
```sql
Policy: "Admins can manage content"
Rule: EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
Effect: Only admins can INSERT/UPDATE/DELETE content
```

### Authentication Security

1. **Password Requirements**
   - Minimum 6 characters
   - Validated client & server-side
   - Hashed by Supabase Auth (bcrypt)
   - Never stored in plain text

2. **Session Management**
   - JWT tokens
   - HTTP-only cookies
   - Automatic refresh
   - Secure flag in production

3. **API Protection**
   - Middleware checks all routes
   - Supabase validates tokens
   - Role verification for admin routes
   - CSRF protection

### Payment Security

1. **Stripe Security**
   - PCI DSS compliant
   - No card data touches server
   - Webhook signature verification
   - Secure API keys

2. **Database Security**
   - Service role key server-side only
   - Anon key for client (limited access)
   - Environment variables
   - No secrets in code

### Input Validation

#### CSV Upload
```typescript
Validation:
1. File type check (must be .csv)
2. File size limit (prevent DOS)
3. Parse errors caught
4. SQL injection prevention (parameterized queries)
5. XSS prevention (sanitize display)
```

#### Form Inputs
```typescript
Validation:
1. Email format
2. Password strength
3. Required fields
4. Type checking (TypeScript)
5. Sanitization before display
```

---

## 11. Key Components & Their Logic

### AuthContext (`lib/context/AuthContext.tsx`)

**Purpose:** Global authentication state management

```typescript
Features:
1. Current user state
2. Loading state
3. Sign in method
4. Sign up method
5. Sign out method
6. Session persistence

Logic:
- Uses Supabase Auth
- Listens to auth state changes
- Provides user data to all components
- Auto-redirects on auth changes
```

### QuizLogic (`lib/quiz-logic.ts`)

**Purpose:** Quiz question generation & scoring

```typescript
Key Functions:

1. generateQuizQuestions()
   Input: words[], type, count
   Output: QuizQuestion[]
   Logic: Shuffle, select, create questions

2. generateDistractors()
   Input: words[], currentId, field, count
   Output: string[]
   Logic: Random wrong answers

3. calculateScore()
   Input: QuizAnswer[]
   Output: { correct, total, percentage }
   Logic: Count correct answers
```

### Supabase Clients

#### Client-side (`lib/supabase/client.ts`)
```typescript
Usage: Browser operations
Auth: User session
Scope: Limited by RLS
Security: Anon key
```

#### Server-side (`lib/supabase/server.ts`)
```typescript
Usage: API routes, Server Components
Auth: Service role
Scope: Bypass RLS (admin operations)
Security: Service role key
```

---

## 12. Data Flow Diagrams

### User Quiz Flow

```
┌──────────────┐
│   Browser    │
└──────┬───────┘
       │
       ↓ 1. Navigate /quiz/setup?listId=xxx
┌──────────────────────┐
│  Quiz Setup Page     │
│  - Fetch vocab list  │
│  - Choose quiz type  │
│  - Choose count      │
└──────┬───────────────┘
       │
       ↓ 2. Click "Start Quiz"
┌──────────────────────┐
│  Quiz Page           │
│  - Generate questions│
│  - Show one at time  │
└──────┬───────────────┘
       │
       ↓ 3. Answer questions
┌──────────────────────┐
│  Quiz Logic          │
│  - Validate answer   │
│  - Store result      │
│  - Next question     │
└──────┬───────────────┘
       │
       ↓ 4. Quiz complete
┌──────────────────────┐
│  Save to Database    │
│  - Create quiz       │
│    attempt           │
└──────┬───────────────┘
       │
       ↓ 5. Store in session
┌──────────────────────┐
│  Results Page        │
│  - Load from session │
│  - Calculate score   │
│  - Show details      │
└──────────────────────┘
```

### Admin Upload Flow

```
┌──────────────┐
│ Admin Panel  │
└──────┬───────┘
       │
       ↓ 1. Select content hierarchy
┌──────────────────────┐
│ Content Selection    │
│ - Anime              │
│ - Season             │
│ - Episode            │
└──────┬───────────────┘
       │
       ↓ 2. Upload CSV
┌──────────────────────┐
│ File Processing      │
│ - PapaParse          │
│ - Validate format    │
│ - Generate preview   │
└──────┬───────────────┘
       │
       ↓ 3. Review & edit
┌──────────────────────┐
│ Preview Table        │
│ - Edit cells         │
│ - Add/remove rows    │
│ - Validate data      │
└──────┬───────────────┘
       │
       ↓ 4. Choose publish status
┌──────────────────────┐
│ Save to Database     │
│ - Create list        │
│ - Insert words       │
│ - Set published flag │
└──────┬───────────────┘
       │
       ↓ 5. Success
┌──────────────────────┐
│ Content Now          │
│ Available to Users   │
└──────────────────────┘
```

### Payment Flow

```
┌──────────────┐
│ User         │
└──────┬───────┘
       │
       ↓ 1. Click "Upgrade"
┌──────────────────────┐
│ Settings Page        │
│ - Check eligibility  │
└──────┬───────────────┘
       │
       ↓ 2. POST to API
┌──────────────────────┐
│ Create Checkout      │
│ - Stripe Session     │
│ - Return URL         │
└──────┬───────────────┘
       │
       ↓ 3. Redirect
┌──────────────────────┐
│ Stripe Checkout      │
│ - Enter payment      │
│ - Process payment    │
└──────┬───────────────┘
       │
       ├─→ 4a. Success
       │   ┌──────────────────┐
       │   │ Stripe Webhook   │
       │   │ - Verify sig     │
       │   │ - Update user    │
       │   │ - Set ad-free    │
       │   └──────────────────┘
       │
       └─→ 4b. Cancel
           ┌──────────────────┐
           │ Return to        │
           │ Settings         │
           └──────────────────┘
```

---

## Conclusion

This documentation provides a comprehensive overview of the KOTOBAnime project's logic, architecture, and implementation details. The system is designed with:

- **Security First:** RLS, authentication, payment verification
- **User Experience:** Immediate feedback, progress tracking, demo mode
- **Admin Efficiency:** CSV upload, content management, publish control
- **Monetization:** Stripe integration, ad-free upgrades, AdSense
- **Scalability:** Serverless architecture, optimized queries, caching

The modular architecture allows for easy maintenance and feature additions while keeping the codebase organized and type-safe.

---

**To convert this to PDF:**

**Option 1: Using Pandoc (Command Line)**
```bash
pandoc PROJECT-LOGIC-DOCUMENTATION.md -o PROJECT-LOGIC-DOCUMENTATION.pdf
```

**Option 2: Online Converters**
- [Markdown to PDF](https://www.markdowntopdf.com/)
- [PDF.co Markdown to PDF](https://pdf.co/markdown-to-pdf)

**Option 3: VS Code Extension**
- Install "Markdown PDF" extension
- Right-click file → "Markdown PDF: Export (pdf)"

