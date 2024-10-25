import React, { useState } from 'react';
import './Constructor.css';

const Constructor = () => {
  const [isForming, setIsForming] = useState(false);
  
  const presetColors = ['rgb(190, 15, 15)', 'rgb(15, 190, 175)', 'rgb(245, 182, 56)'];

  const [filters, setFilters] = useState([
    {
      id: 1,
      options: [
        { text: 'Вариант 1', color: presetColors[0] },
        { text: 'Вариант 2', color: presetColors[1] },
        { text: 'Вариант 3', color: presetColors[2] },
      ],
      selected: null,
    },
  ]);

  const handleStartForming = () => {
    setIsForming(true);
  };

  const handleOptionClick = (filterId, option) => {
    const updatedFilters = filters.map((filter) => {
      if (filter.id === filterId) {
        return { ...filter, selected: option }; 
      }
      if (filter.id === filterId + 1) {
        
        return {
          ...filter,
          options: generateNewOptionsBasedOnPrevious(option),
          selected: null, 
        };
      }
      return filter;
    });

    if (!filters.find((filter) => filter.id === filterId + 1)) {
      updatedFilters.push({
        id: filterId + 1,
        options: generateNewOptionsBasedOnPrevious(option),
        selected: null,
      });
    }

    setFilters(updatedFilters.slice(0, filterId + 2));
  };

  
  const generateNewOptionsBasedOnPrevious = (selectedOption) => {
    if (selectedOption.text === 'Вариант 1') {
      return [
        { text: 'Новое значение 1.1', color: 'rgb(190, 15, 15)' },
        { text: 'Новое значение 1.2', color: 'rgb(245, 182, 56)' },
        { text: 'Новое значение 1.3', color: 'rgb(245, 182, 56)' },
      ];
    } else if (selectedOption.text === 'Вариант 2') {
      return [
        { text: 'Новое значение 2.1', color: 'rgb(190, 15, 15)' },
        { text: 'Новое значение 2.2', color: 'rgb(15, 190, 175)' },
        { text: 'Новое значение 2.3', color: 'rgb(245, 182, 56)' },
      ];
    } else {
      return [
        { text: 'Новое значение 3.1', color: 'rgb(190, 15, 15)' },
        { text: 'Новое значение 3.2', color: 'rgb(15, 190, 175)' },
        { text: 'Новое значение 3.3', color: 'rgb(245, 182, 56)' },
      ];
    }
  };

  return (
    <div className="constructor">
      <button className="start-button" onClick={handleStartForming}>
        Начать формирование
      </button>

      {isForming && (
        <div className="filters-container">
          {filters.map((filter) => (
            <div key={filter.id} className="filter">
              <ul className="filter-options">
                {filter.options.map((option) => (
                  <li
                    key={option.text}
                    className="filter-option"
                    style={{
                      backgroundColor: filter.selected === option ? option.color : '',
                    }}
                    onClick={() => handleOptionClick(filter.id, option)}
                  >
                    {option.text}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
      <button className="finish-button" >
        Загрузить
      </button>
    </div>
  );
};

export default Constructor;
