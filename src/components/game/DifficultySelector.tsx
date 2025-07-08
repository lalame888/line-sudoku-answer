import React from 'react'
import { Difficulty, getDifficultyName } from '../../utils/sudokuUtils'

interface DifficultySelectorProps {
  selectedDifficulty: Difficulty
  onDifficultyChange: (difficulty: Difficulty) => void
  onNewGame: () => void
}

const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  selectedDifficulty,
  onDifficultyChange,
  onNewGame
}) => {
  const difficulties = [
    Difficulty.EASY,
    Difficulty.MEDIUM,
    Difficulty.HARD,
    Difficulty.EXPERT,
    Difficulty.MASTER
  ]

  return (
    <div className="difficulty-selector">
      <div className="difficulty-buttons">
        {difficulties.map((difficulty) => (
          <button
            key={difficulty}
            className={`difficulty-button ${selectedDifficulty === difficulty ? 'active' : ''}`}
            onClick={() => onDifficultyChange(difficulty)}
          >
            {getDifficultyName(difficulty)}
          </button>
        ))}
      </div>
      <button className="new-game-button" onClick={onNewGame}>
        開始新遊戲
      </button>
    </div>
  )
}

export default DifficultySelector 