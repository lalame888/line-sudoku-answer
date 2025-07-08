import React from 'react'

interface GameStatsProps {
  timer: number
  isCompleted: boolean
  formatTime: (seconds: number) => string
  onReset: () => void
}

const GameStats: React.FC<GameStatsProps> = ({
  timer,
  isCompleted,
  formatTime,
  onReset
}) => {
  return (
    <div className="game-stats game-stats-full">
      <div className="stat-item">
        <span className="stat-label">時間：</span>
        <span className="stat-value">{formatTime(timer)}</span>
      </div>
    
      {isCompleted && (
        <div className="completion-message">
          🎉 恭喜完成！
        </div>
      )}
      <button className="mini-reset-btn" onClick={onReset}>清空回答</button>
    </div>
  )
}

export default GameStats 