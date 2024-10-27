import { useState } from 'react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Legend } from 'recharts';
import './Dashboard.css';
import { useLocation } from 'react-router';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const COLORS = ['rgb(190, 15, 15)', 'rgb(255, 181, 15)', 'rgb(4, 188, 186)', 'rgb(6, 15, 163)'];

const Dashboard = () => {
  const location = useLocation();
  const data = location.state?.data;

  const keys = Object.keys(data);
  const [selectedCharts, setSelectedCharts] = useState(
    keys.reduce((acc, key) => ({ ...acc, [key]: [] }), {})
  );

  const handleChartTypeToggle = (key, chartType) => {
    setSelectedCharts(prev => {
      const isSelected = prev[key].includes(chartType);
      const updatedCharts = isSelected
        ? prev[key].filter(type => type !== chartType)
        : [...prev[key], chartType];
      return { ...prev, [key]: updatedCharts };
    });
  };

  const PieChartElement = (data, key) => {
    let sum = 0;
    if (data && data[key] && data[key].entities && data[key].entities.length > 0) {
      data[key].entities.map(entity => (sum += entity.count));
    }
    return (
      <div className="chart-container">
        <h3>Процентное распределение</h3>
        {data && data[key] && data[key].entities && data[key].entities.length > 0 ? (
          <>
            <h3>Всего проектов: {sum}</h3>
            <div className="row">
              <PieChart width={400} height={400}>
                <Pie
                  data={data[key].entities}
                  cx="50%"
                  cy="50%"
                  outerRadius={200}
                  fill="rgb(0,0,0)"
                  dataKey="count"
                >
                  {data[key].entities.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
              <div className="chart-legend">
                {data[key].entities.map((entry, index) => (
                  <div key={`legend-${index}`} className="legend-item">
                    <span
                      className="legend-color"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></span>
                    <span className="legend-label">{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <p>
              График показывает процентное распределение задач по различным категориям, что
              помогает оценить долю каждой категории в общем количестве задач.
            </p>
          </>
        ) : (
          <p>Невозможно составить график по выбранным данным</p>
        )}
      </div>
    );
  };

  const BarDataElement = (data, key) => {
    return (
      <div className="chart-container">
        <h3>Распределение задач по приоритетам</h3>
        {data && data[key] && data[key].entities && data[key].entities.length > 0 ? (
          <>
            <BarChart width={400} height={400} data={data[key].entities}>
              <CartesianGrid strokeDasharray="3 3" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="rgb(15, 190, 175)" />
            </BarChart>
            <p>
              График показывает распределение задач по приоритетам, что помогает определить, какие
              задачи требуют большего внимания.
            </p>
          </>
        ) : (
          <p>Невозможно составить график по выбранным данным</p>
        )}
      </div>
    );
  };

  const LineDataElement = (data, key) => {
    return (
      <div className="chart-container">
        <h3>Динамика выполнения задач</h3>
        {data && data[key] && data[key].entities && data[key].entities.length > 0 ? (
          <>
            <LineChart width={400} height={400} data={data[key].entities}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="tasksCompleted" stroke="#F54B64" strokeWidth={2} />
            </LineChart>
            <p>
              График показывает изменение количества выполненных задач с течением времени.
            </p>
          </>
        ) : (
          <p>Невозможно составить график по выбранным данным</p>
        )}
      </div>
    );
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text('Отчет', 20, 10);
    autoTable(doc, { html: '#chart-table' });
    doc.save('report.pdf');
  };

  return (
    <div className="dashboard">
      {keys.length > 0 && (
        <>
          <h1 className="title">Дэшборд отчета: {data.patternName}</h1>
          <div className="report-description">
            <p>
              Этот отчет содержит визуализацию данных по выбранным фильтрам, включая процентное
              распределение задач, распределение задач по приоритетам и динамику выполнения задач.
            </p>
          </div>
          <div className="dashboard-charts">
            {keys.map(key => (
              <div key={key}>
                <h2>{key}</h2>
                <div className="chart-selector">
                  <button
                    onClick={() => handleChartTypeToggle(key, 'Pie')}
                    className={selectedCharts[key].includes('Pie') ? 'selected' : ''}
                  >
                    Pie Chart
                  </button>
                  <button
                    onClick={() => handleChartTypeToggle(key, 'Bar')}
                    className={selectedCharts[key].includes('Bar') ? 'selected' : ''}
                  >
                    Bar Chart
                  </button>
                  <button
                    onClick={() => handleChartTypeToggle(key, 'Line')}
                    className={selectedCharts[key].includes('Line') ? 'selected' : ''}
                  >
                    Line Chart
                  </button>
                </div>
                {selectedCharts[key].includes('Pie') && PieChartElement(data, key)}
                {selectedCharts[key].includes('Bar') && BarDataElement(data, key)}
                {selectedCharts[key].includes('Line') && LineDataElement(data, key)}
              </div>
            ))}
          </div>
          <div className="export-buttons">
            <button onClick={handleExportPDF} className="export-button pdf-button">
              Экспорт в PDF
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
