const GRID_SIZE = 9

// 檢查數獨題目是否合法並返回錯誤訊息
export function getSudokuValidationError(board: number[][]): string | null {
  // 檢查行
  for (let row = 0; row < 9; row++) {
    const seen = new Set<number>()
    for (let col = 0; col < 9; col++) {
      const num = board[row][col]
      if (num !== 0) {
        if (seen.has(num)) {
          return `第 ${row + 1} 行有重複的數字 ${num}`
        }
        seen.add(num)
      }
    }
  }

  // 檢查列
  for (let col = 0; col < 9; col++) {
    const seen = new Set<number>()
    for (let row = 0; row < 9; row++) {
      const num = board[row][col]
      if (num !== 0) {
        if (seen.has(num)) {
          return `第 ${col + 1} 列有重複的數字 ${num}`
        }
        seen.add(num)
      }
    }
  }

  // 檢查 3x3 宮格
  for (let box = 0; box < 9; box++) {
    const seen = new Set<number>()
    const startRow = Math.floor(box / 3) * 3
    const startCol = (box % 3) * 3
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const num = board[startRow + i][startCol + j]
        if (num !== 0) {
          if (seen.has(num)) {
            const boxRow = Math.floor(box / 3) + 1
            const boxCol = (box % 3) + 1
            return `第 ${boxRow} 行第 ${boxCol} 個宮格有重複的數字 ${num}`
          }
          seen.add(num)
        }
      }
    }
  }

  return null
}

// 檢查數獨題目是否合法
export function isValidSudoku(board: number[][]): boolean {
  return getSudokuValidationError(board) === null
}

// 檢查特定格子是否合法
export function isCellValid(board: number[][], row: number, col: number): boolean {
  const num = board[row][col]
  if (num === 0) return true

  // 檢查同一行
  for (let c = 0; c < 9; c++) {
    if (c !== col && board[row][c] === num) {
      return false
    }
  }

  // 檢查同一列
  for (let r = 0; r < 9; r++) {
    if (r !== row && board[r][col] === num) {
      return false
    }
  }

  // 檢查同一宮格
  const startRow = Math.floor(row / 3) * 3
  const startCol = Math.floor(col / 3) * 3
  for (let r = startRow; r < startRow + 3; r++) {
    for (let c = startCol; c < startCol + 3; c++) {
      if ((r !== row || c !== col) && board[r][c] === num) {
        return false
      }
    }
  }

  return true
}

// 數獨解答演算法
export function solveSudoku(input: number[][]): number[][] | null {
  // 深拷貝
  const board = input.map(row => [...row])
  function isValid(row: number, col: number, num: number): boolean {
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === num || board[i][col] === num) return false
    }
    const startRow = Math.floor(row / 3) * 3
    const startCol = Math.floor(col / 3) * 3
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[startRow + i][startCol + j] === num) return false
      }
    }
    return true
  }
  function backtrack(): boolean {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (board[i][j] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValid(i, j, num)) {
              board[i][j] = num
              if (backtrack()) return true
              board[i][j] = 0
            }
          }
          return false
        }
      }
    }
    return true
  }
  if (backtrack()) return board
  return null
}

// 判斷題目是否全空
export function isBoardEmpty(board: number[][]): boolean {
  return board.every(row => row.every(cell => cell === 0))
}

export { GRID_SIZE } 