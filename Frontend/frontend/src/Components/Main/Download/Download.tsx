import "./Download.css";
import { useState, useEffect, useRef } from "react";
import card from "../../../assets/card.png";
import closeburger from "../../../assets/closeburger.svg";
import toggleIcon from "../../../assets/toggle-icon.png";

const Download = () => {
  const [file, setFile] = useState<File | null>(null); 
  const [historyFile, setHistoryFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [historyDragging, setHistoryDragging] = useState(false);
  const [error, setError] = useState<string | null>(null); 
  const [historyEnabled, setHistoryEnabled] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const historyFileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, setFileCallback: (file: File | null) => void) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.name.endsWith(".xlsx")) {  
        setFileCallback(selectedFile);
        setError(null); 
        event.target.value = ""; // Reset input value to allow the same file to be selected again
      } else {
        setFileCallback(null);
        setError("Пожалуйста, загрузите файл в формате .xlsx");
      }
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>, setFileCallback: (file: File | null) => void) => {
    event.preventDefault();
    setDragging(false);
    setHistoryDragging(false);
    const selectedFile = event.dataTransfer.files?.[0];
    if (selectedFile) {
      if (selectedFile.name.endsWith(".xlsx")) {  
        setFileCallback(selectedFile);
        setError(null);  
      } else {
        setFileCallback(null);
        setError("Пожалуйста, загрузите файл в формате .xlsx");
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>, setDraggingState: (state: boolean) => void) => {
    event.preventDefault();
    setDraggingState(true);
  };

  const handleDragLeave = (setDraggingState: (state: boolean) => void) => {
    setDraggingState(false);
  };

  const removeFile = () => {
    setFile(null);
    setError(null); 
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; 
    }
  };

  const removeHistoryFile = () => {
    setHistoryFile(null);
    setError(null);
    if (historyFileInputRef.current) {
      historyFileInputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Выберите файл перед загрузкой");
      return;
    }

    const formData = new FormData();
    formData.append("file", file, file.name);
    if (historyFile) {
      formData.append("historyFile", historyFile, historyFile.name);
    }

    try {
      const response = await fetch("http://localhost:5249/tasks/loadTask", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "*/*",
        },
      });

      if (response.ok) {
        alert("Файл успешно загружен");
        setTimeout(() => {
          window.location.href = "/constructor";
        }, 300);
        setFile(null);
        setHistoryFile(null);
      } else {
        setError("Ошибка при загрузке файла");
      }
    } catch (error) {
      console.error("Ошибка при загрузке:", error);
      setError("Ошибка при загрузке файла");
    }
  };

  useEffect(() => {
    const preventDefault = (e: Event) => {
      e.preventDefault();
    };

    window.addEventListener("dragover", preventDefault);
    window.addEventListener("drop", preventDefault);

    return () => {
      window.removeEventListener("dragover", preventDefault);
      window.removeEventListener("drop", preventDefault);
    };
  }, []);

  return (
    <div className="download-modal">
      <div className="modal-content">
        <div className="download-modal-header">Загрузка файла с компьютера</div>
        <div className="download-modal-sub">Поддерживаемые форматы: .xlsx</div>

        <div
          className={`upload-area ${dragging ? "dragging" : ""}`} 
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => handleDragOver(e, setDragging)}
          onDragEnter={(e) => handleDragOver(e, setDragging)}
          onDragLeave={() => handleDragLeave(setDragging)}
          onDrop={(e) => handleDrop(e, setFile)}
        >
          <div className="file-icon">
            <img src={card} alt="file icon" />
          </div>
          <div className="desc">Перетащите файл для загрузки<br></br> или 
            <div className="bold">выберите с устройства</div></div>
          <input
            type="file"
            id="fileInput"
            ref={fileInputRef} 
            accept=".xlsx"
            style={{ display: 'none' }}
            onChange={(e) => handleFileChange(e, setFile)}
          />
        </div>

        <div className="toggle-slider">
          <div className="slider-content">
            <span>Загрузить историю</span>
            <input 
              type="checkbox" 
              checked={historyEnabled}
              onChange={(e) => setHistoryEnabled(e.target.checked)}
            />
          </div>
        </div>

        {historyEnabled && (
          <div
            className={`upload-area ${historyDragging ? "dragging" : ""}`} 
            onClick={() => historyFileInputRef.current?.click()}
            onDragOver={(e) => handleDragOver(e, setHistoryDragging)}
            onDragEnter={(e) => handleDragOver(e, setHistoryDragging)}
            onDragLeave={() => handleDragLeave(setHistoryDragging)}
            onDrop={(e) => handleDrop(e, setHistoryFile)}
          >
            <div className="file-icon">
              <img src={card} alt="file icon" />
            </div>
            <div className="desc">Перетащите файл для загрузки<br></br> или 
              <div className="bold">выберите с устройства</div></div>
            <input
              type="file"
              id="historyFileInput"
              ref={historyFileInputRef}
              accept=".xlsx"
              style={{ display: 'none' }}
              onChange={(e) => handleFileChange(e, setHistoryFile)}
            />
          </div>
        )}

        {error && <div className="error-message">{error}</div>} 

        {file && (
          <div className="file-name">
            <div className="wrap">
              <div className="column">
                <span>{file.name}</span>
                <span className="file-size">{(file.size / 1024).toFixed(2)} KB</span>
              </div>
            </div>
            <button className="cancel" onClick={removeFile}>
              <img src={closeburger} alt="remove file" />
            </button>
          </div>
        )}

        {historyFile && (
          <div className="file-name">
            <div className="wrap">
              <div className="column">
                <span>{historyFile.name}</span>
                <span className="file-size">{(historyFile.size / 1024).toFixed(2)} KB</span>
              </div>
            </div>
            <button className="cancel" onClick={removeHistoryFile}>
              <img src={closeburger} alt="remove file" />
            </button>
          </div>
        )}

        <button className="update-button" onClick={handleUpload}>
          Загрузить
        </button>
      </div>
    </div>
  );
};

export default Download;
