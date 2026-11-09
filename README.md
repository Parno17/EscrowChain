<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.
https://ai.studio/apps/a38d37dc-1888-4013-bb1e-c0237f6aa879

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Copy `.env.example` to `.env.local`. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to enable shared catalog and order data. `GEMINI_API_KEY` is only needed for Gemini features.
3. In the Supabase SQL Editor, run [`supabase/schema.sql`](./supabase/schema.sql). Enable email/password sign-in in Supabase Authentication. Set the Auth Site URL and allowed redirect URLs to your local and Vercel app URLs.
4. Run the app:
   `npm run dev`

Without Supabase settings, the app remains in local demo mode and changes are stored only in that browser. Demo balances, gas fees, transaction signatures, and escrow actions remain simulated; this integration does not submit blockchain transactions. Configure the same `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel Project Settings → Environment Variables for Preview and Production, then redeploy.

Use the Supabase anon/publishable key in the frontend, never the `service_role` key. The SQL policies restrict catalog changes to the owning seller and order changes to the buyer or seller. Demo/preset accounts do not use Supabase Auth and therefore do not synchronize their changes across devices; use email sign-up/sign-in for cloud synchronization.

This is still a prototype: simulated balances and escrow statuses are not financial records, and the UI's demo roles are not production-grade authorization for privileged actions.