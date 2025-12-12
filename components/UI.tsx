import React, { useState } from 'react';
import { TreeState } from '../constants';

interface UIProps {
  currentState: TreeState;
  onToggle: () => void;
  onWishSubmit: (wish: string) => void;
}

export const UI: React.FC<UIProps> = ({ currentState, onToggle, onWishSubmit }) => {
  const isTree = currentState === TreeState.TREE_SHAPE;
  const [wish, setWish] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (wish.trim()) {
      onWishSubmit(wish);
      setSubmitted(true);
      setWish('');
      setTimeout(() => setSubmitted(false), 3000); // Reset visual state
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 md:p-8 z-10">
      {/* Header & Wish Module */}
      <div className="flex justify-between items-start w-full">
        {/* Branding */}
        <div className="pointer-events-auto">
            <h1 className="text-4xl md:text-6xl text-amber-100 font-serif-display tracking-widest drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">
            ARIX
            </h1>
            <p className="text-emerald-500 font-sans-body uppercase tracking-[0.3em] text-xs mt-2 font-bold">
            Signature Collection
            </p>
        </div>

        {/* Wish Input Module */}
        <div className="pointer-events-auto flex flex-col items-end gap-2 w-64 md:w-80">
          <label className="text-amber-100/90 font-serif-display text-sm md:text-base tracking-widest text-right drop-shadow-md">
            快来许下你的圣诞愿望吧
          </label>
          <form onSubmit={handleSubmit} className="relative w-full group">
            <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-md rounded-sm border border-amber-500/20 group-hover:border-amber-500/50 transition-colors" />
            <input 
              type="text" 
              value={wish}
              onChange={(e) => setWish(e.target.value)}
              placeholder="Make a wish..."
              className="relative w-full bg-transparent border-none outline-none px-4 py-3 text-amber-50 font-sans-body text-sm placeholder:text-emerald-500/50 text-right"
            />
            <button 
              type="submit"
              className="absolute left-1 top-1 bottom-1 px-3 flex items-center justify-center text-amber-400 hover:text-amber-200 transition-colors"
            >
              ★
            </button>
          </form>
          {submitted && (
            <div className="text-amber-300 text-xs font-serif-display tracking-widest animate-pulse">
              Wish Granted &bull; Tree Transformed
            </div>
          )}
        </div>
      </div>

      {/* Footer Controls */}
      <div className="flex flex-col items-center justify-end pb-4 md:pb-10 pointer-events-auto">
        <button
          onClick={onToggle}
          className={`
            group relative px-8 py-4 bg-black/40 backdrop-blur-md border border-amber-500/30 
            transition-all duration-700 ease-out hover:border-amber-400
            ${isTree ? 'bg-emerald-950/60' : ''}
          `}
        >
          <div className="absolute inset-0 bg-amber-500/10 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
          
          <span className="relative flex items-center gap-3 font-sans-body text-amber-50 uppercase tracking-widest text-sm font-light">
             <span className={`w-2 h-2 rounded-full ${isTree ? 'bg-emerald-400 shadow-[0_0_10px_#34d399]' : 'bg-amber-400 shadow-[0_0_10px_#fbbf24]'}`} />
             {isTree ? 'Release to Void' : 'Summon The Tree'}
          </span>
        </button>
        
        <p className="mt-4 text-emerald-700/60 text-[10px] tracking-widest uppercase">
          Interactive WebGL Experience
        </p>
      </div>
    </div>
  );
};