import React from 'react'

interface TabSelectorProps {
  activeTab: 'solver' | 'game'
  onTabChange: (tab: 'solver' | 'game') => void
}

const TabSelector: React.FC<TabSelectorProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="tab-selector">
      <button
        className={`tab-button ${activeTab === 'solver' ? 'active' : ''}`}
        onClick={() => onTabChange('solver')}
      >
        數獨解答器
      </button>
      <button
        className={`tab-button ${activeTab === 'game' ? 'active' : ''}`}
        onClick={() => onTabChange('game')}
      >
        數獨遊戲
      </button>
    </div>
  )
}

export default TabSelector 