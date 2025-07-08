import React from 'react'

interface GameControlsProps {
  onShowSolution: () => void
  onRestart: () => void
  isCompleted: boolean
}

const GameControls: React.FC<GameControlsProps> = ({
  onShowSolution,
  onRestart,
  isCompleted
}) => {
  return (
    <div className="game-controls">
      <button className="control-button restart-button" onClick={onRestart}>
        新一局
      </button>
      <button className="control-button solution-button" onClick={onShowSolution}>
        顯示解答
      </button>
      {isCompleted && (
        <div className="completion-notice">
          遊戲完成！🎉
        </div>
      )}
    </div>
  )
}

export default GameControls 