import { useRef, useState } from 'react'
import './App.css'
import React from 'react'

const GRID_SIZE = 9

function App() {
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
  // 新增：Modal顯示狀態
  const [showModal, setShowModal] = useState(false)
  // 新增：訊息Modal狀態
  const [messageModal, setMessageModal] = useState<{ open: boolean, message: string, content?: string }>({ open: false, message: '' })
  // 新增：說明Modal狀態
  const [helpModal, setHelpModal] = useState(false)

  // 處理輸入
  const handleInput = (row: number, col: number, value: string) => {
    let num = 0
    if (value !== '') {
      // 支援全型數字轉換
      const fullWidthToHalf = value.replace(/[０-９]/g, (char) => {
        return String.fromCharCode(char.charCodeAt(0) - 0xFEE0)
      })
      
      num = parseInt(fullWidthToHalf)
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
    // 方向鍵切換 focus 格子
    if (e.key === 'ArrowUp' && row > 0) {
      e.preventDefault()
      inputRefs.current[row - 1][col]?.focus()
      return
    }
    if (e.key === 'ArrowDown' && row < GRID_SIZE - 1) {
      e.preventDefault()
      inputRefs.current[row + 1][col]?.focus()
      return
    }
    if (e.key === 'ArrowLeft' && col > 0) {
      e.preventDefault()
      inputRefs.current[row][col - 1]?.focus()
      return
    }
    if (e.key === 'ArrowRight' && col < GRID_SIZE - 1) {
      e.preventDefault()
      inputRefs.current[row][col + 1]?.focus()
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

  // 檢查數獨題目是否合法並返回錯誤訊息
  function getSudokuValidationError(board: number[][]): string | null {
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
  function isValidSudoku(board: number[][]): boolean {
    return getSudokuValidationError(board) === null
  }

  // 檢查特定格子是否合法
  function isCellValid(board: number[][], row: number, col: number): boolean {
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
  function solveSudoku(input: number[][]): number[][] | null {
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

  // 處理「解答」按鈕
  const handleSolve = () => {
    const ans = solveSudoku(board)
    if (ans === null) {
      showMessage('此題目無解！', '請檢查題目是否正確')
      return
    }
    
    setSolution(ans)
    setSelectedNumber(null) // 重置選中的數字
  }

  // 處理數字按鈕點選
  const handleNumberClick = (num: number) => {
    setSelectedNumber(selectedNumber === num ? null : num)
  }

  // 處理箭頭點擊
  const handleArrowClick = (direction: 'left' | 'right') => {
    if (selectedNumber !== null) {
      if (direction === 'left') {
        const prevNum = selectedNumber > 1 ? selectedNumber - 1 : 9
        setSelectedNumber(prevNum)
      } else {
        const nextNum = selectedNumber < 9 ? selectedNumber + 1 : 1
        setSelectedNumber(nextNum)
      }
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
  React.useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // 只有在解答模式下且有選中數字時才處理方向鍵切換數字
      if (solution && selectedNumber !== null) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault()
          const prevNum = selectedNumber > 1 ? selectedNumber - 1 : 9
          setSelectedNumber(prevNum)
        } else if (e.key === 'ArrowRight') {
          e.preventDefault()
          const nextNum = selectedNumber < 9 ? selectedNumber + 1 : 1
          setSelectedNumber(nextNum)
        }
      }
    }

    document.addEventListener('keydown', handleGlobalKeyDown)
    return () => document.removeEventListener('keydown', handleGlobalKeyDown)
  }, [solution, selectedNumber])

  // 判斷題目是否全空
  const isBoardEmpty = board.every(row => row.every(cell => cell === 0))

  return (
    <div className="app-container">
      {/* 使用說明 Modal */}
      {helpModal && (
        <div className="modal-backdrop" onClick={() => setHelpModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">使用說明</div>
            <div className="modal-help-content">
              <ol style={{textAlign: 'left', margin: 0, paddingLeft: '1.2em'}}>
                <li>在 9x9 數獨格子中輸入題目（可用鍵盤或貼上）。</li>
                <li>可點擊「貼上題目」快速貼入剪貼簿內容。</li>
                <li>在任意格子按 Ctrl+V (Windows) 或 Cmd+V (Mac) 可從該格子開始貼上數字。</li>
                <li>輸入完畢後，點擊「解答」即可獲得答案。</li>
                <li>點擊「複製題目」可將目前題目複製到剪貼簿。</li>
                <li>點擊「新一局」可清空所有內容（會再次確認）。</li>
                <li>解答模式下可點選下方數字高亮顯示。</li>
              </ol>
            </div>
            <div className="modal-actions">
              <button className="modal-confirm" onClick={() => setHelpModal(false)}>關閉</button>
            </div>
          </div>
        </div>
      )}
      {/* 訊息 Modal */}
      {messageModal.open && (
        <div className="modal-backdrop" onClick={closeMessage}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">{messageModal.message}</div>
            {messageModal.content && (
              <pre className="modal-pre">{messageModal.content}</pre>
            )}
            <div className="modal-actions">
              <button className="modal-confirm" onClick={closeMessage}>關閉</button>
            </div>
          </div>
        </div>
      )}
      {/* Modal 視窗 */}
      {showModal && (
        <div className="modal-backdrop" onClick={cancelNewGame}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">確定要清空所有題目內容嗎？</div>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={cancelNewGame}>取消</button>
              <button className="modal-confirm" onClick={confirmNewGame}>確認</button>
            </div>
          </div>
        </div>
      )}
      {/* 標題區域 */}
      <div className="title-section">
        <h1 className="main-title">
          <span className="title-icon">🧩</span>
          數獨解答神器
          <span className="title-icon">✨</span>
        </h1>
        <div className="subtitle-row">
          <p className="subtitle">輸入數獨題目，一鍵獲得解答！</p>
          <div className="help-btn-inline-wrapper">
            <button className="help-btn-inline" onClick={() => setHelpModal(true)} aria-label="使用說明">
              ⓘ
              <span className="help-tooltip">使用說明</span>
            </button>
          </div>
        </div>
      </div>

      {/* 主要遊戲區域 */}
      <div className="game-container">
        <div className="button-group">
          <button className="action-button paste-button" onClick={handlePaste}>
            📋 貼上題目
          </button>
          <button className="action-button copy-button" onClick={handleCopy}>
            📄 複製題目
          </button>
        </div>
        
        <div className="sudoku-grid">
          {(solution || board).map((row, i) =>
            row.map((_, j) => {
              const isOriginal = board[i][j] !== 0
              const showValue = solution ? solution[i][j] : board[i][j]
              const isHighlighted = selectedNumber !== null && showValue === selectedNumber && !isOriginal
              const isInvalid = !solution && board[i][j] !== 0 && !isCellValid(board, i, j)

              // 計算邊框粗細
              const borderTop = i === 0 ? '2px solid #222' : (i % 3 === 0 ? '2px solid #222' : '1px solid #bbb')
              const borderLeft = j === 0 ? '2px solid #222' : (j % 3 === 0 ? '2px solid #222' : '1px solid #bbb')
              const borderRight = j === 8 ? '2px solid #222' : 'none'
              const borderBottom = i === 8 ? '2px solid #222' : 'none'

              return (
                <input
                  key={`${i}-${j}`}
                  ref={el => { inputRefs.current[i][j] = el; return undefined }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={showValue === 0 ? '' : String(showValue)}
                  onChange={e => handleInput(i, j, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, j, e)}
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
      </div>

      {/* 控制按鈕區域 */}
      <div className="control-section">
        <div className="main-buttons">
          <div className="solve-button-wrapper">
            <button 
              className="solve-button" 
              onClick={handleSolve} 
              disabled={!!solution || isBoardEmpty || !isValidSudoku(board)}
              data-tooltip={!solution && !isBoardEmpty && !isValidSudoku(board) ? getSudokuValidationError(board) || '' : ''}
            >
              🎯 解答
            </button>
          </div>
          <button className="new-game-button" onClick={handleNewGame}>
            🎮 新一局
          </button>
        </div>
      </div>

      {/* 數字選擇器（僅在解答模式下顯示） */}
      {solution && (
        <div className="number-selector">
          <button
            className="arrow-button"
            onClick={() => handleArrowClick('left')}
          >
            ⬅️
          </button>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button
              key={num}
              onClick={() => handleNumberClick(num)}
              className={`number-button ${selectedNumber === num ? 'selected' : ''}`}
            >
              {num}
            </button>
          ))}
          <button
            className="arrow-button"
            onClick={() => handleArrowClick('right')}
          >
            ➡️
          </button>
        </div>
      )}
    </div>
  )
}

export default App
