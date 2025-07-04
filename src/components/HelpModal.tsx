import React from 'react'
import Modal from './Modal'

interface HelpModalProps {
  isOpen: boolean
  onClose: () => void
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="使用說明"
      actions={
        <button className="modal-confirm" onClick={onClose}>關閉</button>
      }
    >
      <div className="modal-help-content">
        <ol style={{textAlign: 'left', margin: 0, paddingLeft: '1.2em'}}>
          <li>在 9x9 數獨格子中輸入題目，可用0 代表空格，以及使用方向鍵移動焦點。</li>
          <li>可點擊「貼上題目」快速貼入剪貼簿內容。</li>
          <li>在任意格子按 Ctrl+V (Windows) 或 Cmd+V (Mac) 可從該格子開始貼上數字。</li>
          <li>輸入完畢後，點擊「解答」即可獲得答案。</li>
          <li>點擊「複製題目」可將目前題目複製到剪貼簿。</li>
          <li>點擊「新一局」可清空所有內容。</li>
          <li>解答模式下可點選下方數字高亮顯示。</li>
        </ol>
      </div>
    </Modal>
  )
}

export default HelpModal 