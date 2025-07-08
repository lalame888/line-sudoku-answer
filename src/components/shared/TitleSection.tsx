import React from 'react'

interface TitleSectionProps {
  mode?: 'solver' | 'game'
  onHelpClick: () => void
}

const TitleSection: React.FC<TitleSectionProps> = ({ mode = 'solver', onHelpClick }) => {
  return (
    <div className="title-section">
      <div className="main-title">
        {mode === 'solver' ? '數獨解答器' : '數獨遊戲'}
      </div>
      <div className="subtitle-row">
        <span className="subtitle">
          {mode === 'solver'
            ? '填入數獨題目，一鍵獲得解答'
            : '挑戰隨機生成的唯一解數獨題目'}
        </span>
        <span className="help-btn-inline-wrapper">
          <button className="help-btn-inline" onClick={onHelpClick}>
            <span className="help-btn-i">i</span>
            <span className="help-tooltip">使用說明</span>
          </button>
        </span>
      </div>
    </div>
  )
}

export default TitleSection 