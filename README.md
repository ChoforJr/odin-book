# Odinbook

Odinbook is a social app for sharing posts, joining conversations, and finding people to follow. The web client uses Next.js App Router, React, strict TypeScript, and Tailwind CSS. The Express/Prisma API and Socket.IO service live in the sibling `odin-book-api` repository.

## Requirements

- Node.js 20.19 or newer
- npm
- A running Odinbook API and PostgreSQL database

## Local setup

```sh
npm install
cp .env.example .env.local
```

Set both API URLs to the running backend:

```env
API_URL=http://localhost:5000
NEXT_PUBLIC_API_URL=http://localhost:5000
```

`API_URL` is used only by the server-side request proxy. `NEXT_PUBLIC_API_URL` is the Socket.IO origin; do not put credentials or JWT secrets in either variable. Add `http://localhost:3000` as the API's `ALLOWED_URL1`.

Start the web app:

```sh
npm run dev
```

Open `http://localhost:3000`. For production, configure the same variables with your deployed API origin, run `npm run build`, then `npm start`.

## Features

- Sign up and sign in; the HttpOnly session cookie is kept server-side and forwarded through a same-origin Next.js API proxy.
- Home and trending feeds, post creation and deletion, likes, comments, and profile discovery/following.
- Profile, follower/following, account settings, photo upload, and password changes.
- Authenticated Socket.IO connection with reconnect, presence, and live feed/comment refresh indicators.
- Middleware-protected application routes and mobile-responsive Tailwind layouts.

Demo sign-in: `goku@gmail.com` / `1234` or `vegeta@gmail.com` / `1234`. Demo profiles are read-only.

## Project layout

```text
src/
  app/             # Next.js App Router pages and same-origin API proxy
  components/      # Shared UI, state provider, and realtime connection
  lib/             # Typed API client and response normalization
  middleware.ts    # Cookie-presence route protection
  types/           # Domain, API, and Socket.IO contracts
```

Check types with `npm run typecheck` and lint with `npm run lint`.
