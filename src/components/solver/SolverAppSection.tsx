import React from 'react'
import { useSudoku } from '../../hooks/useSudoku'
import SudokuGrid from './SudokuGrid'
import ControlSection from './ControlSection'
import SolverControls from './SolverControls'
import NumberSelector from './NumberSelector'
import ConfirmModal from '../shared/ConfirmModal'
import MessageModal from '../shared/MessageModal'

const SolverAppSection: React.FC = () => {
  const {
    board,
    solution,
    selectedNumber,
    showModal,
    messageModal,
    inputRefs,
    handleInput,
    handleKeyDown,
    handleSolve,
    handleNewGame,
    confirmNewGame,
    cancelNewGame,
    closeMessage,
    handleCopy,
    handlePaste,
    handleNumberClick,
    handleArrowClick,
    isValidSudoku,
    isCellValid,
    getSudokuValidationError,
    isBoardEmpty
  } = useSudoku()

  return (
    <>
      <ControlSection onPaste={handlePaste} onCopy={handleCopy} />
      <SudokuGrid
        board={board}
        solution={solution}
        selectedNumber={selectedNumber}
        inputRefs={inputRefs}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        isCellValid={isCellValid}
      />
      <SolverControls
        onSolve={handleSolve}
        onNewGame={handleNewGame}
        solution={solution}
        isBoardEmpty={isBoardEmpty()}
        isValidSudoku={isValidSudoku()}
        getSudokuValidationError={getSudokuValidationError}
      />
      {solution && (
        <NumberSelector
          selectedNumber={selectedNumber}
          onNumberClick={handleNumberClick}
          onArrowClick={handleArrowClick}
        />
      )}

      <ConfirmModal
        isOpen={showModal}
        title="確定要清空所有題目內容嗎？"
        onConfirm={confirmNewGame}
        onCancel={cancelNewGame}
      />
      <MessageModal
        isOpen={messageModal.open}
        message={messageModal.message}
        content={messageModal.content}
        onClose={closeMessage}
      />
    </>
  )
}

export default SolverAppSection 