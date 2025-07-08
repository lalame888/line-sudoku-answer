import React from 'react'
import type { NoteCell } from '../../hooks/useSudokuGame'

interface GameSudokuGridProps {
  board: number[][]
  originalBoard: number[][]
  notes: NoteCell[][]
  selectedCell: { row: number; col: number } | null
  highlightedCells: { row: number; col: number; type: 'selected' | 'same-number' | 'cross' }[]
  onCellClick: (row: number, col: number) => void
  onClearCell: (row: number, col: number) => void
  isCellConflicting: (row: number, col: number) => boolean
}

const GameSudokuGrid: React.FC<GameSudokuGridProps> = ({
  board,
  originalBoard,
  notes,
  selectedCell,
  highlightedCells,
  onCellClick,
  onClearCell,
  isCellConflicting
}) => {
  const getCellClassName = (row: number, col: number) => {
    let className = 'sudoku-cell game-cell'
    
    // 檢查是否為原始題目
    if (originalBoard[row][col] !== 0) {
      className += ' original'
    } else if (board[row][col] !== 0) {
      // 填入的數字
      className += ' filled'
      if (isCellConflicting(row, col)) {
        className += ' conflicting'
      }
    }
    
    // 檢查是否為選中的格子
    if (selectedCell && selectedCell.row === row && selectedCell.col === col) {
      className += ' selected'
    }
    
    // 檢查高亮顯示
    const highlight = highlightedCells.find(h => h.row === row && h.col === col)
    if (highlight) {
      className += ` highlight-${highlight.type}`
    }
    
    return className
  }

  const getCellStyle = (row: number, col: number) => {
    // 計算邊框粗細，跟解答器模式一樣
    const borderTop = row === 0 ? '2px solid #222' : (row % 3 === 0 ? '2px solid #222' : '1px solid #bbb')
    const borderLeft = col === 0 ? '2px solid #222' : (col % 3 === 0 ? '2px solid #222' : '1px solid #bbb')
    const borderRight = col === 8 ? '2px solid #222' : 'none'
    const borderBottom = row === 8 ? '2px solid #222' : 'none'

    return {
      borderTop,
      borderLeft,
      borderRight,
      borderBottom,
    }
  }

  const handleCellClick = (row: number, col: number) => {
    onCellClick(row, col)
  }

  const handleCellDoubleClick = (row: number, col: number) => {
    if (originalBoard[row][col] === 0) {
      onClearCell(row, col)
    }
  }

  const renderCellContent = (row: number, col: number) => {
    const value = board[row][col]
    const cellNotes = notes[row][col]
    
    if (value !== 0) {
      return (
        <span className="cell-number">
          {value}
        </span>
      )
    }
    
    // 顯示筆記
    return (
      <div className="notes-grid">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <span
            key={num}
            className={`note-number ${cellNotes[num] ? 'active' : ''}`}
          >
            {cellNotes[num] ? num : ''}
          </span>
        ))}
      </div>
    )
  }

  return (
    <div className="sudoku-grid game-grid">
      {board.map((row, rowIndex) =>
        row.map((_, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={getCellClassName(rowIndex, colIndex)}
            style={getCellStyle(rowIndex, colIndex)}
            onClick={() => handleCellClick(rowIndex, colIndex)}
            onDoubleClick={() => handleCellDoubleClick(rowIndex, colIndex)}
          >
            {renderCellContent(rowIndex, colIndex)}
          </div>
        ))
      )}
    </div>
  )
}

export default GameSudokuGrid 