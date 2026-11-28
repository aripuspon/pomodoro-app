# PomoNow Dual-Provider Billing Setup (Lemon Squeezy + Midtrans)

PomoNow supports **two payment providers** side-by-side:
1. **Lemon Squeezy (Global · USD)** — recurring Monthly & Annual subscriptions with Card/PayPal and a self-serve Customer Portal.
2. **Midtrans Snap (Indonesia · IDR)** — prepaid 1-Month (30 days) and 1-Year (365 days) Pro passes supporting **QRIS, GoPay, OVO, ShopeePay, Bank Virtual Accounts, and Cards**.

---

## Step 1: Run Updated Database Schema in Supabase
1. Open **Supabase Dashboard -> SQL Editor -> New query**.
2. Copy the full contents of `supabase/schema.sql`, paste, and click **Run**.
3. Confirm in **Table Editor** that:
   - `public.profiles` has `customer_portal_url` and `trial_used`.
   - `public.payment_orders` exists with **RLS Enabled** (prevents duplicate webhook double-crediting).

---

## Step 2: Configure Lemon Squeezy (Global USD)
1. Create a **PomoNow Pro** product in [Lemon Squeezy](https://app.lemonsqueezy.com/) with two subscription variants:
   - **Monthly** (e.g. `$5 / month`)
   - **Annual** (e.g. `$39 / year`)
   > Note: Do **not** set a card-upfront trial inside Lemon Squeezy because PomoNow already gives every new account a **No-Card 3-Day Free Trial** automatically upon sign-up.
2. Copy your **API Key**, **Store ID**, **Monthly Variant ID**, and **Annual Variant ID**.
3. Go to **Settings -> Webhooks -> + New Webhook**:
   - **Callback URL:** `https://pomonow.vercel.app/api/billing/webhook-lemonsqueezy`
   - **Signing Secret:** Create a strong random secret and save it for Vercel (`LEMONSQUEEZY_WEBHOOK_SECRET`).
   - **Events to select:**
     - `subscription_created`
     - `subscription_updated`
     - `subscription_resumed`
     - `subscription_cancelled`
     - `subscription_expired`
     - `subscription_payment_success`

---

## Step 3: Configure Midtrans Snap (Indonesia IDR · QRIS / E-Wallets / VA)
1. Log in to [Midtrans Dashboard](https://dashboard.midtrans.com/) (start in **Sandbox** to test, then switch to **Production** when approved).
2. Go to **Settings -> Access Keys** and copy your **Server Key**.
3. Go to **Settings -> Configuration (Payment Notification URL)**:
   - Set **Payment Notification URL** to:
     `https://pomonow.vercel.app/api/billing/webhook-midtrans`
   - Set **Finish Redirect URL** (optional fallback) to `https://pomonow.vercel.app/?billing=success&provider=midtrans`.

---

## Step 4: Add Environment Variables in Vercel
In **Vercel -> Project Settings -> Environment Variables**, add:

- `LEMONSQUEEZY_API_KEY`
- `LEMONSQUEEZY_STORE_ID`
- `LEMONSQUEEZY_VARIANT_MONTHLY`
- `LEMONSQUEEZY_VARIANT_ANNUAL`
- `LEMONSQUEEZY_WEBHOOK_SECRET`
- `MIDTRANS_SERVER_KEY`
- `MIDTRANS_IS_PRODUCTION` (`false` for Sandbox testing, `true` when live)
- Optional price display overrides (must match your Lemon Squeezy variants & desired IDR prices):
  - `BILLING_USD_MONTHLY` (default `5`)
  - `BILLING_USD_ANNUAL` (default `39`)
  - `BILLING_IDR_MONTHLY` (default `15000`)
  - `BILLING_IDR_ANNUAL` (default `150000`)

---

## Step 5: Go Live (Turn Off Soft Beta Mode)
1. While `SOFT_BETA_MODE=true`, all features stay unlocked for every user.
2. Once you finish testing Sandbox/Test checkouts, change `SOFT_BETA_MODE` in Vercel from `true` to **`false`** and **Redeploy**.
3. From that moment:
   - New accounts automatically get **3 days of Pro** (`plan='pro'`, `plan_status='trialing'`), with **no credit card required**.
   - After Day 3, accounts drop cleanly to **Free** until they upgrade via Lemon Squeezy or Midtrans.
