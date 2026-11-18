/* ==========================================================================
   DHUN — Full-Screen Now Playing (matches original vinyl design)
   ========================================================================== */

import { playerStore, uiStore, musicStore } from '../store/index.js';
import { getIcon, createIconButton } from '../utils/icons.js';
import { $, $$, h, fmtTime, clamp, setCssVar } from '../utils/format.js';

let npEl = null;
let nringEl = null;
let nrailEl = null;
let nfillEl = null;
let ndotEl = null;
let nvinylEl = null;
let isSeekingRing = false;
let isSeekingRail = false;

/** Create Now Playing view */
export function createNowPlaying(root) {
  if (npEl) return npEl;

  npEl = h('section', { class: 'np', id: 'np', hidden: true, role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Now Playing' }, [
    // Background glow
    h('div', { class: 'np-bg', 'aria-hidden': 'true' }, [
      h('i', {}),
      h('i', {})
    ]),

    // Top bar
    h('div', { class: 'np-top' }, [
      createIconButton('down', '', { id: 'npClose', 'aria-label': 'Close now playing' }),
      h('span', { class: 'from', id: 'npFrom' }, 'Playing from DHUN'),
      createIconButton('theme', '', { 'data-theme-toggle': true, 'aria-label': 'Switch theme' })
    ]),

    // Main content
    h('div', { class: 'np-in' }, [
      // Left: Vinyl disc
      h('div', { class: 'disc', id: 'disc' }, [
        h('div', { class: 'vwrap' }, [
          h('div', { class: 'vinyl spinning', id: 'nvinyl' }, [
            h('div', { class: 'label cover', id: 'nLabel', style: 'inset:30%;box-shadow:0 0 0 6px rgba(255,255,255,.06)' })
          ]),
          h('div', { class: 'sheen' })
        ]),
        h('svg', { class: 'ring', viewBox: '0 0 100 100', id: 'nring', style: 'cursor:pointer;touch-action:none', role: 'slider', 'aria-label': 'Seek', 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': '0', tabindex: '0' }, [
          h('circle', { class: 'trk', cx: '50', cy: '50', r: '50' }),
          h('circle', { class: 'arc', cx: '50', cy: '50', r: '50', pathLength: '100', transform: 'rotate(-90 50 50)', 'stroke-dasharray': '0 100' }),
          h('circle', { class: 'knob', r: '1.7' })
        ])
      ]),

      // Center: Track info & controls
      h('div', { class: 'np-info' }, [
        h('h2', { id: 'nT' }, 'Track Title'),
        h('p', { class: 'ar' }, [
          h('button', { id: 'nA' }, 'Artist Name'),
          h('span', { id: 'nAl' }, ' · Album Name')
        ]),
        h('div', { class: 'bar' }, [
          h('span', { id: 'nCur', class: 'mono' }, '0:00'),
          h('div', { class: 'rail', id: 'nrail' }, [
            h('div', { class: 'fill', id: 'nrailFill' }),
            h('div', { class: 'dot', id: 'nrailDot' })
          ]),
          h('span', { id: 'nDur', class: 'mono' }, '0:00')
        ]),
        h('div', { class: 'ctrls', id: 'nCtrls' })
      ]),

      // Right: Queue
      h('aside', { class: 'np-q' }, [
        h('h4', {}, 'Up next'),
        h('div', { class: 'list', id: 'nQ' })
      ])
    ])
  ]);

  if (root) root.appendChild(npEl);

  // Cache elements
  nringEl = $('#nring', npEl);
  nrailEl = $('#nrail', npEl);
  nfillEl = $('#nrailFill', npEl);
  ndotEl = $('#nrailDot', npEl);
  nvinylEl = $('#nvinyl', npEl);

  // Add styles
  addNowPlayingStyles();

  // Attach listeners
  attachNowPlayingListeners();

  // Subscribe to stores
  playerStore.subscribe(updateNowPlayingUI);
  uiStore.subscribe(updateNowPlayingUI);

  return npEl;
}

/** Add Now Playing styles */
function addNowPlayingStyles() {
  if (document.getElementById('nowPlayingStyles')) return;

  const style = document.createElement('style');
  style.id = 'nowPlayingStyles';
  style.textContent = `
    .np {
      position: fixed;
      inset: 0;
      z-index: 50;
      background: var(--paper);
      overflow: auto;
      padding-top: env(safe-area-inset-top, 0px);
    }
    .np[hidden] { display: none; }
    .np-bg { position: fixed; inset: 0; pointer-events: none; overflow: hidden; }
    .np-bg i {
      position: absolute;
      border-radius: 50%;
      filter: blur(90px);
      opacity: .55;
      transition: background .8s;
    }
    .np-bg i:nth-child(1) {
      width: 60vmax; height: 60vmax; left: -15vmax; top: -20vmax; background: var(--glow);
    }
    .np-bg i:nth-child(2) {
      width: 50vmax; height: 50vmax; right: -20vmax; bottom: -25vmax; background: var(--glow2, var(--glow));
    }
    .np-in {
      position: relative;
      min-height: 100svh;
      display: grid;
      grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr) minmax(0, .7fr);
      align-items: center;
      gap: 3vw;
      padding: 70px max(28px, env(safe-area-inset-right, 0px)) 40px var(--gut);
    }
    .np-top {
      position: absolute;
      top: 18px;
      left: var(--gut);
      right: max(20px, env(safe-area-inset-right, 0px));
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 3;
    }
    .np-top .from { font-family: var(--mono); font-size: 12px; color: var(--ink-2); }
    .disc { --S: min(78svh, 44vw); position: relative; width: var(--S); height: var(--S); margin-left: calc(var(--S)*-.3); justify-self: start; }
    .np-info { min-width: 0; }
    .np-info h2 { margin: 0; font-weight: 800; font-stretch: 75%; text-transform: uppercase; letter-spacing: -.045em; line-height: .86; font-size: clamp(46px, 7vw, 112px); overflow-wrap: anywhere; }
    .np-info .ar { margin: 16px 0 24px; font-family: var(--mono); font-size: 13px; text-transform: uppercase; }
    .np-info .ar button { text-decoration: underline; text-underline-offset: 4px; color: inherit; }
    .np-info .ar span { color: var(--ink-2); }
    .np-info .bar { margin: 16px 0 8px; }
    .np-info .ctrls { justify-content: flex-start; gap: 16px; }
    .np-q h4 { margin: 0 0 10px; font-family: var(--mono); font-weight: 400; font-size: 12px; color: var(--accent); }
    .np-q .trow { grid-template-columns: 40px 1fr auto; gap: 12px; padding: 7px 6px; }
    .np-q .trow .art { width: 40px; height: 40px; }
    .np-q .trow .n, .np-q .trow .lk { display: none; }

    /* Vinyl */
    .vwrap { position: absolute; inset: 0; }
    .vinyl { position: absolute; inset: 0; border-radius: 50%; background: repeating-radial-gradient(circle at 50% 50%, #0b0b0c 0 2px, #151517 2px 3px), #0b0b0c; will-change: transform; }
    .sheen { position: absolute; inset: 0; border-radius: 50%; pointer-events: none; background: conic-gradient(from 25deg, transparent 0 16%, rgba(255,255,255,.13) 23%, transparent 31% 66%, rgba(255,255,255,.09) 73%, transparent 81%); }
    .label { position: absolute; inset: 30%; border-radius: 50%; display: grid; place-items: center; box-shadow: 0 0 0 6px rgba(255,255,255,.06); }
    .label svg { width: 34%; height: 34%; color: var(--accent); }
    .spinning { animation: spin 9s linear infinite; }
    .paused .spinning { animation-play-state: paused; }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* Progress ring */
    .ring { position: absolute; inset: -2.4%; width: 104.8%; height: 104.8%; overflow: visible; }
    .ring .trk { fill: none; stroke: var(--line); stroke-width: .35; }
    .ring .arc { fill: none; stroke: var(--accent); stroke-width: .5; stroke-linecap: round; }
    .ring .knob { fill: var(--accent); stroke: var(--paper); stroke-width: .9; }

    /* Progress rail */
    .np-info .bar { display: flex; align-items: center; gap: 12px; width: 100%; font-family: var(--mono); font-size: 11px; color: var(--ink-2); }
    .np-info .rail { position: relative; flex: 1; height: 18px; cursor: pointer; touch-action: none; }
    .np-info .rail::before { content: ""; position: absolute; left: 0; right: 0; top: 8px; height: 2px; background: var(--line); border-radius: 2px; }
    .np-info .rail .fill { position: absolute; left: 0; top: 8px; height: 2px; background: var(--accent); border-radius: 2px; }
    .np-info .rail .dot { position: absolute; top: 4px; width: 10px; height: 10px; margin-left: -5px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 0 3px var(--paper); opacity: 0; transition: opacity .15s; }
    .np-info .rail:hover .dot, .np-info .rail:focus .dot { opacity: 1; }
    .np-info .rail:focus { outline: none; }
    .np-info .rail:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; border-radius: 4px; }

    /* Controls */
    .np-info .ctrls { display: flex; align-items: center; gap: 16px; }
    .np-info .ctl { width: 36px; height: 36px; display: grid; place-items: center; border-radius: 50%; color: var(--ink-2); }
    .np-info .ctl:hover { color: var(--ink); }
    .np-info .ctl svg { width: 20px; height: 20px; }
    .np-info .ctl.on { color: var(--accent); }
    .np-info .play { width: 64px; height: 64px; border-radius: 50%; background: var(--ink); color: var(--paper); display: grid; place-items: center; transition: transform .15s; }
    .np-info .play:active { transform: scale(.94); }
    .np-info .play svg { width: 24px; height: 24px; }

    /* Queue list */
    .np-q .list { max-height: 60vh; overflow: auto; }
    .np-q .trow { display: grid; align-items: center; border-radius: 12px; text-align: left; width: 100%; transition: background .15s; }
    .np-q .trow:hover { background: color-mix(in srgb, var(--ink) 6%, transparent); }
    .np-q .trow .art { border-radius: 7px; }
    .np-q .trow .t { font-family: var(--mono); font-size: 13px; text-transform: uppercase; letter-spacing: .005em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; }
    .np-q .trow .s { font-family: var(--mono); font-size: 12px; color: var(--ink-2); display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .np-q .trow.cur .t { color: var(--accent); }

    /* Mobile */
    @media (max-width: 860px) {
      .np-in { grid-template-columns: 1fr; padding: 64px var(--gut) 40px; gap: 18px; }
      .disc { --S: 92vw; margin: 0 auto; justify-self: center; }
      .np-info h2 { font-size: clamp(44px, 15vw, 90px); }
      .np-q { margin-top: 10px; }
      .np-top { top: 12px; }
    }

    @media (prefers-reduced-motion:reduce) {
      .spinning { animation: none; }
    }
  `;
  document.head.appendChild(style);
}

/** Attach event listeners */
function attachNowPlayingListeners() {
  // Close button
  $('#npClose', npEl).addEventListener('click', closeNowPlaying);

  // Artist link
  $('#nA', npEl).addEventListener('click', () => {
    const { queue, queueIndex } = playerStore.get();
    if (queueIndex >= 0 && queueIndex < queue.length) {
      // Would need track metadata to get artist ID
    }
  });

  // Ring seek
  nringEl.addEventListener('pointerdown', onRingSeekStart);
  nringEl.addEventListener('keydown', onRingSeekKey);

  // Rail seek
  nrailEl.addEventListener('pointerdown', onRailSeekStart);
  nrailEl.addEventListener('keydown', onRailSeekKey);

  // Control buttons (delegated)
  $('#nCtrls', npEl).addEventListener('click', onControlClick);
}

/** Update Now Playing UI */
function updateNowPlayingUI() {
  const player = playerStore.get();
  const { queue, queueIndex, isPlaying, currentTime, duration, shuffle, repeat, liked, currentTrack, queueContext } = player;

  const trackId = typeof queue[queueIndex] === 'string' ? queue[queueIndex] : queue[queueIndex]?.id;
  const music = musicStore ? musicStore.get() : { tracks: {} };
  const current = currentTrack || (trackId && music.tracks ? music.tracks[trackId] : null);

  if (!current) {
    closeNowPlaying();
    return;
  }

  // Track info
  $('#nLabel', npEl).style.backgroundImage = current.art || '';
  $('#nT', npEl).textContent = current.title || 'Unknown Track';
  $('#nA', npEl).textContent = current.artist || 'Unknown Artist';
  $('#nAl', npEl).textContent = current.album ? ` · ${current.album}` : '';
  $('#nDur', npEl).textContent = fmtTime(current.duration || duration);
  $('#npFrom', npEl).textContent = `Playing from ${queueContext || 'DHUN'}`;

  // Update glow colors
  if (current.glow) {
    setCssVar('--glow', current.glow);
    setCssVar('--glow2', current.glow2 || current.glow);
  }

  // Progress
  const totalDur = current.duration || duration || 240;
  const pct = totalDur > 0 ? clamp(currentTime / totalDur, 0, 1) : 0;
  updateRingProgress(pct);
  updateRailProgress(pct);
  $('#nCur', npEl).textContent = fmtTime(currentTime);

  // Play/Pause state
  npEl.classList.toggle('paused', !isPlaying);
  nvinylEl.classList.toggle('paused', !isPlaying);

  // Controls
  renderControls(isPlaying, shuffle, repeat, current, liked);

  // Queue
  renderQueue(queue, queueIndex, queueContext);
}

/** Render control buttons */
function renderControls(isPlaying, shuffle, repeat, current, liked) {
  const ctrls = $('#nCtrls', npEl);
  const isLiked = current && liked[current.id];

  ctrls.innerHTML = `
    <button class="ctl" data-c="shuf" aria-label="Shuffle"${shuffle ? ' class="on"' : ''}>${getIcon('shuf')}</button>
    <button class="ctl" data-c="prev" aria-label="Previous">${getIcon('prev')}</button>
    <button class="play" data-c="play" aria-label="${isPlaying ? 'Pause' : 'Play'}" style="width:64px;height:64px">${isPlaying ? getIcon('pause') : getIcon('play')}</button>
    <button class="ctl" data-c="next" aria-label="Next">${getIcon('next')}</button>
    <button class="ctl" data-c="rep" aria-label="Repeat"${repeat > 0 ? ' class="on"' : ''}>${repeat === 2 ? getIcon('rep1') : getIcon('rep')}</button>
    <button class="ctl${isLiked ? ' on' : ''}" data-c="like" aria-label="Like">${isLiked ? getIcon('heartOn') : getIcon('heart')}</button>
  `;
}

/** Render up next queue */
function renderQueue(queue, currentIndex, context) {
  const qEl = $('#nQ', npEl);
  const upNext = [];

  for (let n = 1; n <= 6 && n < queue.length; n++) {
    const idx = (currentIndex + n) % queue.length;
    upNext.push({ id: queue[idx], index: idx });
  }

  if (upNext.length) {
    qEl.innerHTML = upNext.map((track, i) => createQueueRow(track, i)).join('');
    bindQueueRows(qEl, upNext.map(t => t.id), context);
  } else {
    qEl.innerHTML = '<div class="empty" style="padding:10px 0">End of the queue.</div>';
  }
}

/** Create queue row HTML */
function createQueueRow(track, i) {
  return `<div class="trow" data-tid="${track.id}" role="button" tabindex="0">
    <span class="art cover" style="background-image:var(--paper-2)"></span>
    <span style="min-width:0"><span class="t">Track ${track.id}</span><span class="s">Unknown Artist</span></span>
  </div>`;
}

/** Bind queue row events */
function bindQueueRows(root, trackIds, context) {
  $$('.trow', root).forEach((row, i) => {
    row.addEventListener('click', () => {
      const id = row.getAttribute('data-tid');
      const idx = trackIds.indexOf(id);
      if (idx >= 0) playerStore.set({ queueIndex: idx, currentTime: 0, isPlaying: true });
    });
    row.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        row.click();
      }
    });
  });
}

/** Update ring progress */
function updateRingProgress(pct) {
  if (!nringEl) return;
  const arc = $('.arc', nringEl);
  const kn = $('.knob', nringEl);
  arc.setAttribute('stroke-dasharray', `${clamp(pct, 0, 1) * 100} 100`);
  const a = pct * Math.PI * 2 - Math.PI / 2;
  kn.setAttribute('cx', 50 + 50 * Math.cos(a));
  kn.setAttribute('cy', 50 + 50 * Math.sin(a));
  nringEl.setAttribute('aria-valuenow', Math.round(pct * 100));
}

/** Update rail progress */
function updateRailProgress(pct) {
  if (nfillEl) nfillEl.style.width = `${pct * 100}%`;
  if (ndotEl) ndotEl.style.left = `${pct * 100}%`;
  if (nrailEl) nrailEl.setAttribute('aria-valuenow', Math.round(pct * 100));
}

/** ===========================
    SEEK HANDLING
    =========================== */

function onRingSeekStart(e) {
  if (e.button !== 0) return;
  isSeekingRing = true;
  nringEl.setPointerCapture(e.pointerId);
  seekRing(e);
  nringEl.addEventListener('pointermove', onRingSeekMove);
  nringEl.addEventListener('pointerup', onRingSeekEnd);
  nringEl.addEventListener('pointercancel', onRingSeekEnd);
}

function onRingSeekMove(e) {
  if (!isSeekingRing) return;
  seekRing(e);
}

function onRingSeekEnd(e) {
  isSeekingRing = false;
  nringEl.releasePointerCapture(e.pointerId);
  nringEl.removeEventListener('pointermove', onRingSeekMove);
  nringEl.removeEventListener('pointerup', onRingSeekEnd);
  nringEl.removeEventListener('pointercancel', onRingSeekEnd);
}

function seekRing(e) {
  const { duration } = playerStore.get();
  if (!duration) return;
  const rect = nringEl.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const angle = Math.atan2(e.clientY - cy, e.clientX - cx) + Math.PI / 2;
  let pct = angle / (Math.PI * 2);
  if (pct < 0) pct += 1;
  pct = clamp(pct, 0, 1);
  playerStore.set({ currentTime: pct * duration });
}

function onRingSeekKey(e) {
  const { currentTime, duration } = playerStore.get();
  if (!duration) return;
  let pct = currentTime / duration;
  if (e.key === 'ArrowLeft') pct = clamp(pct - 0.01, 0, 1);
  else if (e.key === 'ArrowRight') pct = clamp(pct + 0.01, 0, 1);
  else if (e.key === 'Home') pct = 0;
  else if (e.key === 'End') pct = 1;
  else return;
  e.preventDefault();
  playerStore.set({ currentTime: pct * duration });
}

function onRailSeekStart(e) {
  if (e.button !== 0) return;
  isSeekingRail = true;
  nrailEl.setPointerCapture(e.pointerId);
  seekRail(e);
  nrailEl.addEventListener('pointermove', onRailSeekMove);
  nrailEl.addEventListener('pointerup', onRailSeekEnd);
  nrailEl.addEventListener('pointercancel', onRailSeekEnd);
}

function onRailSeekMove(e) {
  if (!isSeekingRail) return;
  seekRail(e);
}

function onRailSeekEnd(e) {
  isSeekingRail = false;
  nrailEl.releasePointerCapture(e.pointerId);
  nrailEl.removeEventListener('pointermove', onRailSeekMove);
  nrailEl.removeEventListener('pointerup', onRailSeekEnd);
  nrailEl.removeEventListener('pointercancel', onRailSeekEnd);
}

function seekRail(e) {
  const { duration } = playerStore.get();
  if (!duration) return;
  const rect = nrailEl.getBoundingClientRect();
  const pct = clamp((e.clientX - rect.left) / rect.width, 0, 1);
  playerStore.set({ currentTime: pct * duration });
}

function onRailSeekKey(e) {
  const { currentTime, duration } = playerStore.get();
  if (!duration) return;
  let pct = currentTime / duration;
  if (e.key === 'ArrowLeft') pct = clamp(pct - 0.01, 0, 1);
  else if (e.key === 'ArrowRight') pct = clamp(pct + 0.01, 0, 1);
  else if (e.key === 'Home') pct = 0;
  else if (e.key === 'End') pct = 1;
  else return;
  e.preventDefault();
  playerStore.set({ currentTime: pct * duration });
}

/** Control button clicks */
function onControlClick(e) {
  const btn = e.target.closest('[data-c]');
  if (!btn) return;
  const action = btn.getAttribute('data-c');

  switch (action) {
    case 'play': togglePlay(); break;
    case 'next': playNext(); break;
    case 'prev': playPrev(); break;
    case 'shuf': toggleShuffle(); break;
    case 'rep': toggleRepeat(); break;
    case 'like': toggleLike(); break;
  }
}

function togglePlay() {
  const { isPlaying } = playerStore.get();
  playerStore.set({ isPlaying: !isPlaying });
}

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

function toggleShuffle() {
  const { shuffle } = playerStore.get();
  playerStore.set({ shuffle: !shuffle });
}

function toggleRepeat() {
  const { repeat } = playerStore.get();
  playerStore.set({ repeat: (repeat + 1) % 3 });
}

function toggleLike() {
  const { queue, queueIndex, liked } = playerStore.get();
  if (queueIndex < 0 || queueIndex >= queue.length) return;
  const trackId = queue[queueIndex];
  const nextLiked = { ...liked };
  if (nextLiked[trackId]) delete nextLiked[trackId];
  else nextLiked[trackId] = true;
  playerStore.set({ liked: nextLiked });
}

/** Open Now Playing */
export function openNowPlaying() {
  if (!npEl) createNowPlaying();
  npEl.hidden = false;
  document.body.style.overflow = 'hidden';
  setTimeout(() => $('#npClose', npEl)?.focus(), 100);
}

/** Close Now Playing */
export function closeNowPlaying() {
  if (!npEl) return;
  npEl.hidden = true;
  document.body.style.overflow = 'hidden';
  if (location.hash === '#playing') {
    if (history.length > 1) {
      history.back();
    } else {
      location.hash = '#home';
    }
  }
}

export default { createNowPlaying, openNowPlaying, closeNowPlaying };