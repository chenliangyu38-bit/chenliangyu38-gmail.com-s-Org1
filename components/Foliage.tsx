import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CONFIG } from '../constants';
import { getScatterPosition, getTreePosition } from '../utils/geometry';
import { TreeTheme } from '../types';
import './FoliageMaterial'; // Registration

interface FoliageProps {
  progress: number; // 0 to 1
  theme: TreeTheme;
}

export const Foliage: React.FC<FoliageProps> = ({ progress, theme }) => {
  const materialRef = useRef<any>(null);

  // Generate Geometry Data - Re-runs if theme.id changes
  const { positions, scatterPos, treePos, randoms } = useMemo(() => {
    const count = CONFIG.FOLIAGE_COUNT;
    const positions = new Float32Array(count * 3);
    const scatterPos = new Float32Array(count * 3);
    const treePos = new Float32Array(count * 3);
    const randoms = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // 1. Scatter Pos
      const sPos = getScatterPosition();
      scatterPos[i * 3] = sPos.x;
      scatterPos[i * 3 + 1] = sPos.y;
      scatterPos[i * 3 + 2] = sPos.z;

      // 2. Tree Pos
      // Distribute randomly along the height for density
      const ratio = Math.random();
      
      // Use Theme Parameters for shape
      const tPos = getTreePosition(
        ratio, 
        0, 
        theme.geometry.height, 
        theme.geometry.radiusBase, 
        theme.geometry.spiralLoops
      );
      
      // Add slight jitter to tree pos so it's not a perfect surface
      tPos.x += (Math.random() - 0.5) * 0.5;
      tPos.z += (Math.random() - 0.5) * 0.5;
      tPos.y += (Math.random() - 0.5) * 0.5;

      treePos[i * 3] = tPos.x;
      treePos[i * 3 + 1] = tPos.y;
      treePos[i * 3 + 2] = tPos.z;

      // 3. Random attribute for animation variation
      randoms[i] = Math.random();

      // Init positions
      positions[i * 3] = 0;
    }

    return { positions, scatterPos, treePos, randoms };
  }, [theme.id, theme.geometry.height, theme.geometry.radiusBase, theme.geometry.spiralLoops]);

  useFrame((state) => {
    if (materialRef.current) {
      // Pass time
      materialRef.current.uTime = state.clock.elapsedTime;
      
      // Smoothly interpolate the progress uniform
      const current = materialRef.current.uProgress;
      materialRef.current.uProgress = THREE.MathUtils.lerp(current, progress, 0.05);
      
      materialRef.current.uPixelRatio = Math.min(window.devicePixelRatio, 2);
    }
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aScatterPos"
          count={scatterPos.length / 3}
          array={scatterPos}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aTreePos"
          count={treePos.length / 3}
          array={treePos}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aRandom"
          count={randoms.length}
          array={randoms}
          itemSize={1}
        />
      </bufferGeometry>
      {/* @ts-ignore */}
      <foliageMaterialImpl
        ref={materialRef}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uColorBase={theme.colors.foliageBase}
        uColorTip={theme.colors.foliageTip}
      />
    </points>
  );
};