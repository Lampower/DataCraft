import { useState } from "react";
import "./Constructor.css";
import TimeFilterModal from "./TimeFilterModal"; // импортируем модальное окно
import { useNavigate } from "react-router";

const Constructor = () => {
  const [selectedPreset, setSelectedPreset] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);

  const presets = [
    { id: 1, label: "Общий статус задач за период", filter: { days: 30, filters: [], columns: ["Status"], } },
    { id: 2, label: "Работа с владельцами задач" },
    { id: 3, label: "Проекты и оценка времени" },
    { id: 4, label: "Спринты и завершение задач" },
    { id: 5, label: "Пространство и тип задачи" },
    { id: 6, label: "Состояние и работа с приоритетами" },
    { id: 7, label: "Эффективность работы команд" },
    { id: 8, label: "Сравнительный анализ задач" },
  ];

  const navigate = useNavigate();

  const handlePresetSelect = (presetId: number) => {
    const selected = presets.find((preset) => preset.id === presetId);
    setSelectedPreset(selected || null);
  };

  const handleNewTemplateClick = () => {
    navigate("/constructor/new");
  };

  const handleFormSubmission = (days: number) => {
    if (selectedPreset) {
      let d;
      console.log(selectedPreset)
      fillByFetch(d, 0, 100);
    }
  };
  const fillByFetch = (data, from, amount) => {
    fetch(`http://localhost:5249/tasks/filterset?from=${from}&amount=${amount}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(selectedPreset.filter),
    })
      .then((response) => response.json())
      .then((d) => {
        if (data == null)
        {
          data = d;
          return fillByFetch(data, from + amount, amount);
        }
          
        var isExiting = true;
        var keys = Object.keys(d)
        keys.forEach(key => {
          data[key].entities = [...data[key].entities, ...d[key].entities]
          if (data[key].entities.length < data[key].totalLength)
            isExiting = false;
        });
        if (isExiting)
        {
          navigate("/dashboard", {state: {data: data}})
          return;
        }
        else
        {
          return fillByFetch(data, from + amount, amount)
        }
      })
      .catch((error) => {
        console.error("Ошибка создания отчета:", error);
      });
  }

  return (
    <div className="container-wrapper">
      <div className="constructor">
        <h1 className="title">Готовые шаблоны</h1>
        <div className="presets">
          {presets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handlePresetSelect(preset.id)}
              className={`preset-button ${selectedPreset?.label === preset.label ? "selected" : ""}`}
            >
              {preset.label}
            </button>
          ))}
        </div>
        <button className="create-filter-button" onClick={handleNewTemplateClick}>Новый шаблон</button>
        <button
          className="apply-button"
          onClick={() => setShowModal(true)}
          disabled={!selectedPreset}
        >
          Создать отчет
        </button>
      </div>

      {showModal && (
        <TimeFilterModal 
          onClose={() => setShowModal(false)}
          onSubmit={handleFormSubmission}
        />
      )}
    </div>
  );
};

export default Constructor;
