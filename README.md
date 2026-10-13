# PackPal

**Pack smarter. Travel stress-free.**

PackPal is a travel packing assistant. Create a trip, organize what you need into packing lists, check items off as you pack, and get reminders in the app as departure day gets closer.

🔗 **Live app:** https://YOUR-PROJECT.vercel.app

## Why I built it

I travel a lot, mostly to visit my parents and a few other places I go to regularly, and I travel with my dog. That means the same packing lists every time, plus a whole second list for her. I originally built myself a small React Native app with my lists and a reminder to finish packing. PackPal is a version of that idea anyone can use straight from the browser.

## Features

- **Trips:** create, edit and delete trips with a name and departure date. The dashboard shows upcoming trips soonest first, with past trips below.
- **Multiple packing lists per trip:** for example "My stuff" and "Dog". Lists can be added, renamed and deleted.
- **Items:** add items quickly by typing and pressing Enter, rename them inline, delete them, and check them off. Packed items are crossed out.
- **Check all / Uncheck all** for each list.
- **Progress:** packed/total counts and progress bars for each list, each trip, and on the dashboard cards.
- **In-app reminders** based on the departure date and how much is left to pack:

  | When | Banner |
  | --- | --- |
  | 3 days before | 🔵 "Your trip is coming up!" |
  | 1–2 days before | 🟠 "Time to finish packing! X items left" |
  | Departure day | 🔴 "Today's the day! Don't forget your remaining X items" |
  | Everything packed (within 3 days) | 🟢 "You're all packed!" |

  There's no reminder for trips more than 3 days away, trips with no items, or past trips.
- **Saved automatically:** every change is stored immediately and survives page refreshes.
- **Responsive:** single column on mobile, grid layout on larger screens. It's built with accessible labels, keyboard support and visible focus states.

## Tech stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- React Router
- Lucide React icons
- Browser `localStorage` for persistence
- Deployed on Vercel

There's no backend, database or authentication. Keeping the MVP frontend-only was a deliberate scoping decision for a roughly 2-hour build.

## Running locally

Requires Node.js 20.19+ or 22.12+.

```bash
git clone https://github.com/natashanodine/packpal.git
cd packpal
npm install
npm run dev
```

Then open http://localhost:5173.

Other scripts:

```bash
npm run build    # type-check and build for production
npm run preview  # preview the production build locally
npm run lint     # run ESLint
```

## Deployment

The app is deployed on Vercel from the `main` branch. Every push redeploys automatically. `vercel.json` rewrites all routes to `index.html` so that refreshing a page like `/trips/:id` works.

## Project structure

```
src/
├── components/   # TripCard, TripForm, PackingListCard, PackingItem, ProgressBar,
│                 # ReminderBanner, ConfirmDialog, EmptyState, EditableText
├── pages/        # TripsPage (dashboard), TripDetailsPage
├── hooks/        # useTrips: context provider with all trip/list/item actions
├── utils/        # storage (localStorage), dateUtils, packingUtils (progress, reminders)
└── types/        # Trip, PackingList, PackingItem
```

### Notes on the implementation

- **Data model:** a trip contains its lists, and each list contains its items. Deleting a trip or list removes everything inside it. IDs come from `crypto.randomUUID()`.
- **Storage:** all reads and writes go through `utils/storage.ts`. Loading validates the saved data and skips anything malformed, so corrupted storage can't crash the app.
- **Dates:** departure dates are stored as `YYYY-MM-DD` and compared as local calendar days, not timestamps. This avoids the off-by-one-day errors you get from `new Date('2026-10-14')` being parsed as UTC.
- **Progress and reminders** are always calculated from the current data, never stored, so they can't get out of sync.

## Limitations

- **Data stays in your browser.** Trips are saved in `localStorage`, so they don't sync between devices or browsers, and they're lost if you clear your browser's site data.
- **Reminders only appear inside the app.** They show when you open the dashboard or a trip. There are no push notifications or emails.
- No accounts, so lists can't be shared with anyone else.

## Roadmap

1. **Reusable lists:** save lists like "Visiting my parents" or "Dog essentials" once and add them to any trip in one tap.
2. **Accounts and sync:** an Express + Prisma API with Postgres, so trips are available on every device. The storage layer is already isolated in `storage.ts` and `useTrips`, so the UI wouldn't need to change.
3. **Real reminders and smart suggestions:** push notifications that work when the app is closed, and packing suggestions based on destination, weather and trip length.
