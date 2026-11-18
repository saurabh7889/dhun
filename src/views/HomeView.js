/* ==========================================================================
   DHUN — Home View (matches original design)
   ========================================================================== */

import { musicStore, playerStore, uiStore, authStore } from '../store/index.js';
import { getIcon, createIconButton } from '../utils/icons.js';
import { $, $$, h, fmtTime, fmtCount, escapeHtml } from '../utils/format.js';
import { renderTrackList } from '../components/TrackRow.js';
import { navigate } from '../router/index.js';

let homeEl = null;

/** Create home view - returns the view container element */
export function createHomeView() {
  homeEl = h('div', { class: 'view', id: 'view' });
  addHomeStyles();
  return homeEl;
}

/** Render home view */
export function renderHomeView() {
  if (!homeEl) return;

  const music = musicStore.get();
  const { featuredArtist, newAlbums, popularTracks, artists } = music;

  homeEl.innerHTML = `
    ${renderHero(featuredArtist || getDefaultFeaturedArtist())}
    ${renderSection('Popular right now', renderPopularTracks(popularTracks))}
    ${renderSection('New albums', renderAlbumGrid(newAlbums))}
    ${renderSection('Pick a mood', renderMoods())}
    ${renderSection('Artists', renderArtistGrid(artists))}
  `;

  bindHomeEvents(homeEl);
}

/** Hero section */
function renderHero(artist) {
  const greeting = getGreeting();
  return `
    <section class="hero">
      <div class="txt">
        <div class="mono" style="color:var(--accent);margin-bottom:16px">${greeting}. Featured artist</div>
        <h1>${escapeHtml(artist.name).replace(' ', '<br>')}</h1>
        <div class="genres">${escapeHtml(artist.genres)}</div>
        <div class="acts">
          <button class="btn accent" data-playartist="${artist.id}">${getIcon('play').replace('<svg', '<svg width="16" height="16"')}Play</button>
          <button class="btn line" data-artist="${artist.id}">See artist</button>
        </div>
      </div>
      ${renderMiniRecord()}
    </section>
  `;
}

/** Mini vinyl record for hero */
function renderMiniRecord() {
  return `
    <div class="mini-rec">
      <div class="vwrap">
        <div class="vinyl spinning">
          <div class="label"><svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="9" width="3.4" height="9" rx="1"/><rect x="8.4" y="4" width="3.4" height="14" rx="1"/><rect x="13.8" y="7" width="3.4" height="11" rx="1"/><rect x="19.2" y="11" width="3.4" height="7" rx="1"/></svg></div>
        </div>
        <div class="sheen"></div>
      </div>
      <svg class="ring" viewBox="0 0 100 100"><circle class="trk" cx="50" cy="50" r="50"/></svg>
    </div>
  `;
}

/** Section wrapper */
function renderSection(title, content, link = null, linkDest = null) {
  return `
    <section class="sec">
      <div class="sec-h">
        <h2>${escapeHtml(title)}</h2>
        ${link ? `<button class="mono" data-nav="${linkDest}" style="text-decoration:underline;text-underline-offset:4px">${escapeHtml(link)}</button>` : ''}
      </div>
      ${content}
    </section>
  `;
}

/** Popular tracks list */
function renderPopularTracks(tracks) {
  if (!tracks || tracks.length === 0) return '<div class="list" id="hPop"></div>';
  return `<div class="list" id="hPop">${tracks.slice(0, 5).map((t, i) => createTrackRowHTML(t, i)).join('')}</div>`;
}

/** Album grid */
function renderAlbumGrid(albums) {
  if (!albums || albums.length === 0) return '<div class="cards"></div>';
  return `<div class="cards">${albums.slice(0, 6).map(createAlbumCardHTML).join('')}</div>`;
}

/** Mood buttons */
function renderMoods() {
  const moods = [
    { n: 'Rain', d: 'बारिश', bg: '#1E5F74', q: 'baarish' },
    { n: 'Journey', d: 'सफ़र', bg: '#C2410C', q: 'night-drive' },
    { n: 'Night', d: 'रात', bg: '#2B2A5C', q: 'focus' },
    { n: 'Romance', d: 'इश्क़', bg: '#B0214F', q: 'chai' }
  ];
  return `<div class="moods">${moods.map(m => `<button class="mood" data-mood="${m.q}" style="background:${m.bg}"><b lang="hi">${escapeHtml(m.d)}</b><span>${escapeHtml(m.n)}</span></button>`).join('')}</div>`;
}

/** Artist grid */
function renderArtistGrid(artists) {
  if (!artists || artists.length === 0) return '<div class="cards"></div>';
  return `<div class="cards">${artists.map(createArtistCardHTML).join('')}</div>`;
}

/** Create track row HTML */
function createTrackRowHTML(track, index) {
  const isCurrent = false; // Will be updated by player store
  return `
    <div class="trow" data-tid="${track.id}" role="button" tabindex="0" aria-label="Play ${escapeHtml(track.title)}">
      <span class="n">${String(index + 1).padStart(2, '0')}</span>
      <span class="eq"><i></i><i></i><i></i></span>
      <span class="art cover" style="background-image:${track.art || ''}"></span>
      <span style="min-width:0"><span class="t">${escapeHtml(track.title)}</span><span class="s">${escapeHtml(track.artist || track.album || '')}</span></span>
      <span class="d mono">${fmtTime(track.duration || 0)}</span>
      <button class="lk" data-like="${track.id}" aria-label="Like">${getIcon('heart')}</button>
    </div>
  `;
}

/** Create album card HTML */
function createAlbumCardHTML(album) {
  return `
    <button class="card" data-album="${album.id}">
      <div class="art cover" style="background-image:${album.art || ''};--c:${album.glow || ''}"></div>
      <b>${escapeHtml(album.title)}</b>
      <span>${escapeHtml(album.artist)} · ${album.year}</span>
    </button>
  `;
}

/** Create artist card HTML */
function createArtistCardHTML(artist) {
  return `
    <button class="card" data-artist="${artist.id}">
      <div class="art cover" style="background-image:${artist.art || ''};--c:${artist.glow || ''};border-radius:50%"></div>
      <b>${escapeHtml(artist.name)}</b>
      <span>${fmtCount(artist.listeners || 0)} listeners</span>
    </button>
  `;
}

/** Bind events */
function bindHomeEvents(view) {
  // Play artist
  $$('[data-playartist]', view).forEach(btn => {
    btn.addEventListener('click', () => {
      const artistId = btn.getAttribute('data-playartist');
      playArtistTracks(artistId);
    });
  });

  // Navigate to artist
  $$('[data-artist]', view).forEach(btn => {
    btn.addEventListener('click', () => {
      const artistId = btn.getAttribute('data-artist');
      navigate(`artist-${artistId}`);
    });
  });

  // Navigate to album
  $$('[data-album]', view).forEach(btn => {
    btn.addEventListener('click', () => {
      const albumId = btn.getAttribute('data-album');
      navigate(`album-${albumId}`);
    });
  });

  // Mood buttons
  $$('[data-mood]', view).forEach(btn => {
    btn.addEventListener('click', () => {
      const mood = btn.getAttribute('data-mood');
      navigate(`playlist-${mood}`);
    });
  });

  // Track rows
  bindTrackRows(view, 'Popular on DHUN');

  // Section links
  $$('[data-nav]', view).forEach(btn => {
    btn.addEventListener('click', () => {
      const dest = btn.getAttribute('data-nav');
      navigate(dest);
    });
  });
}

/** Bind track row events */
function bindTrackRows(root, context) {
  $$('.trow', root).forEach(row => {
    row.addEventListener('click', (e) => {
      if (e.target.closest('[data-like]')) return;
      const trackId = row.getAttribute('data-tid');
      playTrackFromContext(trackId, context, root);
    });
    row.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        row.click();
      }
    });
  });

  // Like buttons
  $$('[data-like]', root).forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const trackId = btn.getAttribute('data-like');
      toggleLike(trackId, btn);
    });
  });
}

/** Play track from context */
function playTrackFromContext(trackId, context, root) {
  const trackRows = $$('.trow', root);
  const trackIds = Array.from(trackRows).map(r => r.getAttribute('data-tid'));
  const index = trackIds.indexOf(trackId);

  // Get track metadata from music store
  const music = musicStore.get();
  const track = music.tracks[trackId] || { id: trackId };

  playerStore.set({
    queue: trackIds,
    queueIndex: index,
    queueContext: context,
    currentTime: 0,
    isPlaying: true,
    currentTrack: track
  });
}

/** Play artist top tracks */
function playArtistTracks(artistId) {
  const music = musicStore.get();
  const tracks = [];
  Object.values(music.albums).forEach(album => {
    if (album.artistId === artistId) {
      album.trackIds?.forEach(tid => tracks.push(tid));
    }
  });

  if (tracks.length) {
    const track = music.tracks[tracks[0]] || { id: tracks[0] };
    playerStore.set({
      queue: tracks,
      queueIndex: 0,
      queueContext: artistId,
      currentTime: 0,
      isPlaying: true,
      currentTrack: track
    });
  }
}

/** Toggle like */
function toggleLike(trackId, btn) {
  const { liked } = playerStore.get();
  const nextLiked = { ...liked };
  if (nextLiked[trackId]) delete nextLiked[trackId];
  else nextLiked[trackId] = true;
  playerStore.set({ liked: nextLiked });
}

/** Get greeting */
function getGreeting() {
  const h = new Date().getHours();
  if (h < 5) return 'Still up';
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

/** Default featured artist */
function getDefaultFeaturedArtist() {
  return {
    id: 'raag-circuit',
    name: 'Raag Circuit',
    genres: 'Electronic raga, downtempo, sitar wave',
    listeners: '2.4M monthly listeners'
  };
}

/** Add home styles */
function addHomeStyles() {
  if (document.getElementById('homeViewStyles')) return;

  const style = document.createElement('style');
  style.id = 'homeViewStyles';
  style.textContent = `
    .main {
      grid-row: 1;
      grid-column: 2;
      overflow: auto;
      padding: 36px max(32px, env(safe-area-inset-right, 0px)) 40px 36px;
      scroll-behavior: smooth;
    }
    .view { max-width: 1180px; margin: 0 auto; }
    .hero {
      position: relative;
      min-height: min(62svh, 560px);
      display: flex;
      align-items: center;
      margin-bottom: 46px;
    }
    .hero .txt { position: relative; z-index: 2; max-width: 70%; }
    .hero h1 { margin: 0; font-weight: 800; font-stretch: 75%; text-transform: uppercase; letter-spacing: -.045em; line-height: .8; font-size: clamp(64px, 10.5vw, 170px); }
    .hero .genres { font-family: var(--mono); font-size: 12px; text-transform: uppercase; margin: 20px 0 22px; color: var(--ink-2); }
    .hero .acts { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
    .hero .mini-rec { position: absolute; right: calc(var(--r, 0px) * -.34); top: 50%; width: var(--r); height: var(--r); margin-top: calc(var(--r)/-2); z-index: 1; }
    .hero { --r: min(52vw, 560px, 70svh); }
    .sec { margin-bottom: 54px; }
    .sec-h { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 14px; }
    .sec-h h2 { margin: 0; font-weight: 700; font-stretch: 75%; letter-spacing: -.03em; font-size: clamp(28px, 3.4vw, 44px); line-height: 1; }
    .sec-h button { font-family: var(--mono); font-size: 12px; text-decoration: underline; text-underline-offset: 4px; }
    .cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(176px, 1fr)); gap: 24px 22px; }
    .card { text-align: left; display: block; width: 100%; }
    .card .art { aspect-ratio: 1; border-radius: 10px; box-shadow: 0 22px 34px -22px var(--c, #000); transition: transform .25s; }
    .card:hover .art { transform: translateY(-4px); }
    .card b { display: block; margin-top: 12px; font-weight: 650; font-size: 16px; letter-spacing: -.01em; }
    .card span { font-family: var(--mono); font-size: 12px; color: var(--ink-2); }
    .moods { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
    .mood { aspect-ratio: 1.25; border-radius: 14px; padding: 16px; text-align: left; display: flex; flex-direction: column; justify-content: space-between; color: #fff; position: relative; overflow: hidden; }
    .mood b { font-family: var(--deva); font-size: clamp(30px, 3.6vw, 54px); font-weight: 800; line-height: 1.1; }
    .mood span { font-weight: 700; font-stretch: 75%; font-size: 20px; letter-spacing: -.01em; }
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
    .trow .lk { width: 30px; height: 30px; display: grid; place-items: center; border-radius: 50%; color: var(--ink-2); }
    .trow .lk svg { width: 16px; height: 16px; }

    @media (max-width: 860px) {
      .main { grid-column: 1; padding: 20px var(--gut) 190px; }
      .hero .txt { max-width: 100%; }
      .hero { --r: 92vw; overflow: hidden; min-height: 430px; margin-bottom: 34px; }
      .hero .mini-rec { top: auto; bottom: -40vw; margin-top: 0; right: -58vw; -webkit-mask-image: linear-gradient(to bottom, #000 62%, transparent 88%); mask-image: linear-gradient(to bottom, #000 62%, transparent 88%); }
      .hero h1 { font-size: clamp(56px, 17vw, 120px); }
      .moods { grid-template-columns: 1fr 1fr; }
      .trow { grid-template-columns: 24px 40px 1fr auto; }
      .trow .lk { display: none; }
    }
  `;
  document.head.appendChild(style);
}

export default { createHomeView, renderHomeView };