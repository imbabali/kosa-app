# KOSA Feature Inventory

**Status:** Living document — updated as features ship.
**Created:** 2026-05-06

This is the canonical "what does the platform do" list. Every feature here either ships, gets blocked on an external setup, or is explicitly deferred. Nothing should be invisible.

## Status legend

- ✅ **Done** — built, pushed, deployed
- 🟢 **Building now** — in active development
- 🟡 **Blocked** — needs external setup (Google Cloud, Twilio, payment provider)
- ⚪️ **Deferred** — out of MVP scope per Foundation spec

## Public site (5)

1. ✅ Landing page (`/`)
2. 🟢 About / KOSA history (`/about`)
3. 🟢 Contact (`/contact`)
4. 🟢 Privacy policy (`/privacy`)
5. 🟢 Terms (`/terms`)

## Auth (7)

6. ✅ Email magic-link sign-in
7. ✅ Sign out
8. ✅ Auth gate on `/portal/*` via proxy
9. 🟡 Google OAuth — needs Google Cloud OAuth client
10. 🟡 Phone OTP — needs Twilio account
11. ⚪️ Apple Sign-In — defer to native (Capacitor) phase
12. 🟢 Account deletion (`/portal/settings/delete-account`)

## Member profile (4)

13. 🟢 View own profile (`/portal/profile`)
14. 🟢 Edit profile — name, residence, workplace, phone, focus, details
15. 🟢 Upload avatar (Supabase Storage)
16. 🟢 Profile completeness indicator

## Directory (4)

17. 🟢 Member list with search (`/portal/directory`)
18. 🟢 Member detail view (`/portal/directory/[id]`)
19. 🟢 Migrate 58 Firestore records → Supabase
20. 🟢 Contact-member shortcuts (`tel:`, `mailto:`)

## Digital ID (4)

21. 🟢 View ID card with QR (`/portal/id-card`)
22. 🟢 Membership validity badge (active/expired)
23. 🟢 Member ID number (`KOSA{year}{seq}` format)
24. ⚪️ Apple Wallet pass (.pkpass) — native phase

## Events (6)

25. 🟢 Upcoming events list (`/portal/events`)
26. 🟢 Event detail (`/portal/events/[id]`)
27. 🟢 RSVP (going / maybe / not)
28. 🟢 View attendees
29. 🟢 Add to calendar (.ics download)
30. 🟢 Past events archive

## Notices (4)

31. 🟢 Notices list (`/portal/notices`)
32. 🟢 Notice detail (`/portal/notices/[id]`)
33. 🟢 Mark as read
34. ⚪️ Email/push on new notice — post-MVP

## Gallery (3)

35. ⚪️ Photo album list — post-MVP
36. ⚪️ Album / photo detail
37. ⚪️ Upload photos

## Payments (1)

38. 🟡 Donations / dues — needs Stripe + Flutterwave/Mobile Money

## Messages (1)

39. ⚪️ 1:1 messaging — out of MVP scope per Foundation spec

## Feedback (1)

40. 🟢 Submit feedback (`/portal/feedback`)

## Admin (4)

41. 🟢 `is_admin` flag on profiles + admin gate (`/portal/admin`)
42. 🟢 Create event
43. 🟢 Create notice
44. 🟢 View feedback

## Cross-cutting (3)

45. 🟢 PWA manifest + installable
46. 🟢 Branded 404 + loading states
47. 🟢 Vercel Analytics

## Total

**47 features** · **5 done** (public landing + 3 auth + sign-out) · **31 building now** · **3 blocked on external setup** · **8 deferred per spec**
