import { ArrowLeft, Play, Lock, CheckCircle } from 'lucide-react';
import { GameProgress } from '../hooks/useGameState';

interface LevelSelectProps {
  mode: 'easy' | 'medium' | 'hard';
  progress: GameProgress;
  onSelectLevel: (level: number) => void;
  onBack: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const LevelSelect = ({ mode, progress, onSelectLevel, onBack, isDarkMode, onToggleDarkMode }: LevelSelectProps) => {
  const getModeInfo = (mode: string) => {
    switch (mode) {
      case 'easy':
        return { title: 'ROOKIE', maxLevels: 10, color: 'from-success/80 to-success' };
      case 'medium':
        return { title: 'AGENT', maxLevels: 10, color: 'from-primary/80 to-primary' };
      case 'hard':
        return { title: 'OPERATIVE', maxLevels: 10, color: 'from-accent/80 to-accent' };
      default:
        return { title: mode.toUpperCase(), maxLevels: 10, color: 'from-primary/80 to-primary' };
    }
  };

  const modeInfo = getModeInfo(mode);
  const currentProgress = progress[mode];
  const levels = Array.from({ length: modeInfo.maxLevels }, (_, i) => i + 1);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="min-h-screen bg-background p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Change Mode
          </button>
          
          <button
            onClick={onToggleDarkMode}
            className="p-3 rounded-lg bg-card border border-border hover:bg-muted transition-colors"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Mode header */}
          <div className="text-center mb-12">
            <div className={`inline-block px-6 py-3 rounded-2xl bg-gradient-to-r ${modeInfo.color} text-white mb-4`}>
              <h1 className="text-3xl md:text-5xl font-bold">{modeInfo.title}</h1>
            </div>
            <p className="text-xl text-muted-foreground">
              Select your mission level
            </p>
            <div className="mt-4 text-sm text-muted-foreground">
              Progress: {currentProgress}/{modeInfo.maxLevels} completed
            </div>
          </div>

          {/* Level grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {levels.map((level) => {
              const isUnlocked = level <= currentProgress + 1;
              const isCompleted = level <= currentProgress;
              const isCurrent = level === currentProgress + 1;

              return (
                <div
                  key={level}
                  className={`
                    mission-card relative overflow-hidden cursor-pointer group
                    ${isUnlocked ? 'hover:scale-105' : 'opacity-50 cursor-not-allowed'}
                    ${isCurrent ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}
                  `}
                  onClick={() => isUnlocked && onSelectLevel(level)}
                  style={{ animationDelay: `${level * 0.1}s` }}
                >
                  {/* Background gradient for current level */}
                  {isCurrent && (
                    <div className={`absolute inset-0 bg-gradient-to-br ${modeInfo.color} opacity-10`}></div>
                  )}

                  <div className="relative z-10">
                    {/* Level number */}
                    <div className="text-center mb-4">
                      <div className={`
                        w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl font-bold
                        ${isCompleted ? 'bg-success text-success-foreground' : 
                          isCurrent ? 'bg-primary text-primary-foreground' : 
                          isUnlocked ? 'bg-muted text-muted-foreground' : 'bg-muted/50 text-muted-foreground/50'}
                      `}>
                        {isCompleted ? <CheckCircle className="w-8 h-8" /> : level}
                      </div>
                    </div>

                    {/* Level title */}
                    <h3 className="text-lg font-semibold text-center mb-2">
                      {isCompleted ? 'COMPLETED' : isCurrent ? 'CURRENT' : isUnlocked ? 'AVAILABLE' : 'LOCKED'}
                    </h3>

                    {/* Mission description */}
                    <p className="text-sm text-muted-foreground text-center mb-4">
                      {getMissionDescription(mode, level)}
                    </p>

                    {/* Action button */}
                    <div className="flex justify-center">
                      {!isUnlocked ? (
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                          <Lock className="w-4 h-4" />
                          <span>Locked</span>
                        </div>
                      ) : (
                        <button
                          className={`
                            flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                            ${isCompleted ? 'bg-success/20 text-success hover:bg-success/30' :
                              isCurrent ? 'bg-primary/20 text-primary hover:bg-primary/30' :
                              'bg-muted text-muted-foreground hover:bg-muted/80'}
                          `}
                        >
                          <Play className="w-4 h-4" />
                          {isCompleted ? 'Replay' : isCurrent ? 'Continue' : 'Start'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Completion indicator */}
                  {isCompleted && (
                    <div className="absolute top-2 right-2">
                      <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-success-foreground" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Mode stats */}
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 rounded-xl bg-card border border-border">
              <div className="text-3xl font-bold text-primary mb-2">
                {currentProgress}
              </div>
              <div className="text-muted-foreground">Levels Completed</div>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-card border border-border">
              <div className="text-3xl font-bold text-accent mb-2">
                {Math.round((currentProgress / modeInfo.maxLevels) * 100)}%
              </div>
              <div className="text-muted-foreground">Mode Progress</div>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-card border border-border">
              <div className="text-3xl font-bold text-success mb-2">
                {modeInfo.maxLevels - currentProgress}
              </div>
              <div className="text-muted-foreground">Levels Remaining</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function getMissionDescription(mode: string, level: number): string {
  const descriptions: Record<string, string[]> = {
    easy: [
      "Basic pattern recognition",
      "Simple cipher analysis", 
      "Elementary logic puzzle",
      "Number sequence analysis",
      "Basic anagram challenge"
    ],
    medium: [
      "Advanced directional analysis",
      "Cryptographic challenge",
      "Rotational matrix puzzle",
      "Fibonacci sequence test",
      "Complex pattern recognition",
      "Multi-step logical reasoning"
    ],
    hard: [
      "Binary decryption task",
      "Algorithm complexity test",
      "Graph theory analysis",
      "Advanced sequence logic",
      "Combinatorial challenge",
      "Frequency analysis test",
      "Modular arithmetic puzzle"
    ]
  };

  return descriptions[mode]?.[level - 1] || "Classified mission";
}