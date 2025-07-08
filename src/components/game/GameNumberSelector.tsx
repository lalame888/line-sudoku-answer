import React from 'react'

interface GameNumberSelectorProps {
  selectedNumber: number | null
  selectedCell: { row: number; col: number } | null
  onNumberClick: (number: number) => void
  onFillCell: (row: number, col: number, number: number) => void
}

const GameNumberSelector: React.FC<GameNumberSelectorProps> = ({
  selectedNumber,
  selectedCell,
  onNumberClick,
  onFillCell
}) => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]

  const handleNumberClick = (number: number) => {
    onNumberClick(number)
    
    // 如果已經選中了格子，自動填入數字
    if (selectedCell) {
      onFillCell(selectedCell.row, selectedCell.col, number)
    }
  }

  return (
    <div className="game-number-selector">
      <div className="number-buttons">
        {numbers.map((number) => (
          <button
            key={number}
            className={`number-button ${selectedNumber === number ? 'selected' : ''}`}
            onClick={() => handleNumberClick(number)}
          >
            {number}
          </button>
        ))}
      </div>
      <div className="selection-info">
        {selectedCell ? (
          <span>已選中格子：({selectedCell.row + 1}, {selectedCell.col + 1})</span>
        ) : (
          <span>請先選擇一個格子</span>
        )}
      </div>
    </div>
  )
}

export default GameNumberSelector 