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

  // 新一局功能
  const handleNewGame = () => {
    setBoard(Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0)))
    setSolution(null)
    setSelectedNumber(null)
  }

  // 複製題目到剪貼簿
  const handleCopy = async () => {
    const puzzleText = board.map(row => 
      row.map(cell => cell).join('')
    ).join('\n')
    
    try {
      await navigator.clipboard.writeText(puzzleText)
      alert('題目已複製到剪貼簿！')
    } catch (err) {
      console.error('複製失敗:', err)
      alert('複製失敗，請手動複製')
    }
  }

  // 貼上題目
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      const lines = text.trim().split('\n')
      
      if (lines.length !== 9) {
        alert('請貼上 9 行的數獨題目')
        return
      }
      
      const newBoard: number[][] = []
      for (let i = 0; i < 9; i++) {
        const line = lines[i].trim()
        if (line.length !== 9) {
          alert(`第 ${i + 1} 行長度不正確，應為 9 個數字`)
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
              alert(`第 ${i + 1} 行第 ${j + 1} 個字元不是有效數字`)
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
      alert('題目已貼上！')
    } catch (err) {
      console.error('貼上失敗:', err)
      alert('貼上失敗，請檢查剪貼簿內容')
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 32 }}>
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', top: -40, right: 0, display: 'flex', gap: 8 }}>
          <button
            onClick={handlePaste}
            style={{
              padding: '8px 16px',
              fontSize: 14,
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            貼上題目
          </button>
          <button
            onClick={handleCopy}
            style={{
              padding: '8px 16px',
              fontSize: 14,
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            複製題目
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${GRID_SIZE}, 32px)`, gap: 2 }}>
          {(solution || board).map((row, i) =>
            row.map((_, j) => {
              const isOriginal = board[i][j] !== 0
              const showValue = solution ? solution[i][j] : board[i][j]
              const isHighlighted = selectedNumber !== null && showValue === selectedNumber && !isOriginal
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
                  style={{
                    width: 32,
                    height: 32,
                    textAlign: 'center',
                    fontSize: 20,
                    border: '1px solid #aaa',
                    borderRight: (j + 1) % 3 === 0 ? '3px solid #333' : '1px solid #aaa',
                    borderBottom: (i + 1) % 3 === 0 ? '3px solid #333' : '1px solid #aaa',
                    borderLeft: j % 3 === 0 ? '3px solid #333' : '1px solid #aaa',
                    borderTop: i % 3 === 0 ? '3px solid #333' : '1px solid #aaa',
                    outline: 'none',
                    color: isHighlighted ? 'red' : (solution ? (isOriginal ? 'black' : 'blue') : 'black'),
                    background: isHighlighted ? '#ffe6e6' : (solution && !isOriginal ? '#eaf4ff' : 'white'),
                    fontWeight: isHighlighted ? 'bold' : (isOriginal ? 'bold' : 'normal'),
                  }}
                />
              )
            })
          )}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 16, marginTop: 24 }}>
        <button style={{ fontSize: 18 }} onClick={handleSolve} disabled={!!solution}>
          解答
        </button>
        <button 
          style={{ 
            fontSize: 18, 
            backgroundColor: '#ff9800', 
            color: 'white', 
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer'
          }} 
          onClick={handleNewGame}
        >
          新一局
        </button>
      </div>
      {solution && (
        <div style={{ display: 'flex', gap: 8, marginTop: 16, alignItems: 'center' }}>
          <button
            onClick={() => handleArrowClick('left')}
            style={{
              fontSize: 20,
              color: '#666',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '4px',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            ←
          </button>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button
              key={num}
              onClick={() => handleNumberClick(num)}
              style={{
                width: 40,
                height: 40,
                fontSize: 18,
                border: '2px solid #ccc',
                borderRadius: '50%',
                background: selectedNumber === num ? '#ff6b6b' : '#f0f0f0',
                color: selectedNumber === num ? 'white' : 'black',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => handleArrowClick('right')}
            style={{
              fontSize: 20,
              color: '#666',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '4px',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            →
          </button>
        </div>
      )}
    </div>
  )
}

export default App
