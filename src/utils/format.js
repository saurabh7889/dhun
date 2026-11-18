/* ==========================================================================
   DHUN — Formatters & Helpers
   ========================================================================== */

/** Format seconds to M:SS or H:MM:SS */
export function fmtTime(seconds) {
  if (!isFinite(seconds) || seconds < 0) return '0:00';
  const s = Math.max(0, Math.round(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  return `${m}:${String(sec).padStart(2, '0')}`;
}

/** Format large numbers: 1.2K, 3.4M, etc. */
export function fmtCount(n) {
  if (!isFinite(n)) return '0';
  if (n >= 1e9) return (n / 1e9).toFixed(1).replace(/\.0$/, '') + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
  return String(n);
}

/** Format duration from milliseconds */
export function fmtDuration(ms) {
  return fmtTime(ms / 1000);
}

/** Clamp value between min and max */
export function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

/** Debounce function */
export function debounce(fn, ms = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

/** Throttle function */
export function throttle(fn, ms = 100) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= ms) {
      last = now;
      fn(...args);
    }
  };
}

/** Generate unique ID */
export function uid(prefix = '') {
  return prefix + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/** Deep clone */
export function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/** Check if element is visible in viewport */
export function isInViewport(el, offset = 0) {
  if (!el) return false;
  const rect = el.getBoundingClientRect();
  return (
    rect.bottom >= -offset &&
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) + offset
  );
}

/** Smooth scroll to element */
export function scrollToEl(el, offset = 0) {
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: 'smooth' });
}

/** Parse query string */
export function parseQuery(str = window.location.search) {
  const params = new URLSearchParams(str.slice(1));
  const obj = {};
  for (const [k, v] of params) obj[k] = v;
  return obj;
}

/** Build query string */
export function buildQuery(obj) {
  const params = new URLSearchParams();
  Object.entries(obj).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.append(k, v);
  });
  return params.toString();
}

/** Storage helpers with error handling */
export const storage = {
  get(key, fallback = null) {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
    } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch { return false; }
  },
  remove(key) {
    try { localStorage.removeItem(key); return true; }
    catch { return false; }
  }
};

/** Session storage helpers */
export const sessionStore = {
  get(key, fallback = null) {
    try {
      const v = sessionStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
    } catch { return fallback; }
  },
  set(key, value) {
    try { sessionStorage.setItem(key, JSON.stringify(value)); return true; }
    catch { return false; }
  },
  remove(key) {
    try { sessionStorage.removeItem(key); return true; }
    catch { return false; }
  }
};

/** Color utilities */
export function hexToRgb(hex) {
  const m = hex.replace('#', '').match(/.{2}/g);
  return m ? m.map(v => parseInt(v, 16)) : [0, 0, 0];
}

export function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

/** Generate CSS color-mix for hover states */
export function colorMix(color1, color2, weight = 0.1) {
  const [r1, g1, b1] = hexToRgb(color1);
  const [r2, g2, b2] = hexToRgb(color2);
  const r = Math.round(r1 * (1 - weight) + r2 * weight);
  const g = Math.round(g1 * (1 - weight) + g2 * weight);
  const b = Math.round(b1 * (1 - weight) + b2 * weight);
  return rgbToHex(r, g, b);
}

/** Get CSS variable value */
export function getCssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/** Set CSS variable */
export function setCssVar(name, value) {
  document.documentElement.style.setProperty(name, value);
}

/** Check if dark theme */
export function isDark() {
  return document.documentElement.getAttribute('data-theme') === 'dark' ||
    (!document.documentElement.hasAttribute('data-theme') &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);
}

/** Toggle theme */
export function toggleTheme() {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDarkMode = current === 'dark' || (!current && prefersDark);
  const next = isDarkMode ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  storage.set('dhun-theme', next);
  return next;
}

/** Initialize theme from storage */
export function initTheme() {
  const saved = storage.get('dhun-theme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
  }
}

/** Reduce motion preference */
export const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Safe query selector */
export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/** Create element with attributes and children */
export function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'class') el.className = v;
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (v !== null && v !== undefined) el.setAttribute(k, v);
  });
  children.flat().forEach(c => {
    if (c instanceof Node) el.appendChild(c);
    else if (c !== null && c !== undefined) el.appendChild(document.createTextNode(String(c)));
  });
  return el;
}

/** Render HTML string to element */
export function html(str) {
  const t = document.createElement('template');
  t.innerHTML = str.trim();
  return t.content.firstElementChild;
}

/** Escape HTML */
export function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, '&#039;');
}