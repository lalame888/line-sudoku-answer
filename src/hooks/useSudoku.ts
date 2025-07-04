import { useState, useRef, useEffect } from 'react'
import { 
  GRID_SIZE, 
  solveSudoku, 
  isValidSudoku, 
  isCellValid, 
  getSudokuValidationError, 
  isBoardEmpty 
} from '../utils/sudokuUtils'
import React from 'react'

export const useSudoku = () => {
  // 儲存使用者輸入的題目
  const [board, setBoard] = useState<number[][]>(Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0)))
  // focus 控制
  const inputRefs = useRef<(HTMLInputElement | null)[][]>(
    Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null))
  )
  
  // 儲存解答
  const [solution, setSolution] = useState<number[][] | null>(null)
  // 儲存選中的數字
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null)
  // Modal顯示狀態
  const [showModal, setShowModal] = useState(false)
  // 訊息Modal狀態
  const [messageModal, setMessageModal] = useState<{ open: boolean, message: string, content?: string }>({ open: false, message: '' })
  // 說明Modal狀態
  const [helpModal, setHelpModal] = useState(false)

  // 處理輸入
  const handleInput = (row: number, col: number, value: string) => {
    console.log(value)
    let num = 0
    if (value !== '') {
      // 支援全型數字轉換
      const fullWidthToHalf = value.trim().replace(/[０-９]/g, (char) => {
        return String.fromCharCode(char.charCodeAt(0) - 0xFEE0)
      })
      
      // 取得舊值
      const oldValue = board[row][col]
      
      // 判斷新輸入的數字
      if (fullWidthToHalf.length === 1) {
        // 如果只有一個字元，直接使用
        num = parseInt(fullWidthToHalf)
      } else if (fullWidthToHalf.length === 2) {
        // 如果有兩個字元，比較哪個是新輸入的
        const first = parseInt(fullWidthToHalf[0])
        const second = parseInt(fullWidthToHalf[1])
        
        if (first === oldValue) {
          num = second // 第一個是舊值，第二個是新值
        } else if (second === oldValue) {
          num = first // 第二個是舊值，第一個是新值
        } else {
          // 如果都不等於舊值，使用最後一個字元
          num = second
        }
      } else {
        // 其他情況使用最後一個字元
        num = parseInt(fullWidthToHalf.slice(-1))
      }
      
      if (isNaN(num) || num < 0 || num > 9) return // 非法輸入不處理
    }
    const newBoard = board.map((r, i) =>
      r.map((c, j) => (i === row && j === col ? num : c))
    )
    setBoard(newBoard)
    // 自動跳到下一格
    if (value !== '' && num >= 0 && num <= 9) {
      if (col < GRID_SIZE - 1) {
        inputRefs.current[row][col + 1]?.focus()
      } else if (row < GRID_SIZE - 1) {
        inputRefs.current[row + 1][0]?.focus()
      }
    }
  }

  // 處理鍵盤（允許 Backspace 跳回上一格）
  const handleKeyDown = (row: number, col: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // 方向鍵切換 focus 格子（支援循環穿越）
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const newRow = row > 0 ? row - 1 : GRID_SIZE - 1
      inputRefs.current[newRow][col]?.focus()
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const newRow = row < GRID_SIZE - 1 ? row + 1 : 0
      inputRefs.current[newRow][col]?.focus()
      return
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      const newCol = col > 0 ? col - 1 : GRID_SIZE - 1
      inputRefs.current[row][newCol]?.focus()
      return
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      const newCol = col < GRID_SIZE - 1 ? col + 1 : 0
      inputRefs.current[row][newCol]?.focus()
      return
    }
    
    // Backspace 跳回上一格
    if (e.key === 'Backspace' && board[row][col] === 0) {
      if (col > 0) {
        inputRefs.current[row][col - 1]?.focus()
      } else if (row > 0) {
        inputRefs.current[row - 1][GRID_SIZE - 1]?.focus()
      }
    }

    // 處理貼上功能 (Ctrl+V 或 Cmd+V)
    if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
      e.preventDefault()
      handlePasteFromCell(row, col)
    }
  }

  // 從指定格子開始貼上剪貼簿內容
  const handlePasteFromCell = async (startRow: number, startCol: number) => {
    try {
      const text = await navigator.clipboard.readText()
      const digits = text.replace(/[^0-9]/g, '') // 只保留數字
      
      if (digits.length === 0) {
        showMessage('剪貼簿中沒有找到數字')
        return
      }

      const newBoard = board.map(row => [...row])
      let currentRow = startRow
      let currentCol = startCol
      let pastedCount = 0

      for (const digit of digits) {
        const num = parseInt(digit)
        if (num >= 0 && num <= 9) {
          newBoard[currentRow][currentCol] = num
          pastedCount++
          
          // 移到下一個格子
          if (currentCol < GRID_SIZE - 1) {
            currentCol++
          } else if (currentRow < GRID_SIZE - 1) {
            currentRow++
            currentCol = 0
          } else {
            // 已經填滿整個格子，停止貼上
            break
          }
        }
      }

      setBoard(newBoard)
      setSolution(null) // 清除之前的解答
      setSelectedNumber(null) // 清除選中的數字
      
      if (pastedCount === 0) {
        showMessage('沒有有效的數字可以貼上')
      }
    } catch (err) {
      console.error('貼上失敗:', err)
      showMessage('貼上失敗，請檢查剪貼簿內容')
    }
  }

  // 處理「解答」按鈕
  const handleSolve = () => {
    const ans = solveSudoku(board)
    if (ans === null) {
      showMessage('此題目無解！', '請檢查題目是否正確')
      return
    }
    
    setSolution(ans)
    setSelectedNumber(1) // 預設選擇數字 1
  }

  // 處理數字按鈕點選
  const handleNumberClick = (num: number) => {
    setSelectedNumber(selectedNumber === num ? null : num)
  }

  // 處理箭頭點擊
  const handleArrowClick = (direction: 'left' | 'right') => {
    // 如果沒有選擇任何數字，預設選擇 1
    if (selectedNumber === null) {
      setSelectedNumber(1)
      return
    }
    const currentNumber = selectedNumber;
    
    if (direction === 'left') {
      const prevNum = currentNumber > 1 ? currentNumber - 1 : 9
      setSelectedNumber(prevNum)
    } else {
      const nextNum = currentNumber < 9 ? currentNumber + 1 : 1
      setSelectedNumber(nextNum)
    }
  }

  // 新一局功能（只顯示Modal，不直接清空）
  const handleNewGame = () => {
    setShowModal(true)
  }

  // 真正執行清空
  const confirmNewGame = () => {
    setBoard(Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0)))
    setSolution(null)
    setSelectedNumber(null)
    setShowModal(false)
  }

  // 取消清空
  const cancelNewGame = () => {
    setShowModal(false)
  }

  // 顯示訊息Modal
  const showMessage = (msg: string, content?: string) => setMessageModal({ open: true, message: msg, content })
  const closeMessage = () => setMessageModal({ open: false, message: '', content: undefined })

  // 複製題目到剪貼簿
  const handleCopy = async () => {
    const puzzleText = board.map(row => 
      row.map(cell => cell).join('')
    ).join('\n')
    try {
      await navigator.clipboard.writeText(puzzleText)
      showMessage('題目已複製到剪貼簿！', puzzleText)
    } catch (err) {
      console.error('複製失敗:', err)
      showMessage('複製失敗，請手動複製')
    }
  }

  // 貼上題目
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      const lines = text.trim().split('\n')
      if (lines.length !== 9) {
        showMessage('請貼上 9 行的數獨題目')
        return
      }
      const newBoard: number[][] = []
      for (let i = 0; i < 9; i++) {
        const line = lines[i].trim()
        if (line.length !== 9) {
          showMessage(`第 ${i + 1} 行長度不正確，應為 9 個數字`)
          return
        }
        const row: number[] = []
        for (let j = 0; j < 9; j++) {
          const char = line[j]
          if (char === '0' || char === '.') {
            row.push(0)
          } else {
            const num = parseInt(char)
            if (isNaN(num) || num < 1 || num > 9) {
              showMessage(`第 ${i + 1} 行第 ${j + 1} 個字元不是有效數字`)
              return
            }
            row.push(num)
          }
        }
        newBoard.push(row)
      }
      setBoard(newBoard)
      setSolution(null) // 清除之前的解答
      setSelectedNumber(null) // 清除選中的數字
      showMessage('題目已貼上！')
    } catch (err) {
      console.error('貼上失敗:', err)
      showMessage('貼上失敗，請檢查剪貼簿內容')
    }
  }

  // 全域鍵盤事件處理（僅在解答模式下處理數字切換）
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // 只有在解答模式下且有選中數字時才處理方向鍵切換數字
      if (solution && selectedNumber !== null) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault()
          // 如果沒有選擇任何數字，預設選擇 1
          const currentNumber = selectedNumber !== null ? selectedNumber : 1
          const prevNum = currentNumber > 1 ? currentNumber - 1 : 9
          setSelectedNumber(prevNum)
        } else if (e.key === 'ArrowRight') {
          e.preventDefault()
          // 如果沒有選擇任何數字，預設選擇 1
          const currentNumber = selectedNumber !== null ? selectedNumber : 1
          const nextNum = currentNumber < 9 ? currentNumber + 1 : 1
          setSelectedNumber(nextNum)
        }
      }
    }

    document.addEventListener('keydown', handleGlobalKeyDown)
    return () => document.removeEventListener('keydown', handleGlobalKeyDown)
  }, [solution, selectedNumber])

  return {
    board,
    solution,
    selectedNumber,
    showModal,
    messageModal,
    helpModal,
    inputRefs,
    handleInput,
    handleKeyDown,
    handlePasteFromCell,
    handleSolve,
    handleNumberClick,
    handleArrowClick,
    handleNewGame,
    confirmNewGame,
    cancelNewGame,
    showMessage,
    closeMessage,
    handleCopy,
    handlePaste,
    setHelpModal,
    isValidSudoku: () => isValidSudoku(board),
    isCellValid: (row: number, col: number) => isCellValid(board, row, col),
    getSudokuValidationError: () => getSudokuValidationError(board),
    isBoardEmpty: () => isBoardEmpty(board)
  }
} 