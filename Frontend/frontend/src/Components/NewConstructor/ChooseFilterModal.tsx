import React, { useState } from 'react';
import './ChooseFilterModal.css';

const ChooseFiltersModal = ({ filters, onClose, onSubmit, activeColumns }) => {
    const [selectedFields, setSelectedFields] = useState([]);

    const handleFieldClick = (field) => {
        if (selectedFields.includes(field)) {
            setSelectedFields(selectedFields.filter((f) => f !== field));
        } else {
            setSelectedFields([...selectedFields, field]);
        }
    };

    const handleSubmit = () => {
        onSubmit(selectedFields);
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Сформировать графики по:</h2>
                <div className="filters-container">
                    {filters.filter((filter) => !activeColumns.includes(filter)).map((filter) => (
                        <div
                            key={filter}
                            className={`filter-item ${selectedFields.includes(filter) ? 'selected' : ''}`}
                            onClick={() => handleFieldClick(filter)}
                        >
                            {filter}
                        </div>
                    ))}
                </div>
                <button onClick={handleSubmit} className="apply-button">Применить</button>
                <button onClick={onClose} className="close-button">Закрыть</button>
            </div>
        </div>
    );
};

export default ChooseFiltersModal;
