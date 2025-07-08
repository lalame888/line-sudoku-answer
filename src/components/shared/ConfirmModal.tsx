import React from 'react'
import Modal from './Modal'

interface ConfirmModalProps {
  isOpen: boolean
  title: string
  onConfirm: () => void
  onCancel: () => void
  confirmText?: string
  cancelText?: string
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ 
  isOpen, 
  title, 
  onConfirm, 
  onCancel, 
  confirmText = "確認", 
  cancelText = "取消" 
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title={title}
      actions={
        <>
          <button className="modal-cancel" onClick={onCancel}>{cancelText}</button>
          <button className="modal-confirm" onClick={onConfirm}>{confirmText}</button>
        </>
      }
    />
  )
}

export default ConfirmModal 