/* ==========================================================================
   DHUN — Library View (matches original design)
   ========================================================================== */

import { libraryStore, playerStore, authStore, uiStore } from '../store/index.js';
import { getIcon, createIconButton } from '../utils/icons.js';
import { $, $$, h, escapeHtml } from '../utils/format.js';
import { navigate as routerNavigate } from '../router/index.js';
import { openAuthModal } from '../components/AuthModal.js';

let libraryEl = null;
let currentTab = 'playlists';

/** Create library view - returns the view container element */
export function createLibraryView() {
  libraryEl = h('div', { class: 'view', id: 'view' });
  addLibraryStyles();
  return libraryEl;
}

/** Render library view */
export function renderLibraryView() {
  if (!libraryEl) return;

  const { isAuthenticated } = authStore.get();
  const { playlists, likedSongs, followedArtists, savedAlbums, recentlyPlayed } = libraryStore.get();

  if (!isAuthenticated) {
    view.innerHTML = renderGuestLibrary();
    bindGuestEvents(view);
    return;
  }

  view.innerHTML = `
    <div class="tabs-l">
      <button data-lib="playlists" class="${currentTab === 'playlists' ? 'on' : ''}">Playlists</button>
      <button data-lib="liked" class="${currentTab === 'liked' ? 'on' : ''}">Liked</button>
      <button data-lib="artists" class="${currentTab === 'artists' ? 'on' : ''}">Artists</button>
      <button data-lib="albums" class="${currentTab === 'albums' ? 'on' : ''}">Albums</button>
      <button data-lib="recent" class="${currentTab === 'recent' ? 'on' : ''}">Recent</button>
    </div>
    ${renderTabContent()}
  `;

  bindLibraryEvents(view);
}

/** Guest library (not logged in) */
function renderGuestLibrary() {
  return `
    <div class="empty" style="text-align:center;padding:60px 20px">
      <div style="font-size:48px;margin-bottom:16px">${getIcon('userPlus')}</div>
      <b style="font-size:22px;display:block;margin-bottom:8px">Sign in to access your library</b>
      <span style="color:var(--ink-2);display:block;margin-bottom:24px">Your playlists, liked songs, and history will be saved across devices</span>
      <button class="btn accent" id="guestLogin">${getIcon('user').replace('<svg', '<svg width="16" height="16"')}Sign In</button>
    </div>
  `;
}

function bindGuestEvents(view) {
  $('#guestLogin', view).addEventListener('click', () => openAuthModal('login'));
}

/** Render current tab content */
function renderTabContent() {
  const { playlists, likedSongs, followedArtists, savedAlbums, recentlyPlayed } = libraryStore.get();

  switch (currentTab) {
    case 'playlists':
      return renderPlaylistsTab(playlists);
    case 'liked':
      return renderLikedTab(likedSongs);
    case 'artists':
      return renderArtistsTab(followedArtists);
    case 'albums':
      return renderAlbumsTab(savedAlbums);
    case 'recent':
      return renderRecentTab(recentlyPlayed);
    default:
      return renderPlaylistsTab(playlists);
  }
}

/** Playlists tab */
function renderPlaylistsTab(playlists) {
  if (playlists.length === 0) {
    return `
      <div class="empty">
        <b>No playlists yet</b>
        Create your first playlist to start organizing your music
      </div>
      <button class="btn accent" id="createPlaylist" style="margin-top:16px">${getIcon('plus').replace('<svg', '<svg width="16" height="16"')}Create Playlist</button>
    `;
  }

  return `
    <div class="cards">
      ${playlists.map(p => createPlaylistCardHTML(p)).join('')}
    </div>
    <button class="btn line" id="createPlaylist" style="margin-top:16px;justify-content:center">${getIcon('plus').replace('<svg', '<svg width="16" height="16"')}Create Playlist</button>
  `;
}

/** Liked songs tab */
function renderLikedTab(likedSongs) {
  if (likedSongs.length === 0) {
    return `
      <div class="empty">
        <b>No liked songs yet</b>
        Tap the heart next to any song and it will show up here
      </div>
    `;
  }

  // Would need track metadata from music store
  return `
    <div class="list" id="lkList">
      ${likedSongs.map((id, i) => createLikedTrackRowHTML(id, i)).join('')}
    </div>
  `;
}

/** Followed artists tab */
function renderArtistsTab(artists) {
  if (artists.length === 0) {
    return `
      <div class="empty">
        <b>No followed artists</b>
        Follow artists to see their new releases here
      </div>
    `;
  }

  return `
    <div class="cards">
      ${artists.map(id => createFollowedArtistCardHTML(id)).join('')}
    </div>
  `;
}

/** Saved albums tab */
function renderAlbumsTab(albums) {
  if (albums.length === 0) {
    return `
      <div class="empty">
        <b>No saved albums</b>
        Save albums to access them quickly
      </div>
    `;
  }

  return `
    <div class="cards">
      ${albums.map(id => createSavedAlbumCardHTML(id)).join('')}
    </div>
  `;
}

/** Recent tab */
function renderRecentTab(recent) {
  if (recent.length === 0) {
    return `
      <div class="empty">
        <b>No recent activity</b>
        Start listening to build your history
      </div>
    `;
  }

  return `
    <div class="list" id="recentList">
      ${recent.map((item, i) => createRecentRowHTML(item, i)).join('')}
    </div>
  `;
}

/** Bind library events */
function bindLibraryEvents(view) {
  // Tab switching
  $$('[data-lib]', view).forEach(btn => {
    btn.addEventListener('click', () => {
      currentTab = btn.getAttribute('data-lib');
      renderLibraryView();
    });
  });

  // Create playlist
  const createBtn = $('#createPlaylist', view);
  if (createBtn) {
    createBtn.addEventListener('click', () => openCreatePlaylistModal());
  }

  // Playlist cards
  $$('[data-playlist]', view).forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-playlist');
      routerNavigate(`playlist-${id}`);
    });
  });

  // Track rows in liked/recent
  $$('.trow', view).forEach(row => {
    row.addEventListener('click', (e) => {
      if (e.target.closest('[data-like]')) return;
      const trackId = row.getAttribute('data-tid');
      playTrackFromLibrary(trackId, view);
    });
    row.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); row.click(); }
    });
  });

  // Like buttons
  $$('[data-like]', view).forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleLike(btn.getAttribute('data-like'), btn);
    });
  });

  // Artist cards
  $$('[data-artist]', view).forEach(btn => {
    btn.addEventListener('click', () => routerNavigate(`artist-${btn.getAttribute('data-artist')}`));
  });

  // Album cards
  $$('[data-album]', view).forEach(btn => {
    btn.addEventListener('click', () => routerNavigate(`album-${btn.getAttribute('data-album')}`));
  });
}

/** Open create playlist modal */
function openCreatePlaylistModal() {
  const modal = h('div', { class: 'modal-overlay', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'createPlTitle' }, [
    h('div', { class: 'modal' }, [
      h('button', { class: 'modal-close', 'aria-label': 'Close', onclick: () => closeModal(modal) }, getIcon('close')),
      h('h2', { id: 'createPlTitle' }, 'Create Playlist'),
      h('form', { id: 'createPlForm' }, [
        h('div', { class: 'form-group' }, [
          h('label', { for: 'plName' }, 'Playlist Name'),
          h('input', { type: 'text', id: 'plName', name: 'name', required: true, placeholder: 'My Awesome Playlist', maxlength: 100 })
        ]),
        h('div', { class: 'form-group' }, [
          h('label', { for: 'plDesc' }, 'Description (optional)'),
          h('textarea', { id: 'plDesc', name: 'description', rows: 3, placeholder: 'What\'s this playlist about?' })
        ]),
        h('div', { class: 'form-group' }, [
          h('label', { class: 'checkbox-label' }, [
            h('input', { type: 'checkbox', name: 'public', checked: true }),
            h('span', {}, 'Make public')
          ])
        ]),
        h('div', { class: 'modal-actions' }, [
          h('button', { type: 'button', class: 'btn line', onclick: () => closeModal(modal) }, 'Cancel'),
          h('button', { type: 'submit', class: 'btn accent' }, 'Create')
        ])
      ])
    ])
  ]);

  document.body.appendChild(modal);
  modal.offsetHeight;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  $('#plName', modal).focus();

  $('#createPlForm', modal).addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    const description = form.description.value.trim();
    const isPublic = form.public.checked;

    if (!name) return;

    // Save to library store
    const newPlaylist = {
      id: 'pl-' + Date.now(),
      name,
      description,
      cover: null,
      tracks: [],
      isPublic,
      createdAt: Date.now()
    };

    libraryStore.set({
      playlists: [...libraryStore.get().playlists, newPlaylist]
    });

    closeModal(modal);
    renderLibraryView();
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal(modal);
  });
}

function closeModal(modal) {
  modal.classList.remove('open');
  setTimeout(() => modal.remove(), 200);
  document.body.style.overflow = '';
}

/** Play track from library */
function playTrackFromLibrary(trackId, root) {
  const trackRows = $$('.trow[data-tid]', root);
  const trackIds = Array.from(trackRows).map(r => r.getAttribute('data-tid'));
  const index = trackIds.indexOf(trackId);

  // Get track from music store
  const music = libraryStore.get(); // Would be musicStore in real implementation
  const track = { id: trackId }; // Placeholder

  playerStore.set({
    queue: trackIds,
    queueIndex: index,
    queueContext: 'Library',
    currentTime: 0,
    isPlaying: true,
    currentTrack: track
  });
}

/** Toggle like */
function toggleLike(trackId, btn) {
  const { liked } = playerStore.get();
  const nextLiked = { ...liked };
  if (nextLiked[trackId]) delete nextLiked[trackId];
  else nextLiked[trackId] = true;
  playerStore.set({ liked: nextLiked });

  // Also update library store likedSongs
  const lib = libraryStore.get();
  const likedSongs = lib.likedSongs.includes(trackId)
    ? lib.likedSongs.filter(id => id !== trackId)
    : [...lib.likedSongs, trackId];
  libraryStore.set({ likedSongs });
}

/** HTML creators */
function createPlaylistCardHTML(p) {
  const cover = p.cover || `url('data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect fill="#EBEBE6" width="200" height="200"/></svg>').replace(/'/g, '%27')}')`;
  return `
    <button class="card" data-playlist="${p.id}">
      <div class="art cover" style="background-image:${cover}"></div>
      <b>${escapeHtml(p.name)}</b>
      <span>${p.tracks?.length || 0} songs</span>
    </button>
  `;
}

function createLikedTrackRowHTML(id, index) {
  return `
    <div class="trow" data-tid="${id}" role="button" tabindex="0">
      <span class="n">${String(index + 1).padStart(2, '0')}</span>
      <span class="eq"><i></i><i></i><i></i></span>
      <span class="art cover" style="background-image:var(--paper-2)"></span>
      <span style="min-width:0"><span class="t">Track ${id}</span><span class="s">Unknown Artist</span></span>
      <span class="d mono">0:00</span>
      <button class="lk on" data-like="${id}" aria-label="Unlike">${getIcon('heartOn')}</button>
    </div>
  `;
}

function createFollowedArtistCardHTML(id) {
  return `
    <button class="card" data-artist="${id}">
      <div class="art cover" style="background-image:var(--paper-2);border-radius:50%"></div>
      <b>Artist ${id}</b>
      <span>Artist</span>
    </button>
  `;
}

function createSavedAlbumCardHTML(id) {
  return `
    <button class="card" data-album="${id}">
      <div class="art cover" style="background-image:var(--paper-2)"></div>
      <b>Album ${id}</b>
      <span>Album</span>
    </button>
  `;
}

function createRecentRowHTML(item, index) {
  return `
    <div class="trow" data-tid="${item.trackId}" role="button" tabindex="0">
      <span class="n">${String(index + 1).padStart(2, '0')}</span>
      <span class="eq"><i></i><i></i><i></i></span>
      <span class="art cover" style="background-image:var(--paper-2)"></span>
      <span style="min-width:0"><span class="t">Track ${item.trackId}</span><span class="s">Unknown Artist</span></span>
      <span class="d mono">${fmtTime(item.progress || 0)}</span>
      <button class="lk" data-like="${item.trackId}" aria-label="Like">${getIcon('heart')}</button>
    </div>
  `;
}

function fmtTime(seconds) {
  if (!isFinite(seconds) || seconds < 0) return '0:00';
  const s = Math.max(0, Math.round(seconds));
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, '0')}`;
}

/** Add library styles */
function addLibraryStyles() {
  if (document.getElementById('libraryViewStyles')) return;

  const style = document.createElement('style');
  style.id = 'libraryViewStyles';
  style.textContent = `
    .tabs-l { display: flex; gap: 26px; margin-bottom: 28px; overflow-x: auto; padding-bottom: 8px; }
    .tabs-l button { font-weight: 800; font-stretch: 75%; letter-spacing: -.035em; font-size: clamp(34px, 5vw, 70px); line-height: 1; color: var(--ink-2); opacity: .55; white-space: nowrap; }
    .tabs-l button.on { color: var(--ink); opacity: 1; }
    .empty { padding: 50px 0; color: var(--ink-2); max-width: 42ch; text-align: center; }
    .empty b { display: block; color: var(--ink); font-size: 22px; font-weight: 700; margin-bottom: 6px; letter-spacing: -.02em; }
    .cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(176px, 1fr)); gap: 24px 22px; }
    .card { text-align: left; display: block; width: 100%; }
    .card .art { aspect-ratio: 1; border-radius: 10px; box-shadow: 0 22px 34px -22px var(--c, #000); transition: transform .25s; }
    .card:hover .art { transform: translateY(-4px); }
    .card b { display: block; margin-top: 12px; font-weight: 650; font-size: 16px; letter-spacing: -.01em; }
    .card span { font-family: var(--mono); font-size: 12px; color: var(--ink-2); }
    .list { display: flex; flex-direction: column; }
    .trow { display: grid; grid-template-columns: 28px 46px 1fr auto 36px; gap: 14px; align-items: center; padding: 9px 8px; border-radius: 12px; text-align: left; width: 100%; transition: background .15s; }
    .trow:hover { background: color-mix(in srgb, var(--ink) 6%, transparent); }
    .trow .n { font-family: var(--mono); font-size: 12px; color: var(--ink-2); }
    .trow .art { width: 46px; height: 46px; border-radius: 7px; }
    .trow .t { font-family: var(--mono); font-size: 13px; text-transform: uppercase; letter-spacing: .005em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; }
    .trow .s { font-family: var(--mono); font-size: 12px; color: var(--ink-2); display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .trow .d { font-family: var(--mono); font-size: 12px; }
    .trow .lk { width: 30px; height: 30px; display: grid; place-items: center; border-radius: 50%; color: var(--ink-2); }
    .trow .lk svg { width: 16px; height: 16px; }
    .trow .lk.on { color: var(--accent); }
    .trow.cur .t { color: var(--accent); }
    .eq { display: none; gap: 2px; align-items: flex-end; height: 14px; width: 14px; }
    .eq i { flex: 1; background: var(--accent); animation: eq 1s ease-in-out infinite; height: 40%; }
    .eq i:nth-child(2) { animation-delay: .2s; }
    .eq i:nth-child(3) { animation-delay: .4s; }
    .trow.cur .n { display: none; }
    .trow.cur .eq { display: flex; }
    .playing-off .eq i { animation-play-state: paused; }
    .modal-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px; }
    .checkbox-label { display: flex; align-items: center; gap: 8px; cursor: pointer; color: var(--ink-2); }
    .checkbox-label input { width: 18px; height: 18px; accent-color: var(--accent); }

    @media (max-width: 860px) {
      .tabs-l { gap: 16px; }
      .tabs-l button { font-size: clamp(28px, 6vw, 50px); }
      .trow { grid-template-columns: 24px 40px 1fr auto; }
      .trow .lk { display: none; }
    }
  `;
  document.head.appendChild(style);
}

export default { createLibraryView, renderLibraryView };