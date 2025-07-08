import React, { useState } from 'react'
import { useSudokuGame, type GameMode } from '../../hooks/useSudokuGame'
import { Difficulty } from '../../utils/sudokuUtils'
import GameSudokuGrid from './GameSudokuGrid'
import GameControls from './GameControls'
import GameStats from './GameStats'
import InputPad from './InputPad'
import DifficultySelector from './DifficultySelector'
import ConfirmModal from '../shared/ConfirmModal'

type ModalType = 'reset' | 'restart' | null

const GameAppSection: React.FC = () => {
  const [isGameStarted, setIsGameStarted] = useState(false)
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(Difficulty.EASY)
  const [showModal, setShowModal] = useState<ModalType>(null)
  
  const {
    gameState,
    selectedNumber,
    generateNewGame,
    selectCell,
    fillCell,
    toggleGameMode,
    clearCell,
    isCellConflicting,
    getHighlightedCells,
    resetGame,
    formatTime
  } = useSudokuGame()

  // 從 gameState 中取得狀態
  const {
    board,
    notes,
    selectedCell,
    isCompleted,
    timer,
    gameMode
  } = gameState

  // 處理難度選擇
  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setSelectedDifficulty(newDifficulty)
  }

  // 處理開始遊戲
  const handleStartGame = () => {
    generateNewGame(selectedDifficulty)
    setIsGameStarted(true)
  }

  // 處理數字選擇
  const handleNumberSelect = (num: number) => {
    if (selectedCell) {
      fillCell(selectedCell.row, selectedCell.col, num)
    }
  }

  // 處理模式切換
  const handleModeToggle = (mode: GameMode) => {
    // 如果切換到不同的模式，則調用 toggleGameMode
    if (mode !== gameMode) {
      toggleGameMode()
    }
  }

  // 處理重置（顯示確認 modal）
  const handleReset = () => {
    setShowModal('reset')
  }

  // 確認重置
  const handleConfirmReset = () => {
    resetGame()
    setShowModal(null)
  }

  // 取消重置
  const handleCancelReset = () => {
    setShowModal(null)
  }

  // 處理重新開始（顯示確認 modal）
  const handleRestart = () => {
    setShowModal('restart')
  }

  // 確認重新開始
  const handleConfirmRestart = () => {
    setIsGameStarted(false)
    setSelectedDifficulty(Difficulty.EASY)
    setShowModal(null)
  }

  // 取消重新開始
  const handleCancelRestart = () => {
    setShowModal(null)
  }

  // 如果遊戲還沒開始，顯示難度選擇介面
  if (!isGameStarted) {
    return (
      <div className="game-setup">
        <h2>選擇難度</h2>
        <DifficultySelector 
          selectedDifficulty={selectedDifficulty} 
          onDifficultyChange={handleDifficultyChange}
          onNewGame={handleStartGame}
        />
      </div>
    )
  }

  // 遊戲開始後顯示完整遊戲介面
  return (
    <>
      <GameStats 
        timer={timer}
        isCompleted={isCompleted}
        formatTime={formatTime}
        onReset={handleReset}
      />
      <GameSudokuGrid
        board={board}
        originalBoard={gameState.originalBoard}
        notes={notes}
        selectedCell={selectedCell}
        highlightedCells={getHighlightedCells()}
        onCellClick={selectCell}
        onClearCell={clearCell}
        isCellConflicting={isCellConflicting}
      />
      <InputPad
        currentMode={gameMode}
        onModeChange={handleModeToggle}
        selectedNumber={selectedNumber}
        onNumberClick={handleNumberSelect}
        onClear={() => selectedCell && clearCell(selectedCell.row, selectedCell.col)}
      />
      <GameControls 
        isCompleted={isCompleted} 
        onShowSolution={() => {}}
        onRestart={handleRestart}
      />
      <ConfirmModal
        isOpen={showModal === 'reset'}
        title="確定要清空所有填答嗎？"
        onConfirm={handleConfirmReset}
        onCancel={handleCancelReset}
      />
      <ConfirmModal
        isOpen={showModal === 'restart'}
        title="確定要放棄目前進度，重新開始新一局遊戲嗎？"
        onConfirm={handleConfirmRestart}
        onCancel={handleCancelRestart}
      />
    </>
  )
}

export default GameAppSection 