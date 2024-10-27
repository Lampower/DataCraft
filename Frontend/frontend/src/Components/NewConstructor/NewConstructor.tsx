import { useEffect, useState } from "react";
import "./NewConstructor.css";
import ChooseFiltersModal from "./ChooseFilterModal";
import { useNavigate } from "react-router-dom";

const NewConstructor = () => {
  const [columns, setColumns] = useState([
  ]);
  const [days, setDays] = useState(30);
  const [dataColumns, setDataColumns] = useState<{ [key: string]: any[] }>({});
  const [activeColumns, setActiveColumns] = useState<string[]>([]);
  const [filters, setFilters] = useState<{ field: string, value: string }[]>([]);
  const [templateName, setTemplateName] = useState("");
  const [showChooseFiltersModal, setShowChooseFiltersModal] = useState(false);
  const navigate = useNavigate();

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
          console.log(data);
          setActiveColumns((prevActiveColumns) => [...prevActiveColumns, column]);
          setDataColumns((prevDataColumns) => ({
            ...prevDataColumns,
            [column]: data.entities,
          }));
        })
        .catch((error) => {
          console.error("Ошибка при получении данных:", error);
        });
    }
  };

  const handleModalSubmit = (selectedColumns: string[]) => {
    // Set default template name if not provided
    const nameToSave = templateName.trim() || "Новый шаблон";
    
    const patternFilterStr = JSON.stringify({
      days: days,
      filters: filters,
      columns: selectedColumns,
    });

    

    checkPattern(nameToSave, patternFilterStr)
      .then(e => { if (!e) savePattern(nameToSave, patternFilterStr) });

    let d;
    fillByFetch(d, 0, 100, {
      days: days,
      filters: filters,
      columns: selectedColumns,
    });
    
    setShowChooseFiltersModal(false);
  };

  const checkPattern = async (patternName, patternFilter) => {
    const response = await fetch("http://localhost:5249/pattern");
    const data = await response.json();
    return data.some(pattern => pattern.patternFilter === patternFilter);
  };

  const savePattern = (patternName, patternFilter) => {
    fetch("http://localhost:5249/pattern", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ "patternName": patternName, "patternFilter": patternFilter }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Шаблон сохранен:", data);
      })
      .catch((error) => {
        console.error("Ошибка при сохранении шаблона:", error);
      });
  };

  const fillByFetch = (data, from, amount, filter) => {
    fetch(`http://localhost:5249/tasks/filterset?from=${from}&amount=${amount}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(filter),
    })
      .then((response) => response.json())
      .then((d) => {
        if (data == null) {
          data = d;
          return fillByFetch(data, from + amount, amount, filter);
        }
        
        var isExiting = true;
        var keys = Object.keys(d);
        keys.forEach(key => {
          data[key].entities = [...data[key].entities, ...d[key].entities];
          if (data[key].entities.length < data[key].totalLength) isExiting = false;
        });
        if (isExiting) {
          navigate("/dashboard", { state: { data: data } });
          return;
        } else {
          return fillByFetch(data, from + amount, amount, filter);
        }
      })
      .catch((error) => {
        console.error("Ошибка создания отчета:", error);
      });
  };

  const handleFilterSelect = (column: string, value: string) => {
    setFilters((prevFilters) => {
      const updatedFilters = prevFilters.filter((filter) => filter.field !== column);
      updatedFilters.push({ field: column, value });
      return updatedFilters;
    });
  };

  const loadNames = async () => {
    const res = await fetch("http://localhost:5249/tasks/names");
    const data = await res.json();
    setColumns(data);
  }

  useEffect(() => {
    loadNames();
  }, [])

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
        <div className="template-name-container">
          <h3>Название шаблона</h3>
          <input
            type="text"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            className="template-name-input"
            placeholder="Введите название шаблона"
          />
        </div>
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
          disabled={days < 1 || filters.length === 0}
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
              handleModalSubmit(selectedFields);
          }}
        />
      )}
    </div>
  );
};

export default NewConstructor;
