import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';

interface Props {
  onBack: () => void;
}

type Board = number[][];

const Game2048: React.FC<Props> = ({ onBack }) => {
  const [board, setBoard] = useState<Board>(initializeBoard());
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const initializeBoard = () => {
    // Initialize with a proper 4x4 grid of zeros
    const newBoard = Array(4).fill(null).map(() => Array(4).fill(0));
    return addNewTile(addNewTile(newBoard));
  };

  const addNewTile = (currentBoard: Board): Board => {
    const newBoard = currentBoard.map(row => [...row]);
    const emptyTiles = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (newBoard[i][j] === 0) {
          emptyTiles.push({ i, j });
        }
      }
    }

    if (emptyTiles.length > 0) {
      const { i, j } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
      newBoard[i][j] = Math.random() < 0.9 ? 2 : 4;
    }

    return newBoard;
  };

  const moveBoard = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameOver) return;

    // Ensure we have a valid board to work with
    if (!Array.isArray(board) || board.length !== 4) {
      console.error('Invalid board state');
      return;
    }

    let newBoard = board.map(row => Array.isArray(row) ? [...row] : Array(4).fill(0));
    let moved = false;
    let newScore = score;

    // Rotate board to simplify logic
    if (direction === 'up') {
      newBoard = rotateBoard(newBoard);
    } else if (direction === 'right') {
      newBoard = rotateBoard(rotateBoard(newBoard));
    } else if (direction === 'down') {
      newBoard = rotateBoard(rotateBoard(rotateBoard(newBoard)));
    }

    // Move and merge tiles
    for (let i = 0; i < 4; i++) {
      const row = newBoard[i] || Array(4).fill(0);
      const newRow = row.filter(cell => cell !== 0);
      
      // Merge adjacent same numbers
      for (let j = 0; j < newRow.length - 1; j++) {
        if (newRow[j] === newRow[j + 1]) {
          newRow[j] *= 2;
          newScore += newRow[j];
          newRow.splice(j + 1, 1);
          moved = true;
        }
      }

      // Fill with zeros
      while (newRow.length < 4) {
        newRow.push(0);
      }

      if (row.some((cell, index) => cell !== newRow[index])) {
        moved = true;
      }

      newBoard[i] = newRow;
    }

    // Rotate back
    if (direction === 'up') {
      newBoard = rotateBoard(rotateBoard(rotateBoard(newBoard)));
    } else if (direction === 'right') {
      newBoard = rotateBoard(rotateBoard(newBoard));
    } else if (direction === 'down') {
      newBoard = rotateBoard(newBoard);
    }

    if (moved) {
      newBoard = addNewTile(newBoard);
      setBoard(newBoard);
      setScore(newScore);
      checkGameOver(newBoard);
    }
  };

  const rotateBoard = (currentBoard: Board): Board => {
    // Ensure we have a valid board to rotate
    if (!Array.isArray(currentBoard) || currentBoard.length !== 4) {
      return Array(4).fill(null).map(() => Array(4).fill(0));
    }

    const newBoard: Board = Array(4).fill(null).map(() => Array(4).fill(0));
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        // Ensure we're accessing valid array indices
        const sourceRow = currentBoard[3 - j];
        newBoard[i][j] = sourceRow ? sourceRow[i] || 0 : 0;
      }
    }
    return newBoard;
  };

  const checkGameOver = (currentBoard: Board) => {
    // Check if there are any empty cells
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (currentBoard[i][j] === 0) return;
      }
    }

    // Check if there are any possible merges
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const current = currentBoard[i][j];
        if (
          (i < 3 && current === currentBoard[i + 1][j]) ||
          (j < 3 && current === currentBoard[i][j + 1])
        ) {
          return;
        }
      }
    }

    setGameOver(true);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          moveBoard('up');
          break;
        case 'ArrowDown':
          moveBoard('down');
          break;
        case 'ArrowLeft':
          moveBoard('left');
          break;
        case 'ArrowRight':
          moveBoard('right');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [board, score, gameOver]); // Add dependencies to ensure latest state is used

  const resetGame = () => {
    setBoard(initializeBoard());
    setScore(0);
    setGameOver(false);
  };

  const getTileColor = (value: number): string => {
    const colors: { [key: number]: string } = {
      2: 'bg-gray-200',
      4: 'bg-gray-300',
      8: 'bg-orange-200',
      16: 'bg-orange-300',
      32: 'bg-orange-400',
      64: 'bg-orange-500',
      128: 'bg-yellow-200',
      256: 'bg-yellow-300',
      512: 'bg-yellow-400',
      1024: 'bg-yellow-500',
      2048: 'bg-yellow-600',
    };
    return colors[value] || 'bg-yellow-700';
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
        <h1 className="text-3xl font-bold text-center text-gray-900">2048</h1>
        <button
          onClick={resetGame}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <RefreshCw className="w-6 h-6 mr-2" />
          Reset
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-4 text-center">
          <p className="text-xl font-bold">Wynik: {score}</p>
          {gameOver && (
            <p className="text-red-500 font-bold mt-2">Koniec gry!</p>
          )}
        </div>

        <div className="grid grid-cols-4 gap-2 bg-gray-100 p-2 rounded-lg">
          {board.map((row, i) =>
            row.map((cell, j) => (
              <div
                key={`${i}-${j}`}
                className={`
                  w-16 h-16 rounded-lg flex items-center justify-center
                  ${cell === 0 ? 'bg-gray-100' : getTileColor(cell)}
                  transition-all duration-100
                `}
              >
                {cell !== 0 && (
                  <span className={`
                    font-bold text-lg
                    ${cell <= 4 ? 'text-gray-700' : 'text-white'}
                  `}>
                    {cell}
                  </span>
                )}
              </div>
            ))
          )}
        </div>

        <div className="mt-4 text-center text-sm text-gray-600">
          <p>Użyj strzałek do przesuwania płytek</p>
        </div>
      </div>
    </div>
  );
};

export default Game2048;