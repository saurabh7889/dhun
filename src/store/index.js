/* ==========================================================================
   DHUN — Central Store (Pub/Sub pattern, matches original S object)
   ========================================================================== */

import { storage, sessionStore } from '../utils/format.js';

/** Simple reactive store with persistence */
export function createStore(initialState, options = {}) {
  const { persistKey, storage: store = localStorage } = options;
  let state = { ...initialState };
  const listeners = new Set();

  /** Load persisted state */
  function load() {
    if (persistKey) {
      const saved = storage.get(persistKey);
      if (saved) state = { ...initialState, ...saved };
    }
  }

  /** Persist state */
  function save() {
    if (persistKey) storage.set(persistKey, state);
  }

  /** Subscribe to changes */
  function subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }

  /** Notify all listeners */
  function notify() {
    listeners.forEach(fn => fn(state));
    save();
  }

  /** Get current state */
  function get() {
    return state;
  }

  /** Set state (shallow merge) */
  function set(patch) {
    state = { ...state, ...patch };
    notify();
    return state;
  }

  /** Set nested path */
  function setPath(path, value) {
    const keys = path.split('.');
    const last = keys.pop();
    let obj = state;
    for (const k of keys) {
      if (!(k in obj)) obj[k] = {};
      obj = obj[k];
    }
    obj[last] = value;
    notify();
    return state;
  }

  /** Reset to initial */
  function reset() {
    state = { ...initialState };
    notify();
  }

  load();
  return { get, set, setPath, subscribe, reset, notify };
}

/** ===========================
    AUTH STORE
    =========================== */
export const authStore = createStore({
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
}, { persistKey: 'dhun-auth' });

/** ===========================
    PLAYER STORE (matches original S object)
    =========================== */
export const playerStore = createStore({
  // Queue
  queue: [],           // Array of track IDs
  queueIndex: -1,      // Current index in queue
  queueContext: '',    // Source context (playlist name, album, etc.)

  // Playback
  isPlaying: false,
  currentTime: 0,      // Seconds
  duration: 0,         // Seconds
  volume: 70,
  isMuted: false,

  // Modes
  shuffle: false,
  repeat: 0,           // 0=off, 1=all, 2=one

  // Current track data (populated from queue)
  currentTrack: null,  // Full track object

  // Liked tracks (trackId -> true)
  liked: {},

  // History
  history: [],         // Recently played track IDs

  // Crossfade
  crossfade: 0
}, { persistKey: 'dhun-player' });

/** ===========================
    LIBRARY STORE
    =========================== */
export const libraryStore = createStore({
  // User playlists
  playlists: [],       // Array of { id, name, description, cover, tracks[], isPublic, createdAt }

  // Liked songs playlist (virtual)
  likedSongs: [],      // Array of track IDs

  // Followed artists
  followedArtists: [], // Array of artist IDs

  // Saved albums
  savedAlbums: [],     // Array of album IDs

  // Recently played (enriched)
  recentlyPlayed: [],  // Array of { trackId, playedAt, source, sourceId }
}, { persistKey: 'dhun-library' });

/** ===========================
    UI STORE
    =========================== */
export const uiStore = createStore({
  // Theme
  theme: 'system',     // 'light', 'dark', 'system'

  // Layout
  sidebarOpen: true,
  nowPlayingOpen: false,
  currentView: 'home', // 'home', 'search', 'library', 'artist', 'album', 'playlist', 'playing'

  // Modals
  authModalOpen: false,
  authMode: 'login',   // 'login', 'signup', 'forgot'
  createPlaylistModalOpen: false,

  // Search
  searchQuery: '',
  searchChips: [],
  searchResults: null,

  // Toasts
  toasts: [],          // Array of { id, message, type, duration }

  // Loading states
  loading: {},         // { key: boolean }

  // Device
  isMobile: window.innerWidth <= 860,
  isTouch: 'ontouchstart' in window
}, { persistKey: 'dhun-ui' });

/** ===========================
    MUSIC DATA STORE (cache for API responses)
    =========================== */
export const musicStore = createStore({
  // Cached data
  tracks: {},          // trackId -> track object
  albums: {},          // albumId -> album object
  artists: {},         // artistId -> artist object
  playlists: {},       // playlistId -> playlist object (editorial)

  // Search cache
  searchCache: {},     // query -> results

  // Featured content
  featuredArtist: null,
  newAlbums: [],
  popularTracks: [],
  charts: {},          // chartId -> tracks[]
}, { persistKey: 'dhun-music-cache' });

/** ===========================
    DERIVED / COMPUTED HELPERS
    =========================== */

/** Get current track from player queue */
export function getCurrentTrack() {
  const { queue, queueIndex } = playerStore.get();
  if (queueIndex >= 0 && queueIndex < queue.length) {
    return queue[queueIndex];
  }
  return null;
}

/** Check if track is liked */
export function isTrackLiked(trackId) {
  const { liked } = playerStore.get();
  return !!liked[trackId];
}

/** Toggle track like */
export function toggleTrackLike(trackId) {
  const { liked } = playerStore.get();
  const nextLiked = { ...liked };
  if (nextLiked[trackId]) delete nextLiked[trackId];
  else nextLiked[trackId] = true;
  playerStore.set({ liked: nextLiked });
  return nextLiked[trackId];
}

/** Add to history */
export function addToHistory(trackId, context = {}) {
  const { history } = playerStore.get();
  const entry = { trackId, playedAt: Date.now(), ...context };
  // Remove duplicates
  const filtered = history.filter(h => h.trackId !== trackId);
  playerStore.set({ history: [entry, ...filtered].slice(0, 100) });
}

/** Format player state for persistence */
export function getPersistablePlayerState() {
  const { queue, queueIndex, queueContext, volume, isMuted, shuffle, repeat, crossfade, liked } = playerStore.get();
  return { queue, queueIndex, queueContext, volume, isMuted, shuffle, repeat, crossfade, liked };
}

/** Restore player state */
export function restorePlayerState(state) {
  if (state) playerStore.set(state);
}

/** Initialize all stores */
export function initStores() {
  // Load theme
  const savedTheme = storage.get('dhun-theme');
  if (savedTheme) uiStore.set({ theme: savedTheme });

  // Listen for storage changes (multi-tab sync)
  window.addEventListener('storage', (e) => {
    if (e.key === 'dhun-auth') {
      const saved = storage.get('dhun-auth');
      if (saved) authStore.set(saved);
    }
    if (e.key === 'dhun-player') {
      const saved = storage.get('dhun-player');
      if (saved) playerStore.set(saved);
    }
    if (e.key === 'dhun-library') {
      const saved = storage.get('dhun-library');
      if (saved) libraryStore.set(saved);
    }
    if (e.key === 'dhun-ui') {
      const saved = storage.get('dhun-ui');
      if (saved) uiStore.set(saved);
    }
  });

  // Handle mobile resize
  const handleResize = () => {
    uiStore.set({ isMobile: window.innerWidth <= 860 });
  };
  window.addEventListener('resize', handleResize);
}

/** Export all stores */
export const stores = {
  auth: authStore,
  player: playerStore,
  library: libraryStore,
  ui: uiStore,
  music: musicStore
};

export default stores;