/* ==========================================================================
   DHUN — Auth Modal Component (matches design system)
   ========================================================================== */

import { authStore, uiStore } from '../store/index.js';
import { authApi } from '../api/client.js';
import { getIcon, createIconButton } from '../utils/icons.js';
import { $, $$, h, fmtTime } from '../utils/format.js';

let modalEl = null;
let cleanupFns = [];

/** Create auth modal */
export function createAuthModal() {
  if (modalEl) return modalEl;

  modalEl = h('div', { class: 'modal-overlay', id: 'authModal', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'authTitle' }, [
    h('div', { class: 'modal' }, [
      h('button', { class: 'modal-close', 'aria-label': 'Close', onclick: closeAuthModal }, getIcon('close')),
      h('div', { class: 'modal-tabs' }, [
        h('button', { class: 'modal-tab active', 'data-tab': 'login', onclick: () => switchTab('login') }, 'Login'),
        h('button', { class: 'modal-tab', 'data-tab': 'signup', onclick: () => switchTab('signup') }, 'Sign Up')
      ]),
      h('div', { class: 'modal-panels' }, [
        // Login Panel
        h('form', { id: 'loginForm', class: 'modal-panel active', 'data-panel': 'login' }, [
          h('h2', { id: 'authTitle' }, 'Welcome back'),
          h('p', { class: 'modal-subtitle' }, 'Sign in to access your library and playlists'),

          // Google OAuth
          h('button', { type: 'button', class: 'oauth-btn google', onclick: handleGoogleLogin }, [
            getIcon('google'),
            'Continue with Google'
          ]),

          h('div', { class: 'divider' }, [
            h('span', {}, 'or continue with email')
          ]),

          // Email/Password
          h('div', { class: 'form-group' }, [
            h('label', { for: 'loginEmail' }, 'Email'),
            h('input', { type: 'email', id: 'loginEmail', name: 'email', required: true, autocomplete: 'email', placeholder: 'you@example.com' })
          ]),
          h('div', { class: 'form-group' }, [
            h('label', { for: 'loginPassword' }, 'Password'),
            h('div', { class: 'password-wrapper' }, [
              h('input', { type: 'password', id: 'loginPassword', name: 'password', required: true, autocomplete: 'current-password', placeholder: '••••••••' }),
              h('button', { type: 'button', class: 'toggle-password', 'aria-label': 'Show password', onclick: togglePassword }, getIcon('eye'))
            ])
          ]),
          h('div', { class: 'form-options' }, [
            h('label', { class: 'checkbox-label' }, [
              h('input', { type: 'checkbox', name: 'remember' }),
              h('span', {}, 'Remember me')
            ]),
            h('a', { href: '#', class: 'forgot-link', onclick: (e) => { e.preventDefault(); switchTab('forgot'); } }, 'Forgot password?')
          ]),
          h('button', { type: 'submit', class: 'btn accent btn-block' }, 'Sign In'),
          h('p', { class: 'modal-error', id: 'loginError', hidden: true })
        ]),

        // Signup Panel
        h('form', { id: 'signupForm', class: 'modal-panel', 'data-panel': 'signup' }, [
          h('h2', {}, 'Create your account'),
          h('p', { class: 'modal-subtitle' }, 'Start building your music library'),

          h('button', { type: 'button', class: 'oauth-btn google', onclick: handleGoogleLogin }, [
            getIcon('google'),
            'Continue with Google'
          ]),

          h('div', { class: 'divider' }, [
            h('span', {}, 'or sign up with email')
          ]),

          h('div', { class: 'form-group' }, [
            h('label', { for: 'signupName' }, 'Display Name'),
            h('input', { type: 'text', id: 'signupName', name: 'displayName', required: true, autocomplete: 'name', placeholder: 'Your name', maxlength: 50 })
          ]),
          h('div', { class: 'form-group' }, [
            h('label', { for: 'signupEmail' }, 'Email'),
            h('input', { type: 'email', id: 'signupEmail', name: 'email', required: true, autocomplete: 'email', placeholder: 'you@example.com' })
          ]),
          h('div', { class: 'form-group' }, [
            h('label', { for: 'signupPhone' }, 'Mobile (optional)'),
            h('input', { type: 'tel', id: 'signupPhone', name: 'phone', autocomplete: 'tel', placeholder: '+91 98765 43210' })
          ]),
          h('div', { class: 'form-group' }, [
            h('label', { for: 'signupPassword' }, 'Password'),
            h('div', { class: 'password-wrapper' }, [
              h('input', { type: 'password', id: 'signupPassword', name: 'password', required: true, autocomplete: 'new-password', placeholder: '••••••••', minlength: 8 }),
              h('button', { type: 'button', class: 'toggle-password', 'aria-label': 'Show password', onclick: togglePassword }, getIcon('eye'))
            ]),
            h('p', { class: 'form-hint' }, 'At least 8 characters')
          ]),
          h('div', { class: 'form-group' }, [
            h('label', { for: 'signupConfirm' }, 'Confirm Password'),
            h('div', { class: 'password-wrapper' }, [
              h('input', { type: 'password', id: 'signupConfirm', name: 'confirmPassword', required: true, autocomplete: 'new-password', placeholder: '••••••••' }),
              h('button', { type: 'button', class: 'toggle-password', 'aria-label': 'Show password', onclick: togglePassword }, getIcon('eye'))
            ])
          ]),
          h('div', { class: 'form-options' }, [
            h('label', { class: 'checkbox-label' }, [
              h('input', { type: 'checkbox', name: 'terms', required: true }),
              h('span', {}, 'I agree to the '),
              h('a', { href: '#', onclick: (e) => { e.preventDefault(); showToast('Terms of Service coming soon'); } }, 'Terms of Service'),
              h('span', {}, ' and '),
              h('a', { href: '#', onclick: (e) => { e.preventDefault(); showToast('Privacy Policy coming soon'); } }, 'Privacy Policy')
            ])
          ]),
          h('button', { type: 'submit', class: 'btn accent btn-block' }, 'Create Account'),
          h('p', { class: 'modal-error', id: 'signupError', hidden: true })
        ]),

        // Forgot Password Panel
        h('form', { id: 'forgotForm', class: 'modal-panel', 'data-panel': 'forgot' }, [
          h('h2', {}, 'Reset password'),
          h('p', { class: 'modal-subtitle' }, 'Enter your email and we\'ll send you a reset link'),
          h('div', { class: 'form-group' }, [
            h('label', { for: 'forgotEmail' }, 'Email'),
            h('input', { type: 'email', id: 'forgotEmail', name: 'email', required: true, autocomplete: 'email', placeholder: 'you@example.com' })
          ]),
          h('button', { type: 'submit', class: 'btn accent btn-block' }, 'Send Reset Link'),
          h('p', { class: 'modal-error', id: 'forgotError', hidden: true }),
          h('button', { type: 'button', class: 'btn line btn-block', onclick: () => switchTab('login') }, 'Back to Login')
        ])
      ])
    ])
  ]);

  // Add styles
  addModalStyles();

  // Attach event listeners
  attachModalListeners();

  return modalEl;
}

/** Add modal styles */
function addModalStyles() {
  if (document.getElementById('authModalStyles')) return;

  const style = document.createElement('style');
  style.id = 'authModalStyles';
  style.textContent = `
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,.5);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      z-index: 100;
      opacity: 0;
      visibility: hidden;
      transition: opacity .2s, visibility .2s;
    }
    .modal-overlay.open {
      opacity: 1;
      visibility: visible;
    }
    .modal {
      background: var(--paper);
      border-radius: 16px;
      padding: 32px;
      width: 100%;
      max-width: 420px;
      box-shadow: 0 24px 48px -24px rgba(0,0,0,.3);
      transform: scale(.95);
      transition: transform .2s;
    }
    .modal-overlay.open .modal {
      transform: scale(1);
    }
    .modal-close {
      position: absolute;
      top: 16px;
      right: 16px;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      border: 1px solid var(--line);
      color: var(--ink-2);
    }
    .modal-close:hover {
      background: color-mix(in srgb, var(--ink) 5%, transparent);
      color: var(--ink);
    }
    .modal-close svg { width: 18px; height: 18px; }
    .modal-tabs {
      display: flex;
      gap: 8px;
      margin-bottom: 24px;
      border-bottom: 1px solid var(--line);
      padding-bottom: 8px;
    }
    .modal-tab {
      flex: 1;
      padding: 10px 16px;
      font-weight: 600;
      font-size: 15px;
      color: var(--ink-2);
      border-radius: 8px;
      border: 0;
      background: none;
    }
    .modal-tab:hover { color: var(--ink); }
    .modal-tab.active { color: var(--ink); background: color-mix(in srgb, var(--ink) 7%, transparent); }
    .modal-panels { position: relative; }
    .modal-panel { display: none; }
    .modal-panel.active { display: block; animation: fadeIn .2s; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
    .modal h2 { margin: 0 0 4px; font-weight: 700; font-stretch: 75%; letter-spacing: -.03em; font-size: 24px; line-height: 1.2; }
    .modal-subtitle { margin: 0 0 24px; color: var(--ink-2); font-size: 15px; }
    .oauth-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 100%;
      padding: 12px 16px;
      border: 1px solid var(--line);
      border-radius: 10px;
      font-weight: 600;
      font-size: 15px;
      color: var(--ink);
      background: var(--paper);
      margin-bottom: 16px;
      transition: background .15s, border-color .15s;
    }
    .oauth-btn:hover { background: color-mix(in srgb, var(--ink) 5%, transparent); border-color: var(--ink-2); }
    .oauth-btn svg { width: 20px; height: 20px; }
    .divider { display: flex; align-items: center; gap: 12px; margin: 8px 0 20px; color: var(--ink-2); font-size: 13px; }
    .divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: var(--line); }
    .form-group { margin-bottom: 16px; }
    .form-group label { display: block; margin-bottom: 6px; font-size: 13px; font-weight: 500; color: var(--ink); }
    .form-group input { width: 100%; padding: 12px 14px; border: 1px solid var(--line); border-radius: 10px; background: var(--paper); color: var(--ink); font-size: 15px; transition: border-color .15s, box-shadow .15s; }
    .form-group input:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 20%, transparent); }
    .form-group input::placeholder { color: var(--ink-2); opacity: .5; }
    .form-hint { margin: 6px 0 0; font-size: 12px; color: var(--ink-2); }
    .password-wrapper { position: relative; }
    .toggle-password { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); width: 32px; height: 32px; display: grid; place-items: center; color: var(--ink-2); border-radius: 8px; }
    .toggle-password:hover { color: var(--ink); background: color-mix(in srgb, var(--ink) 5%, transparent); }
    .toggle-password svg { width: 18px; height: 18px; }
    .form-options { display: flex; align-items: center; justify-content: space-between; margin: 8px 0 20px; font-size: 13px; flex-wrap: wrap; gap: 8px; }
    .checkbox-label { display: flex; align-items: center; gap: 8px; cursor: pointer; color: var(--ink-2); }
    .checkbox-label input { width: 18px; height: 18px; accent-color: var(--accent); }
    .forgot-link { color: var(--accent); text-decoration: none; }
    .forgot-link:hover { text-decoration: underline; }
    .btn-block { width: 100%; justify-content: center; }
    .modal-error { margin: 12px 0 0; padding: 10px 12px; background: color-mix(in srgb, var(--accent) 15%, transparent); border: 1px solid var(--accent); border-radius: 8px; color: var(--accent); font-size: 13px; display: none; }
    .modal-error:not([hidden]) { display: block; }
    @media (max-width: 480px) {
      .modal { padding: 24px 20px; margin: 16px; }
      .modal-tabs { gap: 4px; }
      .modal-tab { padding: 8px 12px; font-size: 14px; }
    }
  `;
  document.head.appendChild(style);
}

/** Attach event listeners */
function attachModalListeners() {
  // Form submissions
  const loginForm = $('#loginForm', modalEl);
  const signupForm = $('#signupForm', modalEl);
  const forgotForm = $('#forgotForm', modalEl);

  if (loginForm) {
    cleanupFns.push(addListener(loginForm, 'submit', handleLogin));
  }
  if (signupForm) {
    cleanupFns.push(addListener(signupForm, 'submit', handleSignup));
  }
  if (forgotForm) {
    cleanupFns.push(addListener(forgotForm, 'submit', handleForgot));
  }

  // Close on overlay click
  cleanupFns.push(addListener(modalEl, 'click', (e) => {
    if (e.target === modalEl) closeAuthModal();
  }));

  // Close on Escape
  cleanupFns.push(addListener(document, 'keydown', (e) => {
    if (e.key === 'Escape' && modalEl.classList.contains('open')) closeAuthModal();
  }));
}

/** Helper to add listener and return cleanup */
function addListener(el, event, handler) {
  el.addEventListener(event, handler);
  return () => el.removeEventListener(event, handler);
}

/** Switch tab/panel */
function switchTab(tab) {
  $$('.modal-tab', modalEl).forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tab));
  $$('.modal-panel', modalEl).forEach(panel => panel.classList.toggle('active', panel.dataset.panel === tab));
  // Clear errors
  $$('.modal-error', modalEl).forEach(el => el.hidden = true);
  uiStore.set({ authMode: tab });
}

/** Toggle password visibility */
function togglePassword(e) {
  const btn = e.currentTarget;
  const input = btn.previousElementSibling;
  const isPassword = input.type === 'password';
  input.type = isPassword ? 'text' : 'password';
  btn.innerHTML = isPassword ? getIcon('eyeOff') : getIcon('eye');
}

/** Handle Google OAuth */
async function handleGoogleLogin() {
  try {
    setLoading(true);
    await authApi.loginWithGoogle();
  } catch (error) {
    showError('loginError', error.message);
  } finally {
    setLoading(false);
  }
}

/** Handle login */
async function handleLogin(e) {
  e.preventDefault();
  const form = e.target;
  const email = form.email.value.trim();
  const password = form.password.value;

  if (!email || !password) return showError('loginError', 'Please fill all fields');

  try {
    setLoading(true, 'loginForm');
    hideError('loginError');
    await authApi.login(email, password);
    closeAuthModal();
    showToast('Welcome back!');
    form.reset();
  } catch (error) {
    showError('loginError', error.message);
  } finally {
    setLoading(false, 'loginForm');
  }
}

/** Handle signup */
async function handleSignup(e) {
  e.preventDefault();
  const form = e.target;
  const displayName = form.displayName.value.trim();
  const email = form.email.value.trim();
  const password = form.password.value;
  const confirmPassword = form.confirmPassword.value;

  if (!displayName || !email || !password) return showError('signupError', 'Please fill all required fields');
  if (password.length < 8) return showError('signupError', 'Password must be at least 8 characters');
  if (password !== confirmPassword) return showError('signupError', 'Passwords do not match');

  try {
    setLoading(true, 'signupForm');
    hideError('signupError');
    await authApi.signup(email, password, displayName);
    closeAuthModal();
    showToast('Account created! Welcome to DHUN.');
    form.reset();
  } catch (error) {
    showError('signupError', error.message);
  } finally {
    setLoading(false, 'signupForm');
  }
}

/** Handle forgot password */
async function handleForgot(e) {
  e.preventDefault();
  const form = e.target;
  const email = form.email.value.trim();

  if (!email) return showError('forgotError', 'Please enter your email');

  try {
    setLoading(true, 'forgotForm');
    hideError('forgotError');
    await authApi.resetPassword(email);
    showToast('Reset link sent! Check your email.');
    switchTab('login');
    form.reset();
  } catch (error) {
    showError('forgotError', error.message);
  } finally {
    setLoading(false, 'forgotForm');
  }
}

/** Show modal */
export function openAuthModal(mode = 'login') {
  if (!modalEl) createAuthModal();
  document.body.appendChild(modalEl);
  // Force reflow for animation
  modalEl.offsetHeight;
  modalEl.classList.add('open');
  switchTab(mode);
  document.body.style.overflow = 'hidden';
  // Focus first input
  setTimeout(() => {
    const input = modalEl.querySelector('input:not([type="hidden"])');
    if (input) input.focus();
  }, 100);
}

/** Close modal */
export function closeAuthModal() {
  if (!modalEl) return;
  modalEl.classList.remove('open');
  setTimeout(() => {
    if (modalEl.parentNode) modalEl.parentNode.removeChild(modalEl);
  }, 200);
  document.body.style.overflow = '';
  // Clear errors
  $$('.modal-error', modalEl).forEach(el => el.hidden = true);
}

/** Show error in form */
function showError(id, message) {
  const el = $(`#${id}`, modalEl);
  if (el) {
    el.textContent = message;
    el.hidden = false;
  }
}

/** Hide error */
function hideError(id) {
  const el = $(`#${id}`, modalEl);
  if (el) el.hidden = true;
}

/** Set loading state */
function setLoading(loading, formId = null) {
  const forms = formId ? [$(formId, modalEl)] : $$('form', modalEl);
  forms.forEach(form => {
    if (!form) return;
    const btn = $('button[type="submit"]', form);
    if (btn) {
      btn.disabled = loading;
      btn.textContent = loading ? 'Please wait...' : btn.dataset.originalText || 'Submit';
      if (!loading) btn.dataset.originalText = btn.textContent;
    }
    $$('input, button', form).forEach(el => el.disabled = loading);
  });
}

/** Toast notification */
function showToast(message, type = 'info') {
  const toast = h('div', { class: `toast toast-${type}` }, message);
  document.body.appendChild(toast);
  toast.offsetHeight;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 200);
  }, 3000);
}

// Add toast styles
if (!document.getElementById('toastStyles')) {
  const style = document.createElement('style');
  style.id = 'toastStyles';
  style.textContent = `
    .toast {
      position: fixed;
      bottom: 100px;
      left: 50%;
      transform: translateX(-50%) translateY(100px);
      padding: 12px 24px;
      background: var(--ink);
      color: var(--paper);
      border-radius: 999px;
      font-weight: 500;
      font-size: 14px;
      z-index: 200;
      opacity: 0;
      transition: transform .3s, opacity .3s;
      box-shadow: 0 12px 24px -12px rgba(0,0,0,.3);
    }
    .toast.show { transform: translateX(-50%) translateY(0); opacity: 1; }
    .toast-success { background: #2E7D32; }
    .toast-error { background: var(--accent); }
    @media (max-width: 480px) {
      .toast { left: 16px; right: 16px; transform: none; bottom: 90px; text-align: center; }
      .toast.show { transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
}

export default { createAuthModal, openAuthModal, closeAuthModal };