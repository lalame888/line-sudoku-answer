export const GRID_SIZE = 9

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

 

// 數獨難度等級定義
export const Difficulty = {
  EASY: 'easy',
  MEDIUM: 'medium', 
  HARD: 'hard',
  EXPERT: 'expert',
  MASTER: 'master'
} as const

export type Difficulty = typeof Difficulty[keyof typeof Difficulty]

// 各難度對應的挖空數量範圍
const DIFFICULTY_HOLES = {
  [Difficulty.EASY]: { min: 30, max: 35 },
  [Difficulty.MEDIUM]: { min: 40, max: 45 },
  [Difficulty.HARD]: { min: 50, max: 55 },
  [Difficulty.EXPERT]: { min: 60, max: 65 },
  [Difficulty.MASTER]: { min: 70, max: 75 }
}

// 生成完整的數獨解答
function generateCompleteSudoku(): number[][] {
  const board: number[][] = Array.from({ length: 9 }, () => Array(9).fill(0))
  
  // 先填入第一行
  const firstRow = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  for (let i = 0; i < 9; i++) {
    board[0][i] = firstRow[i]
  }
  
  // 使用解答演算法完成剩餘部分
  const solution = solveSudoku(board)
  if (!solution) {
    throw new Error('無法生成完整數獨')
  }
  
  return solution
}

// 檢查數獨是否有唯一解
function hasUniqueSolution(board: number[][]): boolean {
  const solution = solveSudoku(board)
  if (!solution) return false
  
  // 找到第一個空格
  let emptyCell = null
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] === 0) {
        emptyCell = { row: i, col: j }
        break
      }
    }
    if (emptyCell) break
  }
  
  if (!emptyCell) return true // 沒有空格，只有一個解
  
  // 嘗試填入不同的數字，看是否有多個解
  const { row, col } = emptyCell
  let solutionCount = 0
  
  for (let num = 1; num <= 9; num++) {
    if (isValidMove(board, row, col, num)) {
      const testBoard = board.map(r => [...r])
      testBoard[row][col] = num
      if (solveSudoku(testBoard)) {
        solutionCount++
        if (solutionCount > 1) return false // 找到多個解
      }
    }
  }
  
  return solutionCount === 1
}

// 檢查在指定位置填入數字是否合法
function isValidMove(board: number[][], row: number, col: number, num: number): boolean {
  // 檢查行
  for (let c = 0; c < 9; c++) {
    if (board[row][c] === num) return false
  }
  
  // 檢查列
  for (let r = 0; r < 9; r++) {
    if (board[r][col] === num) return false
  }
  
  // 檢查宮格
  const startRow = Math.floor(row / 3) * 3
  const startCol = Math.floor(col / 3) * 3
  for (let r = startRow; r < startRow + 3; r++) {
    for (let c = startCol; c < startCol + 3; c++) {
      if (board[r][c] === num) return false
    }
  }
  
  return true
}

// 生成指定難度的數獨題目
export function generateSudokuPuzzle(difficulty: Difficulty): number[][] {
  const completeBoard = generateCompleteSudoku()
  const { min, max } = DIFFICULTY_HOLES[difficulty]
  const targetHoles = Math.floor(Math.random() * (max - min + 1)) + min
  
  let attempts = 0
  const maxAttempts = 1000
  
  while (attempts < maxAttempts) {
    const puzzle = completeBoard.map(row => [...row])
    const positions = []
    
    // 生成所有位置
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        positions.push({ row: i, col: j })
      }
    }
    
    // 隨機挖空指定數量的格子
    let holesCreated = 0
    while (holesCreated < targetHoles && positions.length > 0) {
      const randomIndex = Math.floor(Math.random() * positions.length)
      const { row, col } = positions.splice(randomIndex, 1)[0]
      puzzle[row][col] = 0
      holesCreated++
    }
    
    // 檢查是否有唯一解
    if (hasUniqueSolution(puzzle)) {
      return puzzle
    }
    
    attempts++
  }
  
  // 如果無法生成，返回一個較簡單的題目
  console.warn(`無法生成 ${difficulty} 難度的題目，使用預設題目`)
  return generateDefaultPuzzle(difficulty)
}

// 生成預設題目（當無法生成指定難度時使用）
function generateDefaultPuzzle(difficulty: Difficulty): number[][] {
  const { min } = DIFFICULTY_HOLES[difficulty]
  const completeBoard = generateCompleteSudoku()
  const puzzle = completeBoard.map(row => [...row])
  
  // 簡單地挖空前 min 個位置
  let holesCreated = 0
  for (let i = 0; i < 9 && holesCreated < min; i++) {
    for (let j = 0; j < 9 && holesCreated < min; j++) {
      puzzle[i][j] = 0
      holesCreated++
    }
  }
  
  return puzzle
}

// 獲取難度顯示名稱
export function getDifficultyName(difficulty: Difficulty): string {
  const names = {
    [Difficulty.EASY]: '簡單',
    [Difficulty.MEDIUM]: '中等',
    [Difficulty.HARD]: '困難',
    [Difficulty.EXPERT]: '專家',
    [Difficulty.MASTER]: '大師'
  }
  return names[difficulty]
} 