import * as THREE from 'three';

export const COLORS = {
  EMERALD_DEEP: new THREE.Color('#001a10'),
  EMERALD_LIGHT: new THREE.Color('#034d35'),
  GOLD_METALLIC: new THREE.Color('#FFD700'),
  GOLD_ROSE: new THREE.Color('#E0BFB8'),
  WHITE_WARM: new THREE.Color('#FFF5E1'),
};

export const CONFIG = {
  FOLIAGE_COUNT: 4500,
  ORNAMENT_COUNT_SPHERES: 150,
  ORNAMENT_COUNT_BOXES: 60,
  TREE_HEIGHT: 12,
  TREE_RADIUS_BASE: 4.5,
  SCATTER_RADIUS: 25,
};

export enum TreeState {
  SCATTERED = 'SCATTERED',
  TREE_SHAPE = 'TREE_SHAPE',
}