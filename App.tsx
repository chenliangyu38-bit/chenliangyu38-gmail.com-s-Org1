import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Experience } from './components/Experience';
import { UI } from './components/UI';
import { TreeState } from './constants';
import { Loader } from '@react-three/drei';
import { generateTheme } from './utils/theme';
import { TreeTheme } from './types';

const App: React.FC = () => {
  const [treeState, setTreeState] = useState<TreeState>(TreeState.TREE_SHAPE);
  const [currentTheme, setCurrentTheme] = useState<TreeTheme>(generateTheme(''));

  const toggleState = () => {
    setTreeState((prev) => 
      prev === TreeState.SCATTERED ? TreeState.TREE_SHAPE : TreeState.SCATTERED
    );
  };

  const handleWishSubmit = (wish: string) => {
    const newTheme = generateTheme(wish);
    setCurrentTheme(newTheme);
    // Automatically summon tree if scattered to show the effect
    if (treeState === TreeState.SCATTERED) {
      setTreeState(TreeState.TREE_SHAPE);
    }
  };

  return (
    <div className="w-full h-screen relative bg-black">
      
      <UI 
        currentState={treeState} 
        onToggle={toggleState} 
        onWishSubmit={handleWishSubmit}
      />

      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ 
          antialias: false,
          toneMapping: 3, // ACESFilmicToneMapping
          toneMappingExposure: 1.2
        }}
      >
        <color attach="background" args={['#000502']} />
        <Experience treeState={treeState} theme={currentTheme} />
      </Canvas>
      
      <Loader 
        containerStyles={{ background: '#000502' }}
        innerStyles={{ width: '200px', height: '2px', background: '#034d35' }}
        barStyles={{ background: '#FFD700', height: '2px' }}
        dataStyles={{ fontFamily: 'Inter', color: '#FFD700', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em' }}
      />
    </div>
  );
};

export default App;