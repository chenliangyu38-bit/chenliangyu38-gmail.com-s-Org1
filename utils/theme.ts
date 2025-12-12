import * as THREE from 'three';
import { TreeTheme } from '../types';
import { CONFIG, COLORS } from '../constants';

// Simple hash function for seeding
const cyrb53 = (str: string, seed = 0) => {
  let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

const mulberry32 = (a: number) => {
  return function() {
    var t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

export const generateTheme = (wish: string): TreeTheme => {
  if (!wish) {
    // Default Theme
    return {
      id: 'default',
      colors: {
        foliageBase: COLORS.EMERALD_DEEP,
        foliageTip: COLORS.GOLD_METALLIC,
        ornamentSphere: COLORS.GOLD_METALLIC,
        ornamentBox: new THREE.Color('#8B0000'),
      },
      geometry: {
        height: CONFIG.TREE_HEIGHT,
        radiusBase: CONFIG.TREE_RADIUS_BASE,
        spiralLoops: 20,
      }
    };
  }

  const seed = cyrb53(wish);
  const random = mulberry32(seed);

  // Palettes
  const palettes = [
    { name: 'Classic', base: '#001a10', tip: '#FFD700', sphere: '#FFD700', box: '#8B0000' },
    { name: 'Frozen', base: '#001133', tip: '#aaddff', sphere: '#ffffff', box: '#004488' },
    { name: 'Romance', base: '#1a0010', tip: '#ffbbaa', sphere: '#ff88aa', box: '#550022' },
    { name: 'Mystery', base: '#110022', tip: '#cc88ff', sphere: '#aa00ff', box: '#440066' },
    { name: 'Sunset', base: '#220a00', tip: '#ffaa00', sphere: '#ff5500', box: '#661100' },
  ];

  const paletteIndex = Math.floor(random() * palettes.length);
  const p = palettes[paletteIndex];

  // Randomize Geometry
  // Height: 10 to 16
  const height = 10 + random() * 6;
  // Radius: 3 to 6
  const radiusBase = 3 + random() * 3;
  // Loops: 10 to 40 (tighter vs loose spirals)
  const spiralLoops = 10 + Math.floor(random() * 30);

  return {
    id: wish,
    colors: {
      foliageBase: new THREE.Color(p.base),
      foliageTip: new THREE.Color(p.tip),
      ornamentSphere: new THREE.Color(p.sphere),
      ornamentBox: new THREE.Color(p.box),
    },
    geometry: {
      height,
      radiusBase,
      spiralLoops,
    }
  };
};