/* ==========================================================================
   DHUN — Artist View (matches original design)
   ========================================================================== */

import { musicStore, playerStore } from '../store/index.js';
import { getIcon } from '../utils/icons.js';
import { $, $$, h, escapeHtml } from '../utils/format.js';
import { navigate as routerNavigate } from '../router/index.js';

let artistEl = null;

/** Create artist view - returns the view container element */
export function createArtistView() {
  artistEl = h('div', { class: 'view', id: 'view' });
  addArtistStyles();
  return artistEl;
}

/** Render artist view */
export function renderArtistView(params) {
  if (!artistEl) return;

  const { id } = params;
  const music = musicStore.get();
  const artist = music.artists[id];

  if (!artist) {
    view.innerHTML = renderNotFound('Artist');
    return;
  }

  // Get artist's albums and top tracks
  const albums = Object.values(music.albums).filter(a => a.artistId === id);
  const trackIds = albums.flatMap(a => a.trackIds || []);
  const topTracks = trackIds.slice(0, 5).map(tid => music.tracks[tid]).filter(Boolean);

  view.innerHTML = `
    ${renderArtistHero(artist)}
    ${renderSection('Popular', renderTrackList(topTracks, { context: artist.name }))}
    ${renderSection('Albums', renderAlbumGrid(albums))}
  `;

  bindArtistEvents(view, artist);
}

/** Artist hero */
function renderArtistHero(artist) {
  return `
    <section class="hero">
      <div class="txt">
        <div class="mono" style="color:var(--accent);margin-bottom:16px">${escapeHtml(artist.listeners || 'Artist')}</div>
        <h1>${escapeHtml(artist.name).replace(/ (&|The|Club|Circuit|Sethi|Hours|Quartet)/, '<br>$1')}</h1>
        <div class="genres">${escapeHtml(artist.genres)}</div>
        <div class="acts">
          <button class="btn accent" data-playartist="${artist.id}">${getIcon('play').replace('<svg', '<svg width="16" height="16"')}Play</button>
          <button class="btn line" data-follow>${artist.followed ? 'Following' : 'Follow'}</button>
        </div>
      </div>
      ${renderMiniRecord()}
    </section>
  `;
}

/** Mini vinyl record */
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
function renderSection(title, content) {
  return `
    <section class="sec">
      <div class="sec-h"><h2>${escapeHtml(title)}</h2></div>
      ${content}
    </section>
  `;
}

/** Track list */
function renderTrackList(tracks, options = {}) {
  if (!tracks.length) return '<div class="list"></div>';
  return `<div class="list" id="aList">${tracks.map((t, i) => createTrackRowHTML(t, i, options)).join('')}</div>`;
}

/** Album grid */
function renderAlbumGrid(albums) {
  if (!albums.length) return '<div class="cards"></div>';
  return `<div class="cards">${albums.map(createAlbumCardHTML).join('')}</div>`;
}

/** Bind events */
function bindArtistEvents(view, artist) {
  // Play artist
  $$('[data-playartist]', view).forEach(btn => {
    btn.addEventListener('click', () => playArtistTracks(artist.id));
  });

  // Follow button
  const followBtn = $('[data-follow]', view);
  if (followBtn) {
    followBtn.addEventListener('click', () => {
      const followed = followBtn.classList.toggle('on');
      followBtn.textContent = followed ? 'Following' : 'Follow';
      followBtn.style.background = followed ? 'var(--ink)' : '';
      followBtn.style.color = followed ? 'var(--paper)' : '';
    });
  }

  // Album cards
  $$('[data-album]', view).forEach(btn => {
    btn.addEventListener('click', () => routerNavigate(`album-${btn.getAttribute('data-album')}`));
  });

  // Track rows
  bindTrackRows(view, artist.name);
}

/** Play artist tracks */
function playArtistTracks(artistId) {
  const music = musicStore.get();
  const albums = Object.values(music.albums).filter(a => a.artistId === artistId);
  const trackIds = albums.flatMap(a => a.trackIds || []);

  if (trackIds.length) {
    const track = music.tracks[trackIds[0]] || { id: trackIds[0] };
    playerStore.set({
      queue: trackIds,
      queueIndex: 0,
      queueContext: artistId,
      currentTime: 0,
      isPlaying: true,
      currentTrack: track
    });
  }
}

/** Bind track row events */
function bindTrackRows(root, context) {
  $$('.trow', root).forEach(row => {
    row.addEventListener('click', (e) => {
      if (e.target.closest('[data-like]')) return;
      playTrackFromContext(row.getAttribute('data-tid'), context, root);
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

/** Play track from context */
function playTrackFromContext(trackId, context, root) {
  const trackRows = $$('.trow[data-tid]', root);
  const trackIds = Array.from(trackRows).map(r => r.getAttribute('data-tid'));
  const index = trackIds.indexOf(trackId);

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

/** Toggle like */
function toggleLike(trackId, btn) {
  const { liked } = playerStore.get();
  const nextLiked = { ...liked };
  if (nextLiked[trackId]) delete nextLiked[trackId];
  else nextLiked[trackId] = true;
  playerStore.set({ liked: nextLiked });
}

/** Create HTML helpers */
function createTrackRowHTML(track, index, options = {}) {
  const showAlbum = options.showAlbum !== false;
  return `
    <div class="trow" data-tid="${track.id}" role="button" tabindex="0" aria-label="Play ${escapeHtml(track.title)}">
      <span class="n">${String(index + 1).padStart(2, '0')}</span>
      <span class="eq"><i></i><i></i><i></i></span>
      <span class="art cover" style="background-image:${track.art || ''}"></span>
      <span style="min-width:0"><span class="t">${escapeHtml(track.title)}</span><span class="s">${escapeHtml(showAlbum && track.album ? track.album : track.artist)}</span></span>
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

function fmtTime(seconds) {
  if (!isFinite(seconds) || seconds < 0) return '0:00';
  const s = Math.max(0, Math.round(seconds));
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, '0')}`;
}

function renderNotFound(type) {
  return `
    <div class="empty" style="text-align:center;padding:60px 20px">
      <b style="font-size:22px;display:block;margin-bottom:8px">${type} not found</b>
      <span style="color:var(--ink-2)">This ${type.toLowerCase()} doesn't exist or has been removed</span>
      <button class="btn line" style="margin-top:24px" onclick="window.location.hash='home'">Go Home</button>
    </div>
  `;
}

/** Add artist styles */
function addArtistStyles() {
  if (document.getElementById('artistViewStyles')) return;

  const style = document.createElement('style');
  style.id = 'artistViewStyles';
  style.textContent = `
    .hero { position: relative; min-height: min(62svh, 560px); display: flex; align-items: center; margin-bottom: 46px; }
    .hero .txt { position: relative; z-index: 2; max-width: 70%; }
    .hero h1 { margin: 0; font-weight: 800; font-stretch: 75%; text-transform: uppercase; letter-spacing: -.045em; line-height: .8; font-size: clamp(64px, 10.5vw, 170px); }
    .hero .genres { font-family: var(--mono); font-size: 12px; text-transform: uppercase; margin: 20px 0 22px; color: var(--ink-2); }
    .hero .acts { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
    .hero .mini-rec { position: absolute; right: calc(var(--r, 0px) * -.34); top: 50%; width: var(--r); height: var(--r); margin-top: calc(var(--r)/-2); z-index: 1; }
    .hero { --r: min(52vw, 560px, 70svh); }
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
      .hero .txt { max-width: 100%; }
      .hero { --r: 92vw; overflow: hidden; min-height: 430px; margin-bottom: 34px; }
      .hero .mini-rec { top: auto; bottom: -40vw; margin-top: 0; right: -58vw; -webkit-mask-image: linear-gradient(to bottom, #000 62%, transparent 88%); mask-image: linear-gradient(to bottom, #000 62%, transparent 88%); }
      .hero h1 { font-size: clamp(56px, 17vw, 120px); }
      .trow { grid-template-columns: 24px 40px 1fr auto; }
      .trow .lk { display: none; }
    }
  `;
  document.head.appendChild(style);
}

export default { createArtistView, renderArtistView };