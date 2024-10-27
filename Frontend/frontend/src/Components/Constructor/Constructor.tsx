import { useState, useEffect } from "react";
import "./Constructor.css";
import TimeFilterModal from "./TimeFilterModal";
import { useNavigate } from "react-router";

const Constructor = () => {
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [presets, setPresets] = useState([]);
  const [visiblePresets, setVisiblePresets] = useState(new Set()); // State for button visibility

  useEffect(() => {
    fetch("http://localhost:5249/pattern")
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(data => {
        setPresets(data);
        setVisiblePresets(new Set(data.map(preset => preset.id))); // Initialize all presets as visible
      })
      .catch(error => {
        console.error("Ошибка при загрузке шаблонов:", error);
      });
  }, []);

  const navigate = useNavigate();

  const handlePresetSelect = (presetId) => {
    const selected = presets.find((preset) => preset.id === presetId);
    setSelectedPreset(selected || null);
  };

  const handleNewTemplateClick = () => {
    navigate("/constructor/new");
  };

  const handleFormSubmission = () => {
    if (selectedPreset) {
      let d;
      fillByFetch(d, 0, 100);
    }
  };

  const fillByFetch = (data, from, amount) => {
    fetch(`http://localhost:5249/tasks/filterset?from=${from}&amount=${amount}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: selectedPreset.patternFilter,
    })
      .then((response) => response.json())
      .then((d) => {
        if (data == null) {
          data = d;
          return fillByFetch(data, from + amount, amount);
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
          return fillByFetch(data, from + amount, amount);
        }
      })
      .catch((error) => {
        console.error("Ошибка создания отчета:", error);
      });
  };

  const handleClosePreset = (presetId) => {
    setVisiblePresets(prev => {
      const newVisible = new Set(prev);
      newVisible.delete(presetId);
      return newVisible;
    });
  };

  return (
    <div className="container-wrapper">
      <div className="constructor">
        <h1 className="title">Готовые шаблоны</h1>
        <div className="presets">
          {presets.map((preset) =>
            visiblePresets.has(preset.id) ? (
              <div key={preset.id} className="preset-item">
                <button
                  onClick={() => handlePresetSelect(preset.id)}
                  className={`preset-button ${selectedPreset?.label === preset.patternName ? "selected" : ""}`}
                >
                  {preset.patternName}
                  <button
                  onClick={() => handleClosePreset(preset.id)}
                  className="close-button-preset"
                >
                  ✖
                </button>
                </button>
              </div>
            ) : null
          )}
        </div>
        <button className="create-filter-button" onClick={handleNewTemplateClick}>Новый шаблон</button>
        <button
          className="apply-button-main"
          onClick={handleFormSubmission}
          disabled={!selectedPreset}
        >
          Создать отчет
        </button>
      </div>
    </div>
  );
};

export default Constructor;
