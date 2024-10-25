import "./Download.css";
import { useState, useEffect, useRef } from "react";
import card from "../../../assets/card.png";
import closeburger from "../../../assets/closeburger.svg";

const Download = () => {
  const [file, setFile] = useState<File | null>(null); 
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null); 
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.name.endsWith(".csv")) {  
        setFile(selectedFile);
        setError(null); 
      } else {
        setFile(null);
        setError("Пожалуйста, загрузите файл в формате .csv");
      }
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    const selectedFile = event.dataTransfer.files[0];
    if (selectedFile) {
      if (selectedFile.name.endsWith(".csv")) {  
        setFile(selectedFile);
        setError(null);  
      } else {
        setFile(null);
        setError("Пожалуйста, загрузите файл в формате .csv");
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const removeFile = () => {
    setFile(null);
    setError(null); 
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; 
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
        <div className="download-modal-sub">Поддерживаемые форматы: .csv</div>

        <div
          className={`upload-area ${dragging ? "dragging" : ""}`} 
          onClick={() => document.getElementById('fileInput')!.click()}
          onDragOver={handleDragOver}
          onDragEnter={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
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
            accept=".csv"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </div>

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

        <button className="update-button">Загрузить</button>
      </div>
    </div>
  );
};

export default Download;