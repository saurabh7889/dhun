/* ==========================================================================
   DHUN — Generated Cover Art (exact from original)
   ========================================================================== */

const ART_STYLES = ['sun', 'arch', 'rings', 'blocks', 'stripes'];

const STYLE_PALETTES = {
  sun: [
    ['#1B1464', '#F25C2A', '#FFD25E'],
    ['#0D3B66', '#FAA43A', '#F4D35E'],
    ['#2B1B4F', '#E84545', '#FFB563'],
    ['#1A1A2E', '#E94560', '#FFD700']
  ],
  arch: [
    ['#0F3D3E', '#E8A33D', '#F4E3C1'],
    ['#143A2B', '#C5E063', '#F4F1DE'],
    ['#0B2D2E', '#D4A843', '#E8D5B7'],
    ['#0F2B2B', '#C9B85A', '#F5E9C8']
  ],
  rings: [
    ['#F2C6D0', '#7A2E4B', '#2B2A4C'],
    ['#E8B4C0', '#6B2440', '#1E1D3A'],
    ['#F5D0D8', '#8B3A5C', '#3A3558'],
    ['#F0CAD5', '#9C4A6D', '#2E2A4E']
  ],
  blocks: [
    ['#FF5A7A', '#2D1E5F', '#FFD1DC'],
    ['#E84A6A', '#1E184A', '#E8C0CC'],
    ['#FF6B8A', '#3A2A6F', '#FFE0EB'],
    ['#F05A70', '#251A55', '#F5D5E0']
  ],
  stripes: [
    ['#0B2545', '#13A89E', '#EEF4ED'],
    ['#111114', '#E23B2E', '#EBEBE6'],
    ['#0A1F3A', '#0FA394', '#E0ECE8'],
    ['#0F1419', '#FF4A59', '#ECEAE4']
  ]
};

/** Get random palette for a style */
function getRandomPalette(style) {
  const palettes = STYLE_PALETTES[style] || STYLE_PALETTES.sun;
  return palettes[Math.floor(Math.random() * palettes.length)];
}

/** Generate SVG cover art as data URL */
export function generateCoverArt(style, customPalette = null) {
  const k = ART_STYLES.includes(style) ? style : ART_STYLES[Math.floor(Math.random() * ART_STYLES.length)];
  const c = customPalette || getRandomPalette(k);
  const a = c[0], b = c[1], d = c[2];
  let s = '';

  if (k === 'sun') {
    s = `<rect width="200" height="200" fill="${a}"/><circle cx="100" cy="92" r="58" fill="${b}"/><rect y="118" width="200" height="82" fill="${a}"/><circle cx="100" cy="92" r="32" fill="${d}"/><rect y="132" width="200" height="6" fill="${b}"/><rect y="148" width="200" height="4" fill="${b}"/>`;
  } else if (k === 'arch') {
    s = `<rect width="200" height="200" fill="${a}"/><path d="M30 200V96a70 70 0 0 1 140 0v104z" fill="${b}"/><path d="M60 200V98a40 40 0 0 1 80 0v102z" fill="${d}"/><circle cx="100" cy="94" r="14" fill="${a}"/>`;
  } else if (k === 'rings') {
    s = `<rect width="200" height="200" fill="${a}"/><circle cx="70" cy="130" r="120" fill="${b}"/><circle cx="70" cy="130" r="88" fill="${a}"/><circle cx="70" cy="130" r="56" fill="${d}"/><circle cx="70" cy="130" r="24" fill="${b}"/>`;
  } else if (k === 'blocks') {
    s = `<rect width="200" height="200" fill="${a}"/><path d="M0 100a100 100 0 0 1 100-100v100z" fill="${b}"/><path d="M200 100a100 100 0 0 1-100 100V100z" fill="${d}"/><path d="M100 100a50 50 0 0 1 50-50 50 50 0 0 1 0 100z" fill="${a}" opacity=".0"/><circle cx="150" cy="50" r="38" fill="${d}"/><circle cx="50" cy="150" r="38" fill="${b}"/>`;
  } else { // stripes
    s = `<rect width="200" height="200" fill="${a}"/><g fill="none" stroke-width="16"><circle cx="40" cy="-10" r="60" stroke="${b}"/><circle cx="40" cy="-10" r="90" stroke="${d}"/><circle cx="40" cy="-10" r="120" stroke="${b}"/><circle cx="40" cy="-10" r="150" stroke="${d}"/><circle cx="40" cy="-10" r="180" stroke="${b}"/><circle cx="40" cy="-10" r="210" stroke="${d}"/></g>`;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice">${s}</svg>`;
  return `url('data:image/svg+xml,${encodeURIComponent(svg).replace(/'/g, '%27')}')`;
}

/** Get consistent art for a given seed (track/album ID) */
export function getConsistentArt(seed, customPalette = null) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0;
  }
  const styleIndex = Math.abs(hash) % ART_STYLES.length;
  const style = ART_STYLES[styleIndex];
  return { style, css: generateCoverArt(style, customPalette), glow: customPalette ? customPalette[1] : getRandomPalette(style)[1] };
}

/** Predefined album arts (matching original DHUN) */
export const ALBUM_ARTS = {
  'sun': { style: 'sun', css: generateCoverArt('sun', ['#1B1464', '#F25C2A', '#FFD25E']), glow: '#F25C2A' },
  'arch': { style: 'arch', css: generateCoverArt('arch', ['#0F3D3E', '#E8A33D', '#F4E3C1']), glow: '#E8A33D' },
  'rings': { style: 'rings', css: generateCoverArt('rings', ['#F2C6D0', '#7A2E4B', '#2B2A4C']), glow: '#7A2E4B' },
  'blocks': { style: 'blocks', css: generateCoverArt('blocks', ['#FF5A7A', '#2D1E5F', '#FFD1DC']), glow: '#2D1E5F' },
  'stripes': { style: 'stripes', css: generateCoverArt('stripes', ['#0B2545', '#13A89E', '#EEF4ED']), glow: '#13A89E' }
};

/** Get art for album by key (from original data) */
export function getAlbumArt(key, customColors = null) {
  if (ALBUM_ARTS[key]) {
    const base = ALBUM_ARTS[key];
    if (customColors) {
      return { ...base, css: generateCoverArt(base.style, customColors), glow: customColors[1] };
    }
    return base;
  }
  return getConsistentArt(key);
}

/** Mood gradients (matching original) */
export const MOOD_GRADIENTS = {
  baarish: '#1E5F74',
  'night-drive': '#C2410C',
  focus: '#2B2A5C',
  chai: '#B0214F'
};

/** Mood labels (matching original) */
export const MOODS = [
  { n: 'Rain', d: 'बारिश', bg: '#1E5F74', q: 'baarish' },
  { n: 'Journey', d: 'सफ़र', bg: '#C2410C', q: 'night-drive' },
  { n: 'Night', d: 'रात', bg: '#2B2A5C', q: 'focus' },
  { n: 'Romance', d: 'इश्क़', bg: '#B0214F', q: 'chai' }
];