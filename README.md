# Hafizzan Kadir — Personal Brand Website

React (Vite) personal brand site: trading journal, market outlook, philosophy, knowledge hub, and
projects showcase, backed by Firebase (Firestore + Auth) and the Google Sheets API.

## Getting started

```bash
npm install
npm run dev
```

The site runs fully on mock/placeholder data out of the box — no credentials required.

## Wiring up real data

Copy `.env.example` to `.env.local` and fill in:

- `VITE_FIREBASE_*` — Firebase project config (Firestore for Market Outlook / Trade Ideas /
  Philosophy / Knowledge Hub content, Authentication for `/admin`)
- `VITE_GOOGLE_SHEETS_ID` / `VITE_GOOGLE_SHEETS_API_KEY` — read-only Sheets API access for the
  Trading Journal tab (see `src/lib/googleSheets.js` for the expected sheet layout)

Until these are set, `/admin` runs in demo mode (any email/password unlocks the panel) and all
public pages read from `src/lib/mockData.js`.

## Structure

- `src/pages/` — the 5 public pages + `/admin`
- `src/components/` — shared SiteNav, Footer
- `src/lib/` — Firebase config, Firestore data-access layer, Google Sheets integration, mock data
- `src/context/AuthContext.jsx` — admin auth (Firebase Auth, with a demo-mode fallback)

## Build

```bash
npm run build
```
