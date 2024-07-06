import React from 'react';
import '../app/AlertDialog.css';

function AlertDialog({ message, onClose, transactionHash }) {
    if (!message) return null;

    const transactionUrl = `https://sepolia.voyager.online/tx/${transactionHash}`;

    return (
        <div className="alert-dialog-overlay">
            <div className="alert-dialog-content">
                <p>{message}</p>
                <button className="alert-dialog-close-button" onClick={onClose}>Close</button>
                <button
                    className="alert-dialog-link-button"
                    onClick={() => window.open(transactionUrl, '_blank')}
                    style={{ marginLeft: '10px' }}
                >
                    See Transaction
                </button>
            </div>
        </div>
    );
}

export default AlertDialog;