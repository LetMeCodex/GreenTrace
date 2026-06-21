# GreenTrace AI 🌿

GreenTrace is a premium eco-brutalist Next.js web application designed to help individuals calculate, track, and optimize their daily carbon footprint. 

With interactive tools like the **What-If Simulator**, **AI Trace Coach**, **Weekly/Monthly analytics**, and a gamified **Badges Cabinet**, GreenTrace empowers users to take meaningful action against climate change.

---

## 🚀 Tech Stack

- **Framework**: Next.js (App Router)
- **UI Logic**: React 19
- **Database / Auth**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS (Eco-Brutalist design tokens)
- **Interactions**: Framer Motion & Lucide Icons
- **Testing**: Vitest & React Testing Library (JSDOM environment)

---

## 🛠️ Getting Started

### 1. Prerequisites & Installation

Clone the repository and install all required packages:

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Schema

Execute the SQL script in [supabase_schema.sql](file:///c:/Users/anish%20jha/Downloads/GreenTrace/supabase_schema.sql) within your Supabase SQL Editor to provision the required tables (`profiles`, `daily_entries`, `actions`, `challenges`, `badges`) and configure RLS policies.

### 4. Running Locally

Start the local development server:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the web application.

---

## 🧪 Testing Suite

We use **Vitest** and **React Testing Library** for automated unit and integration tests.

### Running Tests

To run the interactive test watcher:
```bash
npm run test
```

To run a single non-interactive CI check:
```bash
npm run test:run
```

### Test Scope & Coverage

1. **Carbon Calculator Logic ([carbonCalculator.test.ts](file:///c:/Users/anish%20jha/Downloads/GreenTrace/src/lib/carbonCalculator.test.ts))**:
   - Math calculation validations for transit modes (Walk, Cycle, Bus, Metro, Car, etc.).
   - Diet calculations (Vegan, Vegetarian, Meat-heavy, and Delivery).
   - Energy calculations (AC usage, lights, devices count, and load levels).
   - Shopping offsets and Waste/Bottles landfill penalties.
   - Dynamic profile recommendations engine edge-case handlers.

2. **LoginPage Integration ([login.test.tsx](file:///c:/Users/anish%20jha/Downloads/GreenTrace/src/app/login/login.test.tsx))**:
   - Form field availability and submission callbacks.
   - Google OAuth trigger and external connection handshakes.

3. **Dashboard State ([dashboard.test.tsx](file:///c:/Users/anish%20jha/Downloads/GreenTrace/src/app/dashboard/dashboard.test.tsx))**:
   - Handles empty states, local caching, fallback rendering, and populated entries correctly.

4. **Sidebar Badge initials ([Sidebar.test.tsx](file:///c:/Users/anish%20jha/Downloads/GreenTrace/src/components/layout/Sidebar.test.tsx))**:
   - Name and email fallback parsing logic for correct character initials split.

---

## ♿ Accessibility (a11y) Focus

GreenTrace implements W3C WAI-ARIA guidelines to provide a high-quality experience for keyboard and screen-reader users:

- **Form Labels**: Every input, slider, select, and textarea element is linked to an explicit `<label>` utilizing matching `id` and `htmlFor` tags.
- **Keyboard Navigation**: Added a global `:focus-visible` styling outline so screen/keyboard users can identify exactly where their focus cursor is located.
- **Aria Attributes**: All interactive select grids, sliders, and buttons carry `aria-pressed`, `aria-label`, or appropriate status states to communicate context dynamically.
