import React, { useState } from 'react';
import './TimeFilterModal.css';

const TimeFilterModal = ({ onClose, onSubmit }) => {
    const [days, setDays] = useState(30);

    const handleSubmit = () => {
        onSubmit(days);
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Выберите период для отчета (дни)</h2>
                <input
                    type="number"
                    value={days}
                    min={1}
                    onChange={(e) => setDays(Number(e.target.value))}
                    className="days-input"
                />
                <button onClick={handleSubmit} className="apply-button">Применить</button>
                <button onClick={onClose} className="close-button">Закрыть</button>
            </div>
        </div>
    );
};

export default TimeFilterModal;
