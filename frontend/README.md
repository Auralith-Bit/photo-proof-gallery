# Frameora — Frontend

Premium photography album management & private client gallery.
**Every moment. Beautifully preserved.**

Frontend-only build (React + Vite + JavaScript + Tailwind v4). All data flows through a
mock service layer with simulated latency, so every loading / empty / error / success
state is genuinely exercised. Swap the service bodies for real API calls to connect the
MERN backend — components, hooks, and React Query keys stay unchanged.

---

## 1. Getting started

```bash
# install (project uses pnpm — see pnpm-lock.yaml)
pnpm install

# dev server
pnpm dev            # http://localhost:5173

# production build + preview
pnpm build
pnpm preview
```

Stack: React 19, Vite, React Router v7 (data router), TanStack Query v5, Zustand,
React Hook Form + Zod, Tailwind CSS v4 (`@tailwindcss/vite`), Radix UI primitives
(dialog / dropdown / tabs), lucide-react, date-fns, react-dropzone, recharts, qrcode.

---

## 2. Design system — "Frameora Signature"

### Color tokens (defined in `src/index.css` under `@theme`)

| Token      | Hex       | Use                                                                 |
| ---------- | --------- | ------------------------------------------------------------------- |
| `ivory`    | `#F7F5EF` | Page / workspace background, large empty surfaces                   |
| `charcoal` | `#272923` | Sidebar, primary buttons, major headings, body text                 |
| `olive`    | `#777C64` | Secondary buttons, active nav indicator, supporting icons, progress |
| `sand`     | `#E8E4DA` | Borders, dividers, input outlines, neutral surfaces                 |
| `white`    | `#FFFFFF` | Cards, forms, dropdowns, dialogs, photo panels                      |
| `gold`     | `#C4A575` | **Sparing** brand accent only (aperture mark, hairlines)            |
| `success`  | `#39734D` | Active status, success feedback                                     |
| `error`    | `#B54747` | Destructive actions, validation errors                              |
| `warning`  | `#9A6A24` | Approaching-limit warnings                                          |

Tailwind classes are available directly: `bg-ivory`, `text-charcoal`, `border-sand`,
`bg-olive`, `text-gold`, `text-error`, etc. Semantic status colors are always paired with
text or an icon (never color alone).

### Typography

- Interface: **Inter** (`font-sans`).
- Editorial headings: **DM Serif Display** (`font-serif`) — used for the marketing hero,
  client-facing album titles, the 404 / error fallbacks, and brand moments. Not used
  across the dashboard.
- Scale: page titles 28–32px (24–28 mobile), section 18–20, card 15–17, body 14–16,
  secondary 13–14, labels 12–13, metrics 28–36.

### Spacing / surfaces

4px system (4,8,12,16,20,24,32,40,48,64). Sidebar 240–256 expanded / 72–80 collapsed.
Top nav 64–72 desktop / 56–64 mobile. Controls 40–44 (large 48). Card padding 16–24,
radius `rounded-card` (14px); controls `rounded-control` (10px). Main content max-width
~1440px. Shadows only for elevation (dropdowns, dialogs, floating panels) — `shadow-subtle`
/ `shadow-elevated`. Default light mode; no competing palettes per page.

---

## 3. Folder structure

```
src/
├── app/
│   ├── layouts/        WorkspaceLayout · AlbumWorkspaceLayout · ClientLayout
│   ├── providers/      QueryProvider (React Query)
│   ├── router.jsx      Route table (wrapped in ErrorBoundary)
│   └── ErrorBoundary.jsx
├── components/
│   ├── ui/             Design-system primitives (Button, Input, Card, Badge, Dialog,
│   │                   DropdownMenu, Tabs, Toast/Toaster, Skeleton, EmptyState,
│   │                   ErrorState, Switch, Avatar, ImageUpload, MetricCard, …)
│   ├── workspace/      Sidebar · Topbar · MobileDrawer · Breadcrumbs · ActivityItem ·
│   │                   StorageCard · navigation.js
│   ├── album/          AlbumCard · AlbumListItem · AlbumActionsMenu · UploadDropzone ·
│   │                   PhotoGrid · PhotoThumbnail · PhotoLightbox · PhotosTab ·
│   │                   AlbumDetailsTab · AlbumPrivacyTab · AlbumClientTab ·
│   │                   AlbumWorkspaceHeader
│   ├── client/         ClientFormFields · ClientActionsMenu
│   ├── gallery/        ClientHeader · ClientGalleryGrid · ClientLightbox  (client-facing)
│   ├── analytics/      Charts · ChartCard · CustomTooltip · FilterBar · NotTrackedPanel
│   ├── settings/       SettingsLayout · SaveBar · BrandingPreview
│   ├── uploads/        UploadQueue · UploadQueueRow
│   └── shared/         PlaceholderPage · NotFoundPage
├── features/           auth · dashboard · albums · uploads · clients · analytics ·
│                       settings · client-access · marketing   (each holds its pages)
├── hooks/              useAlbums · useClients · usePhotos · useUploadQueue · useActivity ·
│                       useStorage · useUser · useAnalytics · useSettings · useSaveStatus ·
│                       useClientAccess · useAlbumClient · useAlbumPrivacy ·
│                       usePrefersReducedMotion
├── lib/                utils.js (cn) · formatters.js (locale-aware dates/bytes/status maps) ·
│                       sharing.js (buildAlbumLink / downloadAlbumQr) · analytics.js ·
│                       downloads.js
├── mocks/              albums · clients · photos · activity · storage · settings · user
├── services/           album · client · photo · activity · storage · analytics · auth ·
│                       settings · user · client-access · albumSecrets.store
└── stores/             toastStore · uiStore · localeStore · settingsDirtyStore ·
                        clientAccessStore
```

---

## 4. Route map

| Route                                                             | Layout                         | Purpose                                                    |
| ----------------------------------------------------------------- | ------------------------------ | ---------------------------------------------------------- |
| `/`                                                               | standalone                     | Marketing homepage                                         |
| `/login` `/register` `/forgot-password` `/reset-password`         | AuthLayout                     | Photographer auth                                          |
| `/dashboard`                                                      | WorkspaceLayout                | Studio overview, metrics, recent albums, activity, storage |
| `/albums`                                                         | WorkspaceLayout                | Directory — grid/list, search, status filters, actions     |
| `/albums/new`                                                     | WorkspaceLayout                | Create album (info · client · privacy)                     |
| `/albums/:albumId`                                                | AlbumWorkspaceLayout → Photos  | Photo grid, dropzone, lightbox, bulk, cover                |
| `/albums/:albumId/details`                                        | AlbumWorkspaceLayout → Details | Autosave edit form                                         |
| `/albums/:albumId/privacy`                                        | AlbumWorkspaceLayout → Privacy | Access · password · QR · link · downloads                  |
| `/albums/:albumId/client`                                         | AlbumWorkspaceLayout → Client  | Assign / change / create / unassign client                 |
| `/uploads`                                                        | WorkspaceLayout                | Upload manager — queue, progress, retry, cancel            |
| `/clients` `/clients/new` `/clients/:clientId`                    | WorkspaceLayout                | Client directory / create / details                        |
| `/analytics`                                                      | WorkspaceLayout                | Derived metrics + charts (sample-flagged)                  |
| `/settings` (+ `/profile` `/security` `/branding` `/preferences`) | SettingsLayout                 | Section nav + storage                                      |
| `/a/:accessToken`                                                 | ClientLayout                   | Album password gate (metadata only)                        |
| `/a/:accessToken/gallery`                                         | ClientLayout                   | Private branded gallery                                    |
| `*`                                                               | standalone                     | 404                                                        |

There is **no** separate QR/Sharing page — QR + sharing live inside each album's Privacy tab.
There is **no** expiry anywhere (statuses are Active / Draft / Archived only).

---

## 5. Data layer & mock → real swap

Every screen reads through `src/services/*.js`. Each function currently returns mock data
after a simulated delay. **To connect the backend, replace only the function bodies** with
`fetch`/axios calls — the React Query hooks (`src/hooks/*`) and all components are unchanged
because the services already return the shapes the UI consumes. Add an `api` client
(e.g. axios instance with `baseURL: "/api"` and an auth interceptor) under `src/lib/api.js`.

Suggested REST contract (method · path → service function):

**Auth** (`auth.service.js`)

- `POST /api/auth/login` `{email,password}` → `{user}` — `login`
- `POST /api/auth/register` `{name,email,password}` → `{user}` — `register`
- `POST /api/auth/forgot-password` `{email}` → `{ok}` (generic, never reveals existence) — `requestPasswordReset`
- `POST /api/auth/reset-password` `{token,password}` → `{ok}` — `resetPassword`
- `POST /api/auth/resend-verification` → `{ok,email}` — `resendVerification` (settings)
- `GET /api/auth/me` → `{user}` — `getUser` (user.service)

**Albums** (`album.service.js`)

- `GET /api/albums` → `Album[]` (joined `clientName`, `hasPassword`) — `getAlbums`
- `GET /api/albums/:id` → `Album` (+ `photos`) — `getAlbumById`
- `POST /api/albums` `{title,description,eventDate,clientId,password}` → `Album` — `createAlbum`
- `PATCH /api/albums/:id` `{title,description,eventDate,clientId}` → `Album` — `updateAlbum`
- `POST /api/albums/:id/archive` · `POST /api/albums/:id/restore` → `Album` — `archiveAlbum` / `restoreAlbum`
- `DELETE /api/albums/:id` → `Album` — `deleteAlbum`
- `PATCH /api/albums/:id/access` `{enabled}` → `Album` — `setAccessEnabled`
- `PATCH /api/albums/:id/downloads` `{allow}` → `Album` — `setDownloadPermission`
- `PUT /api/albums/:id/password` `{password}` → `Album` — `setAlbumPassword`
- `DELETE /api/albums/:id/password` → `Album` — `removeAlbumPassword`
- `POST /api/albums/:id/regenerate-link` → `Album` (new `accessToken`) — `regenerateAlbumLink`

**Photos** (`photo.service.js`)

- `GET /api/albums/:albumId/photos` → `Photo[]` — `getPhotosByAlbum`
- `POST /api/albums/:albumId/photos` (multipart, one request per file) → `Photo` — `uploadPhoto`
  (wire `onProgress` to the XHR/axios upload progress event; wire `signal` to the request's
  `AbortController` so cancel works; the brief "processing" stage maps to a server
  post-upload transform)
- `DELETE /api/albums/:albumId/photos/:photoId` → `Photo` — `deletePhoto`
- `PUT /api/albums/:albumId/cover/:photoId` → `Photo` — `setCoverPhoto`
- Keep `photoCount` in sync server-side; the UI already invalidates album queries on change.

**Clients** (`client.service.js`)

- `GET /api/clients` → `Client[]` (joined `albumCount`, `latestAlbum`) — `getClients`
- `GET /api/clients/:id` → `Client` — `getClientById`
- `POST /api/clients` `{fullName,email,phone,notes}` → `Client` — `createClient`
- `PATCH /api/clients/:id` → `Client` — `updateClient`
- `POST /api/clients/:id/archive` · `POST /api/clients/:id/restore` → `Client` — `archiveClient` / `restoreClient`
- `DELETE /api/clients/:id` → `Client` (albums survive, become unassigned) — `deleteClient`

**Activity / Storage** (`activity.service.js`, `storage.service.js`)

- `GET /api/activity?limit=` → `ActivityItem[]` — `getRecentActivity`
- `GET /api/storage` → `{usedBytes,totalBytes}` — `getStorageInfo`

**Analytics** (`analytics.service.js`)

- `GET /api/analytics?range=7|30|90|custom&from=&to=` → `{sample?,range,buckets,totals}` — `getAnalytics`
  Return **only derived** metrics (albums created / photos uploaded over time). Return
  visits / downloads **only if** the backend actually tracks them; otherwise omit and the UI
  shows the "Requires backend tracking" panel. Never send invented deltas.

**Settings** (`settings.service.js`)

- `GET /api/settings/profile` · `PATCH /api/settings/profile` — `getProfile` / `updateProfile`
- `GET /api/settings/security` — `getSecurity`
- `POST /api/settings/security/password` `{currentPassword,newPassword}` — `changePassword`
- `PATCH /api/settings/security/preferences` `{notifyOnNewDevice,notifyOnClientAccess}` — `updateSecurityPrefs`
- `DELETE /api/settings/security/sessions/:id` — `revokeSession`
- `DELETE /api/settings/security/sessions` (others) — `revokeOtherSessions`
- `GET /api/settings/branding` · `PATCH /api/settings/branding` — `getBranding` / `updateBranding`
- `GET /api/settings/preferences` · `PATCH /api/settings/preferences` — `getPreferences` / `updatePreferences`
- `getPreferencesSync` / `getBrandingSync` are in-memory caches the UI reads synchronously
  (e.g. `createAlbum` applying default access/download). With a real backend, **apply those
  defaults server-side on creation** and drop the sync helpers; the branding cache feeds the
  client gallery, which the backend should also return on access verification.

**Client access / the gate** (`client-access.service.js`)

- `GET /api/a/:accessToken` → **metadata only** `{id,title,description,eventDate,coverPhotoUrl,status,accessEnabled,hasPassword,allowDownload}` — `resolveAlbumByToken`.
  Must **never** include the photo array. The cover is the single sanctioned teaser.
- `POST /api/a/:accessToken/verify` `{password}` → on success `{sessionToken,album,branding,photos}`;
  on failure an error with a code the UI maps to a state: `INVALID_LINK`, `DISABLED`,
  `UNAVAILABLE` (archived), `INCORRECT_PASSWORD`, `RATE_LIMITED` (with `retryAfter`),
  `NETWORK`. The server enforces access-enabled, archived, rate-limit, and the password
  comparison (bcrypt/argon2 hash) **before** returning any photo. — `verifyAlbumAccess`

`albumSecrets.store.js` is the mock password map; in production it is a hashed column on the
album document and the comparison happens entirely server-side. The frontend only ever learns
`hasPassword`, never the value.

---

## 6. Security model (frontend responsibilities)

- **No passwords in URLs or storage.** The share link / QR carry only the `accessToken` (the
  route). The album password is typed at the gate and sent in the verify request body; it is
  never written to the URL, `localStorage`, or rendered as plaintext.
- **Authorization is in-memory only.** `clientAccessStore` holds verified sessions and is
  deliberately **not** persisted — reloading the gallery returns the client to the gate. The
  `/gallery` route guards on that session, so deep-linking cannot bypass verification. For a
  real backend, return a short-lived token from `/verify` and keep it in memory (or set an
  httpOnly cookie); the guard logic stays the same.
- **No photo leak pre-auth.** Photo arrays are returned only by `/verify` and rendered only
  after a session exists. The password page resolves metadata (incl. one cover image) only.
- **Hiding ≠ enforcement.** Download controls are shown only when `allowDownload` is true, but
  the real enforcement is the backend rejecting download requests when the permission is off.
  The UI reflects the server's permission; it does not provide the security.
- **Generic errors.** Auth/access failures use safe, non-revealing messages (e.g. "Incorrect
  email or password", "This link doesn't look right"). No stack traces, no internal details.
- **Graceful states.** Expired albums were removed from the product; the gate handles
  incorrect-password, rate-limited (with countdown), disabled, invalid-link, unavailable, and
  network-failure (driven by `navigator.onLine`) explicitly.
- User-provided strings (titles, notes, filenames) are rendered as text, never raw HTML.

---

## 7. Accessibility & responsive

Targets WCAG 2.2 AA: semantic landmarks, logical headings, visible focus rings, real
`<button>`/`<a>` for interactions, labelled forms with `aria-invalid`/`aria-describedby`,
dialog focus management (Radix), `aria-live` for async status (save indicators, toasts,
upload progress), status never by color alone, `prefers-reduced-motion` honored (chart
animations + smooth scroll disabled), meaningful alt text / empty alt for decorative imagery.
Mobile-first to 320px: sidebar → slide-in drawer, tables → stacked cards, grids reflow,
dialogs fit viewport height, no horizontal overflow.

---

## 8. Handoff checklist for the backend team

1. Stand up the endpoints in §5 with the exact request/response shapes (the mock return
   objects are the contract).
2. Implement album password hashing + the `/verify` gate with rate limiting and the error
   codes listed; never return photos before verification.
3. Issue `accessToken` on album create and on regenerate-link; serve the QR target route
   `/a/:token` (metadata) and `/a/:token/gallery` (post-verify).
4. Apply default album access / download server-side on create (replaces the sync-preference
   helpers).
5. Return branding with the verify payload so the client gallery is branded from the server.
6. Track visits/downloads only if intended; otherwise omit so the UI shows "Requires backend
   tracking" rather than fake numbers.
7. On the frontend, add `src/lib/api.js`, swap each service function body to call it, and
   delete the `src/mocks/*` files. No component or hook changes required.
