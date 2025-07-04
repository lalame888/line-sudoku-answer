import React from 'react'

interface GameControlsProps {
  onSolve: () => void
  onNewGame: () => void
  solution: number[][] | null
  isBoardEmpty: boolean
  isValidSudoku: boolean
  getSudokuValidationError: () => string | null
}

const GameControls: React.FC<GameControlsProps> = ({
  onSolve,
  onNewGame,
  solution,
  isBoardEmpty,
  isValidSudoku,
  getSudokuValidationError
}) => {
  return (
    <div className="control-section">
      <div className="main-buttons">
        <div className="solve-button-wrapper">
          <button 
            className="solve-button" 
            onClick={onSolve} 
            disabled={!!solution || isBoardEmpty || !isValidSudoku}
            data-tooltip={!solution && !isBoardEmpty && !isValidSudoku ? getSudokuValidationError() || '' : ''}
          >
            🎯 解答
          </button>
        </div>
        <button className="new-game-button" onClick={onNewGame}>
          🎮 新一局
        </button>
      </div>
    </div>
  )
}

export default GameControls 