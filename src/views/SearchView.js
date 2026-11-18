/* ==========================================================================
   DHUN — Search View (matches original design)
   ========================================================================== */

import { musicStore, playerStore, uiStore } from '../store/index.js';
import { getIcon } from '../utils/icons.js';
import { $, $$, h, debounce, escapeHtml } from '../utils/format.js';
import { navigate } from '../router/index.js';

let searchEl = null;
let searchInput = null;
let searchResults = null;
let searchDebounce = null;

/** Create search view - returns the view container element */
export function createSearchView() {
  searchEl = h('div', { class: 'view', id: 'view' });
  addSearchStyles();
  return searchEl;
}

/** Render search view */
export function renderSearchView() {
  if (!searchEl) return;

  searchEl.innerHTML = `
    <div class="search-big">
      ${getIcon('search')}
      <input id="sq" type="search" placeholder="Search songs, artists, albums" autocomplete="off" aria-label="Search">
    </div>
    <div class="chips" id="chips"></div>
    <div id="sres"></div>
  `;

  searchInput = $('#sq', searchEl);
  searchResults = $('#sres', searchEl);

  bindSearchEvents();
  renderChips();
  runSearch();
}

/** Bind search events */
function bindSearchEvents() {
  // Input with debounce
  searchDebounce = debounce(() => {
    runSearch();
  }, 300);

  searchInput.addEventListener('input', (e) => {
    uiStore.set({ searchQuery: e.target.value });
    searchDebounce();
  });

  // Chip clicks (delegated)
  $('#chips', searchEl).addEventListener('click', (e) => {
    const chip = e.target.closest('[data-chip]');
    if (chip) {
      const value = chip.getAttribute('data-chip');
      const current = uiStore.get().searchChips;
      const next = current.includes(value)
        ? current.filter(c => c !== value)
        : [...current, value];
      uiStore.set({ searchChips: next });
      renderChips();
      runSearch();
    }
  });

  // Result clicks (delegated)
  searchResults.addEventListener('click', (e) => {
    // Artist
    const artistBtn = e.target.closest('[data-artist]');
    if (artistBtn) {
      navigate(`artist-${artistBtn.getAttribute('data-artist')}`);
      return;
    }

    // Album
    const albumBtn = e.target.closest('[data-album]');
    if (albumBtn) {
      navigate(`album-${albumBtn.getAttribute('data-album')}`);
      return;
    }

    // Track row
    const trackRow = e.target.closest('.trow');
    if (trackRow && !e.target.closest('[data-like]')) {
      const trackId = trackRow.getAttribute('data-tid');
      playTrackFromResults(trackId);
      return;
    }

    // Like button
    const likeBtn = e.target.closest('[data-like]');
    if (likeBtn) {
      e.stopPropagation();
      const trackId = likeBtn.getAttribute('data-like');
      toggleLike(trackId, likeBtn);
      return;
    }
  });

  // Keyboard navigation for results
  searchResults.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('.trow')) {
      e.preventDefault();
      e.target.closest('.trow').click();
    }
  });
}

/** Render language/genre chips */
function renderChips() {
  const chips = ['Hindi', 'Tamil', 'Punjabi', 'Bangla', 'Malayalam', 'Indie', 'Lo-fi', 'Jazz', 'Pop'];
  const activeChips = uiStore.get().searchChips;

  const container = $('#chips', searchEl);
  container.innerHTML = chips.map(c =>
    `<button class="chip${activeChips.includes(c) ? ' on' : ''}" data-chip="${c}">${escapeHtml(c)}</button>`
  ).join('');
}

/** Run search */
function runSearch() {
  const { searchQuery, searchChips } = uiStore.get();
  const q = (searchQuery + ' ' + searchChips.join(' ')).trim().toLowerCase();

  if (!q) {
    renderBrowseAll();
    return;
  }

  const words = q.split(/\s+/);
  const music = musicStore.get();

  // Search function
  const hit = (s) => {
    s = s.toLowerCase();
    return words.every(w => s.includes(w));
  };

  // Search tracks
  const tracks = Object.values(music.tracks).filter(t =>
    hit(`${t.title} ${t.artist} ${t.album} ${t.genres || ''}`)
  );

  // Search artists
  const artists = Object.values(music.artists).filter(a =>
    hit(`${a.name} ${a.genres}`)
  );

  // Search albums
  const albums = Object.values(music.albums).filter(a =>
    hit(`${a.title} ${a.artist}`)
  );

  if (!tracks.length && !artists.length && !albums.length) {
    searchResults.innerHTML = `
      <div class="empty">
        <b>Nothing for "${escapeHtml(searchQuery || searchChips.join(' '))}"</b>
        Check the spelling, or try a language, a mood or an artist name.
      </div>
    `;
    return;
  }

  let html = '';

  if (artists.length) {
    html += `
      <section class="sec">
        <div class="sec-h"><h2>Artists</h2></div>
        <div class="cards">${artists.slice(0, 8).map(createArtistCardHTML).join('')}</div>
      </section>
    `;
  }

  if (tracks.length) {
    html += `
      <section class="sec">
        <div class="sec-h"><h2>Songs</h2></div>
        <div class="list" id="sList">${tracks.slice(0, 20).map((t, i) => createTrackRowHTML(t, i)).join('')}</div>
      </section>
    `;
  }

  if (albums.length) {
    html += `
      <section class="sec">
        <div class="sec-h"><h2>Albums</h2></div>
        <div class="cards">${albums.slice(0, 8).map(createAlbumCardHTML).join('')}</div>
      </section>
    `;
  }

  searchResults.innerHTML = html;

  // Bind events for new content
  bindResultEvents(searchResults);
}

/** Render browse all (empty search) */
function renderBrowseAll() {
  const music = musicStore.get();
  searchResults.innerHTML = `
    <section class="sec">
      <div class="sec-h"><h2>Browse all</h2></div>
      <div class="cards">${Object.values(music.albums).slice(0, 12).map(createAlbumCardHTML).join('')}</div>
    </section>
  `;
  bindResultEvents(searchResults);
}

/** Bind events for search results */
function bindResultEvents(root) {
  $$('[data-artist]', root).forEach(btn => {
    btn.addEventListener('click', () => navigate(`artist-${btn.getAttribute('data-artist')}`));
  });
  $$('[data-album]', root).forEach(btn => {
    btn.addEventListener('click', () => navigate(`album-${btn.getAttribute('data-album')}`));
  });
  $$('.trow', root).forEach(row => {
    row.addEventListener('click', (e) => {
      if (e.target.closest('[data-like]')) return;
      playTrackFromResults(row.getAttribute('data-tid'));
    });
    row.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); row.click(); }
    });
  });
  $$('[data-like]', root).forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleLike(btn.getAttribute('data-like'), btn);
    });
  });
}

/** Play track from search results */
function playTrackFromResults(trackId) {
  const music = musicStore.get();
  const track = music.tracks[trackId];
  if (!track) return;

  // Build queue from visible results
  const trackRows = $$('.trow[data-tid]', searchResults);
  const trackIds = Array.from(trackRows).map(r => r.getAttribute('data-tid'));
  const index = trackIds.indexOf(trackId);

  playerStore.set({
    queue: trackIds,
    queueIndex: index,
    queueContext: 'Search results',
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
}

/** Create HTML helpers */
function createTrackRowHTML(track, index) {
  return `
    <div class="trow" data-tid="${track.id}" role="button" tabindex="0" aria-label="Play ${escapeHtml(track.title)}">
      <span class="n">${String(index + 1).padStart(2, '0')}</span>
      <span class="eq"><i></i><i></i><i></i></span>
      <span class="art cover" style="background-image:${track.art || ''}"></span>
      <span style="min-width:0"><span class="t">${escapeHtml(track.title)}</span><span class="s">${escapeHtml(track.artist)}</span></span>
      <span class="d mono">${fmtTime(track.duration || 0)}</span>
      <button class="lk" data-like="${track.id}" aria-label="Like">${getIcon('heart')}</button>
    </div>
  `;
}

function createAlbumCardHTML(album) {
  return `
    <button class="card" data-album="${album.id}">
      <div class="art cover" style="background-image:${album.art || ''};--c:${album.glow || ''}"></div>
      <b>${escapeHtml(album.title)}</b>
      <span>${escapeHtml(album.artist)} · ${album.year}</span>
    </button>
  `;
}

function createArtistCardHTML(artist) {
  return `
    <button class="card" data-artist="${artist.id}">
      <div class="art cover" style="background-image:${artist.art || ''};--c:${artist.glow || ''};border-radius:50%"></div>
      <b>${escapeHtml(artist.name)}</b>
      <span>Artist</span>
    </button>
  `;
}

/** Format time helper */
function fmtTime(seconds) {
  if (!isFinite(seconds) || seconds < 0) return '0:00';
  const s = Math.max(0, Math.round(seconds));
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, '0')}`;
}

/** Add search styles */
function addSearchStyles() {
  if (document.getElementById('searchViewStyles')) return;

  const style = document.createElement('style');
  style.id = 'searchViewStyles';
  style.textContent = `
    .search-big { display: flex; align-items: center; gap: 14px; border-bottom: 2px solid var(--ink); padding-bottom: 10px; margin-bottom: 34px; }
    .search-big svg { width: 30px; height: 30px; flex: none; color: var(--ink-2); }
    .search-big input { flex: 1; min-width: 0; background: none; border: 0; outline: 0; font: 800 clamp(34px, 6vw, 84px)/1 var(--display); font-stretch: 75%; letter-spacing: -.04em; color: var(--ink); }
    .search-big input::placeholder { color: var(--ink-2); opacity: .5; }
    .chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 34px; }
    .chip { border: 1px solid var(--line); border-radius: 999px; padding: 8px 16px; font-size: 14px; font-weight: 550; }
    .chip:hover, .chip.on { background: var(--ink); color: var(--paper); border-color: var(--ink); }
    .empty { padding: 50px 0; color: var(--ink-2); max-width: 42ch; text-align: center; }
    .empty b { display: block; color: var(--ink); font-size: 22px; font-weight: 700; margin-bottom: 6px; letter-spacing: -.02em; }
    .sec { margin-bottom: 54px; }
    .sec-h { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 14px; }
    .sec-h h2 { margin: 0; font-weight: 700; font-stretch: 75%; letter-spacing: -.03em; font-size: clamp(28px, 3.4vw, 44px); line-height: 1; }
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

    @media (max-width: 860px) {
      .search-big input { font-size: clamp(28px, 8vw, 56px); }
      .trow { grid-template-columns: 24px 40px 1fr auto; }
      .trow .lk { display: none; }
    }
  `;
  document.head.appendChild(style);
}

export default { createSearchView, renderSearchView };