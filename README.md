# Pfelders 2027 Umfrage

Eine Umfrage-App für die Gruppenfahrt nach Pfelders 2027.

## Struktur

- `index.html` – Umfrageformular
- `results.html` – Ergebnisansicht
- `api/index.js` – Vercel API Route (Backend)
- `vercel.json` – Vercel Konfiguration

## Deployment auf Vercel

### 1. Vercel CLI installieren (falls nicht vorhanden)

```bash
npm i -g vercel
```

### 2. Umgebungsvariablen setzen

In Vercel Dashboard unter **Settings → Environment Variables**:

- `TURSO_URL`: `https://pfelders-2027-umfrage-mimi800-debug21.aws-ap-northeast-1.turso.io`
- `TURSO_TOKEN`: Dein Turso Auth Token

### 3. Deployen

```bash
vercel
```

### 4. Produktion

```bash
vercel --prod
```

## Lokal testen

```bash
npm install
npm run dev
```

## Technologie-Stack

- **Frontend:** HTML, CSS, Vanilla JavaScript
- **Backend:** Vercel Serverless Functions (Node.js)
- **Datenbank:** Turso (SQLite)
