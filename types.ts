import * as THREE from 'three';

export interface PositionData {
  scatter: Float32Array;
  tree: Float32Array;
}

export interface OrnamentData {
  scatterPos: Float32Array;
  treePos: Float32Array;
  scales: Float32Array;
  rotationSpeeds: Float32Array;
}

export interface TreeTheme {
  id: string; // The wish string
  colors: {
    foliageBase: THREE.Color;
    foliageTip: THREE.Color;
    ornamentSphere: THREE.Color;
    ornamentBox: THREE.Color;
  };
  geometry: {
    height: number;
    radiusBase: number;
    spiralLoops: number;
  };
}