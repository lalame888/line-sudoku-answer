import './App.css'
import { useSudoku } from './hooks/useSudoku'
import TitleSection from './components/TitleSection'
import SudokuGrid from './components/SudokuGrid'
import ControlSection from './components/ControlSection'
import GameControls from './components/GameControls'
import NumberSelector from './components/NumberSelector'
import HelpModal from './components/HelpModal'
import MessageModal from './components/MessageModal'
import ConfirmModal from './components/ConfirmModal'
import AuthorInfo from './components/AuthorInfo'

function App() {
  const {
    board,
    solution,
    selectedNumber,
    showModal,
    messageModal,
    helpModal,
    inputRefs,
    handleInput,
    handleKeyDown,
    handleSolve,
    handleNumberClick,
    handleArrowClick,
    handleNewGame,
    confirmNewGame,
    cancelNewGame,
    closeMessage,
    handleCopy,
    handlePaste,
    setHelpModal,
    isValidSudoku,
    isCellValid,
    getSudokuValidationError,
    isBoardEmpty
  } = useSudoku()

  return (
    <>
      <div className="app-container">
        {/* 使用說明 Modal */}
        <HelpModal 
          isOpen={helpModal} 
          onClose={() => setHelpModal(false)} 
        />
        
        {/* 訊息 Modal */}
        <MessageModal
          isOpen={messageModal.open}
          message={messageModal.message}
          content={messageModal.content}
          onClose={closeMessage}
        />
        
        {/* 確認 Modal */}
        <ConfirmModal
          isOpen={showModal}
          title="確定要清空所有題目內容嗎？"
          onConfirm={confirmNewGame}
          onCancel={cancelNewGame}
        />
        
        {/* 標題區域 */}
        <TitleSection onHelpClick={() => setHelpModal(true)} />

        {/* 主要遊戲區域 */}
        <div className="game-container">
          {/* 上方按鈕組 */}
          <ControlSection
            onPaste={handlePaste}
            onCopy={handleCopy}
          />
          
          {/* 數獨格子 */}
          <SudokuGrid
            board={board}
            solution={solution}
            selectedNumber={selectedNumber}
            inputRefs={inputRefs}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            isCellValid={isCellValid}
          />
          
          {/* 下方控制按鈕 */}
          <GameControls
            onSolve={handleSolve}
            onNewGame={handleNewGame}
            solution={solution}
            isBoardEmpty={isBoardEmpty()}
            isValidSudoku={isValidSudoku()}
            getSudokuValidationError={getSudokuValidationError}
          />
        </div>

        {/* 數字選擇器（僅在解答模式下顯示） */}
        {solution && (
          <NumberSelector
            selectedNumber={selectedNumber}
            onNumberClick={handleNumberClick}
            onArrowClick={handleArrowClick}
          />
        )}
      </div>
      
      {/* 作者資訊 */}
      <AuthorInfo />
    </>
  )
}

export default App
