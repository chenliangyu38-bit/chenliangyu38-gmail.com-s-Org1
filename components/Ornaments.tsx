import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CONFIG, COLORS } from '../constants';
import { getScatterPosition, getTreePosition } from '../utils/geometry';
import { TreeTheme } from '../types';

interface OrnamentsProps {
  progress: number;
  type: 'SPHERE' | 'BOX';
  theme: TreeTheme;
}

const dummy = new THREE.Object3D();
const tempVec = new THREE.Vector3();

export const Ornaments: React.FC<OrnamentsProps> = ({ progress, type, theme }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  // Configuration based on type
  const count = type === 'SPHERE' ? CONFIG.ORNAMENT_COUNT_SPHERES : CONFIG.ORNAMENT_COUNT_BOXES;
  const geometry = useMemo(() => {
    if (type === 'SPHERE') return new THREE.SphereGeometry(0.25, 32, 32);
    return new THREE.BoxGeometry(0.4, 0.4, 0.4);
  }, [type]);

  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: type === 'SPHERE' ? theme.colors.ornamentSphere : theme.colors.ornamentBox,
      roughness: type === 'SPHERE' ? 0.1 : 0.3,
      metalness: type === 'SPHERE' ? 1.0 : 0.4,
      emissive: type === 'SPHERE' ? theme.colors.ornamentSphere : new THREE.Color('#220000'),
      emissiveIntensity: 0.2,
    });
  }, [type, theme.id]); // Re-create material on theme change

  // Data Generation
  const data = useMemo(() => {
    const scatterPos = new Float32Array(count * 3);
    const treePos = new Float32Array(count * 3);
    const rotationSpeeds = new Float32Array(count * 3);
    const scales = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Scatter
      const s = getScatterPosition();
      scatterPos[i * 3] = s.x;
      scatterPos[i * 3 + 1] = s.y;
      scatterPos[i * 3 + 2] = s.z;

      // Tree Position
      const ratio = Math.random(); 
      const adjustedRatio = type === 'BOX' ? Math.pow(ratio, 1.5) : ratio;
      
      const t = getTreePosition(
        adjustedRatio,
        0,
        theme.geometry.height,
        theme.geometry.radiusBase,
        theme.geometry.spiralLoops
      );
      
      // Push outward slightly based on cone radius calculation
      const h = theme.geometry.height;
      const yNorm = (t.y + h/2) / h; // 0 to 1
      const radiusAtY = (1 - yNorm) * theme.geometry.radiusBase;
      
      const angle = Math.atan2(t.z, t.x) + (Math.random() - 0.5);
      const r = radiusAtY + (Math.random() * 0.5); // Push out
      
      treePos[i * 3] = r * Math.cos(angle);
      treePos[i * 3 + 1] = t.y;
      treePos[i * 3 + 2] = r * Math.sin(angle);

      // Random Rotation Speeds
      rotationSpeeds[i * 3] = (Math.random() - 0.5) * 2;
      rotationSpeeds[i * 3 + 1] = (Math.random() - 0.5) * 2;
      rotationSpeeds[i * 3 + 2] = (Math.random() - 0.5) * 2;

      // Scales
      scales[i] = 0.5 + Math.random() * 1.0;
    }
    return { scatterPos, treePos, rotationSpeeds, scales };
  }, [count, type, theme.id, theme.geometry]);

  // Animation Loop
  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.elapsedTime;
    
    if (meshRef.current.userData.currentProgress === undefined) {
      meshRef.current.userData.currentProgress = 0;
    }
    
    const targetProgress = progress;
    const currentProgress = THREE.MathUtils.lerp(
      meshRef.current.userData.currentProgress,
      targetProgress,
      0.04 
    );
    meshRef.current.userData.currentProgress = currentProgress;

    const t = currentProgress;
    const easeT = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    for (let i = 0; i < count; i++) {
      const sx = data.scatterPos[i * 3];
      const sy = data.scatterPos[i * 3 + 1];
      const sz = data.scatterPos[i * 3 + 2];

      const tx = data.treePos[i * 3];
      const ty = data.treePos[i * 3 + 1];
      const tz = data.treePos[i * 3 + 2];

      tempVec.set(sx, sy, sz).lerp(new THREE.Vector3(tx, ty, tz), easeT);

      if (t < 0.9) {
        const floatFactor = 1.0 - t;
        tempVec.y += Math.sin(time + i) * 0.5 * floatFactor;
        tempVec.x += Math.cos(time * 0.5 + i) * 0.3 * floatFactor;
      }

      dummy.position.copy(tempVec);

      const rx = data.rotationSpeeds[i * 3] * time;
      const ry = data.rotationSpeeds[i * 3 + 1] * time;
      
      if (t < 0.8) {
         dummy.rotation.set(rx, ry, rx);
      } else {
         dummy.rotation.set(
            THREE.MathUtils.lerp(rx, 0, easeT), 
            ry, 
            THREE.MathUtils.lerp(rx, 0, easeT)
         );
      }

      dummy.scale.setScalar(data.scales[i]);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, count]}
      castShadow
      receiveShadow
    />
  );
};