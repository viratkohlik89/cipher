import { useEffect, useState } from 'react';
import { Shield, Brain, Lock, ArrowRight } from 'lucide-react';

interface LandingProps {
  onEnter: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Landing = ({ onEnter, isDarkMode, onToggleDarkMode }: LandingProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Theme toggle */}
        <button
          onClick={onToggleDarkMode}
          className="absolute top-6 right-6 p-3 rounded-lg bg-card border border-border hover:bg-muted transition-colors"
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>

        <div className={`max-w-4xl mx-auto text-center space-y-8 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}>
          {/* Logo and title */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30">
              <Shield className="w-8 h-8 text-primary animate-cipher-flicker" />
              <h1 className="text-3xl font-bold text-foreground tracking-wider">CIPHER</h1>
              <Lock className="w-8 h-8 text-accent animate-cipher-flicker" style={{ animationDelay: '0.5s' }} />
            </div>
            
            <h2 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
              INTELLIGENCE TEST
            </h2>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Test your analytical skills with puzzles designed by intelligence professionals.
              <br />
              <span className="text-primary font-semibold">Think beyond the obvious.</span>
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="mission-card group">
              <Brain className="w-12 h-12 text-primary mx-auto mb-4 transition-transform group-hover:scale-110" />
              <h3 className="text-xl font-semibold mb-2">Critical Thinking</h3>
              <p className="text-muted-foreground">Puzzles that require deep analysis and unconventional approaches</p>
            </div>
            
            <div className="mission-card group">
              <Shield className="w-12 h-12 text-accent mx-auto mb-4 transition-transform group-hover:scale-110" />
              <h3 className="text-xl font-semibold mb-2">Progressive Difficulty</h3>
              <p className="text-muted-foreground">Three difficulty modes with unlockable levels</p>
            </div>
            
            <div className="mission-card group">
              <Lock className="w-12 h-12 text-primary-glow mx-auto mb-4 transition-transform group-hover:scale-110" />
              <h3 className="text-xl font-semibold mb-2">Secure Progress</h3>
              <p className="text-muted-foreground">Your progress is automatically saved and encrypted</p>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16">
            <button 
              onClick={onEnter}
              className="cipher-button text-lg px-8 py-4 group"
            >
              BEGIN ASSESSMENT
              <ArrowRight className="w-5 h-5 ml-2 inline-block transition-transform group-hover:translate-x-1" />
            </button>
            
            <p className="text-sm text-muted-foreground mt-4">
              Classified • For Intelligence Personnel Only
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-6 left-6 text-sm text-muted-foreground font-mono">
          CIPHER v2.0 • CLASSIFIED
        </div>
      </div>
    </div>
  );
};