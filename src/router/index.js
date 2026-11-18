/* ==========================================================================
   DHUN — Hash Router (matches original hash-based routing)
   ========================================================================== */

import { uiStore } from '../store/index.js';
import { $ } from '../utils/format.js';

const routes = new Map();
let currentRoute = null;
let beforeHooks = [];

/** Register a route */
export function route(path, handler) {
  routes.set(path, handler);
}

/** Register before navigation hook */
export function beforeEach(hook) {
  beforeHooks.push(hook);
}

/** Navigate to a hash route */
export function navigate(hash) {
  if (hash.startsWith('#')) hash = hash.slice(1);
  if (location.hash.slice(1) === hash) {
    // Same route, trigger update
    handleHashChange();
    return;
  }
  location.hash = hash;
}

/** Go back */
export function goBack() {
  history.back();
}

/** Get current route */
export function getCurrentRoute() {
  return currentRoute;
}

/** Parse hash into route name and params */
function parseHash(hash) {
  if (!hash) return { name: 'landing', params: {} };
  const [name, ...rest] = hash.split('-');
  const param = rest.join('-');
  return { name, params: { id: param } };
}

/** Handle hash change */
async function handleHashChange() {
  const hash = location.hash.slice(1);
  const { name, params } = parseHash(hash);

  // Run before hooks
  for (const hook of beforeHooks) {
    const result = await hook({ name, params, hash });
    if (result === false) return; // Navigation cancelled
    if (typeof result === 'string') {
      location.hash = result;
      return;
    }
  }

  const handler = routes.get(name);
  if (handler) {
    currentRoute = { name, params, hash };
    uiStore.set({ currentView: name });
    await handler(params);
  } else if (name !== 'landing') {
    // Unknown route, try home
    navigate('home');
  }
}

/** Initialize router */
export function initRouter() {
  // Handle initial load
  handleHashChange();

  // Listen for hash changes
  window.addEventListener('hashchange', handleHashChange);

  // Handle browser back/forward
  window.addEventListener('popstate', handleHashChange);
}

/** Route guards */
export const guards = {
  /** Require authentication */
  requireAuth: async ({ name }) => {
    const { isAuthenticated } = uiStore.get(); // Will use authStore in real implementation
    // For now, just check if we have a token in localStorage
    const auth = JSON.parse(localStorage.getItem('dhun-auth') || '{}');
    if (!auth.token && name !== 'landing' && name !== 'login' && name !== 'signup') {
      return 'login';
    }
    return true;
  },

  /** Redirect authenticated users away from auth pages */
  guestOnly: async ({ name }) => {
    const auth = JSON.parse(localStorage.getItem('dhun-auth') || '{}');
    if (auth.token && (name === 'login' || name === 'signup')) {
      return 'home';
    }
    return true;
  }
};

export default { route, navigate, goBack, getCurrentRoute, initRouter, guards };