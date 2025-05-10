import React from 'react';

interface ModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isOpen: boolean;
}

export const Modal: React.FC<ModalProps> = ({ 
  title, 
  message, 
  onConfirm, 
  onCancel,
  isOpen
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
    >
      <div className="modal-container" 
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          maxWidth: '500px',
          width: '90%',
          padding: '20px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div className="modal-header" style={{ marginBottom: '15px' }}>
          <h3 style={{ 
            fontSize: '18px', 
            margin: 0, 
            fontWeight: 600,
            color: '#222'
          }}>{title}</h3>
        </div>
        
        <div className="modal-body" style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '14px', lineHeight: '1.5', color: '#555' }}>{message}</p>
        </div>
        
        <div className="modal-footer" style={{ 
          display: 'flex', 
          justifyContent: 'flex-end',
          gap: '10px'
        }}>
          <button 
            onClick={onCancel}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f5f5f5',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Hủy
          </button>
          <button 
            onClick={onConfirm}
            style={{
              padding: '8px 16px',
              backgroundColor: '#e94560',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}; 