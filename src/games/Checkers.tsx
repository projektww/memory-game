import React, { useState } from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';

interface Props {
  onBack: () => void;
}

type PieceType = 'black' | 'white' | null;
type Board = PieceType[][];
type Position = { row: number; col: number };

const Checkers: React.FC<Props> = ({ onBack }) => {
  const initialBoard = (): Board => {
    const board: Board = Array(8).fill(null).map(() => Array(8).fill(null));
    
    // Place black pieces
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 8; col++) {
        if ((row + col) % 2 === 1) {
          board[row][col] = 'black';
        }
      }
    }
    
    // Place white pieces
    for (let row = 5; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if ((row + col) % 2 === 1) {
          board[row][col] = 'white';
        }
      }
    }
    
    return board;
  };

  const [board, setBoard] = useState<Board>(initialBoard());
  const [selectedPiece, setSelectedPiece] = useState<Position | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<'white' | 'black'>('white');
  const [winner, setWinner] = useState<'white' | 'black' | null>(null);

  const isValidMove = (from: Position, to: Position): boolean => {
    const { row: fromRow, col: fromCol } = from;
    const { row: toRow, col: toCol } = to;
    
    // Basic move validation
    if (toRow < 0 || toRow > 7 || toCol < 0 || toCol > 7) return false;
    if (board[toRow][toCol] !== null) return false;
    
    const rowDiff = toRow - fromRow;
    const colDiff = Math.abs(toCol - fromCol);
    
    // Normal move
    if (colDiff === 1) {
      if (currentPlayer === 'white' && rowDiff === -1) return true;
      if (currentPlayer === 'black' && rowDiff === 1) return true;
    }
    
    // Capture move
    if (colDiff === 2) {
      const jumpedRow = fromRow + (rowDiff > 0 ? 1 : -1);
      const jumpedCol = fromCol + (toCol > fromCol ? 1 : -1);
      const jumpedPiece = board[jumpedRow][jumpedCol];
      
      if (jumpedPiece && jumpedPiece !== currentPlayer) {
        if (currentPlayer === 'white' && rowDiff === -2) return true;
        if (currentPlayer === 'black' && rowDiff === 2) return true;
      }
    }
    
    return false;
  };

  const handleMove = (row: number, col: number) => {
    if (winner) return;
    
    if (!selectedPiece) {
      if (board[row][col] === currentPlayer) {
        setSelectedPiece({ row, col });
      }
      return;
    }
    
    if (isValidMove(selectedPiece, { row, col })) {
      const newBoard = board.map(row => [...row]);
      
      // Move piece
      newBoard[row][col] = board[selectedPiece.row][selectedPiece.col];
      newBoard[selectedPiece.row][selectedPiece.col] = null;
      
      // Handle capture
      if (Math.abs(row - selectedPiece.row) === 2) {
        const jumpedRow = selectedPiece.row + (row > selectedPiece.row ? 1 : -1);
        const jumpedCol = selectedPiece.col + (col > selectedPiece.col ? 1 : -1);
        newBoard[jumpedRow][jumpedCol] = null;
      }
      
      setBoard(newBoard);
      setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
      setSelectedPiece(null);
      
      // Check for winner
      const hasWhitePieces = newBoard.some(row => row.includes('white'));
      const hasBlackPieces = newBoard.some(row => row.includes('black'));
      
      if (!hasWhitePieces) setWinner('black');
      if (!hasBlackPieces) setWinner('white');
    } else {
      setSelectedPiece(null);
    }
  };

  const resetGame = () => {
    setBoard(initialBoard());
    setSelectedPiece(null);
    setCurrentPlayer('white');
    setWinner(null);
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
        <h1 className="text-3xl font-bold text-center text-gray-900">Warcaby</h1>
        <button
          onClick={resetGame}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <RefreshCw className="w-6 h-6 mr-2" />
          Reset
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="grid grid-cols-8 gap-1 bg-brown-800 p-2 rounded-lg">
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleMove(rowIndex, colIndex)}
                className={`
                  w-12 h-12 rounded-lg transition-all
                  ${(rowIndex + colIndex) % 2 === 0 ? 'bg-amber-200' : 'bg-amber-800'}
                  ${selectedPiece?.row === rowIndex && selectedPiece?.col === colIndex ? 'ring-2 ring-blue-500' : ''}
                `}
              >
                {cell && (
                  <div
                    className={`
                      w-8 h-8 rounded-full mx-auto
                      ${cell === 'white' ? 'bg-white' : 'bg-gray-900'}
                      ${selectedPiece?.row === rowIndex && selectedPiece?.col === colIndex ? 'scale-90' : ''}
                      transition-transform
                    `}
                  />
                )}
              </button>
            ))
          )}
        </div>

        <div className="mt-6 text-center">
          {winner ? (
            <p className="text-xl font-bold">
              Wygrywa {winner === 'white' ? 'biały' : 'czarny'}!
            </p>
          ) : (
            <p className="text-xl">
              Ruch gracza: <span className="font-bold">{currentPlayer === 'white' ? 'biały' : 'czarny'}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkers;