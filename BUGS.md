# Bugs Found During Audit

## Critical

1. **ProfileDetailPage.tsx:99** — Engagement rate multiplied by 10,000 instead of 100.
   `(user.engagement_rate * 10000).toFixed(2) + "%"` shows 125% instead of 1.25%.

## High

2. **ProfileDetailPage.tsx:131-138** — "Engagements" stat block uses `formatEngagementRate(user.engagement_rate)` instead of the actual `user.engagements` count. Label says "Engagements" but displays a percentage rate.

3. **ProfileDetailPage.tsx:27** — No `.catch()` on `loadProfileByUsername()` — unhandled promise rejection if JSON load fails.

4. **ProfileCard.tsx:48-54** — "Add to List" button is permanently `disabled` with `cursor-not-allowed`. The feature is unimplemented (TODO comments).

5. **ProfileDetailPage.tsx:153-158** — "Add to List" button on the profile page is also permanently `disabled` — feature unimplemented.

## Medium

6. **dataHelpers.ts:1-3** — All three platform JSON files (instagram, youtube, tiktok) are imported at module level. The entire dataset (~27KB) is loaded into the initial bundle regardless of which platform the user views.

7. **dataHelpers.ts:27** — Username search is case-sensitive (`p.username.includes(query)`) while fullname search is case-insensitive. Searching "MrBeast" won't match username "mrbeast".

8. **ProfileCard.tsx:34** — Hard-coded `w-[700px]` on card container — breaks responsive layout, causes horizontal overflow on mobile.

9. **index.css:56** — `#root` has hard-coded `width: 1126px` and `text-align: center` — constrains layout for the redesign.

10. **tsconfig.app.json** — Missing `strict: true` — weaker type safety, allows implicit `any` and unchecked nulls.

11. **YouTube search data** — Some YouTube accounts are missing the `username` field (e.g., "Vlad and Niki", "Kids Diana Show", "Like Nastya"). This would cause `undefined` to be used as the key in ProfileList and as the route parameter.

12. **SearchPage.tsx:13** — `extractProfiles()` called on every render without memoization. Recomputes the full array each time any state changes.

## Low

13. **SearchPage.tsx:11-18** — `clickCount` state increments on every card click but is only used for `console.log`. Causes unnecessary re-renders.

14. **ProfileCard.tsx:37** — `<img>` tag missing `alt` attribute — accessibility violation.

15. **ProfileDetailPage.tsx:72** — Profile image also missing `alt` attribute.

16. **formatters.ts:1** — `formatFollowers` function is defined but never imported anywhere. Duplicate formatting logic exists inline in ProfileCard.tsx and ProfileDetailPage.tsx.

17. **package.json:15** — `react-beautiful-dnd` is a deprecated dependency, incompatible with React 19 (requires `--legacy-peer-deps`), and is never imported anywhere in the codebase.

## Post-Redesign Additions

18. **Google User Content Image Expiry (Resolved)** — 6 YouTube creators in the `search/youtube.json` database had dead profile picture URLs (HTTP 404). This was resolved by patching the JSON file to use live dynamic links (`https://unavatar.io/youtube/{username}`). Furthermore, the `<Avatar>` component was upgraded with an `onError` state fallback to render the creator's first initial if any image URL fails to load in the future.

19. **Zustand LocalStorage Desync (Resolved)** — The `shuffledCreators` state was caching deprecated `InfluencerSummary` objects instead of the new `GlobalProfile` objects, causing undefined `picture` properties on load. Solved by updating `InfluencerCard.tsx` and `InfluencerGrid.tsx` with graceful fallbacks (`profile.picture || profile.avatarUrl`).
