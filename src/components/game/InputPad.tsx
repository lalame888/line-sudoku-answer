import React from 'react'
import type { GameMode } from '../../hooks/useSudokuGame'

interface InputPadProps {
  currentMode: GameMode
  onModeChange: (mode: GameMode) => void
  selectedNumber: number[]
  onNumberClick: (number: number) => void
  onClear: () => void
}

const InputPad: React.FC<InputPadProps> = ({
  currentMode,
  onModeChange,
  selectedNumber,
  onNumberClick,
  onClear
}) => {
  return (
    <div className="input-pad-container">
      <div className="input-mode-switch">
        <button
          className={`mode-btn fill-btn${currentMode === 'fill' ? ' active' : ''}`}
          onClick={() => onModeChange('fill')}
        >
          作答
        </button>
        <button
          className={`mode-btn note-btn${currentMode === 'note' ? ' active' : ''}`}
          onClick={() => onModeChange('note')}
        >
          筆記
        </button>
      </div>
      <div className="input-number-pad">
        <div className="number-grid">
          {[1,2,3,4,5,6,7,8,9].map(num => (
            <button
              key={num}
              className={`number-btn ${selectedNumber?.includes(num) ? 'selected' : ''}`}
              onClick={() => onNumberClick(num)}
            >
              {num}
            </button>
          ))}
        </div>
        <button className="clear-btn" onClick={onClear}>清空</button>
      </div>
    </div>
  )
}

export default InputPad 