import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls, Environment, Lightformer, Stars } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import * as THREE from 'three';
import { Foliage } from './Foliage';
import { Ornaments } from './Ornaments';
import { TreeState } from '../constants';
import { TreeTheme } from '../types';

interface ExperienceProps {
  treeState: TreeState;
  theme: TreeTheme;
}

export const Experience: React.FC<ExperienceProps> = ({ treeState, theme }) => {
  const groupRef = useRef<THREE.Group>(null);

  // Determine target progress based on state
  const targetProgress = treeState === TreeState.TREE_SHAPE ? 1 : 0;

  useFrame((state) => {
    if (groupRef.current) {
      // Slowly rotate the entire tree/galaxy
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 2, 25]} fov={45} />
      <OrbitControls 
        enablePan={false} 
        minDistance={10} 
        maxDistance={40} 
        maxPolarAngle={Math.PI / 1.5}
        autoRotate={false} // We rotate the group instead
      />

      {/* Lighting System */}
      <ambientLight intensity={0.2} color="#001133" />
      <directionalLight position={[10, 10, 5]} intensity={2} color="#aaddff" castShadow />
      
      {/* Warm internal glow lights */}
      <pointLight position={[0, -2, 0]} intensity={5} distance={15} color="#ffaa00" decay={2} />
      <pointLight position={[0, 4, 0]} intensity={5} distance={15} color="#ffaa00" decay={2} />

      <group ref={groupRef}>
        <Foliage progress={targetProgress} theme={theme} />
        <Ornaments type="SPHERE" progress={targetProgress} theme={theme} />
        <Ornaments type="BOX" progress={targetProgress} theme={theme} />
        
        {/* Central Star - matches tip color */}
        <mesh position={[0, (theme.geometry.height / 2) + 0.5, 0]}>
           <octahedronGeometry args={[0.8, 0]} />
           <meshStandardMaterial 
              color={theme.colors.foliageTip} 
              emissive={theme.colors.foliageTip}
              emissiveIntensity={2}
              toneMapped={false} 
           />
        </mesh>
      </group>
      
      {/* Background Ambience */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      <Environment resolution={256}>
        <group rotation={[-Math.PI / 3, 0, 1]}>
          <Lightformer form="circle" intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={2} />
          <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={2} />
          <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={2} />
          <Lightformer form="rect" intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[10, 10, 1]} />
        </group>
      </Environment>

      <EffectComposer disableNormalPass>
        <Bloom 
          luminanceThreshold={1.1} 
          mipmapBlur 
          intensity={1.5} 
          radius={0.7} 
        />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
        <Noise opacity={0.02} />
      </EffectComposer>
    </>
  );
};