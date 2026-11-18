/* ==========================================================================
   DHUN — Main Entry Point
   ========================================================================== */

import { initStores, authStore, playerStore, uiStore, libraryStore, musicStore } from './store/index.js';
import { initRouter, route, navigate, guards } from './router/index.js';
import { createAuthModal, openAuthModal, closeAuthModal } from './components/AuthModal.js';
import { createPlayerBar } from './components/PlayerBar.js';
import { createNowPlaying, openNowPlaying, closeNowPlaying } from './components/NowPlaying.js';
import { createSidebar } from './components/Sidebar.js';
import { createTabBar } from './components/TabBar.js';
import { createHomeView, renderHomeView } from './views/HomeView.js';
import { createSearchView, renderSearchView } from './views/SearchView.js';
import { createLibraryView, renderLibraryView } from './views/LibraryView.js';
import { createArtistView, renderArtistView } from './views/ArtistView.js';
import { createAlbumView, renderAlbumView } from './views/AlbumView.js';
import { createPlaylistView, renderPlaylistView } from './views/PlaylistView.js';
import { createLandingView, showLanding as showLandingView, hideLanding as hideLandingView } from './views/LandingView.js';
import { initTheme, toggleTheme } from './utils/format.js';
import { authApi } from './api/client.js';
import { $, $$, h } from './utils/format.js';

/** View instances */
const views = {
  landing: null,
  home: null,
  search: null,
  library: null,
  artist: null,
  album: null,
  playlist: null
};

let mainContainer = null;

/** Initialize the application */
async function initApp() {
  // Initialize theme
  initTheme();

  // Initialize stores (loads persisted state)
  initStores();

  const landingRoot = document.getElementById('landing-root');
  const app = document.getElementById('app');

  // Create core components
  createAuthModal();
  const sidebar = createSidebar();
  const tabbar = createTabBar();
  const player = createPlayerBar();
  const np = createNowPlaying();
  document.body.appendChild(np);

  // Main scrollable container for views
  mainContainer = h('main', { class: 'main', id: 'main' });

  // Mount components as direct children of the #app grid container
  app.innerHTML = '';
  app.appendChild(sidebar);
  app.appendChild(mainContainer);
  app.appendChild(tabbar);
  app.appendChild(player);

  // Create view instances
  views.landing = createLandingView();
  views.home = createHomeView();
  views.search = createSearchView();
  views.library = createLibraryView();
  views.artist = createArtistView();
  views.album = createAlbumView();
  views.playlist = createPlaylistView();

  // Mount landing to landing-root
  landingRoot.innerHTML = '';
  landingRoot.appendChild(views.landing);

  // Set up router with guards
  setupRouter();

  // Initialize router (handles initial hash)
  initRouter();

  // Global event listeners
  setupGlobalListeners();

  // Check for OAuth callback
  await handleOAuthCallback();

  // Load initial music data
  loadMockMusicData();

  // Restore player state
  restorePlayerState();

  // Start playback ticker loop
  startPlaybackTicker();

  console.log('DHUN initialized successfully');
}

/** Set up router with routes and guards */
function setupRouter() {
  // Define routes
  route('landing', () => showLanding());
  route('home', () => showView('home', renderHomeView));
  route('search', () => showView('search', renderSearchView));
  route('library', () => showView('library', renderLibraryView));
  route('artist', (params) => showView('artist', () => renderArtistView(params)));
  route('album', (params) => showView('album', () => renderAlbumView(params)));
  route('playlist', (params) => showView('playlist', () => renderPlaylistView(params)));
  route('playing', () => openNowPlaying());

  // Auth routes
  route('login', () => openAuthModal('login'));
  route('signup', () => openAuthModal('signup'));
  route('forgot', () => openAuthModal('forgot'));
}

/** Show landing page */
function showLanding() {
  const landingRoot = document.getElementById('landing-root');
  const app = document.getElementById('app');
  if (landingRoot) landingRoot.hidden = false;
  if (app) app.hidden = true;
  showLandingView();
  document.body.style.overflow = '';
}

/** Show a view */
function showView(viewName, renderFn) {
  const landingRoot = document.getElementById('landing-root');
  const app = document.getElementById('app');

  if (landingRoot) landingRoot.hidden = true;
  hideLandingView();

  if (app) app.hidden = false;
  document.body.style.overflow = 'hidden';

  // Mount target view inside main container
  if (mainContainer) {
    mainContainer.innerHTML = '';
    const view = views[viewName];
    if (view) {
      mainContainer.appendChild(view);
      if (renderFn) renderFn();
    }
    mainContainer.scrollTop = 0;
  }
}

/** Playback ticker loop */
function startPlaybackTicker() {
  setInterval(() => {
    const { isPlaying, currentTime, duration, queue, queueIndex } = playerStore.get();
    if (!isPlaying || queueIndex < 0 || !queue.length) return;

    const currentTrack = queue[queueIndex];
    const dur = duration || (typeof currentTrack === 'object' ? currentTrack.duration : 240) || 240;

    const nextTime = currentTime + 0.25;
    if (nextTime >= dur) {
      playNext();
    } else {
      playerStore.set({ currentTime: nextTime, duration: dur });
    }
  }, 250);
}

/** Handle OAuth callback */
async function handleOAuthCallback() {
  if (location.hash.includes('access_token=')) {
    try {
      await authApi.handleOAuthCallback(location.hash);
      // Clean URL
      history.replaceState(null, '', location.pathname + location.search);
      showToast('Signed in with Google!');
      navigate('home');
    } catch (error) {
      console.error('OAuth callback failed:', error);
      showToast('Sign in failed: ' + error.message, 'error');
    }
  }
}

/** Load mock music data (replace with real API later) */
function loadMockMusicData() {
  // This matches the original DHUN.html mock data
  const ARTISTS = {
    'raag-circuit': { id: 'raag-circuit', name: 'Raag Circuit', genres: 'Electronic raga, downtempo, sitar wave', listeners: '2.4M monthly listeners', art: generateCoverArt('sun', ['#1B1464', '#F25C2A', '#FFD25E']), glow: '#F25C2A' },
    'meera-monsoon': { id: 'meera-monsoon', name: 'Meera & The Monsoon', genres: 'Indie folk, Hindi pop, acoustic', listeners: '1.8M monthly listeners', art: generateCoverArt('arch', ['#0F3D3E', '#E8A33D', '#F4E3C1']), glow: '#E8A33D' },
    'tanpura-club': { id: 'tanpura-club', name: 'Tanpura Club', genres: 'Lo-fi, ambient, classical fusion', listeners: '960K monthly listeners', art: generateCoverArt('rings', ['#F2C6D0', '#7A2E4B', '#2B2A4C']), glow: '#7A2E4B' },
    'kavya-sethi': { id: 'kavya-sethi', name: 'Kavya Sethi', genres: 'Pop, R&B, Hinglish', listeners: '3.1M monthly listeners', art: generateCoverArt('blocks', ['#FF5A7A', '#2D1E5F', '#FFD1DC']), glow: '#2D1E5F' },
    'nilgiri-hours': { id: 'nilgiri-hours', name: 'Nilgiri Hours', genres: 'Indie rock, shoegaze, Tamil', listeners: '740K monthly listeners', art: generateCoverArt('stripes', ['#0B2545', '#13A89E', '#EEF4ED']), glow: '#13A89E' },
    'dev-nair-quartet': { id: 'dev-nair-quartet', name: 'Dev Nair Quartet', genres: 'Jazz, Malayalam fusion', listeners: '410K monthly listeners', art: generateCoverArt('arch', ['#143A2B', '#C5E063', '#F4F1DE']), glow: '#C5E063' }
  };

  const ALBUMS = {
    'al0': { id: 'al0', title: 'Sitar Wave', artist: 'Raag Circuit', artistId: 'raag-circuit', year: 2025, art: generateCoverArt('sun', ['#1B1464', '#F25C2A', '#FFD25E']), glow: '#F25C2A', trackIds: ['t0-0', 't0-1', 't0-2', 't0-3', 't0-4'] },
    'al1': { id: 'al1', title: 'Monsoon Letters', artist: 'Meera & The Monsoon', artistId: 'meera-monsoon', year: 2024, art: generateCoverArt('arch', ['#0F3D3E', '#E8A33D', '#F4E3C1']), glow: '#E8A33D', trackIds: ['t1-0', 't1-1', 't1-2', 't1-3'] },
    'al2': { id: 'al2', title: 'Slow Sunday', artist: 'Tanpura Club', artistId: 'tanpura-club', year: 2025, art: generateCoverArt('rings', ['#F2C6D0', '#7A2E4B', '#2B2A4C']), glow: '#7A2E4B', trackIds: ['t2-0', 't2-1', 't2-2', 't2-3'] },
    'al3': { id: 'al3', title: 'Hinglish Hearts', artist: 'Kavya Sethi', artistId: 'kavya-sethi', year: 2026, art: generateCoverArt('blocks', ['#FF5A7A', '#2D1E5F', '#FFD1DC']), glow: '#2D1E5F', trackIds: ['t3-0', 't3-1', 't3-2', 't3-3'] },
    'al4': { id: 'al4', title: 'Blue Hour', artist: 'Nilgiri Hours', artistId: 'nilgiri-hours', year: 2024, art: generateCoverArt('stripes', ['#0B2545', '#13A89E', '#EEF4ED']), glow: '#13A89E', trackIds: ['t4-0', 't4-1', 't4-2', 't4-3'] },
    'al5': { id: 'al5', title: 'Kerala Standard Time', artist: 'Dev Nair Quartet', artistId: 'dev-nair-quartet', year: 2025, art: generateCoverArt('arch', ['#143A2B', '#C5E063', '#F4F1DE']), glow: '#C5E063', trackIds: ['t5-0', 't5-1', 't5-2', 't5-3'] },
    'al6': { id: 'al6', title: 'Zero Night', artist: 'Raag Circuit', artistId: 'raag-circuit', year: 2023, art: generateCoverArt('stripes', ['#111114', '#E23B2E', '#EBEBE6']), glow: '#E23B2E', trackIds: ['t6-0', 't6-1', 't6-2'] },
    'al7': { id: 'al7', title: 'Open Windows', artist: 'Kavya Sethi', artistId: 'kavya-sethi', year: 2023, art: generateCoverArt('sun', ['#0D3B66', '#FAA43A', '#F4D35E']), glow: '#FAA43A', trackIds: ['t7-0', 't7-1', 't7-2'] }
  };

  const TRACKS = {
    't0-0': { id: 't0-0', title: 'Neon Bhairavi', artist: 'Raag Circuit', artistId: 'raag-circuit', album: 'Sitar Wave', albumId: 'al0', duration: 252, art: generateCoverArt('sun', ['#1B1464', '#F25C2A', '#FFD25E']), glow: '#F25C2A' },
    't0-1': { id: 't0-1', title: 'Midnight Kalyan', artist: 'Raag Circuit', artistId: 'raag-circuit', album: 'Sitar Wave', albumId: 'al0', duration: 228, art: generateCoverArt('sun', ['#1B1464', '#F25C2A', '#FFD25E']), glow: '#F25C2A' },
    't0-2': { id: 't0-2', title: 'Tabla Drift', artist: 'Raag Circuit', artistId: 'raag-circuit', album: 'Sitar Wave', albumId: 'al0', duration: 301, art: generateCoverArt('sun', ['#1B1464', '#F25C2A', '#FFD25E']), glow: '#F25C2A' },
    't0-3': { id: 't0-3', title: 'Raga in Rain', artist: 'Raag Circuit', artistId: 'raag-circuit', album: 'Sitar Wave', albumId: 'al0', duration: 216, art: generateCoverArt('sun', ['#1B1464', '#F25C2A', '#FFD25E']), glow: '#F25C2A' },
    't0-4': { id: 't0-4', title: 'Last Local', artist: 'Raag Circuit', artistId: 'raag-circuit', album: 'Sitar Wave', albumId: 'al0', duration: 260, art: generateCoverArt('sun', ['#1B1464', '#F25C2A', '#FFD25E']), glow: '#F25C2A' },
    't1-0': { id: 't1-0', title: 'Baarish Ke Baad', artist: 'Meera & The Monsoon', artistId: 'meera-monsoon', album: 'Monsoon Letters', albumId: 'al1', duration: 211, art: generateCoverArt('arch', ['#0F3D3E', '#E8A33D', '#F4E3C1']), glow: '#E8A33D' },
    't1-1': { id: 't1-1', title: 'Chai at 3 AM', artist: 'Meera & The Monsoon', artistId: 'meera-monsoon', album: 'Monsoon Letters', albumId: 'al1', duration: 178, art: generateCoverArt('arch', ['#0F3D3E', '#E8A33D', '#F4E3C1']), glow: '#E8A33D' },
    't1-2': { id: 't1-2', title: 'Chitthi', artist: 'Meera & The Monsoon', artistId: 'meera-monsoon', album: 'Monsoon Letters', albumId: 'al1', duration: 245, art: generateCoverArt('arch', ['#0F3D3E', '#E8A33D', '#F4E3C1']), glow: '#E8A33D' },
    't1-3': { id: 't1-3', title: 'Kaagaz Ki Naav', artist: 'Meera & The Monsoon', artistId: 'meera-monsoon', album: 'Monsoon Letters', albumId: 'al1', duration: 202, art: generateCoverArt('arch', ['#0F3D3E', '#E8A33D', '#F4E3C1']), glow: '#E8A33D' },
    't2-0': { id: 't2-0', title: 'Dhoop Chhaon', artist: 'Tanpura Club', artistId: 'tanpura-club', album: 'Slow Sunday', albumId: 'al2', duration: 194, art: generateCoverArt('rings', ['#F2C6D0', '#7A2E4B', '#2B2A4C']), glow: '#7A2E4B' },
    't2-1': { id: 't2-1', title: 'Sunday Raga', artist: 'Tanpura Club', artistId: 'tanpura-club', album: 'Slow Sunday', albumId: 'al2', duration: 280, art: generateCoverArt('rings', ['#F2C6D0', '#7A2E4B', '#2B2A4C']), glow: '#7A2E4B' },
    't2-2': { id: 't2-2', title: 'Humming Fan', artist: 'Tanpura Club', artistId: 'tanpura-club', album: 'Slow Sunday', albumId: 'al2', duration: 167, art: generateCoverArt('rings', ['#F2C6D0', '#7A2E4B', '#2B2A4C']), glow: '#7A2E4B' },
    't2-3': { id: 't2-3', title: 'Neend', artist: 'Tanpura Club', artistId: 'tanpura-club', album: 'Slow Sunday', albumId: 'al2', duration: 309, art: generateCoverArt('rings', ['#F2C6D0', '#7A2E4B', '#2B2A4C']), glow: '#7A2E4B' },
    't3-0': { id: 't3-0', title: 'Textuals', artist: 'Kavya Sethi', artistId: 'kavya-sethi', album: 'Hinglish Hearts', albumId: 'al3', duration: 176, art: generateCoverArt('blocks', ['#FF5A7A', '#2D1E5F', '#FFD1DC']), glow: '#2D1E5F' },
    't3-1': { id: 't3-1', title: 'Dil Ka DM', artist: 'Kavya Sethi', artistId: 'kavya-sethi', album: 'Hinglish Hearts', albumId: 'al3', duration: 199, art: generateCoverArt('blocks', ['#FF5A7A', '#2D1E5F', '#FFD1DC']), glow: '#2D1E5F' },
    't3-2': { id: 't3-2', title: 'Chal Na', artist: 'Kavya Sethi', artistId: 'kavya-sethi', album: 'Hinglish Hearts', albumId: 'al3', duration: 183, art: generateCoverArt('blocks', ['#FF5A7A', '#2D1E5F', '#FFD1DC']), glow: '#2D1E5F' },
    't3-3': { id: 't3-3', title: 'Rooftop Wifi', artist: 'Kavya Sethi', artistId: 'kavya-sethi', album: 'Hinglish Hearts', albumId: 'al3', duration: 221, art: generateCoverArt('blocks', ['#FF5A7A', '#2D1E5F', '#FFD1DC']), glow: '#2D1E5F' },
    't4-0': { id: 't4-0', title: 'Kohra', artist: 'Nilgiri Hours', artistId: 'nilgiri-hours', album: 'Blue Hour', albumId: 'al4', duration: 273, art: generateCoverArt('stripes', ['#0B2545', '#13A89E', '#EEF4ED']), glow: '#13A89E' },
    't4-1': { id: 't4-1', title: 'Tea Estate', artist: 'Nilgiri Hours', artistId: 'nilgiri-hours', album: 'Blue Hour', albumId: 'al4', duration: 237, art: generateCoverArt('stripes', ['#0B2545', '#13A89E', '#EEF4ED']), glow: '#13A89E' },
    't4-2': { id: 't4-2', title: 'Ooty Static', artist: 'Nilgiri Hours', artistId: 'nilgiri-hours', album: 'Blue Hour', albumId: 'al4', duration: 258, art: generateCoverArt('stripes', ['#0B2545', '#13A89E', '#EEF4ED']), glow: '#13A89E' },
    't4-3': { id: 't4-3', title: 'Saanjh', artist: 'Nilgiri Hours', artistId: 'nilgiri-hours', album: 'Blue Hour', albumId: 'al4', duration: 209, art: generateCoverArt('stripes', ['#0B2545', '#13A89E', '#EEF4ED']), glow: '#13A89E' },
    't5-0': { id: 't5-0', title: 'Backwater Blues', artist: 'Dev Nair Quartet', artistId: 'dev-nair-quartet', album: 'Kerala Standard Time', albumId: 'al5', duration: 322, art: generateCoverArt('arch', ['#143A2B', '#C5E063', '#F4F1DE']), glow: '#C5E063' },
    't5-1': { id: 't5-1', title: 'Sadhya', artist: 'Dev Nair Quartet', artistId: 'dev-nair-quartet', album: 'Kerala Standard Time', albumId: 'al5', duration: 251, art: generateCoverArt('arch', ['#143A2B', '#C5E063', '#F4F1DE']), glow: '#C5E063' },
    't5-2': { id: 't5-2', title: 'Kathakali Swing', artist: 'Dev Nair Quartet', artistId: 'dev-nair-quartet', album: 'Kerala Standard Time', albumId: 'al5', duration: 232, art: generateCoverArt('arch', ['#143A2B', '#C5E063', '#F4F1DE']), glow: '#C5E063' },
    't5-3': { id: 't5-3', title: 'Monsoon Waltz', artist: 'Dev Nair Quartet', artistId: 'dev-nair-quartet', album: 'Kerala Standard Time', albumId: 'al5', duration: 362, art: generateCoverArt('arch', ['#143A2B', '#C5E063', '#F4F1DE']), glow: '#C5E063' },
    't6-0': { id: 't6-0', title: 'Subah 4 AM', artist: 'Raag Circuit', artistId: 'raag-circuit', album: 'Zero Night', albumId: 'al6', duration: 214, art: generateCoverArt('stripes', ['#111114', '#E23B2E', '#EBEBE6']), glow: '#E23B2E' },
    't6-1': { id: 't6-1', title: 'Tandoor Techno', artist: 'Raag Circuit', artistId: 'raag-circuit', album: 'Zero Night', albumId: 'al6', duration: 243, art: generateCoverArt('stripes', ['#111114', '#E23B2E', '#EBEBE6']), glow: '#E23B2E' },
    't6-2': { id: 't6-2', title: 'Metro Mantra', artist: 'Raag Circuit', artistId: 'raag-circuit', album: 'Zero Night', albumId: 'al6', duration: 229, art: generateCoverArt('stripes', ['#111114', '#E23B2E', '#EBEBE6']), glow: '#E23B2E' },
    't7-0': { id: 't7-0', title: 'Gali Ke Lights', artist: 'Kavya Sethi', artistId: 'kavya-sethi', album: 'Open Windows', albumId: 'al7', duration: 188, art: generateCoverArt('sun', ['#0D3B66', '#FAA43A', '#F4D35E']), glow: '#FAA43A' },
    't7-1': { id: 't7-1', title: 'Ek Aur Chai', artist: 'Kavya Sethi', artistId: 'kavya-sethi', album: 'Open Windows', albumId: 'al7', duration: 205, art: generateCoverArt('sun', ['#0D3B66', '#FAA43A', '#F4D35E']), glow: '#FAA43A' },
    't7-2': { id: 't7-2', title: 'Pause', artist: 'Kavya Sethi', artistId: 'kavya-sethi', album: 'Open Windows', albumId: 'al7', duration: 172, art: generateCoverArt('sun', ['#0D3B66', '#FAA43A', '#F4D35E']), glow: '#FAA43A' }
  };

  // Popular tracks
  const POP = ['t0-0', 't1-0', 't5-0', 't3-1', 't4-0', 't2-1', 't0-3', 't6-1'];

  // Editorial playlists
  const EDITORIAL_PLAYLISTS = {
    'baarish': { id: 'baarish', name: 'Baarish Mood', trackIds: ['t1-0', 't0-3', 't5-3', 't1-3', 't2-0', 't4-1'] },
    'night-drive': { id: 'night-drive', name: 'Late Night Drive', trackIds: ['t0-0', 't6-0', 't6-1', 't0-1', 't4-0', 't3-0'] },
    'chai': { id: 'chai', name: 'Chai & Chill', trackIds: ['t1-1', 't7-1', 't2-3', 't1-2', 't3-2'] },
    'focus': { id: 'focus', name: 'Focus Dhun', trackIds: ['t2-1', 't2-2', 't4-3', 't0-2', 't5-1'] },
    'gym': { id: 'gym', name: 'Gym Ke Baad', trackIds: ['t6-2', 't3-0', 't0-0', 't7-0', 't6-1'] }
  };

  // Set in music store
  musicStore.set({
    artists: ARTISTS,
    albums: ALBUMS,
    tracks: TRACKS,
    playlists: EDITORIAL_PLAYLISTS,
    featuredArtist: ARTISTS['raag-circuit'],
    newAlbums: Object.values(ALBUMS).slice(0, 6),
    popularTracks: POP.map(id => TRACKS[id]),
    artistsList: Object.values(ARTISTS)
  });
}

/** Generate cover art (inline to avoid import cycle) */
function generateCoverArt(style, colors) {
  const a = colors[0], b = colors[1], d = colors[2];
  let s = '';

  if (style === 'sun') {
    s = `<rect width="200" height="200" fill="${a}"/><circle cx="100" cy="92" r="58" fill="${b}"/><rect y="118" width="200" height="82" fill="${a}"/><circle cx="100" cy="92" r="32" fill="${d}"/><rect y="132" width="200" height="6" fill="${b}"/><rect y="148" width="200" height="4" fill="${b}"/>`;
  } else if (style === 'arch') {
    s = `<rect width="200" height="200" fill="${a}"/><path d="M30 200V96a70 70 0 0 1 140 0v104z" fill="${b}"/><path d="M60 200V98a40 40 0 0 1 80 0v102z" fill="${d}"/><circle cx="100" cy="94" r="14" fill="${a}"/>`;
  } else if (style === 'rings') {
    s = `<rect width="200" height="200" fill="${a}"/><circle cx="70" cy="130" r="120" fill="${b}"/><circle cx="70" cy="130" r="88" fill="${a}"/><circle cx="70" cy="130" r="56" fill="${d}"/><circle cx="70" cy="130" r="24" fill="${b}"/>`;
  } else if (style === 'blocks') {
    s = `<rect width="200" height="200" fill="${a}"/><path d="M0 100a100 100 0 0 1 100-100v100z" fill="${b}"/><path d="M200 100a100 100 0 0 1-100 100V100z" fill="${d}"/><circle cx="150" cy="50" r="38" fill="${d}"/><circle cx="50" cy="150" r="38" fill="${b}"/>`;
  } else {
    s = `<rect width="200" height="200" fill="${a}"/><g fill="none" stroke-width="16"><circle cx="40" cy="-10" r="60" stroke="${b}"/><circle cx="40" cy="-10" r="90" stroke="${d}"/><circle cx="40" cy="-10" r="120" stroke="${b}"/><circle cx="40" cy="-10" r="150" stroke="${d}"/><circle cx="40" cy="-10" r="180" stroke="${b}"/><circle cx="40" cy="-10" r="210" stroke="${d}"/></g>`;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice">${s}</svg>`;
  return `url('data:image/svg+xml,${encodeURIComponent(svg).replace(/'/g, '%27')}')`;
}

/** Restore player state from storage */
function restorePlayerState() {
  const saved = JSON.parse(localStorage.getItem('dhun-player') || '{}');
  if (saved && saved.queue) {
    playerStore.set(saved);
  }
}

/** Setup global event listeners */
function setupGlobalListeners() {
  // Theme toggles (delegated)
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-theme-toggle]')) {
      toggleTheme();
    }
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Don't intercept if typing in input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    const player = playerStore.get();

    if (e.code === 'Space') {
      e.preventDefault();
      playerStore.set({ isPlaying: !player.isPlaying });
    } else if (e.key === 'ArrowRight') {
      e.shiftKey ? playNext() : seekRelative(10);
    } else if (e.key === 'ArrowLeft') {
      e.shiftKey ? playPrev() : seekRelative(-10);
    } else if (e.key === 'Escape') {
      const np = document.getElementById('np');
      if (np && !np.hidden) {
        closeNowPlaying();
      }
    }
  });

  // Window resize
  window.addEventListener('resize', () => {
    uiStore.set({ isMobile: window.innerWidth <= 860 });
  });
}

/** Playback helpers */
function playNext() {
  const { queue, queueIndex, shuffle, repeat } = playerStore.get();
  if (!queue.length) return;
  let nextIndex = queueIndex;
  if (shuffle && queue.length > 1) {
    do { nextIndex = Math.floor(Math.random() * queue.length); }
    while (nextIndex === queueIndex && queue.length > 1);
  } else if (queueIndex < queue.length - 1) {
    nextIndex++;
  } else if (repeat === 1) {
    nextIndex = 0;
  } else {
    playerStore.set({ isPlaying: false, currentTime: 0 });
    return;
  }
  playerStore.set({ queueIndex: nextIndex, currentTime: 0, isPlaying: true });
}

function playPrev() {
  const { queue, queueIndex, currentTime } = playerStore.get();
  if (!queue.length) return;
  if (currentTime > 3) playerStore.set({ currentTime: 0 });
  else if (queueIndex > 0) playerStore.set({ queueIndex: queueIndex - 1, currentTime: 0 });
  else playerStore.set({ queueIndex: queue.length - 1, currentTime: 0 });
}

function seekRelative(seconds) {
  const { currentTime, duration } = playerStore.get();
  if (!duration) return;
  const next = Math.max(0, Math.min(duration, currentTime + seconds));
  playerStore.set({ currentTime: next });
}

/** Toast notification */
function showToast(message, type = 'info') {
  const toast = h('div', { class: `toast toast-${type}` }, message);
  document.body.appendChild(toast);
  toast.offsetHeight;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 200);
  }, 3000);
}

// Add toast styles if not already added
if (!document.getElementById('toastStyles')) {
  const style = document.createElement('style');
  style.id = 'toastStyles';
  style.textContent = `
    .toast { position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%) translateY(100px); padding: 12px 24px; background: var(--ink); color: var(--paper); border-radius: 999px; font-weight: 500; font-size: 14px; z-index: 200; opacity: 0; transition: transform .3s, opacity .3s; box-shadow: 0 12px 24px -12px rgba(0,0,0,.3); }
    .toast.show { transform: translateX(-50%) translateY(0); opacity: 1; }
    .toast-success { background: #2E7D32; }
    .toast-error { background: var(--accent); }
    @media (max-width: 480px) { .toast { left: 16px; right: 16px; transform: none; bottom: 90px; text-align: center; } .toast.show { transform: translateY(0); } }
  `;
  document.head.appendChild(style);
}

/** Export for debugging */
window.DHUN = {
  stores: { authStore, playerStore, uiStore, libraryStore, musicStore },
  navigate,
  openAuthModal,
  showToast
};

// Start the app
initApp();