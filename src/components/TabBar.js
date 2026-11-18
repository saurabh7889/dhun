/* ==========================================================================
   DHUN — Mobile Tab Bar (matches original design)
   ========================================================================== */

import { uiStore } from '../store/index.js';
import { getIcon } from '../utils/icons.js';
import { $, $$, h } from '../utils/format.js';
import { navigate as routerNavigate } from '../router/index.js';

let tabbarEl = null;

/** Create mobile tab bar */
export function createTabBar(root) {
  if (tabbarEl) return tabbarEl;

  tabbarEl = h('nav', { class: 'tabbar', role: 'tablist', 'aria-label': 'Main navigation' }, [
    createTab('home', getIcon('home'), 'Home'),
    createTab('search', getIcon('search'), 'Search'),
    createTab('library', getIcon('library'), 'Library')
  ]);

  if (root) root.appendChild(tabbarEl);

  // Add styles
  addTabBarStyles();

  // Attach listeners
  attachTabBarListeners();

  // Subscribe to UI store
  uiStore.subscribe(updateActiveTab);

  // Initial render
  updateActiveTab(uiStore.get());

  return tabbarEl;
}

/** Create tab button */
function createTab(id, icon, label) {
  return h('button', {
    class: 'tab',
    'data-nav': id,
    role: 'tab',
    'aria-selected': 'false',
    'aria-label': label
  }, [
    h('span', { class: 'tab-icon' }, icon),
    h('span', { class: 'tab-label' }, label)
  ]);
}

/** Add tab bar styles */
function addTabBarStyles() {
  if (document.getElementById('tabBarStyles')) return;

  const style = document.createElement('style');
  style.id = 'tabBarStyles';
  style.textContent = `
    .tabbar {
      display: none;
    }

    @media (max-width: 860px) {
      .tabbar {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        background: var(--paper);
        border-top: 1px solid var(--line);
        padding: 8px 0 calc(8px + env(safe-area-inset-bottom, 0px));
        z-index: 6;
      }
      .tab {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 3px;
        font-size: 11px;
        font-weight: 600;
        color: var(--ink-2);
        padding: 4px 0;
      }
      .tab[aria-selected="true"] { color: var(--ink); }
      .tab .tab-icon { display: flex; }
      .tab .tab-icon svg { width: 22px; height: 22px; }
      .tab .tab-label { line-height: 1; }
    }
  `;
  document.head.appendChild(style);
}

/** Attach event listeners */
function attachTabBarListeners() {
  $$('[data-nav]', tabbarEl).forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.getAttribute('data-nav');
      routerNavigate(view);
    });
  });
}

/** Update active tab */
function updateActiveTab(state) {
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

  $$('.tab', tabbarEl).forEach(btn => {
    const isActive = btn.getAttribute('data-nav') === active;
    btn.setAttribute('aria-selected', isActive);
  });
}

export default { createTabBar };