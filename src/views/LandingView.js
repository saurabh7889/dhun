/* ==========================================================================
   DHUN — Landing View (exact from original DHUN.html)
   ========================================================================== */

import { getIcon } from '../utils/icons.js';
import { $, $$, h } from '../utils/format.js';
import { navigate } from '../router/index.js';
import { openAuthModal } from '../components/AuthModal.js';
import { authStore } from '../store/index.js';

let landingEl = null;
let lringEl = null;
let lvinylEl = null;
let clockEl = null;
let trackEl = null;
let flowEl = null;
let fcs = [];
let lastFc = -1;
let reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Create landing page (matches original exactly) */
export function createLandingView() {
  landingEl = h('div', { id: 'landing' }, [
    // Landing nav
    h('header', { class: 'l-nav' }, [
      h('div', { class: 'logo' }, ['DHUN', h('i', {}, 'धुन')]),
      h('div', { class: 'right' }, [
        h('button', { class: 'lnk', 'data-go': 'flow' }, 'Sound'),
        h('button', { class: 'lnk', 'data-go': 'feat' }, 'Features'),
        h('button', { class: 'icon-btn', 'data-theme-toggle': true, 'aria-label': 'Switch theme' }, getIcon('theme')),
        h('button', { class: 'auth-nav-btn', id: 'landingAuthBtn' }, 'Sign In'),
        h('a', { class: 'btn', href: '#home' }, 'Open DHUN')
      ])
    ]),

    // Stage with vinyl
    h('section', { class: 'stage', id: 'stage' }, [
      h('div', { class: 'stage-in' }, [
        h('div', { class: 'rec', id: 'rec' }, [
          h('div', { class: 'vwrap' }, [
            h('div', { class: 'vinyl', id: 'lvinyl' }, [
              h('div', { class: 'label' }, [
                h('svg', { viewBox: '0 0 24 24', fill: 'currentColor' }, [
                  h('rect', { x: '3', y: '9', width: '3.4', height: '9', rx: '1' }),
                  h('rect', { x: '8.4', y: '4', width: '3.4', height: '14', rx: '1' }),
                  h('rect', { x: '13.8', y: '7', width: '3.4', height: '11', rx: '1' }),
                  h('rect', { x: '19.2', y: '11', width: '3.4', height: '7', rx: '1' })
                ])
              ])
            ]),
            h('div', { class: 'sheen' })
          ]),
          h('svg', { class: 'ring', viewBox: '0 0 100 100', id: 'lring', 'aria-hidden': 'true' }, [
            h('circle', { class: 'trk', cx: '50', cy: '50', r: '50' }),
            h('circle', { class: 'arc', cx: '50', cy: '50', r: '50', pathLength: '100', transform: 'rotate(-90 50 50)', 'stroke-dasharray': '0 100' }),
            h('circle', { class: 'knob', r: '1.5' })
          ])
        ]),

        // Phase 1 - Hero
        h('div', { class: 'phase p1', id: 'p1' }, [
          h('h1', { class: 'word', 'aria-label': 'DHUN' }, [
            h('span', {}, 'D'),
            h('span', {}, 'H'),
            h('span', {}, 'U'),
            h('span', {}, 'N')
          ]),
          h('p', { class: 'word-d', lang: 'hi' }, 'धुन'),
          h('p', { class: 'sub' }, 'Indie, film, ghazal, lo-fi. Every language you hum in, in one place.'),
          h('div', { class: 'row' }, [
            h('a', { class: 'btn accent', href: '#home' }, 'Start listening'),
            h('span', { class: 'mono' }, 'Free to try. No card.')
          ])
        ]),

        // Phase 2 - Languages
        h('div', { class: 'phase p2', id: 'p2' }, [
          h('h2', { class: 'big' }, 'Hindi.<br>Tamil.<br>Punjabi.<br><em>Bangla.</em>'),
          h('p', { class: 'note' }, 'Songs from Mumbai bedrooms, Chennai studios and Kolkata rooftops sit next to each other. Search by language, mood or the line you remember.')
        ]),

        // Phase 3 - Popular
        h('div', { class: 'phase p3', id: 'p3' }, [
          h('div', { class: 'pop-h' }, 'Popular right now'),
          h('div', { class: 'list', id: 'lpop' })
        ]),

        // Clock
        h('div', { class: 'clock', id: 'clock' }, [
            h('b', {}, '0:00'),
            h('span', {}, ' / 3:42')
        ])
      ])
    ]),

    // Flow / Coverflow
    h('section', { class: 'flow', id: 'flow' }, [
      h('div', { class: 'flow-in' }, [
        h('div', { class: 'flow-h' }, [
          h('h2', {}, 'New this week'),
          h('p', {}, 'Keep scrolling to turn the shelf. Tap a cover to play it.')
        ]),
        h('div', { class: 'track', id: 'track' }),
        h('div', { class: 'flow-cap' }, [
            h('b', { id: 'fcT' }, 'Sitar Wave'),
            h('span', { id: 'fcS' }, 'Raag Circuit')
        ])
      ])
    ]),

    // Features
    h('section', { class: 'feat', id: 'feat' }, [
      h('h2', {}, 'What you get'),
      h('div', { class: 'frow' }, [
        h('h3', {}, 'The player takes the colour of the cover'),
        h('p', {}, 'Open Now Playing and the whole screen glows in the album\'s palette. Skip a track and the room changes with it.')
      ]),
      h('div', { class: 'frow' }, [
        h('h3', {}, 'Search by mood and language'),
        h('p', {}, 'Type "rain" or pick Tamil. Results group into tracks, artists and albums as you type, with the language shown next to each one.')
      ]),
      h('div', { class: 'frow' }, [
        h('h3', {}, 'One queue that stays put'),
        h('p', {}, 'Browse artists, albums and playlists while the music keeps playing. Add to the queue from any list and see what comes next in one tap.')
      ]),
      h('div', { class: 'frow' }, [
        h('h3', {}, 'Made to be read, too'),
        h('p', {}, 'Large type, plain labels and light and dark themes that hold the same contrast. Everything works on a phone with one thumb.')
      ])
    ]),

    // Close
    h('section', { class: 'close', id: 'close' }, [
      h('h2', { class: 'big' }, 'Press<br>play.'),
      h('div', { style: 'display:flex;gap:14px;align-items:center;flex-wrap:wrap' }, [
        h('a', { class: 'btn accent', href: '#home' }, 'Open DHUN'),
        h('span', { class: 'mono', style: 'color:var(--ink-2)' }, 'Works in your browser. Nothing to install.')
      ]),
      h('div', { class: 'foot' }, [
        h('span', {}, 'DHUN, a tune that stays'),
        h('span', {}, 'Hindi, Tamil, Punjabi, Bangla and more')
      ])
    ])
  ]);

  // Cache elements
  lringEl = $('#lring', landingEl);
  lvinylEl = $('#lvinyl', landingEl);
  clockEl = $('#clock b', landingEl);
  trackEl = $('#track', landingEl);
  flowEl = $('#flow', landingEl);

  // Add styles
  addLandingStyles();

  // Attach listeners
  attachLandingListeners();

  // Initialize coverflow
  initCoverflow();

  // Initial popular tracks
  renderPopular();

  return landingEl;
}

/** Add landing styles (from original) */
function addLandingStyles() {
  if (document.getElementById('landingViewStyles')) return;

  const style = document.createElement('style');
  style.id = 'landingViewStyles';
  style.textContent = `
    /* Landing specific styles */
    #landing { position: relative; }
    .l-nav {
      position: fixed;
      top: env(safe-area-inset-top, 0px);
      left: 0; right: 0; z-index: 20;
      display: flex; align-items: center; justify-content: space-between;
      padding: 18px max(16px, env(safe-area-inset-right, 0px)) 18px var(--gut);
      mix-blend-mode: normal;
    }
    .logo { font-weight: 800; font-stretch: 75%; letter-spacing: -.02em; font-size: 22px; display: flex; align-items: baseline; gap: 8px; }
    .l-nav.on-rec .logo, .l-nav.on-rec .logo i { color: #fff; }
    .logo i { font-style: normal; font-family: var(--deva); font-size: 15px; color: var(--accent); font-weight: 700; }
    .l-nav .right { display: flex; align-items: center; gap: 20px; }
    .l-nav .lnk { font-family: var(--mono); font-size: 12px; text-transform: uppercase; letter-spacing: .06em; }

    .stage { height: 430vh; position: relative; }
    .stage-in { position: sticky; top: 0; height: 100vh; height: 100svh; overflow: hidden; }
    .rec { --S: min(98svh, 64vw); position: absolute; width: var(--S); height: var(--S); left: calc(var(--S)*-.43); top: 50%; margin-top: calc(var(--S)*-.5); }
    .vwrap { position: absolute; inset: 0; }
    .vinyl { position: absolute; inset: 0; border-radius: 50%; background: repeating-radial-gradient(circle at 50% 50%, #0b0b0c 0 2px, #151517 2px 3px), #0b0b0c; will-change: transform; }
    .sheen { position: absolute; inset: 0; border-radius: 50%; pointer-events: none; background: conic-gradient(from 25deg, transparent 0 16%, rgba(255,255,255,.13) 23%, transparent 31% 66%, rgba(255,255,255,.09) 73%, transparent 81%); }
    .label { position: absolute; inset: 34%; border-radius: 50%; background: var(--paper); display: grid; place-items: center; box-shadow: 0 0 0 6px rgba(255,255,255,.05); }
    .label svg { width: 34%; height: 34%; color: var(--accent); }
    .ring { position: absolute; inset: -2.4%; width: 104.8%; height: 104.8%; overflow: visible; }
    .ring .trk { fill: none; stroke: var(--line); stroke-width: .35; }
    .ring .arc { fill: none; stroke: var(--accent); stroke-width: .5; stroke-linecap: round; }
    .ring .knob { fill: var(--accent); stroke: var(--paper); stroke-width: .9; }
    .clock { color: #fff; position: absolute; left: max(16px, env(safe-area-inset-left, 0px)); bottom: max(20px, env(safe-area-inset-bottom, 0px)); font-family: var(--mono); font-size: 13px; }
    .clock b { font-weight: 500; }
    .phase { position: absolute; inset: 0; pointer-events: none; will-change: opacity, transform; }
    .phase > * { pointer-events: auto; }
    .p1 { display: flex; flex-direction: column; justify-content: center; padding-left: calc(var(--S, 0px) + 2vw); padding-right: max(16px, env(safe-area-inset-right, 0px)); }
    .rec ~ .phase { --S: min(98svh, 64vw); }
    .p1 { padding-left: calc(min(98svh, 64vw)*.57 + 4vw); }
    .word { font-weight: 800; font-stretch: 75%; text-transform: uppercase; line-height: .78; letter-spacing: -.045em; font-size: min(23vw, 43svh, 330px); margin: 0; display: flex; }
    .word span { display: inline-block; animation: rise .9s cubic-bezier(.2,.8,.2,1) both; }
    .word span:nth-child(2) { animation-delay: .06s; }
    .word span:nth-child(3) { animation-delay: .12s; }
    .word span:nth-child(4) { animation-delay: .18s; }
    @keyframes rise { from { transform: translateY(40%); opacity: 0; } to { transform: none; opacity: 1; } }
    .word-d { font-family: var(--deva); font-weight: 800; color: var(--accent); font-size: min(12vw, 20svh, 170px); line-height: 1.25; margin: 0 0 0 .04em; }
    .p1 .sub { margin: 18px 0 26px; max-width: 36ch; color: var(--ink-2); font-size: 16px; }
    .p1 .row { display: flex; gap: 14px; align-items: center; flex-wrap: wrap; }
    .p2, .p3 { display: flex; flex-direction: column; justify-content: center; padding-left: calc(min(98svh, 64vw)*.57 + 5vw); padding-right: max(16px, env(safe-area-inset-right, 0px)); }
    .big { font-weight: 700; font-stretch: 75%; letter-spacing: -.035em; line-height: .92; font-size: min(10.5vw, 17svh, 150px); margin: 0; }
    .big em { font-style: normal; color: var(--accent); }
    .p2 .note { margin-top: 22px; max-width: 40ch; color: var(--ink-2); }
    .pop-h { font-family: var(--mono); font-size: 13px; color: var(--accent); margin-bottom: 14px; }
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
    .trow .lk { width: 30px; height: 30px; display: grid; place-items: center; border-radius: 50%; color: var(--ink-2); }
    .trow .lk svg { width: 16px; height: 16px; }

    /* Coverflow */
    .flow { height: 300vh; position: relative; }
    .flow-in { position: sticky; top: 0; height: 100svh; overflow: hidden; display: flex; flex-direction: column; justify-content: center; perspective: 1500px; }
    .flow-h { position: absolute; top: calc(88px + env(safe-area-inset-top, 0px)); left: var(--gut); right: var(--gut); display: flex; justify-content: space-between; align-items: flex-end; gap: 20px; }
    .flow-h h2 { margin: 0; font-weight: 700; font-stretch: 75%; letter-spacing: -.035em; line-height: .92; font-size: min(9vw, 13svh, 120px); }
    .flow-h p { margin: 0; max-width: 26ch; color: var(--ink-2); text-align: right; }
    .track { position: relative; height: min(34vw, 44svh); margin-top: 8svh; transform-style: preserve-3d; }
    .fc { position: absolute; left: 50%; top: 50%; width: min(34vw, 44svh); height: min(34vw, 44svh); margin: calc(min(34vw, 44svh)/-2) 0 0 calc(min(34vw, 44svh)/-2); border-radius: 10px; box-shadow: 0 30px 60px -30px var(--c, #000); cursor: pointer; will-change: transform, opacity; }
    .flow-cap { position: absolute; bottom: max(34px, env(safe-area-inset-bottom, 0px)); left: 0; right: 0; text-align: center; }
    .flow-cap b { display: block; font-weight: 700; font-stretch: 75%; font-size: 28px; letter-spacing: -.02em; }
    .flow-cap span { font-family: var(--mono); font-size: 12px; color: var(--ink-2); }

    /* Features */
    .feat { padding: 14vh var(--gut) 10vh; max-width: 1400px; margin: 0 auto; }
    .feat h2 { margin: 0 0 7vh; font-weight: 700; font-stretch: 75%; letter-spacing: -.035em; line-height: .92; font-size: min(11vw, 150px); }
    .frow { display: grid; grid-template-columns: 1.1fr 1fr; gap: 5vw; padding: 34px 0; border-top: 1px solid var(--line); align-items: start; }
    .frow h3 { margin: 0; font-weight: 700; font-stretch: 75%; letter-spacing: -.03em; font-size: clamp(30px, 4.4vw, 60px); line-height: .98; }
    .frow p { margin: 0; color: var(--ink-2); max-width: 46ch; font-size: 16px; }

    /* Close */
    .close { padding: 12vh var(--gut) 8vh; text-align: left; position: relative; overflow: hidden; min-height: 90svh; display: flex; flex-direction: column; justify-content: flex-end; gap: 32px; }
    .close .big { font-size: min(30vw, 36svh, 420px); line-height: .8; padding-bottom: .14em; }
    .foot { display: flex; justify-content: space-between; gap: 18px; flex-wrap: wrap; font-family: var(--mono); font-size: 12px; color: var(--ink-2); border-top: 1px solid var(--line); padding-top: 18px; }

    /* Mobile */
    @media (max-width: 860px) {
      .l-nav .lnk { display: none; }
      .rec { --S: 150vw; left: -25vw; top: auto; bottom: calc(var(--S)*-.47); margin-top: 0; }
      .rec ~ .phase { --S: 150vw; }
      .p1, .p2, .p3 { padding: calc(76px + env(safe-area-inset-top, 0px)) var(--gut) 0 var(--gut); justify-content: flex-start; }
      .p1 { padding-left: var(--gut); }
      .word { font-size: min(36vw, 26svh); }
      .word-d { font-size: min(19vw, 13svh); }
      .big { font-size: min(17vw, 12svh); }
      .p3 .trow { grid-template-columns: 24px 40px 1fr auto; }
      .p3 .trow .lk { display: none; }
      .clock { left: auto; right: var(--gut); bottom: max(14px, env(safe-area-inset-bottom, 0px)); }
      .flow-h { flex-direction: column; align-items: flex-start; }
      .flow-h p { text-align: left; }
      .track { height: 62vw; }
      .fc { width: 58vw; height: 58vw; margin: -29vw 0 0 -29vw; }
      .frow { grid-template-columns: 1fr; gap: 12px; }
    }
  `;
  document.head.appendChild(style);
}

/** Attach event listeners */
function attachLandingListeners() {
  // Auth button in landing header
  const authBtn = $('#landingAuthBtn', landingEl);
  if (authBtn) {
    const updateLandingAuth = (state) => {
      const { isAuthenticated, user } = state;
      if (isAuthenticated && user) {
        const name = user.user_metadata?.display_name || user.email?.split('@')[0] || 'Member';
        authBtn.textContent = name;
        authBtn.title = 'Account';
      } else {
        authBtn.textContent = 'Sign In';
        authBtn.title = 'Sign In';
      }
    };
    authBtn.addEventListener('click', () => {
      const { isAuthenticated } = authStore.get();
      if (isAuthenticated) {
        navigate('home');
      } else {
        openAuthModal('login');
      }
    });
    authStore.subscribe(updateLandingAuth);
    updateLandingAuth(authStore.get());
  }

  // Smooth scroll nav
  $$('[data-go]', landingEl).forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-go');
      const target = $(`#${targetId}`, landingEl);
      if (target) {
        window.scrollTo({ top: target.offsetTop, behavior: reduceMotion ? 'auto' : 'smooth' });
      }
    });
  });

  // Theme toggles
  $$('[data-theme-toggle]', landingEl).forEach(btn => {
    btn.addEventListener('click', () => {
      const html = document.documentElement;
      const current = html.getAttribute('data-theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const isDarkMode = current === 'dark' || (!current && prefersDark);
      const next = isDarkMode ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('dhun-theme', next);
    });
  });

  // Scroll handler
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
}

/** Render popular tracks */
function renderPopular() {
  const container = $('#lpop', landingEl);
  if (!container) return;

  // Use mock data for now
  const POP = [
    { id: 't0-0', title: 'Neon Bhairavi', artist: 'Raag Circuit', art: '', duration: 252 },
    { id: 't1-0', title: 'Baarish Ke Baad', artist: 'Meera & The Monsoon', art: '', duration: 211 },
    { id: 't5-0', title: 'Backwater Blues', artist: 'Dev Nair Quartet', art: '', duration: 322 },
    { id: 't3-1', title: 'Dil Ka DM', artist: 'Kavya Sethi', art: '', duration: 199 }
  ];

  container.innerHTML = POP.map((t, i) => `
    <div class="trow" data-tid="${t.id}" role="button" tabindex="0" aria-label="Play ${t.title}">
      <span class="n">${String(i + 1).padStart(2, '0')}</span>
      <span class="eq"><i></i><i></i><i></i></span>
      <span class="art cover" style="background-image:${t.art || 'var(--paper-2)'}"></span>
      <span style="min-width:0"><span class="t">${t.title}</span><span class="s">${t.artist}</span></span>
      <span class="d mono">${fmtTime(t.duration)}</span>
      <button class="lk" data-like="${t.id}" aria-label="Like">${getIcon('heart')}</button>
    </div>
  `).join('');

  // Bind track rows
  $$('.trow', container).forEach(row => {
    row.addEventListener('click', (e) => {
      if (e.target.closest('[data-like]')) return;
      const trackId = row.getAttribute('data-tid');
      navigate(`home`); // Will trigger app to load and play
      // Store track to play after app loads
      sessionStorage.setItem('dhun-autoplay', trackId);
    });
    row.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); row.click(); }
    });
  });
}

/** Init coverflow */
function initCoverflow() {
  const albums = [
    { id: 'al0', title: 'Sitar Wave', artist: 'Raag Circuit', year: 2025, art: '', glow: '#F25C2A' },
    { id: 'al1', title: 'Monsoon Letters', artist: 'Meera & The Monsoon', year: 2024, art: '', glow: '#E8A33D' },
    { id: 'al2', title: 'Slow Sunday', artist: 'Tanpura Club', year: 2025, art: '', glow: '#7A2E4B' },
    { id: 'al3', title: 'Hinglish Hearts', artist: 'Kavya Sethi', year: 2026, art: '', glow: '#2D1E5F' },
    { id: 'al4', title: 'Blue Hour', artist: 'Nilgiri Hours', year: 2024, art: '', glow: '#13A89E' },
    { id: 'al5', title: 'Kerala Standard Time', artist: 'Dev Nair Quartet', year: 2025, art: '', glow: '#C5E063' },
    { id: 'al6', title: 'Zero Night', artist: 'Raag Circuit', year: 2023, art: '', glow: '#E23B2E' },
    { id: 'al7', title: 'Open Windows', artist: 'Kavya Sethi', year: 2023, art: '', glow: '#FAA43A' }
  ];

  albums.forEach((a, i) => {
    const el = h('button', { class: 'fc cover', style: `background-image:${a.art || 'var(--paper-2)'};--c:${a.glow}`, 'aria-label': `${a.title} by ${a.artist}` });
    el.addEventListener('click', () => navigate(`album-${a.id}`));
    trackEl.appendChild(el);
    fcs.push(el);
  });
}

/** Scroll handler - matches original exactly */
function onScroll() {
  if (landingEl?.hidden) return;

  const stage = $('#stage', landingEl);
  if (!stage) return;

  const tot = stage.offsetHeight - innerHeight;
  const p = Math.min(1, Math.max(0, -stage.getBoundingClientRect().top / tot));

  // Ring progress
  setRingProgress(lringEl, p);

  // Nav blend
  const nr = stage.getBoundingClientRect();
  $('.l-nav', landingEl)?.classList.toggle('on-rec', innerWidth > 860 && nr.top <= 0 && nr.bottom > 60);

  // Vinyl rotation
  if (lvinylEl) {
    lvinylEl.style.transform = `rotate(${reduceMotion ? 0 : p * 1080}deg)`;
  }

  // Clock
  if (clockEl) clockEl.textContent = fmtTime(p * 222);

  // Phase animations
  setPhase($('#p1', landingEl), seg(p, -1, 0, .2, .29), -1);
  setPhase($('#p2', landingEl), seg(p, .27, .37, .55, .64), 1);
  setPhase($('#p3', landingEl), seg(p, .62, .72, 1.2, 1.3), 1);

  // Coverflow
  flowUpdate();
}

/** Helpers */
function seg(p, a, b, c, d) {
  return p < b ? Math.min(1, Math.max(0, (p - a) / (b - a))) : (p <= c ? 1 : Math.min(1, Math.max(0, 1 - (p - c) / (d - c))));
}

function setPhase(el, o, dir) {
  if (!el) return;
  el.style.opacity = o;
  el.style.transform = `translate3d(0,${(1 - o) * dir * 26}px,0)`;
  el.style.visibility = o < .01 ? 'hidden' : 'visible';
  el.style.pointerEvents = o > .6 ? 'auto' : 'none';
}

function setRingProgress(svg, f) {
  if (!svg) return;
  const arc = $('.arc', svg), kn = $('.knob', svg);
  arc.setAttribute('stroke-dasharray', `${Math.min(1, Math.max(0, f)) * 100} 100`);
  const a = f * Math.PI * 2 - Math.PI / 2;
  kn.setAttribute('cx', 50 + 50 * Math.cos(a));
  kn.setAttribute('cy', 50 + 50 * Math.sin(a));
}

function flowUpdate() {
  const r = flowEl.getBoundingClientRect();
  const tot = flowEl.offsetHeight - innerHeight;
  const p = Math.min(1, Math.max(0, -r.top / tot));
  if (r.bottom < -50 || r.top > innerHeight + 50) return;

  const pos = p * (fcs.length - 1);
  const w = trackEl.offsetWidth;
  const size = fcs[0]?.offsetWidth || 300;
  const gap = Math.min(size * .7, w * .22);

  fcs.forEach((el, i) => {
    const d = i - pos, ad = Math.abs(d);
    const rot = Math.min(62, Math.max(-62, d * -52));
    const z = -Math.min(ad, 3) * 90;
    const sc = 1 - Math.min(ad, 3) * .07;
    const op = 1 - Math.min(ad, 3.6) * .24;
    const x = d * gap + (d > 0 ? size * .3 : d < 0 ? -size * .3 : 0) * Math.min(ad, 1);
    el.style.transform = `translate3d(${x}px,0,${z}px) rotateY(${rot}deg) scale(${sc})`;
    el.style.opacity = op;
    el.style.zIndex = 100 - Math.round(ad * 10);
  });

  const n = Math.round(pos);
  if (n !== lastFc) {
    lastFc = n;
    const album = [{title: 'Sitar Wave', artist: 'Raag Circuit', year: 2025}][n] || {};
    $('#fcT', landingEl).textContent = album.title || 'Sitar Wave';
    $('#fcS', landingEl).textContent = `${album.artist || 'Raag Circuit'} · ${album.year || 2025}`;
  }
}

function fmtTime(s) {
  s = Math.max(0, Math.round(s));
  return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
}

/** Show/hide landing */
export function showLanding() {
  if (landingEl) {
    landingEl.hidden = false;
    // Re-attach scroll listener
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
}

export function hideLanding() {
  if (landingEl) {
    landingEl.hidden = true;
    window.removeEventListener('scroll', onScroll);
  }
}

export default { createLandingView, showLanding, hideLanding };