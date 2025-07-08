import { useState, useRef, useEffect, useMemo } from 'react'
import { 
  GRID_SIZE, 
  Difficulty, 
  generateSudokuPuzzle, 
  getDifficultyName,
  solveSudoku
} from '../utils/sudokuUtils'

export interface NoteCell {
  [key: number]: boolean // 數字 -> 是否標記
}

export type GameMode = 'fill' | 'note'

export interface GameState {
  board: number[][]
  originalBoard: number[][] // 原始題目（不可修改的部分）
  notes: NoteCell[][]
  selectedCell: { row: number; col: number } | null
  difficulty: Difficulty
  isGameMode: boolean
  isCompleted: boolean
  mistakes: number
  timer: number
  isTimerRunning: boolean
  gameMode: GameMode // 新增：填入模式或筆記模式
}

export const useSudokuGame = () => {
  // 遊戲狀態
  const [gameState, setGameState] = useState<GameState>({
    board: Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0)),
    originalBoard: Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0)),
    notes: Array.from({ length: GRID_SIZE }, () => 
      Array.from({ length: GRID_SIZE }, () => ({}))
    ),
    selectedCell: null,
    difficulty: Difficulty.EASY,
    isGameMode: false,
    isCompleted: false,
    mistakes: 0,
    timer: 0,
    isTimerRunning: false,
    gameMode: 'fill' // 預設為填入模式
  })

  // 計時器 ref
  const timerRef = useRef<number | null>(null)

  // 使用 useMemo 計算 selectedNumber
  const selectedNumber = useMemo(() => {
    if (!gameState.selectedCell) {
      return []
    }
    
    const { row, col } = gameState.selectedCell
    const cellValue = gameState.board[row][col]
    const cellNotes = gameState.notes[row][col]
    
    if (cellValue !== 0) {
      // 如果格子有填答，則選中該數字
      return [cellValue]
    } else {
      // 如果格子沒有填答，則選中所有筆記數字
      return Object.keys(cellNotes)
        .filter(key => cellNotes[parseInt(key)])
        .map(key => parseInt(key))
    }
  }, [gameState.selectedCell, gameState.board, gameState.notes])

  // 開始計時器
  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    
    timerRef.current = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        timer: prev.timer + 1
      }))
    }, 1000)
  }

  // 停止計時器
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }



  // 生成新遊戲
  const generateNewGame = (difficulty: Difficulty) => {
    const puzzle = generateSudokuPuzzle(difficulty)
    const originalBoard = puzzle.map(row => [...row])
    
    setGameState(prev => ({
      ...prev,
      board: puzzle.map(row => [...row]),
      originalBoard,
      notes: Array.from({ length: GRID_SIZE }, () => 
        Array.from({ length: GRID_SIZE }, () => ({}))
      ),
      selectedCell: null,
      difficulty,
      isGameMode: true,
      isCompleted: false,
      mistakes: 0,
      timer: 0,
      isTimerRunning: true,
      gameMode: 'fill'
    }))

    startTimer()
  }

  // 選擇格子
  const selectCell = (row: number, col: number) => {
    setGameState(prev => ({
      ...prev,
      selectedCell: { row, col }
    }))
  }

   // 切換遊戲模式（填入/筆記）
  const toggleGameMode = () => {
    setGameState(prev => ({
      ...prev,
      gameMode: prev.gameMode === 'fill' ? 'note' : 'fill'
    }))
  }

  // 填入數字或筆記
  const fillCell = (row: number, col: number, number: number) => {
    // 檢查是否為原始題目的格子
    if (gameState.originalBoard[row][col] !== 0) {
      return
    }

    setGameState(prev => {
      const newBoard = prev.board.map(r => [...r])
      const newNotes = prev.notes.map(r => r.map(c => ({ ...c })))
      
      if (prev.gameMode === 'fill') {
        // 填入模式：填入數字並清除筆記
        newBoard[row][col] = number
        newNotes[row][col] = {}
      } else {
        // 筆記模式：只能在空格子添加筆記
        if (prev.board[row][col] === 0) {
          newNotes[row][col][number] = !newNotes[row][col][number]
        }
      }
      
      // 檢查是否完成
      const isCompleted = newBoard.every((r) => 
        r.every((c) => c !== 0)
      )

      return {
        ...prev,
        board: newBoard,
        notes: newNotes,
        isCompleted,
        isTimerRunning: !isCompleted
      }
    })

    // 如果完成，停止計時器
    if (gameState.board.every((r) => 
      r.every((c) => c !== 0)
    )) {
      stopTimer()
    }
  }

  // 清除格子
  const clearCell = (row: number, col: number) => {
    // 檢查是否為原始題目的格子
    if (gameState.originalBoard[row][col] !== 0) {
      return
    }

    setGameState(prev => {
      const newBoard = prev.board.map(r => [...r])
      const newNotes = prev.notes.map(r => r.map(c => ({ ...c })))
      
      newBoard[row][col] = 0
      newNotes[row][col] = {}
      
      return {
        ...prev,
        board: newBoard,
        notes: newNotes
      }
    })
  }

  // 檢查格子是否為原始題目
  const isOriginalCell = (row: number, col: number): boolean => {
    return gameState.originalBoard[row][col] !== 0
  }

  // 檢查填入的數字是否正確
  const isCellCorrect = (row: number, col: number): boolean => {
    const solution = solveSudoku(gameState.originalBoard)
    if (!solution) return false
    return gameState.board[row][col] === solution[row][col]
  }

  // 檢查填入的數字是否有衝突（用於紅色顯示）
  const isCellConflicting = (row: number, col: number): boolean => {
    const value = gameState.board[row][col]
    if (value === 0) return false

    // 檢查同一行
    for (let c = 0; c < GRID_SIZE; c++) {
      if (c !== col && gameState.board[row][c] === value) {
        return true
      }
    }

    // 檢查同一列
    for (let r = 0; r < GRID_SIZE; r++) {
      if (r !== row && gameState.board[r][col] === value) {
        return true
      }
    }

    // 檢查同一宮格
    const startRow = Math.floor(row / 3) * 3
    const startCol = Math.floor(col / 3) * 3
    for (let r = startRow; r < startRow + 3; r++) {
      for (let c = startCol; c < startCol + 3; c++) {
        if ((r !== row || c !== col) && gameState.board[r][c] === value) {
          return true
        }
      }
    }

    return false
  }

  // 獲取高亮顯示的格子
  const getHighlightedCells = () => {
    const highlighted: { row: number; col: number; type: 'selected' | 'same-number' | 'cross' }[] = []
    
    if (!gameState.selectedCell) return highlighted

    const { row, col } = gameState.selectedCell
    const cellValue = gameState.board[row][col]

    // 選中的格子
    highlighted.push({ row, col, type: 'selected' })

    // 十字高亮
    for (let i = 0; i < GRID_SIZE; i++) {
      if (i !== row) highlighted.push({ row: i, col, type: 'cross' })
      if (i !== col) highlighted.push({ row, col: i, type: 'cross' })
    }

    // 相同數字高亮（基於選中格子的值）
    if (cellValue !== 0) {
      for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
          if (gameState.board[i][j] === cellValue && (i !== row || j !== col)) {
            highlighted.push({ row: i, col: j, type: 'same-number' })
          }
        }
      }
    }

    return highlighted
  }

  // 重置遊戲
  const resetGame = () => {
    setGameState(prev => ({
      ...prev,
      board: prev.originalBoard.map(row => [...row]),
      notes: Array.from({ length: GRID_SIZE }, () => 
        Array.from({ length: GRID_SIZE }, () => ({}))
      ),
      selectedCell: null,
      isCompleted: false,
      mistakes: 0,
      isTimerRunning: true,
      gameMode: 'fill'
    }))
    startTimer()
  }

  // 格式化時間顯示
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  // 清理計時器
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  return {
    gameState,
    selectedNumber, // 添加計算出的 selectedNumber
    generateNewGame,
    selectCell,
    fillCell,
    toggleGameMode,
    clearCell,
    isOriginalCell,
    isCellCorrect,
    isCellConflicting,
    getHighlightedCells,
    resetGame,
    formatTime,
    getDifficultyName
  }
} 