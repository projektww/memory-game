import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, RefreshCw, Timer } from 'lucide-react';

interface Props {
  onBack: () => void;
  emojis: string[];
  gameName: string;
  difficulty: 'easy' | 'medium';
  settings: {
    pairs: number;
    timeLimit: number;
  };
}

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const Memory: React.FC<Props> = ({ onBack, emojis, gameName, difficulty, settings }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [timeLeft, setTimeLeft] = useState(settings.timeLimit);
  const [isGameOver, setIsGameOver] = useState(false);
  const [bestScore, setBestScore] = useState<number>(() => {
    const saved = localStorage.getItem(`memory-best-score-${gameName}-${difficulty}`);
    return saved ? parseInt(saved, 10) : Infinity;
  });

  const initializeCards = useCallback(() => {
    const selectedEmojis = emojis.slice(0, settings.pairs);
    const duplicatedEmojis = [...selectedEmojis, ...selectedEmojis];
    const shuffledEmojis = duplicatedEmojis.sort(() => Math.random() - 0.5);
    return shuffledEmojis.map((emoji, index) => ({
      id: index,
      emoji,
      isFlipped: false,
      isMatched: false,
    }));
  }, [emojis, settings.pairs]);

  useEffect(() => {
    setCards(initializeCards());
    setTimeLeft(settings.timeLimit);
    setIsGameOver(false);
  }, [initializeCards, settings.timeLimit]);

  useEffect(() => {
    if (isWon || isGameOver) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isWon, isGameOver]);

  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2 || cards[id].isMatched || cards[id].isFlipped || isGameOver) return;

    const newCards = [...cards];
    newCards[id].isFlipped = true;
    setCards(newCards);

    const newFlippedCards = [...flippedCards, id];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      const [firstCard, secondCard] = newFlippedCards;

      if (cards[firstCard].emoji === cards[secondCard].emoji) {
        newCards[firstCard].isMatched = true;
        newCards[secondCard].isMatched = true;
        setCards(newCards);
        setFlippedCards([]);

        if (newCards.every(card => card.isMatched)) {
          setIsWon(true);
          if (moves + 1 < bestScore) {
            setBestScore(moves + 1);
            localStorage.setItem(`memory-best-score-${gameName}-${difficulty}`, (moves + 1).toString());
          }
        }
      } else {
        setTimeout(() => {
          newCards[firstCard].isFlipped = false;
          newCards[secondCard].isFlipped = false;
          setCards(newCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const resetGame = () => {
    setCards(initializeCards());
    setFlippedCards([]);
    setMoves(0);
    setIsWon(false);
    setTimeLeft(settings.timeLimit);
    setIsGameOver(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-6 h-6 mr-2" />
          Powrót
        </button>
        <h1 className="text-3xl font-bold text-center text-gray-900">
          Memory: {gameName}
          <div className="text-sm font-normal text-gray-600 mt-1">
            {difficulty === 'easy' ? 'Poziom łatwy' : 'Poziom średni'}
          </div>
        </h1>
        <button
          onClick={resetGame}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <RefreshCw className="w-6 h-6 mr-2" />
          Reset
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-4 text-center space-y-2">
          <div className="flex justify-center items-center gap-8">
            <p className="text-xl">Ruchy: {moves}</p>
            <p className="text-xl flex items-center">
              <Timer className="w-5 h-5 mr-2" />
              {formatTime(timeLeft)}
            </p>
          </div>
          <p className="text-sm text-gray-600">
            Najlepszy wynik: {bestScore === Infinity ? '-' : bestScore}
          </p>
          {isWon && (
            <p className="text-green-500 font-bold mt-2">
              Gratulacje! Wygrałeś w {moves} ruchach!
              {moves === bestScore && ' Nowy rekord! 🎉'}
            </p>
          )}
          {isGameOver && !isWon && (
            <p className="text-red-500 font-bold mt-2">
              Koniec czasu! Spróbuj jeszcze raz!
            </p>
          )}
        </div>

        <div className="grid grid-cols-4 gap-4">
          {cards.map(card => (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`
                aspect-square text-4xl rounded-lg transition-all duration-300 transform
                ${card.isFlipped || card.isMatched
                  ? 'bg-white rotate-0'
                  : 'bg-indigo-500 rotate-180'
                }
                ${!card.isMatched && !card.isFlipped && !isGameOver ? 'hover:bg-indigo-400' : ''}
                disabled:cursor-not-allowed
                shadow-md hover:shadow-lg
              `}
              disabled={card.isMatched || card.isFlipped || isGameOver}
            >
              {(card.isFlipped || card.isMatched) && card.emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Memory;