import React from 'react';
import './ConfirmModal.css';
import { FaExclamationTriangle } from 'react-icons/fa';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="confirm-modal-overlay">
      <div className="confirm-modal">
        <div className="confirm-modal-header">
          <div className="confirm-modal-icon">
            <FaExclamationTriangle />
          </div>
          <h3 className="confirm-modal-title">{title}</h3>
        </div>
        <div className="confirm-modal-body">
          <p className="confirm-modal-message">{message}</p>
        </div>
        <div className="confirm-modal-footer">
          <button className="btn btn-secondary" onClick={onCancel}>
            Hủy bỏ
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal; 