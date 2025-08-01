import { useState } from 'react';
import { Landing } from '../components/Landing';
import { ModeSelection } from '../components/ModeSelection';
import { LevelSelect } from '../components/LevelSelect';
import { PuzzleGame } from '../components/PuzzleGame';
import { useGameState } from '../hooks/useGameState';

type GameScreen = 'landing' | 'mode-select' | 'level-select' | 'game';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('landing');
  const { 
    gameState, 
    setMode, 
    setLevel, 
    unlockNextLevel, 
    toggleDarkMode, 
    useHint 
  } = useGameState();

  const handleEnterGame = () => {
    setCurrentScreen('mode-select');
  };

  const handleSelectMode = (mode: 'easy' | 'medium' | 'hard') => {
    setMode(mode);
    setCurrentScreen('level-select');
  };

  const handleSelectLevel = (level: number) => {
    setLevel(level);
    setCurrentScreen('game');
  };

  const handleLevelComplete = () => {
    unlockNextLevel();
    // Return to level select to show progress
    setCurrentScreen('level-select');
  };

  const handleBackToModeSelect = () => {
    setCurrentScreen('mode-select');
  };

  const handleBackToLanding = () => {
    setCurrentScreen('landing');
  };

  const handleBackToLevelSelect = () => {
    setCurrentScreen('level-select');
  };

  const getMaxLevels = (mode: 'easy' | 'medium' | 'hard') => {
    switch (mode) {
      case 'easy': return 10;
      case 'medium': return 10;
      case 'hard': return 10;
      default: return 10;
    }
  };

  // Render current screen
  switch (currentScreen) {
    case 'landing':
      return (
        <Landing 
          onEnter={handleEnterGame}
          isDarkMode={gameState.isDarkMode}
          onToggleDarkMode={toggleDarkMode}
        />
      );

    case 'mode-select':
      return (
        <ModeSelection 
          onSelectMode={handleSelectMode}
          onBack={handleBackToLanding}
          progress={gameState.progress}
          isDarkMode={gameState.isDarkMode}
          onToggleDarkMode={toggleDarkMode}
        />
      );

    case 'level-select':
      return gameState.currentMode ? (
        <LevelSelect 
          mode={gameState.currentMode}
          progress={gameState.progress}
          onSelectLevel={handleSelectLevel}
          onBack={handleBackToModeSelect}
          isDarkMode={gameState.isDarkMode}
          onToggleDarkMode={toggleDarkMode}
        />
      ) : null;

    case 'game':
      return gameState.currentMode ? (
        <PuzzleGame 
          mode={gameState.currentMode}
          currentLevel={gameState.currentLevel}
          maxLevel={getMaxLevels(gameState.currentMode)}
          onBack={handleBackToLevelSelect}
          onLevelComplete={handleLevelComplete}
          onUseHint={useHint}
          hintsUsed={gameState.hintsUsed}
          isDarkMode={gameState.isDarkMode}
          onToggleDarkMode={toggleDarkMode}
        />
      ) : null;

    default:
      return null;
  }
};

export default Index;
