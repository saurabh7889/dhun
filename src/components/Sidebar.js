/* ==========================================================================
   DHUN — Sidebar Component (matches original design)
   ========================================================================== */

import { uiStore, libraryStore, authStore } from '../store/index.js';
import { getIcon, createIconButton } from '../utils/icons.js';
import { $, $$, h } from '../utils/format.js';
import { navigate as routerNavigate } from '../router/index.js';
import { openAuthModal } from './AuthModal.js';
import { authApi } from '../api/client.js';

let sidebarEl = null;

/** Create sidebar */
export function createSidebar(root) {
  if (sidebarEl) return sidebarEl;

  sidebarEl = h('aside', { class: 'side' }, [
    h('div', { class: 'logo' }, ['DHUN', h('i', {}, 'धुन')]),
    h('nav', { class: 'side-nav' }, [
      createNavItem('home', getIcon('home'), 'Home'),
      createNavItem('search', getIcon('search'), 'Search'),
      createNavItem('library', getIcon('library'), 'Library')
    ]),
    h('div', { class: 'side-playlists' }, [
      h('h4', {}, 'Playlists'),
      h('div', { id: 'sidePl', class: 'side-pl-list' })
    ]),
    h('div', { id: 'sideAuthSection', class: 'side-auth' }),
    h('div', { class: 'grow' }),
    h('div', { class: 'side-footer' }, [
      createIconButton('theme', '', { 'data-theme-toggle': true, 'aria-label': 'Switch theme' }),
      h('a', { href: '#', id: 'toLanding', class: 'mono', style: 'text-decoration:underline;text-underline-offset:4px' }, 'About DHUN')
    ])
  ]);

  if (root) root.appendChild(sidebarEl);

  // Add styles
  addSidebarStyles();

  // Attach listeners
  attachSidebarListeners();

  // Subscribe to stores
  libraryStore.subscribe(renderPlaylists);
  uiStore.subscribe(updateActiveNav);
  authStore.subscribe(updateAuthState);

  // Initial render
  renderPlaylists(libraryStore.get());
  updateActiveNav(uiStore.get());
  updateAuthState(authStore.get());

  return sidebarEl;
}

/** Create nav item */
function createNavItem(id, icon, label) {
  return h('button', {
    class: 'nv',
    'data-nav': id,
    'aria-label': label
  }, [icon, label]);
}

/** Add sidebar styles */
function addSidebarStyles() {
  if (document.getElementById('sidebarStyles')) return;

  const style = document.createElement('style');
  style.id = 'sidebarStyles';
  style.textContent = `
    .side {
      grid-row: 1;
      display: flex;
      flex-direction: column;
      gap: 26px;
      padding: 24px 20px;
      border-right: 1px solid var(--line);
      overflow: auto;
    }
    .side-nav { display: flex; flex-direction: column; gap: 2px; }
    .nv {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 11px 12px;
      border-radius: 12px;
      font-weight: 600;
      font-size: 16px;
      text-align: left;
      color: var(--ink-2);
    }
    .nv svg { width: 20px; height: 20px; flex-shrink: 0; }
    .nv:hover { color: var(--ink); background: color-mix(in srgb, var(--ink) 5%, transparent); }
    .nv.on { color: var(--ink); background: color-mix(in srgb, var(--ink) 7%, transparent); }
    .side h4 {
      margin: 0 0 8px 12px;
      font-family: var(--mono);
      font-weight: 400;
      font-size: 12px;
      color: var(--ink-2);
      text-transform: uppercase;
      letter-spacing: .06em;
    }
    .side-pl-list { display: flex; flex-direction: column; gap: 2px; }
    .pl {
      display: block;
      padding: 7px 12px;
      color: var(--ink-2);
      font-size: 14px;
      text-align: left;
      width: 100%;
      border-radius: 8px;
      border: 0;
      background: none;
    }
    .pl:hover { color: var(--ink); background: color-mix(in srgb, var(--ink) 5%, transparent); }
    .grow { flex: 1; }
    .side-footer { display: flex; gap: 10px; align-items: center; padding-top: 16px; border-top: 1px solid var(--line); }
    .side-footer .mono { color: var(--ink-2); font-size: 13px; }
    .side-footer .mono:hover { color: var(--accent); }

    @media (max-width: 860px) {
      .side { display: none; }
    }
  `;
  document.head.appendChild(style);
}

/** Attach event listeners */
function attachSidebarListeners() {
  // Navigation
  $$('[data-nav]', sidebarEl).forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.getAttribute('data-nav');
      routerNavigate(view);
    });
  });

  // Playlist clicks (delegated)
  $('#sidePl', sidebarEl).addEventListener('click', (e) => {
    const btn = e.target.closest('[data-playlist]');
    if (btn) {
      const id = btn.getAttribute('data-playlist');
      routerNavigate(`playlist-${id}`);
    }
  });

  // Theme toggle
  $$('[data-theme-toggle]', sidebarEl).forEach(btn => {
    btn.addEventListener('click', toggleTheme);
  });

  // To landing
  $('#toLanding', sidebarEl).addEventListener('click', (e) => {
    e.preventDefault();
    history.pushState('', document.title, location.pathname + location.search);
    window.location.hash = '';
  });
}

/** Render user playlists */
function renderPlaylists(state) {
  const container = $('#sidePl', sidebarEl);
  if (!container) return;

  const { playlists } = state;
  if (playlists.length === 0) {
    container.innerHTML = '<p class="mono" style="padding:12px;color:var(--ink-2)">No playlists yet</p>';
    return;
  }

  container.innerHTML = playlists.map(p =>
    `<button class="pl" data-playlist="${p.id}">${escapeHtml(p.name)}</button>`
  ).join('');
}

/** Update active nav */
function updateActiveNav(state) {
  const { currentView } = state;
  const map = {
    home: 'home',
    search: 'search',
    library: 'library',
    artist: 'library',
    album: 'library',
    playlist: 'library',
    playing: ''
  };
  const active = map[currentView] || '';

  $$('.nv', sidebarEl).forEach(btn => {
    btn.classList.toggle('on', btn.getAttribute('data-nav') === active);
  });
}

/** Update auth state */
function updateAuthState(state) {
  const { isAuthenticated, user } = state;
  const authSection = $('#sideAuthSection', sidebarEl);
  if (!authSection) return;

  if (isAuthenticated && user) {
    const name = user.user_metadata?.display_name || user.email?.split('@')[0] || 'Member';
    const initial = name.charAt(0).toUpperCase();
    authSection.innerHTML = `
      <div class="user-profile">
        <div class="user-avatar">${initial}</div>
        <div class="user-info">
          <span class="user-name">${escapeHtml(name)}</span>
          <span class="user-role">${escapeHtml(user.email || 'Free Member')}</span>
        </div>
        <button class="icon-btn" id="sideLogoutBtn" title="Sign Out" aria-label="Sign Out" style="width:30px;height:30px">
          ${getIcon('logout')}
        </button>
      </div>
    `;
    const logoutBtn = $('#sideLogoutBtn', authSection);
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        await authApi.logout();
      });
    }
  } else {
    authSection.innerHTML = `
      <button class="nv" id="sideLoginBtn" aria-label="Sign In" style="width:100%;margin-bottom:6px">
        ${getIcon('user')}
        <span>Sign In</span>
      </button>
    `;
    const loginBtn = $('#sideLoginBtn', authSection);
    if (loginBtn) {
      loginBtn.addEventListener('click', () => {
        openAuthModal('login');
      });
    }
  }
}

/** Toggle theme */
function toggleTheme() {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDarkMode = current === 'dark' || (!current && prefersDark);
  const next = isDarkMode ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('dhun-theme', next);
}

/** Escape HTML */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, '&#039;');
}

export default { createSidebar };