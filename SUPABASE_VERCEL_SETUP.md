# Supabase + Vercel SaaS & Cloud Sync Setup Guide

Follow these steps to turn your local Pomodoro app into a live multi-device SaaS on Vercel backed by Supabase.

---

## Step 1: Create the Database Tables in Supabase
1. Open your project in the [Supabase Dashboard](https://supabase.com/dashboard).
2. Go to **SQL Editor** -> **New query**.
3. Open `supabase/schema.sql` from this repository, copy its full contents, paste into the SQL Editor, and click **Run**.
4. Confirm both `profiles` and `workspaces` appear in **Table Editor** with **RLS Enabled**.

> Security built-in: Browser users can only read/write their own `workspaces` and cannot upgrade `profiles.plan` from client JavaScript (`trg_profiles_protect_billing` restricts plan changes to `service_role` webhooks or direct SQL administration).

---

## Step 2: Configure Auth Providers in Supabase
1. Go to **Authentication** -> **Providers**:
   - **Email**: Make sure **Email** is enabled (supports both Email/Password and Magic Link OTP).
   - **Google (Optional for "Continue with Google")**: Toggle Google on and paste your Google Cloud OAuth Client ID & Secret (set authorized redirect URI in Google Cloud to `https://YOUR-PROJECT-ID.supabase.co/auth/v1/callback`).
2. Go to **Authentication** -> **URL Configuration**:
   - Set **Site URL** to your live Vercel URL (e.g. `https://pomodoro-app.vercel.app`).
   - Add your live URL (and `http://localhost:3000` / `http://127.0.0.1:4175` if testing locally) to **Redirect URLs**.

---

## Step 3: Deploy on Vercel with Environment Variables
1. In the [Vercel Dashboard](https://vercel.com/new), import your GitHub repository `aripuspon/pomodoro-app`.
2. Framework Preset: **Other** (zero build step needed).
3. Go to **Project Settings** -> **Environment Variables** and add:
   - `SUPABASE_URL` — from Supabase **Project Settings -> Data API**
   - `SUPABASE_ANON_KEY` — from Supabase **Project Settings -> API Keys**
   - `SUPABASE_SERVICE_ROLE_KEY` — from Supabase **Project Settings -> API Keys** (secret key)
   - `SOFT_BETA_MODE` — set to `true` (keeps all Pro features unlocked while billing is built next; flip to `false` when payment webhooks are connected!)
4. Click **Deploy** (or **Redeploy** after saving variables).

---

## Step 4: Verify Live Sync
1. Open your Vercel URL, click **Account** in the top header, and create an account or sign in.
2. Add a task or customize a theme -> click **Sync Now** (or wait ~1 second for auto-sync).
3. Sign into the same account in a second browser/incognito window -> confirm your tasks, streaks, themes, and settings sync automatically.

---

## How Payments Will Connect Later
When you are ready to enable paid subscriptions (Lemon Squeezy, Paddle, or Midtrans QRIS):
1. Add `/api/billing/checkout` and `/api/billing/webhook` endpoints verified with your payment webhook secret.
2. Inside the webhook, update `public.profiles` (`plan = 'pro'`, `plan_status = 'active'`, `current_period_end`) using `SUPABASE_SERVICE_ROLE_KEY`.
3. Set `SOFT_BETA_MODE=false` in Vercel Environment Variables — your existing Pro plan checks & Upgrade modal will automatically enforce Free vs. Pro!
