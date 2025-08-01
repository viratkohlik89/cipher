import { useState, useEffect } from 'react';

export interface GameProgress {
  easy: number;
  medium: number;
  hard: number;
}

export interface GameState {
  currentMode: 'easy' | 'medium' | 'hard' | null;
  currentLevel: number;
  progress: GameProgress;
  isDarkMode: boolean;
  hintsUsed: Record<string, boolean>;
}

const defaultState: GameState = {
  currentMode: null,
  currentLevel: 1,
  progress: { easy: 0, medium: 0, hard: 0 },
  isDarkMode: true,
  hintsUsed: {}
};

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(defaultState);

  // Load state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('cipher-game-state');
    if (saved) {
      try {
        const parsedState = JSON.parse(saved);
        setGameState({ ...defaultState, ...parsedState });
      } catch (error) {
        console.error('Failed to parse saved game state:', error);
      }
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cipher-game-state', JSON.stringify(gameState));
  }, [gameState]);

  const setMode = (mode: 'easy' | 'medium' | 'hard') => {
    setGameState(prev => ({
      ...prev,
      currentMode: mode,
      currentLevel: Math.max(1, prev.progress[mode] + 1)
    }));
  };

  const unlockNextLevel = () => {
    setGameState(prev => {
      if (!prev.currentMode) return prev;
      
      // Only unlock next level if we're completing the current progress level
      // Don't unlock if we're just replaying an already completed level
      if (prev.currentLevel <= prev.progress[prev.currentMode]) {
        return prev; // Just replaying, don't change progress
      }
      
      const newProgress = {
        ...prev.progress,
        [prev.currentMode]: prev.progress[prev.currentMode] + 1
      };
      
      return {
        ...prev,
        progress: newProgress,
        currentLevel: prev.currentLevel + 1
      };
    });
  };

  const setLevel = (level: number) => {
    setGameState(prev => ({
      ...prev,
      currentLevel: level
    }));
  };

  const toggleDarkMode = () => {
    setGameState(prev => ({
      ...prev,
      isDarkMode: !prev.isDarkMode
    }));
  };

  const useHint = (puzzleId: string) => {
    setGameState(prev => ({
      ...prev,
      hintsUsed: {
        ...prev.hintsUsed,
        [puzzleId]: true
      }
    }));
  };

  const resetProgress = () => {
    setGameState(defaultState);
    localStorage.removeItem('cipher-game-state');
  };

  return {
    gameState,
    setMode,
    setLevel,
    unlockNextLevel,
    toggleDarkMode,
    useHint,
    resetProgress
  };
};