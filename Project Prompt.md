# AI AGENT PROMPT: JAPANESE VOCABULARY LEARNING WEBSITE

## PROJECT OVERVIEW
Create a full-stack Japanese vocabulary learning web application where users can take quizzes based on anime episodes. Admins can upload CSV files containing vocabulary from anime episodes, and users can access these to practice Japanese vocabulary through interactive quizzes.

## TECH STACK REQUIREMENTS

### Core Framework
- **Frontend/Backend**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS

### Database & Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage (for CSV files if needed)
- **ORM**: Prisma or Supabase JS Client

### Additional Technologies
- **Payment Processing**: Stripe (one-time payment)
- **Advertisements**: Google AdSense
- **Form Handling**: React Hook Form + Zod validation
- **UI Components**: shadcn/ui or Radix UI
- **CSV Parsing**: PapaParse or csv-parser
- **State Management**: React Context API or Zustand
- **Deployment**: Vercel

## DATABASE SCHEMA

### Tables Required:

#### 1. users
```
- id (uuid, primary key)
- email (string, unique)
- password_hash (string)
- role (enum: 'user', 'admin')
- is_ad_free (boolean, default: false)
- stripe_payment_id (string, nullable)
- created_at (timestamp)
- updated_at (timestamp)
```

#### 2. animes
```
- id (uuid, primary key)
- name (string, unique)
- slug (string, unique)
- created_at (timestamp)
- updated_at (timestamp)
```

#### 3. seasons
```
- id (uuid, primary key)
- anime_id (uuid, foreign key -> animes.id)
- season_number (integer)
- created_at (timestamp)
- unique constraint on (anime_id, season_number)
```

#### 4. episodes
```
- id (uuid, primary key)
- season_id (uuid, foreign key -> seasons.id)
- episode_number (integer)
- created_at (timestamp)
- updated_at (timestamp)
- unique constraint on (season_id, episode_number)
```

#### 5. vocabulary_lists
```
- id (uuid, primary key)
- episode_id (uuid, foreign key -> episodes.id)
- csv_filename (string)
- uploaded_by (uuid, foreign key -> users.id)
- is_published (boolean, default: false)
- created_at (timestamp)
- updated_at (timestamp)
```

#### 6. vocabulary_words
```
- id (uuid, primary key)
- vocabulary_list_id (uuid, foreign key -> vocabulary_lists.id)
- word (string) - Japanese word in kanji/kana
- reading (string) - Hiragana reading
- meaning (string) - English meaning
- order_index (integer)
- created_at (timestamp)
- updated_at (timestamp)
```

#### 7. quiz_attempts
```
- id (uuid, primary key)
- user_id (uuid, foreign key -> users.id)
- vocabulary_list_id (uuid, foreign key -> vocabulary_lists.id)
- quiz_type (string)
- total_questions (integer)
- correct_answers (integer)
- completed_at (timestamp)
```

## FEATURE REQUIREMENTS

### PUBLIC PAGES

#### 1. Landing Page (/)
- Hero section explaining the website purpose
- Features showcase
- Call-to-action buttons:
  - "Sign Up" button
  - "Login" button
- Display sample anime/vocabulary content
- Responsive design

#### 2. Sign Up Page (/signup)
- Email and password registration
- Form validation
- Link to login page
- Use Supabase Auth

#### 3. Login Page (/login)
- Email and password login
- Form validation
- Link to signup page
- Use Supabase Auth

### USER DASHBOARD

#### 4. User Dashboard (/dashboard)
- **Anime Directory Section**:
  - List of all available animes
  - Expandable/collapsible structure:
    - Anime Name
      - Season 1, Season 2, etc.
        - Episode 1, Episode 2, etc.
  - Click on episode to start quiz setup

#### 5. Quiz Setup Modal/Page
- **Quiz Type Selection** (Radio buttons or dropdown):
  - "Meaning from Word + Reading"
  - "Word from Meaning"
  - "Reading from Word"
  - (Add more types as desired)
- **Number of Questions Dropdown**:
  - Minimum: 10
  - Options: 10, 20, 30, 50, All
- **Vocabulary Source**:
  - Option to test on specific episode
  - Option to test on "All vocabulary" from all lists
- "Start Quiz" button

#### 6. Quiz Page (/quiz/[id])
- Display question number (e.g., "Question 5 of 20")
- Display question based on quiz type:
  - Example: "What is the meaning of: 進撃 (しんげき)?"
- Four multiple-choice options (A, B, C, D)
- **Immediate Feedback**:
  - After selecting answer, show:
    - Green highlight if correct
    - Red highlight if wrong + show correct answer in green
  - "Next Question" button appears after selection
- Progress bar showing quiz completion
- Display Google AdSense banners (unless user is ad-free)

#### 7. Quiz Results Page
- Score display (e.g., "18/20 correct")
- Percentage score
- List of incorrect answers with correct answers
- "Retake Quiz" button
- "Back to Dashboard" button

#### 8. User Settings (/settings)
- **Profile Section**:
  - Display email
  - Change password option
- **Ad-Free Upgrade Section**:
  - If not ad-free: Show Stripe payment button for one-time payment
  - If ad-free: Show "Ad-Free Active" status
- Logout button

### ADMIN DASHBOARD

#### 9. Admin Dashboard (/admin)
- Protected route (role-based access)
- Navigation tabs:
  - Upload Vocabulary
  - Manage Content
  - View Statistics (optional)

#### 10. Upload Vocabulary Page (/admin/upload)
- **Single Page Form** with:
  - **Anime Selection**:
    - Dropdown of existing animes OR
    - Input field to create new anime
  - **Season Selection**:
    - Dropdown of existing seasons for selected anime OR
    - Input field to create new season number
  - **Episode Selection**:
    - Dropdown of existing episodes for selected season OR
    - Input field to create new episode number
  - **CSV Upload**:
    - File input accepting .csv files
    - CSV format: word, reading, meaning (3 columns)
    - Parse and display preview table
  - **Editable Preview Table**:
    - Display parsed CSV data
    - Inline editing for:
      - Word (Japanese)
      - Reading (Hiragana)
      - Meaning (English)
    - Add row button
    - Delete row button
    - Drag to reorder rows (optional)
  - **Actions**:
    - "Save as Draft" button (is_published = false)
    - "Publish" button (is_published = true, makes available to users)
    - "Cancel" button

#### 11. Manage Content Page (/admin/manage)
- **List View** showing:
  - Anime > Season > Episode structure
  - Published status indicator
  - Word count per list
- **Actions per vocabulary list**:
  - Edit button (opens edit interface similar to upload page)
  - Delete button (with confirmation)
  - Unpublish/Publish toggle

### PAYMENT INTEGRATION

#### 12. Stripe Payment Flow
- One-time payment for ad-free experience
- Create Stripe Checkout Session
- Success redirect to dashboard with confirmation
- Update user `is_ad_free` status in database
- Webhook handler for payment verification

### ADVERTISEMENT INTEGRATION

#### 13. Google AdSense
- Display banner ads on:
  - Quiz page (top and bottom)
  - Dashboard (sidebar or between content)
- Conditionally hide ads if `user.is_ad_free === true`

## FUNCTIONAL REQUIREMENTS

### Authentication & Authorization
- Implement Row Level Security (RLS) in Supabase
- Admin role check middleware for admin routes
- Protected routes for authenticated users
- Session management with Supabase Auth

### CSV Processing
- Validate CSV format (3 columns: word, reading, meaning)
- Handle Japanese characters (UTF-8 encoding)
- Error handling for malformed CSV files
- Maximum file size limit (e.g., 5MB)

### Quiz Logic
- Randomize question order
- Randomize answer options
- Generate 3 incorrect answers (distractors) from other vocabulary words
- Ensure correct answer is randomized in position (A, B, C, or D)
- Track user answers for results page

### Data Validation
- Validate hiragana input for readings
- Validate Japanese characters for words
- Required fields validation
- Unique constraints enforcement

### Performance Considerations
- Implement pagination for large vocabulary lists
- Lazy loading for anime directory
- Optimize database queries with proper indexing
- Cache frequently accessed data

## USER FLOWS

### User Flow:
1. Land on homepage → Sign up → Login
2. View dashboard with anime directory
3. Select anime → season → episode
4. Configure quiz (type, number of questions)
5. Take quiz with immediate feedback
6. View results
7. Option to upgrade to ad-free

### Admin Flow:
1. Login with admin role
2. Access admin dashboard
3. Select/create anime, season, episode
4. Upload CSV file
5. Preview and edit vocabulary list
6. Publish to make available to users
7. Manage existing content (edit/delete/unpublish)

## ADDITIONAL REQUIREMENTS

### Responsive Design
- Mobile-first approach
- Tablet and desktop layouts
- Touch-friendly quiz interface

### Error Handling
- User-friendly error messages
- Form validation errors
- Network error handling
- 404 and 500 error pages

### Security
- SQL injection prevention (use parameterized queries)
- XSS protection
- CSRF protection
- Secure password hashing (handled by Supabase)
- Environment variables for sensitive data

### SEO
- Meta tags for landing page
- Semantic HTML
- OpenGraph tags
- Sitemap generation

## IMPLEMENTATION STEPS

1. **Setup Project**
   - Initialize Next.js project with TypeScript
   - Install dependencies (Supabase, Stripe, etc.)
   - Configure Tailwind CSS

2. **Setup Supabase**
   - Create Supabase project
   - Create database tables
   - Configure authentication
   - Setup RLS policies

3. **Build Authentication**
   - Create signup/login pages
   - Implement Supabase Auth
   - Create auth context/hooks

4. **Build Public Pages**
   - Landing page
   - Navigation components

5. **Build User Features**
   - User dashboard
   - Anime directory
   - Quiz setup
   - Quiz interface with feedback
   - Results page
   - Settings page

6. **Build Admin Features**
   - Admin dashboard
   - CSV upload and parsing
   - Editable preview table
   - Content management interface

7. **Integrate Payments**
   - Setup Stripe
   - Create checkout flow
   - Implement webhooks
   - Update user ad-free status

8. **Integrate Ads**
   - Setup Google AdSense
   - Add conditional ad display logic

9. **Testing**
   - Test all user flows
   - Test admin functionality
   - Test payment flow
   - Cross-browser testing

10. **Deploy**
    - Deploy to Vercel
    - Configure environment variables
    - Setup custom domain (if applicable)

## DELIVERABLES

- Fully functional Next.js application
- Supabase database with proper schema and RLS policies
- Admin dashboard for content management
- User dashboard with quiz functionality
- Stripe payment integration
- Google AdSense integration
- Responsive design
- Documentation for setup and deployment

---

## CSV FORMAT SPECIFICATION

The CSV file should have exactly 3 columns with the following headers (first row):

```
word,reading,meaning
```

Example CSV content:
```
word,reading,meaning
進撃,しんげき,advance/attack
巨人,きょじん,giant/titan
壁,かべ,wall
調査,ちょうさ,investigation
兵団,へいだん,corps
```

- **word**: Japanese word (can include kanji, hiragana, katakana)
- **reading**: Hiragana reading of the word
- **meaning**: English translation/meaning

---