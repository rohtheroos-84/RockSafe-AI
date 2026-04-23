# RockSafe AI - Live Deployment Guide (Netlify Preferred)

This guide deploys:

- Frontend (`ui/`) to Netlify.
- Backend (`backend/`) to a Python host (Render shown as the reference path).

## 1. Why Split Deployment

Netlify is best used here for static frontend hosting.

The backend is a Python API that:

- Loads ML model artifacts.
- Makes server-side HTTP calls to external data providers.
- Sends SMS through Twilio.

For reliability and easier operations, host backend separately and point Netlify frontend to it.

## 2. Prerequisites

- Git repository pushed to GitHub/GitLab/Bitbucket.
- Tomorrow.io API key.
- Twilio credentials (if SMS alerts are needed).
- Netlify account.
- Render (or equivalent Python host) account.

## 3. Deploy Backend (Render Example)

## 3.1 Create Service

1. In Render, create a new Web Service from your repo.
2. Set root directory to `backend`.
3. Runtime: Python.

## 3.2 Build and Start Commands

- Build command:

```bash
pip install -r requirements.txt
```

- Start command:

```bash
uvicorn app:app --host 0.0.0.0 --port $PORT
```

## 3.3 Configure Environment Variables

Set these in Render:

- `TOMORROW_API_KEY`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_FROM_NUMBER` (or `TWILIO_PHONE_NUMBER`)
- `EMERGENCY_CONTACTS` (comma-separated)
- `SMS_ALERTS_ENABLED=true` (or `false`)

Use `backend/.env.example` as reference.

## 3.4 Verify Backend

After deploy, verify:

- `https://<your-backend-domain>/health`
- `https://<your-backend-domain>/metadata`

Save this backend base URL for Netlify step.

## 4. Deploy Frontend to Netlify

The repository already includes `netlify.toml` configured to build from `ui/`.

## 4.1 Create Netlify Site

1. In Netlify, Add New Site -> Import from Git.
2. Select your repository.
3. Netlify should pick up config from `netlify.toml`.

If entering manually, use:

- Base directory: `ui`
- Build command: `npm run build`
- Publish directory: `dist`

## 4.2 Set Frontend Environment Variable

In Netlify Site Settings -> Environment Variables, add:

- `VITE_API_BASE_URL=https://<your-backend-domain>`

Do not include a trailing slash.

## 4.3 Deploy and Validate

Trigger deploy and verify:

- App loads without console CORS/fetch errors.
- `/predict` successfully returns risk predictions.
- `/live-monitoring` successfully fetches live location data.

## 5. CORS and Security Notes

Current backend CORS allows all origins for convenience.

For production hardening:

- Restrict allowed origins to Netlify domain(s).
- Remove emergency contact list from status endpoint output.
- Rotate API and Twilio credentials if ever exposed.

## 6. Optional: Custom Domains

- Attach custom domain in Netlify for frontend.
- Attach custom domain in backend host for API.
- Update `VITE_API_BASE_URL` to new backend domain and redeploy frontend.

## 7. Troubleshooting

## Problem: Frontend says cannot connect to backend

Check:

- `VITE_API_BASE_URL` is set correctly in Netlify.
- Backend service is live (`/health` returns `status: ok`).
- Backend allows browser requests from your Netlify domain.

## Problem: Live Monitoring fails

Check:

- `TOMORROW_API_KEY` is set on backend host.
- Outbound HTTP calls are not blocked.

## Problem: SMS not sent

Check:

- `SMS_ALERTS_ENABLED=true`
- Twilio SID/token/from-number are valid.
- `EMERGENCY_CONTACTS` has valid E.164 numbers.
- Risk level is High/Critical (SMS triggers only for these levels).

## Problem: Refreshing a route gives 404 on Netlify

The repo includes SPA redirects in `netlify.toml`.
If issue persists, confirm Netlify is using repository config and redeploy.

## 8. One-Line Deployment Summary

Deploy backend first, copy backend URL, set `VITE_API_BASE_URL` in Netlify, deploy frontend, then run smoke tests on predict and live-monitoring flows.
