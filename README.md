# My Habit Tracker Journey 🚀

Welcome to my Habit Tracker! This isn't just another generic app; it's a project I built from scratch to help me stay consistent with daily goals. I wanted something that looked beautiful, felt premium, and actually worked across my devices.

Here's a deep dive into how I built it, what technologies I used, and how everything connects under the hood.

---

## 🛠️ The Tech Stack (And Why I Chose It)

I carefully picked a modern stack that balances performance, developer experience, and scalability:

*   **React 19**: I wanted the latest and greatest features for building a snappy user interface. The component-based architecture makes it easy to manage the different views.
*   **TypeScript**: Safety first! strict typing helped me catch so many bugs before they even happened, especially when dealing with the data structures for habits and completions.
*   **Vite**: For lightning-fast development server start times and optimized production builds.
*   **Tailwind CSS**: I wanted full control over the design without wrestling with custom CSS files. The utility-first approach let me iterate on the "Beige/Brown" aesthetic rapidly.
*   **Supabase**: Originally, I started with **IndexedDB** for a local-only approach. However, I realized I needed to check my habits on my phone *and* my laptop. So, I migrated the persistence layer to Supabase (a Firebase alternative) for real-time reliable cloud storage.
*   **Recharts**: For those beautiful graphs in the Analytics view. It makes visualizing data super intuitive.
*   **Date-fns**: Handling dates in JavaScript is a nightmare. This library made date manipulation (like "get last 7 days") a breeze.

---

## 🏗️ Architecture: How Everything Connects

The app is built as a **Single Page Application (SPA)**. Here is the high-level flow of how data moves through the system:

### 1. The Entry Point (`main.tsx` & `App.tsx`)
Everything starts here. `App.tsx` handles the initial authentication (the password lock) and manages the top-level view state. Depending on which tab you click (Today, Calendar, Analytics, Habits), it renders the corresponding component.

### 2. The Data Layer (`src/lib/db.ts`)
This is the bridge between my UI and the backend.
*   **The Abstraction**: One of the coolest things I did was abstracting the database logic. The UI components (`TodayView`, etc.) don't know *how* data is saved; they just call functions like `toggleCompletion` or `addHabit`.
*   **The Migration**: When I switched from IndexedDB to Supabase, I only had to rewrite this file. The rest of the app didn't even notice the change! now, `db.ts` calls `supabase.ts` to perform SQL operations on my remote database.

### 3. The Components (`src/components/`)
*   **`TodayView.tsx`**: This is the heart of the app. It fetches today's completion status. When you check a box, it calls `toggleCompletion`, which sends an `UPSERT` command to Supabase to either create or update the record.
*   **`AnalyticsView.tsx`**: This component crunches the numbers. It fetches *all* history, calculates streaks, and prepares the data arrays that `Recharts` needs to draw the lines and bars.
*   **`CalendarView.tsx`**: This renders a monthly view. I use a clever "heatmap" logic where the color intensity of a day depends on the percentage of habits completed that day (Dark Brown = 100%, Beige = 0%).

---

## 🎨 Design Philosophy

I didn't want a boring, clinical app. I wanted something that felt **warm** and **inviting**.

*   **The "Rooshan" Aesthetic**: I used a palette of warm beiges, creams, and deep browns. It feels like a cup of coffee or an old book.
*   **Dark Mode (The "Batman" Theme)**: I also added a dark mode that isn't just "black." It uses deep charcoal and desaturated browns to keep the same warm vibe but easier on the eyes at night.
*   **Responsiveness**: I spent a lot of time perfecting the CSS so it looks just as good on my iPhone as it does on my widescreen monitor. The navbar adapts, grids resize, and touch targets are optimized.

---

## 🚀 Key Features I Built

1.  **Dynamic Navbar**: As you scroll, the navbar transforms! It becomes slightly translucent and catchy, maximizing screen real estate.
2.  **Smart Analytics**: It tracks not just *if* you did it, but your streaks and weekly trends.
3.  **Authentication**: A simple but effective password gate to keep my data private.
4.  **Optimistic Updates**: When you click a checkbox, the UI updates *instantly* while the data saves in the background. No loading spinners for simple actions.

---

## 📈 What's Next?

I'm constantly improving this. Next up, I'm thinking about:
*   Adding "Habit Categories" (e.g., Health, Learning).
*   Implementing push notifications for reminders.
*   Maybe even a social feature to compete with friends?

---

Made the App just for myself but the code is open source so feel free to use it.

**- Ali Rooshan**
