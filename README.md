# Wobb Influencer Search

Live demo: [Not deployed — Phase 8 skipped per instructions]

## What I Changed

### Bug Fixes
- **Engagement Rate Calculation:** Fixed bug where engagement rate was multiplied by 10,000 instead of 100, which displayed rates like 125% instead of 1.25%.
- **Engagement Stat Label:** The profile page displayed `engagement_rate` under the "Engagements" label; corrected to show the actual `engagements` count.
- **Unhandled Promises:** Added `.catch()` block in `useProfileData` to prevent unhandled promise rejections when a profile JSON fails to load.
- **Search Logic:** Made username search case-insensitive to match fullname search behavior.
- **Responsive Layout:** Removed hard-coded `w-[700px]` from the influencer card that broke mobile layout.
- **Accessibility:** Added missing `alt` tags to all avatar images.
- **Unused State:** Removed unnecessary `clickCount` state that caused re-renders on clicks.
- **Dependencies:** Removed `react-beautiful-dnd` as it was deprecated, unused, and incompatible with React 19.

### Architecture
- **Folder Structure:** Reorganized into `components/`, `pages/`, `hooks/`, `store/`, `types/`, and `utils/`.
- **State Management:** Replaced React Context with Zustand (with `persist` middleware for localStorage).
- **TypeScript:** Enforced strict types for all data shapes, removed implicit `any` types, and enabled `strict: true` in tsconfig.
- **Code Splitting:** Dynamic imports for all JSON data (search and profiles) to drastically reduce initial bundle size. Added React.lazy and Suspense for page-level code splitting.

### UI/UX Redesign
- **Gen-Z Aesthetic:** Fully dark theme using CSS variables (`index.css`), featuring glassmorphism cards and neon purple/cyan accents.
- **Framer Motion Animations:** Smooth card entrance stagger, dynamic platform tab indicator, and a sleek slide-over panel for the saved list.
- **GSAP Animation:** Engaging stat counter animation on the profile page hero section on mount.
- **Polished States:** Added skeleton loading states, empty states, and comprehensive error states.
- **Responsive Design:** Mobile-first layout adjustments across all components.

### New Libraries

| Library | Reason |
|---|---|
| zustand | Lightweight, scalable state management with persist middleware |
| framer-motion | Smooth, physics-based animations for tabs and slide-overs |
| gsap | High-performance number counter animation |
| lucide-react | Clean, modern icon set |
| clsx + tailwind-merge | Clean className composition utility (`cn`) |
| react-hot-toast | Non-intrusive toast notifications |

*(Note: Radix UI primitives were skipped in favor of building lightweight custom accessible components to reduce bundle size).*

### Assumptions
- Profile JSON files are named exactly by username or `user_id` in the case of some platforms.
- The provided sample JSON data shapes are fixed and can be statically typed.
- The "My List" feature is user-specific per browser session and does not need backend syncing.

### Trade-offs
- **Testing:** No unit or E2E testing frameworks (Vitest, Playwright) added due to scope limits.
- **Analytics Tab:** The UI is built for the Analytics tab, but it displays a "coming soon" message as the JSON data doesn't have relevant time-series data to plot.
- **Animation Libraries:** GSAP is only used for the stat counters; Framer Motion handles all layout and DOM animations to prevent conflict between two animation engines.

### Remaining Improvements
- Add unit tests with Vitest + React Testing Library.
- Add E2E tests with Playwright for critical flows (search -> profile -> save).
- Implement virtual scrolling (`react-window`) for the influencer search grid.
- Expand keyboard navigation accessibility (ARIA roles).
- Add CSV export functionality for the saved influencer list.
