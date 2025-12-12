import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { extend } from '@react-three/fiber';

// Custom Shader Logic
// Vertex: Interpolates between scatter and tree positions based on uProgress
// Fragment: Draws a soft glowing circle with gold tinted edges

const FoliageMaterialImpl = shaderMaterial(
  {
    uTime: 0,
    uProgress: 0, // 0 = scatter, 1 = tree
    uColorBase: new THREE.Color('#002b1c'),
    uColorTip: new THREE.Color('#FFD700'),
    uPixelRatio: 1,
  },
  // Vertex Shader
  `
    uniform float uTime;
    uniform float uProgress;
    uniform float uPixelRatio;
    
    attribute vec3 aScatterPos;
    attribute vec3 aTreePos;
    attribute float aRandom;
    
    varying float vAlpha;
    varying float vRandom;

    // Cubic easing for smooth transition
    float easeInOutCubic(float x) {
      return x < 0.5 ? 4.0 * x * x * x : 1.0 - pow(-2.0 * x + 2.0, 3.0) / 2.0;
    }

    void main() {
      vRandom = aRandom;
      
      // Interpolate Position
      float t = easeInOutCubic(uProgress);
      vec3 pos = mix(aScatterPos, aTreePos, t);
      
      // Add "Breathing" / Wind effect
      // More chaotic in scatter mode, subtle shimmer in tree mode
      float noiseFreq = 2.0;
      float noiseAmp = mix(0.5, 0.05, t);
      pos.x += sin(uTime * noiseFreq + pos.y) * noiseAmp;
      pos.z += cos(uTime * noiseFreq + pos.x) * noiseAmp;
      pos.y += sin(uTime * 1.5 + aRandom * 10.0) * noiseAmp;

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      
      // Size attenuation
      // Particles are larger when scattered (fantasy dust), smaller/sharper when tree (needles)
      float baseSize = mix(80.0, 60.0, t); 
      gl_PointSize = baseSize * (1.0 + sin(uTime + aRandom * 10.0) * 0.3) * uPixelRatio / -mvPosition.z;
      
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  // Fragment Shader
  `
    uniform vec3 uColorBase;
    uniform vec3 uColorTip;
    varying float vRandom;

    void main() {
      // Circular particle
      vec2 center = gl_PointCoord - 0.5;
      float dist = length(center);
      if (dist > 0.5) discard;
      
      // Soft glow gradient (Gaussian-ish)
      float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
      alpha = pow(alpha, 1.5); // Sharpen center

      // Mix colors: Deep Green core, Gold edge/tip
      // Random variation per particle
      vec3 finalColor = mix(uColorBase, uColorTip, dist * 1.5 + vRandom * 0.2);
      
      // Boost alpha for bloom
      gl_FragColor = vec4(finalColor, alpha * 0.9);
      
      // Tone mapping fix (rudimentary)
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }
  `
);

extend({ FoliageMaterialImpl });

export { FoliageMaterialImpl };