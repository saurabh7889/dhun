/* ==========================================================================
   DHUN — Album View (matches original design)
   ========================================================================== */

import { musicStore, playerStore } from '../store/index.js';
import { getIcon } from '../utils/icons.js';
import { $, $$, h, escapeHtml } from '../utils/format.js';
import { navigate as routerNavigate } from '../router/index.js';

let albumEl = null;

/** Create album view - returns the view container element */
export function createAlbumView() {
  albumEl = h('div', { class: 'view', id: 'view' });
  addAlbumStyles();
  return albumEl;
}

/** Render album view */
export function renderAlbumView(params) {
  if (!albumEl) return;

  const { id } = params;
  const music = musicStore.get();
  const album = music.albums[id];

  if (!album) {
    view.innerHTML = renderNotFound('Album');
    return;
  }

  // Get tracks
  const tracks = (album.trackIds || []).map(tid => music.tracks[tid]).filter(Boolean);

  view.innerHTML = `
    ${renderAlbumHero(album, tracks)}
    ${renderSection('Tracks', renderTrackList(tracks))}
  `;

  bindAlbumEvents(view, album);
}

/** Album hero */
function renderAlbumHero(album, tracks) {
  const totalDuration = tracks.reduce((sum, t) => sum + (t.duration || 0), 0);
  const mins = Math.round(totalDuration / 60);

  return `
    <section class="hero" style="min-height:0;margin-bottom:34px;gap:34px;align-items:flex-end;flex-wrap:wrap">
      <div class="art cover" style="width:min(300px,72vw);aspect-ratio:1;border-radius:12px;background-image:${album.art || ''};box-shadow:0 36px 60px -30px ${album.glow || ''}"></div>
      <div style="min-width:0;flex:1">
        <div class="mono" style="color:var(--accent)">Album · ${album.year}</div>
        <h1 style="font-weight:800;font-stretch:75%;text-transform:uppercase;letter-spacing:-.045em;line-height:.84;font-size:clamp(46px,8vw,120px);margin:12px 0 16px;overflow-wrap:anywhere">${escapeHtml(album.title)}</h1>
        <div class="acts" style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
          <button class="btn accent" data-playalbum="${album.id}">${getIcon('play').replace('<svg', '<svg width="16" height="16"')}Play</button>
          <button class="btn line" data-artist="${album.artistId}">${escapeHtml(album.artist)}</button>
          <span class="mono" style="color:var(--ink-2)">${tracks.length} songs, ${mins} min</span>
        </div>
      </div>
    </section>
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
function renderTrackList(tracks) {
  if (!tracks.length) return '<div class="list"></div>';
  return `<div class="list" id="aList">${tracks.map((t, i) => createTrackRowHTML(t, i)).join('')}</div>`;
}

/** Bind events */
function bindAlbumEvents(view, album) {
  // Play album
  $$('[data-playalbum]', view).forEach(btn => {
    btn.addEventListener('click', () => playAlbum(album));
  });

  // Artist link
  $$('[data-artist]', view).forEach(btn => {
    btn.addEventListener('click', () => routerNavigate(`artist-${btn.getAttribute('data-artist')}`));
  });

  // Track rows
  bindTrackRows(view, album.title);
}

/** Play album */
function playAlbum(album) {
  const music = musicStore.get();
  const trackIds = (album.trackIds || []).filter(tid => music.tracks[tid]);

  if (trackIds.length) {
    const track = music.tracks[trackIds[0]] || { id: trackIds[0] };
    playerStore.set({
      queue: trackIds,
      queueIndex: 0,
      queueContext: album.title,
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

/** Add album styles */
function addAlbumStyles() {
  if (document.getElementById('albumViewStyles')) return;

  const style = document.createElement('style');
  style.id = 'albumViewStyles';
  style.textContent = `
    .hero { position: relative; min-height: min(62svh, 560px); display: flex; align-items: center; margin-bottom: 46px; }
    .sec { margin-bottom: 54px; }
    .sec-h { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 14px; }
    .sec-h h2 { margin: 0; font-weight: 700; font-stretch: 75%; letter-spacing: -.03em; font-size: clamp(28px, 3.4vw, 44px); line-height: 1; }
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
      .trow { grid-template-columns: 24px 40px 1fr auto; }
      .trow .lk { display: none; }
    }
  `;
  document.head.appendChild(style);
}

export default { createAlbumView, renderAlbumView };