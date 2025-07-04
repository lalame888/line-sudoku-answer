import React from 'react'

interface NumberSelectorProps {
  selectedNumber: number | null
  onNumberClick: (num: number) => void
  onArrowClick: (direction: 'left' | 'right') => void
}

const NumberSelector: React.FC<NumberSelectorProps> = ({
  selectedNumber,
  onNumberClick,
  onArrowClick
}) => {
  return (
    <div className="number-selector">
      <button
        className="arrow-button"
        onClick={() => onArrowClick('left')}
      >
        ←
      </button>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
        <button
          key={num}
          onClick={() => onNumberClick(num)}
          className={`number-button ${selectedNumber === num ? 'selected' : ''}`}
        >
          {num}
        </button>
      ))}
      <button
        className="arrow-button"
        onClick={() => onArrowClick('right')}
      >
        →
      </button>
    </div>
  )
}

export default NumberSelector 