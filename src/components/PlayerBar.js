/* ==========================================================================
   DHUN — Persistent Player Bar (matches original design exactly)
   ========================================================================== */

import { playerStore, uiStore, musicStore } from '../store/index.js';
import { getIcon, createIconButton } from '../utils/icons.js';
import { $, $$, h, fmtTime, clamp } from '../utils/format.js';

let playerEl = null;
let railEl = null;
let fillEl = null;
let dotEl = null;
let isSeeking = false;

/** Create player bar */
export function createPlayerBar(root) {
  if (playerEl) return playerEl;

  playerEl = h('div', { class: 'player', id: 'player', role: 'region', 'aria-label': 'Music player' }, [
    // Left: Track info
    h('button', { class: 'pl-l', id: 'plOpen', 'aria-label': 'Open now playing' }, [
      h('div', { class: 'art cover', id: 'plArt', 'aria-hidden': 'true' }),
      h('div', { class: 'txt' }, [
        h('b', { id: 'plT' }, 'Nothing playing'),
        h('span', { id: 'plA' }, 'Pick a song to start')
      ])
    ]),

    // Center: Controls
    h('div', { class: 'pl-c' }, [
      h('div', { class: 'ctrls' }, [
        createIconButton('shuf', '', { id: 'bShuf', 'aria-label': 'Shuffle', title: 'Shuffle' }),
        createIconButton('prev', '', { id: 'bPrev', 'aria-label': 'Previous', title: 'Previous' }),
        h('button', { class: 'play', id: 'bPlay', 'aria-label': 'Play' }, getIcon('play')),
        createIconButton('next', '', { id: 'bNext', 'aria-label': 'Next', title: 'Next' }),
        createIconButton('rep', '', { id: 'bRep', 'aria-label': 'Repeat', title: 'Repeat' })
      ]),
      h('div', { class: 'bar' }, [
        h('span', { id: 'tCur', class: 'mono' }, '0:00'),
        h('div', { class: 'rail', id: 'rail', role: 'slider', 'aria-label': 'Seek', 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': '0', tabindex: '0' }, [
          h('div', { class: 'fill', id: 'railFill' }),
          h('div', { class: 'dot', id: 'railDot' })
        ]),
        h('span', { id: 'tDur', class: 'mono' }, '0:00')
      ])
    ]),

    // Right: Volume & Like
    h('div', { class: 'pl-r' }, [
      createIconButton('heart', '', { id: 'bLike', 'aria-label': 'Like', title: 'Like' }),
      createIconButton('vol', '', { id: 'bMute', 'aria-label': 'Mute', title: 'Mute' }),
      h('input', { class: 'vol', id: 'vol', type: 'range', min: '0', max: '100', value: '70', 'aria-label': 'Volume' }),
      createIconButton('expand', '', { id: 'bExpand', 'aria-label': 'Open now playing', title: 'Open Now Playing' })
    ])
  ]);

  if (root) root.appendChild(playerEl);

  // Cache elements
  railEl = $('#rail', playerEl);
  fillEl = $('#railFill', playerEl);
  dotEl = $('#railDot', playerEl);

  // Add styles
  addPlayerStyles();

  // Attach listeners
  attachPlayerListeners();

  // Subscribe to store
  playerStore.subscribe(updatePlayerUI);
  uiStore.subscribe(updateMobileLayout);

  // Initial render
  updatePlayerUI(playerStore.get());

  return playerEl;
}

/** Add player styles */
function addPlayerStyles() {
  if (document.getElementById('playerBarStyles')) return;

  const style = document.createElement('style');
  style.id = 'playerBarStyles';
  style.textContent = `
    .player {
      grid-row: 2;
      grid-column: 1 / -1;
      border-top: 1px solid var(--line);
      display: grid;
      grid-template-columns: 1fr minmax(0, 1.4fr) 1fr;
      align-items: center;
      gap: 20px;
      padding: 0 max(24px, env(safe-area-inset-right, 0px)) 0 24px;
      background: var(--paper);
      position: relative;
      z-index: 5;
    }
    .player.nothing .pl-l { opacity: .6; pointer-events: none; }
    .pl-l { display: flex; align-items: center; gap: 14px; min-width: 0; text-align: left; }
    .pl-l .art { width: 56px; height: 56px; border-radius: 8px; flex: none; }
    .pl-l b { display: block; font-weight: 650; font-size: 15px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .pl-l span { font-family: var(--mono); font-size: 12px; color: var(--ink-2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; }
    .pl-l .txt { min-width: 0; }
    .pl-c { display: flex; flex-direction: column; gap: 8px; align-items: center; }
    .ctrls { display: flex; align-items: center; gap: 14px; }
    .ctl { width: 36px; height: 36px; display: grid; place-items: center; border-radius: 50%; color: var(--ink-2); }
    .ctl:hover { color: var(--ink); }
    .ctl svg { width: 20px; height: 20px; }
    .ctl.on { color: var(--accent); }
    .play { width: 46px; height: 46px; border-radius: 50%; background: var(--ink); color: var(--paper); display: grid; place-items: center; transition: transform .15s; }
    .play:active { transform: scale(.94); }
    .play svg { width: 20px; height: 20px; }
    .bar { display: flex; align-items: center; gap: 12px; width: 100%; font-family: var(--mono); font-size: 11px; color: var(--ink-2); }
    .rail { position: relative; flex: 1; height: 18px; cursor: pointer; touch-action: none; }
    .rail::before { content: ""; position: absolute; left: 0; right: 0; top: 8px; height: 2px; background: var(--line); border-radius: 2px; }
    .rail .fill { position: absolute; left: 0; top: 8px; height: 2px; background: var(--accent); border-radius: 2px; }
    .rail .dot { position: absolute; top: 4px; width: 10px; height: 10px; margin-left: -5px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 0 3px var(--paper); opacity: 0; transition: opacity .15s; }
    .rail:hover .dot, .rail:focus .dot { opacity: 1; }
    .rail:focus { outline: none; }
    .rail:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; border-radius: 4px; }
    .pl-r { display: flex; justify-content: flex-end; align-items: center; gap: 8px; }
    .vol { width: 90px; accent-color: var(--accent); }
    .nothing { opacity: .6; }

    /* Mobile player */
    @media (max-width: 860px) {
      .player {
        position: fixed;
        left: max(10px, env(safe-area-inset-left, 0px));
        right: max(10px, env(safe-area-inset-right, 0px));
        bottom: calc(64px + env(safe-area-inset-bottom, 0px));
        grid-template-columns: 1fr auto;
        border: 0;
        border-radius: 999px;
        background: #0F0F12;
        color: #F2F0EA;
        padding: 8px 10px 8px 8px;
        height: auto;
        gap: 10px;
        box-shadow: 0 18px 40px -14px rgba(0, 0, 0, .55);
        overflow: hidden;
        z-index: 40;
      }
      .player .pl-c .ctrls .ctl,
      .player .pl-r,
      .player .bar span { display: none; }
      .player .pl-c { flex-direction: row; }
      .player .pl-c .bar { position: absolute; left: 0; right: 0; bottom: 0; padding: 0; }
      .player .pl-c .bar .rail { height: 3px; }
      .player .rail::before { top: 0; height: 3px; background: rgba(255, 255, 255, .18); }
      .player .rail .fill { top: 0; height: 3px; }
      .player .rail .dot { display: none; }
      .player .pl-l span { color: #A9A7A2; }
      .player .play { background: #F2F0EA; color: #0F0F12; width: 42px; height: 42px; }
      .player .pl-c .ctrls { gap: 0; }
      .player .pl-c .ctrls .play { display: grid; }
    }
  `;
  document.head.appendChild(style);
}

/** Attach event listeners */
function attachPlayerListeners() {
  // Play/Pause
  $('#bPlay', playerEl).addEventListener('click', togglePlay);

  // Next/Prev
  $('#bNext', playerEl).addEventListener('click', playNext);
  $('#bPrev', playerEl).addEventListener('click', playPrev);

  // Shuffle/Repeat
  $('#bShuf', playerEl).addEventListener('click', toggleShuffle);
  $('#bRep', playerEl).addEventListener('click', toggleRepeat);

  // Like
  $('#bLike', playerEl).addEventListener('click', toggleLike);

  // Mute
  $('#bMute', playerEl).addEventListener('click', toggleMute);

  // Volume
  $('#vol', playerEl).addEventListener('input', handleVolumeChange);

  // Open Now Playing
  $('#plOpen', playerEl).addEventListener('click', openNowPlaying);
  $('#bExpand', playerEl).addEventListener('click', openNowPlaying);

  // Seek rail
  railEl.addEventListener('pointerdown', onSeekStart);
  railEl.addEventListener('keydown', onSeekKey);
}

/** Update player UI from store */
function updatePlayerUI(state) {
  const { queue, queueIndex, isPlaying, currentTime, duration, volume, isMuted, shuffle, repeat, liked, currentTrack } = state;

  // Play/Pause button
  const playBtn = $('#bPlay', playerEl);
  if (playBtn) {
    playBtn.innerHTML = isPlaying ? getIcon('pause') : getIcon('play');
    playBtn.setAttribute('aria-label', isPlaying ? 'Pause' : 'Play');
  }

  // Shuffle
  $('#bShuf', playerEl).classList.toggle('on', shuffle);

  // Repeat
  const repBtn = $('#bRep', playerEl);
  repBtn.classList.toggle('on', repeat > 0);
  repBtn.innerHTML = repeat === 2 ? getIcon('rep1') : getIcon('rep');

  // Mute
  $('#bMute', playerEl).innerHTML = (isMuted || volume === 0) ? getIcon('mute') : getIcon('vol');

  // Volume slider
  $('#vol', playerEl).value = volume;

  // Track resolution
  const trackId = typeof queue[queueIndex] === 'string' ? queue[queueIndex] : queue[queueIndex]?.id;
  const music = musicStore ? musicStore.get() : { tracks: {} };
  const trackObj = currentTrack || (trackId && music.tracks ? music.tracks[trackId] : null);

  // Like
  const isLiked = trackObj && liked[trackObj.id];
  const likeBtn = $('#bLike', playerEl);
  likeBtn.classList.toggle('on', !!isLiked);
  likeBtn.innerHTML = isLiked ? getIcon('heartOn') : getIcon('heart');

  // Track info
  if (trackObj) {
    $('#plArt', playerEl).style.backgroundImage = trackObj.art || '';
    $('#plT', playerEl).textContent = trackObj.title || 'Unknown';
    $('#plA', playerEl).textContent = trackObj.artist || 'Unknown Artist';
    $('#tDur', playerEl).textContent = fmtTime(trackObj.duration || duration);
    playerEl.classList.remove('nothing');
  } else {
    $('#plArt', playerEl).style.backgroundImage = '';
    $('#plT', playerEl).textContent = 'Nothing playing';
    $('#plA', playerEl).textContent = 'Pick a song to start';
    $('#tDur', playerEl).textContent = '0:00';
    playerEl.classList.add('nothing');
  }

  // Progress
  updateProgress(currentTime, duration);
}

/** Update progress bar */
function updateProgress(current, total) {
  const pct = total > 0 ? clamp(current / total, 0, 1) : 0;
  if (fillEl) fillEl.style.width = `${pct * 100}%`;
  if (dotEl) dotEl.style.left = `${pct * 100}%`;
  if (railEl) {
    railEl.setAttribute('aria-valuenow', Math.round(pct * 100));
  }
  $('#tCur', playerEl).textContent = fmtTime(current);
}

/** Update mobile layout */
function updateMobileLayout(uiState) {
  // Handled by CSS media queries
}

/** ===========================
    PLAYBACK CONTROLS
    =========================== */

function togglePlay() {
  const { isPlaying, queue, queueIndex } = playerStore.get();
  if (!queue.length || queueIndex === -1) {
    const POP = ['t0-0', 't1-0', 't5-0', 't3-1', 't4-0', 't2-1', 't0-3', 't6-1'];
    playerStore.set({
      queue: POP,
      queueIndex: 0,
      queueContext: 'Popular on DHUN',
      currentTime: 0,
      isPlaying: true
    });
    return;
  }
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

  if (currentTime > 3) {
    playerStore.set({ currentTime: 0 });
  } else if (queueIndex > 0) {
    playerStore.set({ queueIndex: queueIndex - 1, currentTime: 0 });
  } else {
    playerStore.set({ queueIndex: queue.length - 1, currentTime: 0 });
  }
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

function toggleMute() {
  const { isMuted, volume } = playerStore.get();
  playerStore.set({ isMuted: !isMuted });
}

function handleVolumeChange(e) {
  const vol = parseInt(e.target.value, 10);
  playerStore.set({ volume: vol, isMuted: vol === 0 });
}

function openNowPlaying() {
  const { queue, queueIndex } = playerStore.get();
  if (queue.length && queueIndex >= 0) {
    window.location.hash = 'playing';
  }
}

/** ===========================
    SEEK HANDLING
    =========================== */

function onSeekStart(e) {
  if (e.button !== 0) return;
  isSeeking = true;
  railEl.setPointerCapture(e.pointerId);
  seekToEvent(e);
  railEl.addEventListener('pointermove', onSeekMove);
  railEl.addEventListener('pointerup', onSeekEnd);
  railEl.addEventListener('pointercancel', onSeekEnd);
}

function onSeekMove(e) {
  if (!isSeeking) return;
  seekToEvent(e);
}

function onSeekEnd(e) {
  isSeeking = false;
  railEl.releasePointerCapture(e.pointerId);
  railEl.removeEventListener('pointermove', onSeekMove);
  railEl.removeEventListener('pointerup', onSeekEnd);
  railEl.removeEventListener('pointercancel', onSeekEnd);
}

function seekToEvent(e) {
  const { duration } = playerStore.get();
  if (!duration) return;
  const rect = railEl.getBoundingClientRect();
  const pct = clamp((e.clientX - rect.left) / rect.width, 0, 1);
  playerStore.set({ currentTime: pct * duration });
}

function onSeekKey(e) {
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

/** ===========================
    EXTERNAL CONTROL API
    =========================== */

/** Set queue and play */
export function setQueue(trackIds, startIndex = 0, context = '', trackObjects = []) {
  playerStore.set({
    queue: trackIds,
    queueIndex: startIndex,
    queueContext: context,
    currentTime: 0,
    isPlaying: true
  });
  if (trackObjects.length) {
    const currentTrack = trackObjects[startIndex];
    if (currentTrack) playerStore.set({ currentTrack });
  }
}

/** Play specific track */
export function playTrack(trackId, trackList = null, context = '') {
  const list = trackList && trackList.includes(trackId) ? trackList : [trackId];
  const index = list.indexOf(trackId);
  setQueue(list, index, context);
}

/** Get current track */
export function getCurrentTrack() {
  const { queue, queueIndex } = playerStore.get();
  if (queueIndex >= 0 && queueIndex < queue.length) {
    return { id: queue[queueIndex], index: queueIndex };
  }
  return null;
}

/** Update current track metadata */
export function setCurrentTrackMeta(meta) {
  playerStore.set({ currentTrack: meta });
}

/** Update playback time */
export function updateTime(current, total) {
  playerStore.set({ currentTime: current, duration: total });
}

/** Update playing state */
export function setPlaying(playing) {
  playerStore.set({ isPlaying: playing });
}

export default { createPlayerBar, setQueue, playTrack, getCurrentTrack, setCurrentTrackMeta, updateTime, setPlaying };