# RockSafe AI - Project Documentation

## 1. Project Overview

RockSafe AI is a full-stack rockfall risk assessment platform with:

- A Python FastAPI backend for ML inference, live environmental data ingestion, and SMS alerting.
- A React + TypeScript frontend for dashboards, prediction workflows, live monitoring, and risk map visualization.

The repository is organized as:

- `backend/`: API server, model artifacts, external API integration, SMS integration.
- `ui/`: Vite React application with route-based pages and reusable UI components.
- `docs/`: Project documentation and deployment guides.

## 2. High-Level Architecture

```text
[User Browser]
    -> React SPA (Vite, Netlify)
    -> Calls FastAPI backend over HTTPS

[FastAPI Backend]
    -> Loads model and metadata from backend/models
    -> Generates inference features from:
       - Request payload (manual prediction)
       - External live APIs + synthetic parameters (live monitoring)
    -> Runs prediction and thresholding
    -> Triggers SMS alerts via Twilio for high-risk levels
```

## 3. Backend Documentation

## 3.1 Core Backend Files

- `backend/app.py`
  - FastAPI app and endpoint definitions.
  - Model loading (`model.pkl`, `preproc.pkl` if present, `label_encoder.pkl` if present).
  - Prediction and live monitoring flow.
  - SMS integration hooks.
- `backend/input.py`
  - External API integrations for weather, elevation, and rainfall.
  - Synthetic geotechnical/mining parameter generation.
  - Builds complete model input JSON.
- `backend/sms_service.py`
  - Twilio client setup.
  - Risk-level based SMS alert policy.
- `backend/config.py`
  - Env-driven Twilio settings and emergency contacts.
  - SMS feature toggle.

## 3.2 Model Artifacts

Artifacts in `backend/models/`:

- `model.pkl`: Trained model.
- `label_encoder.pkl`: Encoder for location identifiers.
- `feature_cols.json`: Ordered model feature list.
- `metadata.json`: Model metadata (includes threshold and AUC metadata values).

Notes:

- `preproc.pkl` is optional. If missing, raw features are passed to model directly.
- Missing input features are zero-filled in `prepare_array_from_map`.

## 3.3 Backend API Endpoints

### `GET /metadata`

Returns model metadata and sample feature columns.

### `GET /sms/status`

Returns SMS enablement and Twilio configuration status.

### `POST /sms/test`

Triggers a test SMS workflow.

Request body (optional):

```json
{
  "probability": 0.8,
  "location": "Test Location"
}
```

### `POST /predict`

Runs prediction from either:

- Ordered feature array (`payload.features`), or
- Named feature map (`payload_map.feature_map`) as used by frontend.

Frontend currently sends:

```json
{
  "payload_map": {
    "feature_map": {
      "timestamp": "2026-01-01",
      "location_id": "loc_1",
      "elevation": 750,
      "...": 0
    }
  }
}
```

Response shape:

```json
{
  "prediction": 1,
  "probability": 0.82,
  "used_threshold": 0.5,
  "raw_score": 0.82,
  "message": null,
  "sms_alert": {
    "success": true,
    "message": "SMS alerts sent to 1/1 recipients",
    "sent_count": 1,
    "failed_count": 0
  }
}
```

### `POST /monitor/location`

Runs live monitoring by location name.

Request:

```json
{
  "location_name": "Panaji, Goa, India",
  "location_id": "optional_custom_id"
}
```

Behavior:

- Calls external APIs for weather/elevation/rainfall.
- Generates synthetic parameters for remaining model features.
- Performs inference and thresholding.
- Sends SMS for high/critical risk.

### `GET /health`

Health endpoint for deployment probes and uptime checks.

## 3.4 Risk and Alert Logic

Risk bands used consistently by backend and frontend:

- Critical: probability >= 0.75
- High: probability >= 0.50 and < 0.75
- Moderate: probability >= 0.25 and < 0.50
- Low: probability < 0.25

SMS is sent only for:

- High
- Critical

## 3.5 External Services Used

- Tomorrow.io realtime weather API (`TOMORROW_API_KEY`).
- OpenStreetMap Nominatim geocoding.
- Open-Elevation API.
- Open-Meteo daily precipitation API.
- Twilio SMS API.

## 3.6 Backend Environment Variables

Defined/used in code and examples:

- `TOMORROW_API_KEY` (required for live monitoring endpoint quality).
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_FROM_NUMBER` (or `TWILIO_PHONE_NUMBER` alias)
- `EMERGENCY_CONTACTS` (comma-separated numbers)
- `SMS_ALERTS_ENABLED` (`true` or `false`)

See `backend/.env.example`.

## 4. Frontend Documentation

## 4.1 Core Frontend Files

- `ui/src/App.tsx`: Router and app shell.
- `ui/src/components/`: Reusable UI and feature components.
- `ui/src/pages/`: Route pages.
- `ui/src/services/`: API calls and app state store.
- `ui/src/utils/exportPDF.ts`: Risk map PDF export utility.

## 4.2 Routes and Pages

Configured in `ui/src/App.tsx`:

- `/` -> Dashboard (currently demo/static analytics widgets)
- `/risk-map` -> Interactive risk map + PDF export
- `/alerts` -> Alert management UI (currently static/demonstration dataset)
- `/live-monitoring` -> Live backend-driven monitoring flow
- `/predict` -> Manual/JSON prediction flow
- `/settings` -> Settings UI (currently local form UI)
- `/about` -> Product/stack narrative page

## 4.3 Data and State Sources

- Dynamic backend-driven pages:
  - `Predict` page via `ui/src/services/predict.ts`
  - `Live Monitoring` page via `ui/src/services/liveMonitor.ts`
- Shared in-memory risk map state:
  - `ui/src/services/riskMap.ts` (Zustand store)
  - Updated by both predict/live-monitoring flows for known location IDs.
- Static/demo-driven pages and charts:
  - Dashboard, Alerts, and some risk map analytics use local sample arrays.

## 4.4 Frontend Environment Variables

- `VITE_API_BASE_URL`
  - Used by prediction and live monitoring services.
  - Defaults to `http://127.0.0.1:8000` when unset.

See `ui/.env.example`.

## 5. Local Development

## 5.1 Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

## 5.2 Frontend

```bash
cd ui
npm install
npm run dev
```

Frontend default dev URL: `http://localhost:8080` (set in `ui/vite.config.ts`).

## 5.3 Local Smoke Test Checklist

- Open frontend and visit `/predict`.
- Submit form or JSON and verify probability/result renders.
- Visit `/live-monitoring` and run a location check.
- Verify backend endpoints:
  - `/health`
  - `/metadata`
  - `/sms/status`

## 6. Deployment Strategy (Netlify Preferred)

Recommended production topology:

- Frontend on Netlify.
- Backend on a Python host (Render/Railway/Fly/Azure App Service).

Reason:

- Netlify is ideal for static/Vite frontend deployment.
- Backend requires persistent Python runtime, ML model loading, and outbound API/Twilio calls.

This repository includes `netlify.toml` configured for the `ui/` subfolder and SPA redirects.

For full step-by-step deployment, see:

- `docs/DEPLOYMENT_NETLIFY.md`

## 7. Known Gaps and Operational Notes

- Several pages are currently UI/demo-driven rather than backend-connected (Dashboard, Alerts, many charts).
- `backend/requirements.txt` contains both FastAPI and Flask dependencies, but the running server is FastAPI.
- CORS is currently permissive (`allow_origins=["*"]`). Lock down origins for production.
- `/sms/status` currently returns emergency contacts; remove in hardened production builds.
- `backend/test_live_monitoring.py` is a manual script, not an automated test suite.

## 8. Suggested Next Improvements

- Move hardcoded contacts and config entirely to env-managed secrets.
- Add authenticated admin APIs for alert recipients and thresholds.
- Replace static page data with backend APIs and persistence.
- Add automated tests (backend unit tests + frontend integration tests).
- Add request/response schemas to API reference docs and publish OpenAPI snapshots.
