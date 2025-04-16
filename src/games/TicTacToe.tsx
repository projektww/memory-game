import React, { useState } from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';

interface Props {
  onBack: () => void;
}

type Player = 'X' | 'O';
type Board = (Player | null)[][];

const TicTacToe: React.FC<Props> = ({ onBack }) => {
  const [board, setBoard] = useState<Board>(Array(3).fill(null).map(() => Array(3).fill(null)));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [winner, setWinner] = useState<Player | 'draw' | null>(null);

  const checkWinner = (board: Board): Player | 'draw' | null => {
    // Check rows, columns and diagonals
    for (let i = 0; i < 3; i++) {
      if (board[i][0] && board[i][0] === board[i][1] && board[i][0] === board[i][2]) {
        return board[i][0];
      }
      if (board[0][i] && board[0][i] === board[1][i] && board[0][i] === board[2][i]) {
        return board[0][i];
      }
    }
    if (board[0][0] && board[0][0] === board[1][1] && board[0][0] === board[2][2]) {
      return board[0][0];
    }
    if (board[0][2] && board[0][2] === board[1][1] && board[0][2] === board[2][0]) {
      return board[0][2];
    }

    // Check for draw
    if (board.every(row => row.every(cell => cell !== null))) {
      return 'draw';
    }

    return null;
  };

  const handleClick = (row: number, col: number) => {
    if (board[row][col] || winner) return;

    const newBoard = board.map(row => [...row]);
    newBoard[row][col] = currentPlayer;
    setBoard(newBoard);

    const newWinner = checkWinner(newBoard);
    if (newWinner) {
      setWinner(newWinner);
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const resetGame = () => {
    setBoard(Array(3).fill(null).map(() => Array(3).fill(null)));
    setCurrentPlayer('X');
    setWinner(null);
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-6 h-6 mr-2" />
          Powrót
        </button>
        <h1 className="text-3xl font-bold text-center text-gray-900">Kółko i Krzyżyk</h1>
        <button
          onClick={resetGame}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <RefreshCw className="w-6 h-6 mr-2" />
          Reset
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="grid grid-cols-3 gap-2">
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleClick(rowIndex, colIndex)}
                className={`h-24 text-4xl font-bold rounded-lg transition-colors
                  ${!cell && !winner ? 'hover:bg-gray-100' : ''}
                  ${cell === 'X' ? 'text-blue-500' : 'text-red-500'}
                  ${!cell ? 'bg-gray-50' : 'bg-white'}`}
                disabled={!!winner}
              >
                {cell}
              </button>
            ))
          )}
        </div>

        <div className="mt-6 text-center">
          {winner ? (
            <p className="text-xl font-bold">
              {winner === 'draw' ? 'Remis!' : `Wygrywa ${winner}!`}
            </p>
          ) : (
            <p className="text-xl">
              Ruch gracza: <span className="font-bold">{currentPlayer}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicTacToe;