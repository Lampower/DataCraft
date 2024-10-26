import { useState } from "react";
import { useNavigate } from "react-router";
import "./NewConstructor.css";
import ChooseFiltersModal from "./ChooseFilterModal";

const NewConstructor = () => {
  const [columns, setColumns] = useState([
    "ProjectName", "TaskType", "Status", "Priority", "TaskName", "CreatedAt", "CreatedBy", "UpdatedAt", "UpdatedBy", "Description", "Assigned", "Owner", "Deadline", "TimeRating", "Sprint", "Estimation", "TimeTaken", "WorkerGroup", "Resolution"
  ]);
  const [days, setDays] = useState(30);
  const [dataColumns, setDataColumns] = useState<{ [key: string]: any[] }>({});
  const [activeColumns, setActiveColumns] = useState<string[]>([]);
  const [filters, setFilters] = useState<{ field: string, value: string }[]>([]);
  const [showChooseFiltersModal, setShowChooseFiltersModal] = useState(false);

  const handleColumnClick = (column: string) => {
    if (activeColumns.includes(column)) {
      setActiveColumns((prevActiveColumns) => prevActiveColumns.filter((col) => col !== column));
      setDataColumns((prevDataColumns) => {
        const updatedDataColumns = { ...prevDataColumns };
        delete updatedDataColumns[column];
        return updatedDataColumns;
      });
      setFilters((prevFilters) => prevFilters.filter((filter) => filter.field !== column));
    } else {
      fetch(`http://localhost:5249/tasks?column=${column}`)
        .then((response) => response.json())
        .then((data) => {
          setActiveColumns((prevActiveColumns) => [...prevActiveColumns, column]);
          setDataColumns((prevDataColumns) => ({
            ...prevDataColumns,
            [column]: data,
          }));
        })
        .catch((error) => {
          console.error("Ошибка при получении данных:", error);
        });
    }
  };
 

  const handleModalSubmit = (selectedColumns: string[]) => {
    const requestBody = {
      days: days,
      filters: filters,
      column: selectedColumns,
    };
    console.log(requestBody);
    setShowChooseFiltersModal(false);
  };

  const handleFilterSelect = (column: string, value: string) => {
    setFilters((prevFilters) => {
      const updatedFilters = prevFilters.filter((filter) => filter.field !== column);
      updatedFilters.push({ field: column, value });
      return updatedFilters;
    });
  };

 

  return (
    <div className="new-constructor-container">
      <div className="columns-container">
        {columns.map((column) => (
          <div
            key={column}
            className={`column-item ${activeColumns.includes(column) ? "active" : ""}`}
            onClick={() => handleColumnClick(column)}
          >
            {column}
          </div>
        ))}
      </div>

      

      <div className="data-columns-container">
        {Object.keys(dataColumns).map((column) => (
          <div key={column} className="data-column">
            <h3>{column}</h3>
            {dataColumns[column].map((item, index) => (
              <div
                key={index}
                className={`data-item ${filters.find((filter) => filter.field === column && filter.value === item) ? "selected" : ""}`}
                onClick={() => handleFilterSelect(column, item)}
              >
                {JSON.stringify(item)}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="column">
        <div className="time-filter-container">
          <h3>Выберите период для отчета (дни)</h3>
          <input
              type="number"
              value={days}
              min={1}
              onChange={(e) => setDays(Number(e.target.value))}
              className="days-input"
          />
        </div>
        <button
          className="create-report-button"
          onClick={() => setShowChooseFiltersModal(true)}
          disabled={(days === null || filters.length === 0)}
        >
          Сформировать
        </button>
      </div>
      

      {showChooseFiltersModal && (
    <ChooseFiltersModal
        filters={columns}
        activeColumns={activeColumns}
        onClose={() => setShowChooseFiltersModal(false)}
        onSubmit={(selectedFields) => {
            console.log('Выбранные фильтры:', selectedFields);
            setShowChooseFiltersModal(false);
        }}
    />
)}

    </div>
  );
};

export default NewConstructor;
