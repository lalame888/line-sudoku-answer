import React from 'react'

interface TitleSectionProps {
  onHelpClick: () => void
}

const TitleSection: React.FC<TitleSectionProps> = ({ onHelpClick }) => {
  return (
    <div className="title-section">
      <h1 className="main-title">
        <span className="title-icon">🧩</span>
        數獨解答神器
        <span className="title-icon">✨</span>
      </h1>
      <div className="subtitle-row">
        <p className="subtitle">輸入數獨題目，一鍵獲得解答！</p>
        <div className="help-btn-inline-wrapper">
          <button className="help-btn-inline" onClick={onHelpClick} aria-label="使用說明">
            ⓘ
            <span className="help-tooltip">使用說明</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default TitleSection 