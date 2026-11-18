/* ==========================================================================
   DHUN — Track Row Component (matches original design exactly)
   ========================================================================== */

import { playerStore } from '../store/index.js';
import { getIcon } from '../utils/icons.js';
import { $, $$, h, fmtTime, escapeHtml } from '../utils/format.js';

/** Create a track row element */
export function createTrackRow(track, index, options = {}) {
  const {
    showNumber = true,
    showArt = true,
    showAlbum = false,
    showArtist = true,
    showDuration = true,
    showLike = true,
    showEq = true,
    clickable = true,
    context = '',
    playlistId = null
  } = options;

  const player = playerStore.get();
  const isCurrent = player.queueIndex >= 0 && player.queue[player.queueIndex] === track.id;
  const isLiked = player.liked[track.id];
  const isPlaying = isCurrent && player.isPlaying;

  const row = h('div', {
    class: `trow${isCurrent ? ' cur' : ''}${!clickable ? ' nothing' : ''}`,
    'data-tid': track.id,
    role: clickable ? 'button' : undefined,
    tabindex: clickable ? '0' : undefined,
    'aria-label': clickable ? `Play ${escapeHtml(track.title)}` : undefined
  }, [
    // Number / EQ
    showNumber ? h('span', { class: isCurrent && showEq ? 'eq' : 'n' }, isCurrent && showEq ? '<i></i><i></i><i></i>' : String(index + 1).padStart(2, '0')) : '',

    // Artwork
    showArt ? h('span', { class: 'art cover', style: `background-image:${track.art || ''}` }) : '',

    // Title & subtitle
    h('span', { style: 'min-width:0' }, [
      h('span', { class: 't' }, escapeHtml(track.title)),
      h('span', { class: 's' }, escapeHtml(
        showAlbum && track.album ? track.album :
        showArtist && track.artist ? track.artist :
        ''
      ))
    ]),

    // Duration
    showDuration ? h('span', { class: 'd mono' }, fmtTime(track.duration || 0)) : '',

    // Like button
    showLike ? h('button', {
      class: `lk${isLiked ? ' on' : ''}`,
      'data-like': track.id,
      'aria-label': isLiked ? 'Unlike' : 'Like',
      type: 'button'
    }, isLiked ? getIcon('heartOn') : getIcon('heart')) : ''
  ]);

  return row;
}

/** Render track list into container */
export function renderTrackList(container, tracks, options = {}) {
  const { context = '', onPlay, onLike, ...rowOptions } = options;

  container.innerHTML = tracks.map((track, i) => createTrackRow(track, i, rowOptions).outerHTML).join('');

  // Bind events
  bindTrackRows(container, tracks, context, onPlay, onLike);
}

/** Bind track row events */
function bindTrackRows(container, tracks, context, onPlay, onLike) {
  const trackIds = tracks.map(t => t.id);

  // Play buttons (row click)
  $$('.trow', container).forEach((row, i) => {
    const trackId = row.getAttribute('data-tid');
    const track = tracks[i];

    const handlePlay = (e) => {
      // Don't trigger if clicking on like button
      if (e.target.closest('[data-like]')) return;

      const player = playerStore.get();
      const isCurrent = player.queueIndex >= 0 && player.queue[player.queueIndex] === trackId;

      if (isCurrent && player.isPlaying) {
        // Toggle play/pause
        if (onPlay) onPlay('toggle', trackId, track);
        else playerStore.set({ isPlaying: !player.isPlaying });
      } else {
        // Play this track
        if (onPlay) onPlay('play', trackId, track);
        else playTrack(trackId, trackIds, context, tracks);
      }
    };

    row.addEventListener('click', handlePlay);
    row.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handlePlay(e);
      }
    });
  });

  // Like buttons
  $$('[data-like]', container).forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const trackId = btn.getAttribute('data-like');
      const track = tracks.find(t => t.id === trackId);

      if (onLike) onLike(trackId, track);
      else toggleLike(trackId);
    });
  });
}

/** Play track helper */
function playTrack(trackId, trackList, context, trackObjects = []) {
  const index = trackList.indexOf(trackId);
  if (index === -1) return;

  // Find track object for metadata
  const currentTrack = trackObjects.find(t => t.id === trackId) || { id: trackId };

  playerStore.set({
    queue: trackList,
    queueIndex: index,
    queueContext: context,
    currentTime: 0,
    isPlaying: true,
    currentTrack
  });
}

/** Toggle like */
function toggleLike(trackId) {
  const { liked } = playerStore.get();
  const nextLiked = { ...liked };
  if (nextLiked[trackId]) delete nextLiked[trackId];
  else nextLiked[trackId] = true;
  playerStore.set({ liked: nextLiked });
}

/** Update a single row's playing/liked state */
export function updateTrackRow(row, trackId) {
  if (!row) return;
  const player = playerStore.get();
  const isCurrent = player.queueIndex >= 0 && player.queue[player.queueIndex] === trackId;
  const isLiked = player.liked[trackId];
  const isPlaying = isCurrent && player.isPlaying;

  row.classList.toggle('cur', isCurrent);
  row.classList.toggle('playing-off', !isPlaying);

  // Update number/EQ
  const numEl = $('.n, .eq', row);
  if (numEl) {
    if (isCurrent) {
      numEl.className = 'eq';
      numEl.innerHTML = '<i></i><i></i><i></i>';
    } else {
      numEl.className = 'n';
      const index = player.queue.indexOf(trackId);
      numEl.textContent = index >= 0 ? String(index + 1).padStart(2, '0') : '';
    }
  }

  // Update like button
  const likeBtn = $('[data-like]', row);
  if (likeBtn) {
    likeBtn.classList.toggle('on', isLiked);
    likeBtn.innerHTML = isLiked ? getIcon('heartOn') : getIcon('heart');
  }
}

/** Update all visible track rows */
export function updateAllTrackRows() {
  const player = playerStore.get();
  $$('.trow[data-tid]').forEach(row => {
    const trackId = row.getAttribute('data-tid');
    updateTrackRow(row, trackId);
  });
}

export default { createTrackRow, renderTrackList, updateTrackRow, updateAllTrackRows };