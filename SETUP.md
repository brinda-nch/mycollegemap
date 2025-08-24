# Local Development Setup Guide

## Prerequisites

- Node.js (v18 or higher)
- npm or pnpm
- Supabase account and project

## Environment Configuration

Create a `.env.local` file in the root directory with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here

# Google OAuth (Optional - for Google sign-in)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

## Setting up Supabase

1. Create a new Supabase project at https://supabase.com
2. Get your project URL and service role key from the project settings
3. Run the database schema scripts in the `scripts/` directory:

```bash
# Run these in your Supabase SQL editor:
# 1. 01-create-supabase-schema.sql
# 2. 02-enable-rls-policies.sql
# 3. 03-create-triggers.sql
# 4. 04-seed-demo-data.sql (optional)
```

## Setting up NextAuth Secret

Generate a secure random string for NEXTAUTH_SECRET:

```bash
openssl rand -base64 32
```

## Google OAuth Setup (Optional)

1. Go to Google Cloud Console
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add `http://localhost:3000/api/auth/callback/google` to authorized redirect URIs

## Running the Application

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open http://localhost:3000 in your browser

## Demo Mode (Current Setup) ✅ WORKING

The application is currently configured to run in **demo mode** with the following credentials:

- **Email**: demo@example.com
- **Password**: demo123

This allows you to explore the application without setting up a real Supabase database. The demo mode uses mock data and a simplified authentication system.

### Demo Features Available:
- ✅ Dashboard with sample data
- ✅ GPA tracking with demo entries
- ✅ Test scores management
- ✅ Extracurricular activities
- ✅ Essay management
- ✅ College application tracking
- ✅ Responsive UI with dark mode
- ✅ Authentication system (demo mode)
- ✅ Error handling pages

### Current Status:
- ✅ **Application running** at http://localhost:3000
- ✅ **Homepage loading** correctly
- ✅ **Login page accessible** at /auth/login
- ✅ **Demo authentication** working
- ✅ **All routes functional**

### To Use Real Data:
Replace the demo environment variables in `.env.local` with your actual Supabase credentials and set up the database schema as described below.

## Database Schema

The application uses the following main tables:
- `users` - User accounts and profiles
- `gpa_records` - Academic GPA tracking
- `test_scores` - Standardized test scores
- `extracurriculars` - Activities and involvement
- `honors_awards` - Achievements and recognition
- `essays` - College application essays
- `user_colleges` - College applications and status

## Features

- User authentication (email/password + Google OAuth)
- Academic tracking (GPA, test scores)
- Extracurricular activity management
- Essay organization and tracking
- College application status tracking
- Responsive design with dark mode support
