import { ArrowLeft, Star, Shield, Zap, Lock } from 'lucide-react';
import { GameProgress } from '../hooks/useGameState';

interface ModeSelectionProps {
  onSelectMode: (mode: 'easy' | 'medium' | 'hard') => void;
  onBack: () => void;
  progress: GameProgress;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const ModeSelection = ({ onSelectMode, onBack, progress, isDarkMode, onToggleDarkMode }: ModeSelectionProps) => {
  const modes = [
    {
      id: 'easy' as const,
      title: 'ROOKIE',
      description: 'Entry-level intelligence assessment',
      icon: Star,
      color: 'from-success/80 to-success',
      maxLevels: 10,
      unlocked: true
    },
    {
      id: 'medium' as const,
      title: 'AGENT',
      description: 'Intermediate analytical challenges',
      icon: Shield,
      color: 'from-primary/80 to-primary',
      maxLevels: 10,
      unlocked: progress.easy >= 5 // Unlock after completing 3 easy levels
    },
    {
      id: 'hard' as const,
      title: 'OPERATIVE',
      description: 'Elite intelligence operations',
      icon: Zap,
      color: 'from-accent/80 to-accent',
      maxLevels: 10,
      unlocked: progress.medium >= 5 // Unlock after completing 4 medium levels
    }
  ];

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
            Return to Base
          </button>
          
          <button
            onClick={onToggleDarkMode}
            className="p-3 rounded-lg bg-card border border-border hover:bg-muted transition-colors"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent mb-4">
              SELECT CLEARANCE LEVEL
            </h1>
            <p className="text-xl text-muted-foreground">
              Choose your intelligence assessment difficulty
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {modes.map((mode, index) => {
              const Icon = mode.icon;
              const currentProgress = progress[mode.id];
              const completionRate = Math.round((currentProgress / mode.maxLevels) * 100);
              
              return (
                <div
                  key={mode.id}
                  className={`
                    mission-card group cursor-pointer relative overflow-hidden
                    ${mode.unlocked ? 'hover:scale-105' : 'opacity-60 cursor-not-allowed'}
                    ${index === 1 ? 'md:-translate-y-4' : ''}
                    ${index === 2 ? 'md:-translate-y-2' : ''}
                  `}
                  onClick={() => mode.unlocked && onSelectMode(mode.id)}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  {/* Background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${mode.color} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
                  
                  {/* Lock overlay for locked modes */}
                  {!mode.unlocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                      <div className="text-center">
                        <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                          {mode.id === 'medium' ? 'Complete 3 Rookie levels' : 'Complete 4 Agent levels'}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <Icon className={`w-12 h-12 text-primary transition-transform group-hover:scale-110`} />
                      <div className="text-right">
                        <div className="text-2xl font-bold text-foreground">{currentProgress}/{mode.maxLevels}</div>
                        <div className="text-sm text-muted-foreground">Levels</div>
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-2 text-foreground">{mode.title}</h3>
                    <p className="text-muted-foreground mb-6">{mode.description}</p>
                    
                    {/* Progress bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="text-primary font-semibold">{completionRate}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full bg-gradient-to-r ${mode.color} transition-all duration-500`}
                          style={{ width: `${completionRate}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {mode.unlocked && (
                      <div className="text-center">
                        <span className="inline-block px-4 py-2 bg-primary/20 text-primary rounded-lg text-sm font-semibold">
                          ACCESS GRANTED
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stats section */}
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 rounded-xl bg-card border border-border">
              <div className="text-3xl font-bold text-primary mb-2">
                {progress.easy + progress.medium + progress.hard}
              </div>
              <div className="text-muted-foreground">Puzzles Solved</div>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-card border border-border">
              <div className="text-3xl font-bold text-accent mb-2">
                {Object.values(progress).filter(p => p > 0).length}
              </div>
              <div className="text-muted-foreground">Modes Unlocked</div>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-card border border-border">
              <div className="text-3xl font-bold text-success mb-2">
                {Math.round(((progress.easy + progress.medium + progress.hard) / 30) * 100)}%
              </div>
              <div className="text-muted-foreground">Overall Progress</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};