import * as THREE from 'three';
import { CONFIG } from '../constants';

/**
 * Generates random point inside a sphere
 */
export const getScatterPosition = (): THREE.Vector3 => {
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  const r = CONFIG.SCATTER_RADIUS * Math.cbrt(Math.random());
  
  return new THREE.Vector3(
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.sin(phi) * Math.sin(theta),
    r * Math.cos(phi)
  );
};

/**
 * Generates a point on a cone surface (spiral distribution)
 * Supports dynamic height and radius
 */
export const getTreePosition = (
  ratio: number, 
  yOffset: number = 0,
  height: number = CONFIG.TREE_HEIGHT,
  radiusBase: number = CONFIG.TREE_RADIUS_BASE,
  loops: number = 20
): THREE.Vector3 => {
  // height goes from -Half to +Half
  const h = height;
  const y = (ratio * h) - (h / 2) + yOffset;
  
  // Radius decreases as Y increases
  const r = ((h - (y + h/2)) / h) * radiusBase;
  
  // Golden Angle spiral or Custom Loops
  const theta = ratio * Math.PI * loops;
  
  const x = r * Math.cos(theta);
  const z = r * Math.sin(theta);
  
  return new THREE.Vector3(x, y, z);
};