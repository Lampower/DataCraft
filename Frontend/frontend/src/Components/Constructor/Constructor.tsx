import  { useState } from 'react';
import './Constructor.css'; 

const Constructor = () => {
  const [isForming, setIsForming] = useState(false);
  const [filters, setFilters] = useState([{
    id: 1,
    options: ['Вариант 1', 'Вариант 2', 'Вариант 3'],
    selected: null,
  }]);

  const handleStartForming = () => {
    setIsForming(true);
  };

  const handleOptionClick = (filterId, option) => {
    const newFilters = filters.map(filter => {
      if (filter.id === filterId) {
        return { ...filter, selected: option };
      }
      return filter;
    });

    setFilters([...newFilters, {
      id: filters.length + 1,
      options: ['Новый вариант 1', 'Новый вариант 2', 'Новый вариант 3'],
      selected: null,
    }]);
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
                    key={option}
                    className={`filter-option ${filter.selected === option ? 'selected' : ''}`}
                    onClick={() => handleOptionClick(filter.id, option)}
                  >
                    {option}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Constructor; 
