import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [board, setBoard] = useState(
    Array(10)
      .fill(null)
      .map(() => Array(10).fill(null))
  );
  const [currentNumber, setCurrentNumber] = useState(1);
  const [history, setHistory] = useState([]);
  const [showDefeatModal, setShowDefeatModal] = useState(false);
  const [showVictoryModal, setShowVictoryModal] = useState(false);

  const isMoveValid = (row, col, prevRow, prevCol) => {
    const rowDiff = Math.abs(row - prevRow);
    const colDiff = Math.abs(col - prevCol);

    if (rowDiff === 3 && colDiff === 0) return true; // Vertical move with 2 empty spaces
    if (rowDiff === 0 && colDiff === 3) return true; // Horizontal move with 2 empty spaces
    if (rowDiff === 2 && colDiff === 2) return true; // Diagonal move with 1 empty space

    return false;
  };

  const handleClick = (row, col) => {
    if (board[row][col] !== null) return;

    const lastMove = history.length ? history[history.length - 1] : null;

    if (lastMove) {
      const [prevRow, prevCol] = lastMove;
      if (!isMoveValid(row, col, prevRow, prevCol)) {
        toast.error('Invalid move!', {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
      }
    }

    const newBoard = board.map((r, i) =>
      r.map((c, j) => (i === row && j === col ? currentNumber : c))
    );

    setBoard(newBoard);
    setHistory((prevHistory) => [...prevHistory, [row, col]]);
    setCurrentNumber((prevNumber) => prevNumber + 1);

    if (currentNumber + 1 > 100) {
      setShowVictoryModal(true);
    } else if (!canMakeAnyMove(newBoard, row, col)) {
      setShowDefeatModal(true);
    }
  };

  const canMakeAnyMove = (board, row, col) => {
    const directions = [
      [3, 0],
      [-3, 0],
      [0, 3],
      [0, -3],
      [2, 2],
      [-2, -2],
      [2, -2],
      [-2, 2],
    ];

    return directions.some(([dRow, dCol]) => {
      const newRow = row + dRow;
      const newCol = col + dCol;
      return (
        newRow >= 0 &&
        newRow < 10 &&
        newCol >= 0 &&
        newCol < 10 &&
        board[newRow][newCol] === null &&
        isMoveValid(newRow, newCol, row, col)
      );
    });
  };

  const handleRestart = () => {
    setBoard(
      Array(10)
        .fill(null)
        .map(() => Array(10).fill(null))
    );
    setCurrentNumber(1);
    setHistory([]);
    setShowDefeatModal(false);
    setShowVictoryModal(false);
  };

  const handleUndo = () => {
    if (!history.length) return;

    const newHistory = [...history];
    const [lastRow, lastCol] = newHistory.pop();

    const newBoard = board.map((r, i) =>
      r.map((c, j) => (i === lastRow && j === lastCol ? null : c))
    );

    setBoard(newBoard);
    setHistory(newHistory);
    setCurrentNumber((prevNumber) => prevNumber - 1);
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gradient-to-br from-cyan-500 from-0% via-yellow-200 via-60% to-purple-300 p-6">
      <ToastContainer />
      <div className="flex flex-col md:flex-row max-w-5xl w-full bg-white shadow-2xl rounded-lg overflow-hidden">
        <div className="p-6 md:w-1/2 bg-gradient-to-b from-white to-gray-100">
          <h1 className="text-4xl font-bold mb-4 text-center text-gray-800">100 Squares</h1>
          <p className="mb-4 text-lg text-gray-700">
            Place numbers from 1 to 100 on the board. Each number must be placed according to the following rules:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-4">
            <li>Vertical move: exactly 2 empty spaces between numbers.</li>
            <li>Horizontal move: exactly 2 empty spaces between numbers.</li>
            <li>Diagonal move: exactly 1 empty space between numbers.</li>
          </ul>
          <div className="flex justify-center space-x-4">
            <button
              className="bg-gradient-to-r from-green-400 to-green-600 text-white px-6 py-2 m-2 rounded-full shadow-lg hover:shadow-xl hover:from-green-500 hover:to-green-700 transition-all"
              onClick={handleRestart}
            >
              Restart
            </button>
            <button
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-6 py-2 m-2 rounded-full shadow-lg hover:shadow-xl hover:from-yellow-500 hover:to-yellow-700 transition-all"
              onClick={handleUndo}
            >
              Undo
            </button>
          </div>
          <div className="mt-4 text-xl text-center text-gray-800">Filled Squares: {currentNumber - 1}</div>
        </div>
        <div className="p-4 md:w-1/2 bg-gray-200 flex items-center justify-center">
          <div className="grid grid-cols-10 gap-1">
            {board.map((row, i) =>
              row.map((cell, j) => (
                <div
                  key={`${i}-${j}`}
                  className="w-7 h-7 md:w-12 md:h-12 flex items-center justify-center border border-gray-300 cursor-pointer text-lg md:text-xl bg-white hover:bg-gray-300 transition-all"
                  onClick={() => handleClick(i, j)}
                >
                  {cell}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Defeat Modal */}
      {showDefeatModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm">
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Game Over!</h2>
            <p className="mb-4 text-center text-gray-700">
              No more moves possible. Would you like to play again?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-all"
                onClick={handleRestart}
              >
                Restart
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-all"
                onClick={() => setShowDefeatModal(false)}
              >
                Quit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Victory Modal */}
      {showVictoryModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm">
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Congratulations!</h2>
            <p className="mb-4 text-center text-gray-700">
              You've successfully filled the board. Would you like to play again?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-all"
                onClick={handleRestart}
              >
                Restart
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-all"
                onClick={() => setShowVictoryModal(false)}
              >
                Quit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
