import React, { useState } from "react";
import "./Constructor.css";
import TimeFilterModal from "./TimeFilterModal"; // импортируем модальное окно

const Constructor = () => {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const presets = [
    { id: 1, label: "Общий статус задач за период" },
    { id: 2, label: "Работа с владельцами задач" },
    { id: 3, label: "Проекты и оценка времени" },
    { id: 4, label: "Спринты и завершение задач" },
    { id: 5, label: "Пространство и тип задачи" },
    { id: 6, label: "Состояние и работа с приоритетами" },
    { id: 7, label: "Эффективность работы команд" },
    { id: 8, label: "Сравнительный анализ задач" },
  ];

  const handlePresetSelect = (presetId: number) => {
    const selected = presets.find((preset) => preset.id === presetId);
    setSelectedPreset(selected?.label || null);
  };

  const handleFormSubmission = (days: number) => {
    if (selectedPreset) {
      fetch("http://localhost:5249/api/filter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ preset: selectedPreset, days }),
      })
        .then((response) => response.json())
        .then(() => {
          alert("Отчет успешно создан");
          window.location.href = "/reports";
        })
        .catch((error) => {
          console.error("Ошибка создания отчета:", error);
        });
    }
  };

  return (
    <div className="container-wrapper">
      <div className="constructor">
        <h1 className="title">Готовые шаблоны</h1>
        <div className="presets">
          {presets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handlePresetSelect(preset.id)}
              className={`preset-button ${selectedPreset === preset.label ? "selected" : ""}`}
            >
              {preset.label}
            </button>
          ))}
        </div>
        <button className="create-filter-button">Новый шаблон</button>
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
