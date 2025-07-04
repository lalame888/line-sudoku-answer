import React from 'react'

interface SudokuGridProps {
  board: number[][]
  solution: number[][] | null
  selectedNumber: number | null
  inputRefs: React.MutableRefObject<(HTMLInputElement | null)[][]>
  onInput: (row: number, col: number, value: string) => void
  onKeyDown: (row: number, col: number, e: React.KeyboardEvent<HTMLInputElement>) => void
  isCellValid: (row: number, col: number) => boolean
}

const SudokuGrid: React.FC<SudokuGridProps> = ({
  board,
  solution,
  selectedNumber,
  inputRefs,
  onInput,
  onKeyDown,
  isCellValid
}) => {
  return (
    <div className="sudoku-grid">
      {(solution || board).map((row, i) =>
        row.map((_, j) => {
          const isOriginal = board[i][j] !== 0
          const showValue = solution ? solution[i][j] : board[i][j]
          const isHighlighted = selectedNumber !== null && showValue === selectedNumber && !isOriginal
          const isInvalid = !solution && board[i][j] !== 0 && !isCellValid(i, j)

          // 計算邊框粗細
          const borderTop = i === 0 ? '2px solid #222' : (i % 3 === 0 ? '2px solid #222' : '1px solid #bbb')
          const borderLeft = j === 0 ? '2px solid #222' : (j % 3 === 0 ? '2px solid #222' : '1px solid #bbb')
          const borderRight = j === 8 ? '2px solid #222' : 'none'
          const borderBottom = i === 8 ? '2px solid #222' : 'none'

          return (
            <input
              key={`${i}-${j}`}
              ref={el => { inputRefs.current[i][j] = el }}
              type="text"
              inputMode="numeric"
              maxLength={2}
              value={showValue === 0 ? '' : String(showValue)}
              onChange={e => onInput(i, j, e.target.value)}
              onKeyDown={e => onKeyDown(i, j, e)}
              disabled={!!solution}
              className={`sudoku-cell ${isOriginal ? 'original' : ''} ${isHighlighted ? 'highlighted' : ''} ${solution && !isOriginal ? 'solution' : ''} ${isInvalid ? 'invalid' : ''}`}
              style={{
                borderTop,
                borderLeft,
                borderRight,
                borderBottom,
              }}
            />
          )
        })
      )}
    </div>
  )
}

export default SudokuGrid 