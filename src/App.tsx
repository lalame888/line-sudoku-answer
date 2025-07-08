import './App.css'
import { useState } from 'react'
import TitleSection from './components/shared/TitleSection'
import AuthorInfo from './components/shared/AuthorInfo'
import SolverAppSection from './components/solver/SolverAppSection'
import GameAppSection from './components/game/GameAppSection'
import HelpModal from './components/shared/HelpModal'

function App() {
  const [activeTab, setActiveTab] = useState<'solver' | 'game'>('solver')
  const [helpModal, setHelpModal] = useState(false)

  const handleHelpClick = () => {
    setHelpModal(true)
  }

  const handleCloseHelp = () => {
    setHelpModal(false)
  }

  return (
    <>
      {/* Nav 導覽列 */}
      <nav className="main-nav">
        <button className={`nav-tab${activeTab === 'solver' ? ' active' : ''}`} onClick={() => setActiveTab('solver')}>數獨解答器</button>
        <button className={`nav-tab${activeTab === 'game' ? ' active' : ''}`} onClick={() => setActiveTab('game')}>數獨遊戲</button>
      </nav>
      <div className="app-container">
        {/* 標題區域 */}
        <TitleSection mode={activeTab} onHelpClick={handleHelpClick} />
        {/* 主要遊戲區域 */}
        <div className="game-container">
          {activeTab === 'solver' ? (
            <SolverAppSection />
          ) : (
            <GameAppSection />
          )}
        </div>
      </div>
      <AuthorInfo />
      <HelpModal isOpen={helpModal} onClose={handleCloseHelp} />
    </>
  )
}

export default App
