import { useState, useEffect } from 'react';
import { ArrowLeft, Lightbulb, RotateCcw, CheckCircle, XCircle, Clock } from 'lucide-react';
import puzzleData from '../data/puzzles.json';

type LocalizedPuzzle = {
  id: string;
  question: string;
  image: string;
  type: string;
  answer: string;
  hint: string;
  explanation?: string;
  question_en?: string;
  question_hi?: string;
  hint_en?: string;
  hint_hi?: string;
  explanation_en?: string;
  explanation_hi?: string;
};

// Import puzzle images
import patternCircles from '../assets/pattern-circles.jpg';
import arrowsSequence from '../assets/arrows-sequence.jpg';
import rotatedSymbols from '../assets/rotated-symbols.jpg';
import oddSymbols from '../assets/odd-symbols.jpg';
import binaryMatrix from '../assets/binary-matrix.jpg';
import networkGraph from '../assets/network-graph.jpg';

interface PuzzleGameProps {
  mode: 'easy' | 'medium' | 'hard';
  currentLevel: number;
  maxLevel: number;
  onBack: () => void;
  onLevelComplete: () => void;
  onUseHint: (puzzleId: string) => void;
  hintsUsed: Record<string, boolean>;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

const imageMap: Record<string, string> = {
  'pattern-circles.jpg': patternCircles,
  'arrows-sequence.jpg': arrowsSequence,
  'rotated-symbols.jpg': rotatedSymbols,
  'odd-symbols.jpg': oddSymbols,
  'binary-matrix.jpg': binaryMatrix,
  'network-graph.jpg': networkGraph,
};

// ...existing code...
export const PuzzleGame = ({ mode, currentLevel, maxLevel, onBack, onLevelComplete, onUseHint, hintsUsed, isDarkMode, onToggleDarkMode }: PuzzleGameProps) => {
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [showHint, setShowHint] = useState(false);
  const [startTime] = useState(Date.now());
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [language, setLanguage] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('cipher_language') || 'en';
    }
    return 'en';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cipher_language', language);
    }
  }, [language]);

  const puzzles: LocalizedPuzzle[] = (puzzleData[mode] as any[]).map((puzzle, idx) => ({
    id: puzzle.id ?? `puzzle-${idx}`,
    question: puzzle.question ?? '',
    image: puzzle.image ?? '',
    type: puzzle.type ?? '',
    answer: puzzle.answer ?? '',
    hint: puzzle.hint ?? '',
    explanation: puzzle.explanation ?? '',
    question_en: puzzle.question_en,
    question_hi: puzzle.question_hi,
    hint_en: puzzle.hint_en,
    hint_hi: puzzle.hint_hi,
    explanation_en: puzzle.explanation_en,
    explanation_hi: puzzle.explanation_hi,
  }));
  const currentPuzzle: LocalizedPuzzle = puzzles[currentLevel - 1];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(Date.now() - startTime);
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  useEffect(() => {
    // Reset state when level changes
    setUserAnswer('');
    setFeedback({ type: null, message: '' });
    setShowHint(false);
    setIsSubmitting(false);
  }, [currentLevel]);

  if (!currentPuzzle) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Mission Complete!</h2>
          <p className="text-muted-foreground mb-6">You've completed all puzzles in this difficulty mode.</p>
          <button onClick={onBack} className="cipher-button">
            Return to Base
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!userAnswer.trim() || isSubmitting) return;
    setIsSubmitting(true);
    // Simulate processing time for dramatic effect
    await new Promise(resolve => setTimeout(resolve, 800));
    const isCorrect = userAnswer.trim().toLowerCase() === currentPuzzle.answer.toLowerCase();
    if (isCorrect) {
      setFeedback({
        type: 'success',
        message: language === 'en' ? 'Correct! Well done, Agent.' : 'Sahi hai! Shabash, Agent.'
      });
      setTimeout(() => {
        onLevelComplete();
      }, 2000);
    } else {
      setFeedback({
        type: 'error',
        message: language === 'en' ? 'Incorrect. Analyze further.' : 'Galat hai. Aur socho.'
      });
      setTimeout(() => {
        setFeedback({ type: null, message: '' });
      }, 3000);
    }
    setIsSubmitting(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleUseHint = () => {
    setShowHint(true);
    onUseHint(currentPuzzle.id);
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  const getModeTitle = (mode: string) => {
    switch (mode) {
      case 'easy': return 'ROOKIE';
      case 'medium': return 'AGENT';
      case 'hard': return 'OPERATIVE';
      default: return mode.toUpperCase();
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="min-h-screen bg-background p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {language === 'en' ? 'Exit Mission' : 'Mission Chhodo'}
          </button>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="font-mono text-sm">{formatTime(timeElapsed)}</span>
            </div>

            {/* Language toggle button */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="p-3 rounded-lg bg-card border border-border hover:bg-muted transition-colors font-semibold"
              title={language === 'en' ? 'Switch to Hinglish' : 'Switch to English'}
            >
              {language === 'en' ? '🇮🇳 Hinglish' : '🇬🇧 English'}
            </button>

            <button
              onClick={onToggleDarkMode}
              className="p-3 rounded-lg bg-card border border-border hover:bg-muted transition-colors"
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-2xl font-bold text-foreground">
                {getModeTitle(mode)} • {language === 'en' ? 'LEVEL' : 'STAR'} {currentLevel}
              </h1>
              <span className="text-muted-foreground">{currentLevel}/{maxLevel}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="h-2 bg-gradient-to-r from-primary to-primary-glow rounded-full transition-all duration-500"
                style={{ width: `${(currentLevel / maxLevel) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Puzzle card */}
          <div className="mission-card">
            {/* Puzzle image */}
            {currentPuzzle.image && (
              <div className="mb-6">
                <img 
                  src={imageMap[currentPuzzle.image]} 
                  alt="Puzzle visual"
                  className="w-full max-w-2xl mx-auto rounded-lg border border-border"
                />
              </div>
            )}

            {/* Question */}
            <div className="mb-8">
              <h2 className="text-xl md:text-2xl font-semibold mb-4 text-foreground">
                {language === 'en'
                  ? (currentPuzzle.question_en || currentPuzzle.question)
                  : (currentPuzzle.question_hi || currentPuzzle.question)}
              </h2>

              {currentPuzzle.type && (
                <div className="inline-block px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">
                  {currentPuzzle.type.replace('-', ' ').toUpperCase()}
                </div>
              )}
            </div>

            {/* Hint section */}
            {showHint && (
              <div className="mb-6 p-4 bg-warning/10 border border-warning/30 rounded-lg animate-fade-in">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-warning mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-warning mb-1">{language === 'en' ? 'Intelligence Hint' : 'Hint'}</h3>
                    <p className="text-warning/90">{language === 'en'
                      ? (currentPuzzle.hint_en || currentPuzzle.hint)
                      : (currentPuzzle.hint_hi || currentPuzzle.hint)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Explanation section (if present) */}
            {feedback.type === 'success' && currentPuzzle[`explanation_${language}`] && (
              <div className="mb-6 p-4 bg-info/10 border border-info/30 rounded-lg animate-fade-in">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-info mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-info mb-1">{language === 'en' ? 'Explanation' : 'Samjhaayi'}</h3>
                    <p className="text-info/90">{currentPuzzle[`explanation_${language}`]}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Answer input */}
            <div className="space-y-4">
              <div>
                <label htmlFor="answer" className="block text-sm font-medium text-muted-foreground mb-2">
                  {language === 'en' ? 'Your Answer' : 'Aapka Jawaab'}
                </label>
                <input
                  id="answer"
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={language === 'en' ? 'Enter your solution...' : 'Yahan likho...'}
                  className={`
                    secure-input w-full
                    ${feedback.type === 'error' ? 'animate-glitch border-destructive' : ''}
                    ${feedback.type === 'success' ? 'border-success' : ''}
                  `}
                  disabled={isSubmitting || feedback.type === 'success'}
                />
              </div>

              {/* Feedback */}
              {feedback.type && (
                <div className={`
                  flex items-center gap-2 p-3 rounded-lg animate-fade-in
                  ${feedback.type === 'success' ? 'bg-success/10 text-success border border-success/30' : ''}
                  ${feedback.type === 'error' ? 'bg-destructive/10 text-destructive border border-destructive/30' : ''}
                `}>
                  {feedback.type === 'success' ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <XCircle className="w-5 h-5" />
                  )}
                  <span className="font-medium">{feedback.message}</span>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSubmit}
                  disabled={!userAnswer.trim() || isSubmitting || feedback.type === 'success'}
                  className={`
                    cipher-button flex-1
                    ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}
                    ${feedback.type === 'success' ? 'success-pulse' : ''}
                  `}
                >
                  {isSubmitting
                    ? (language === 'en' ? 'ANALYZING...' : 'Socha ja raha hai...')
                    : (language === 'en' ? 'SUBMIT ANSWER' : 'Jawaab Do')}
                </button>

                {!hintsUsed[currentPuzzle.id] && !showHint && (
                  <button
                    onClick={handleUseHint}
                    className="px-6 py-3 bg-warning/20 text-warning border border-warning/30 rounded-lg font-semibold hover:bg-warning/30 transition-colors"
                  >
                    <Lightbulb className="w-5 h-5" />
                  </button>
                )}

                <button
                  onClick={() => setUserAnswer('')}
                  className="px-6 py-3 bg-muted/50 text-muted-foreground border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Puzzle type info */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            {language === 'en'
              ? <>Classification: {currentPuzzle.type?.toUpperCase() || 'CLASSIFIED'} • Security Level: {getModeTitle(mode)} • Mission: {currentLevel}/{maxLevel}</>
              : <>Prakar: {currentPuzzle.type?.toUpperCase() || 'CLASSIFIED'} • Suraksha Star: {getModeTitle(mode)} • Mission: {currentLevel}/{maxLevel}</>
            }
          </div>
        </div>
      </div>
    </div>
  );
};