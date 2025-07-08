import React from 'react'
import Modal from './Modal'

interface MessageModalProps {
  isOpen: boolean
  message: string
  content?: string
  onClose: () => void
}

const MessageModal: React.FC<MessageModalProps> = ({ isOpen, message, content, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={message}
      actions={
        <button className="modal-confirm" onClick={onClose}>關閉</button>
      }
    >
      {content && (
        <pre className="modal-pre">{content}</pre>
      )}
    </Modal>
  )
}

export default MessageModal 