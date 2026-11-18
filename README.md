# DHUN — A Tune That Stays 🎵

> Modern Indian music streaming application blending indie, film, ghazal, and lo-fi genres across Hindi, Tamil, Punjabi, Bangla, Malayalam, and more.

---

## 📂 The Two HTML Files Explained

| File | Purpose | When to use |
|------|---------|-------------|
| **`index.html`** ⭐ **(MAIN APPLICATION)** | **The modern web application entry point** served by Vite (`http://localhost:3000`). It is powered by the modular JavaScript engine in `/src`, featuring full **Supabase Authentication (Sign In, Sign Up, Google OAuth, Profile state)**, reactive stores, router, responsive layouts, and full player controls. | **This is the main website that users should see.** |
| **`DHUN.html`** *(Legacy Prototype)* | The original standalone single-file prototype containing embedded inline CSS and vanilla scripts without module bundlers. Retained for offline single-file reference. | Optional backup/reference only. |

---

## 🚀 Getting Started (Run Locally)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the local development server:**
   ```bash
   npm run dev
   ```

3. **Open in your browser:**
   ```
   http://localhost:3000
   ```

---

## 🔐 Authentication Features

DHUN comes equipped with a **Dual-Engine Authentication System**:
- **Zero-Config Local Demo Mode (Active by default):** If no Supabase environment keys are provided, DHUN functions seamlessly using local demo authentication. You can sign up with any email, sign in, or click **"Continue with Google"** for instant 1-click access.
- **Production Supabase Mode:** To connect your own Supabase project:
  1. Copy `.env.example` to `.env`
  2. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
  3. Restart the dev server (`npm run dev`)

---

## 🛠 Project Architecture (`/src`)

```
mUSIC/
├── index.html               # Main website entry point
├── DHUN.html                # Legacy standalone prototype
├── vite.config.js           # Vite dev server configuration (Port 3000)
├── package.json             # NPM dependencies & scripts
├── .env.example             # Supabase configuration template
│
└── src/
    ├── main.js              # Application bootstrapper, DOM mounter & audio ticker
    ├── style.css            # Complete design system & responsive layout styles
    │
    ├── api/
    │   └── client.js        # Supabase client & dual-mode authentication API
    │
    ├── store/
    │   └── index.js         # Reactive stores (authStore, playerStore, libraryStore, musicStore)
    │
    ├── router/
    │   └── index.js         # Hash-based SPA router (#home, #search, #library, #artist, etc.)
    │
    ├── components/
    │   ├── AuthModal.js     # Sign in / Sign up / Forgot password modal dialog
    │   ├── Sidebar.js       # App sidebar with navigation & user profile / sign-in
    │   ├── PlayerBar.js     # Persistent bottom player with seek rail & controls
    │   ├── NowPlaying.js    # Full-screen vinyl Now Playing screen with seek ring
    │   ├── TabBar.js        # Mobile navigation bottom tab bar
    │   └── TrackRow.js      # Interactive track row component with EQ & like
    │
    ├── views/
    │   ├── LandingView.js   # 3D interactive vinyl stage & coverflow shelf
    │   ├── HomeView.js      # Featured artist hero, popular tracks & new albums
    │   ├── SearchView.js    # Multi-term instant search & language chips
    │   ├── LibraryView.js   # Playlists, Liked songs, and Recent history
    │   ├── ArtistView.js    # Artist bio, discography & popular tracks
    │   ├── AlbumView.js     # Album track listing & playback
    │   └── PlaylistView.js  # Curated playlist mosaics
    │
    └── utils/
        ├── art.js           # Procedural SVG album art generator
        ├── format.js        # Time formatters, DOM helpers & theme controls
        └── icons.js         # Curated SVG icons
```

---

## ⌨️ Keyboard Shortcuts

- <kbd>Space</kbd> — Play / Pause current track
- <kbd>→</kbd> / <kbd>←</kbd> — Seek forward / backward 10 seconds
- <kbd>Shift</kbd> + <kbd>→</kbd> / <kbd>Shift</kbd> + <kbd>←</kbd> — Skip to Next / Previous track
- <kbd>Esc</kbd> — Close full-screen Now Playing view
