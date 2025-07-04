import React from 'react'

interface ControlSectionProps {
  onPaste: () => void
  onCopy: () => void
}

const ControlSection: React.FC<ControlSectionProps> = ({
  onPaste,
  onCopy
}) => {
  return (
    <>
      {/* 上方按鈕組 */}
      <div className="button-group">
        <button className="action-button paste-button" onClick={onPaste}>
          📋 貼上題目
        </button>
        <button className="action-button copy-button" onClick={onCopy}>
          📄 複製題目
        </button>
      </div>
    </>
  )
}

export default ControlSection 