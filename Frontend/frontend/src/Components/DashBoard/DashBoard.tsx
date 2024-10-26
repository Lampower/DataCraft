import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Legend } from 'recharts';
import './Dashboard.css';  
import { useLocation } from 'react-router';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const COLORS = [ '#fc9866', 'rgb(245, 182, 56)', 'rgb(15, 190, 175)','#efd1cb'];

const Dashboard = () => {
  const location = useLocation();
  const data = location.state?.data;
  const keys = Object.keys(data);

  const PieChartElement = (data, key) => {
    let sum = 0;
    if (data && data[key] && data[key].entities && data[key].entities.length > 0) {
      data[key].entities.map((entity) => {sum += entity.count});
    }
    return (
      <div className="chart-container">
        <h3>Процентное распределение</h3>
        {data && data[key] && data[key].entities && data[key].entities.length > 0 ? (
          <>
            <h3>Всего проектов: {sum}</h3>
            <div className='row'>
            <PieChart width={400} height={400}>
              <Pie
                data={data[key].entities}
                cx="50%"
                cy="50%"
                outerRadius={200}
                fill="#8884d8"
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
                  <span className="legend-color" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                  <span className="legend-label">{entry.name}</span>
                </div>
              ))}
            </div>
            </div>
          </>
        ) : (
          <p>Невозможно составить график по выбранным данным</p>
        )}
            <p>График показывает процентное распределение задач по различным категориям, что помогает оценить долю каждой категории в общем количестве задач. Этот тип графика полезен для определения, какие категории требуют большего внимания. Он наглядно показывает вклад каждой категории в общий процесс.</p>
      </div>
    );
  };

  const BarDataElement = (data, key) => {
    return (
      <div className="chart-container">
        <h3>Распределение задач по приоритетам</h3>
        {data && data[key] && data[key].entities && data[key].entities.length > 0 ? (
          <BarChart width={400} height={400} data={data[key].entities}>
            <CartesianGrid strokeDasharray="3 3" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="rgb(15, 190, 175)" />
          </BarChart>
          
        
        ) : (
          <p>Невозможно составить график по выбранным данным</p>
        )}
        <p>График показывает распределение задач по приоритетам (высокий, средний, низкий), что помогает определить, какие задачи требуют большего внимания. Анализ распределения задач по приоритетам позволяет лучше управлять рабочей нагрузкой. Это дает возможность командам сосредоточиться на задачах, которые имеют критическое значение для успеха проекта.</p>
      </div>
    );
  };

  const LineDataElement = (data, key) => {
    return (
      <div className="chart-container">
        <h3>Динамика выполнения задач</h3>
        {data && data[key] && data[key].entities && data[key].entities.length > 0 ? (
          <LineChart width={400} height={400} data={data[key].entities}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="tasksCompleted" stroke="#F54B64" strokeWidth={2} />
          </LineChart>
       
        ) : (
          <p>Невозможно составить график по выбранным данным</p>
        )}
        <p>График показывает изменение количества выполненных задач с течением времени, что помогает оценить эффективность выполнения задач. Этот график позволяет понять, насколько продуктивно работает команда. С его помощью можно выявить периоды, когда выполнение задач было особенно активным или замедленным.</p>
      </div>
    );
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text('Отчет', 20, 10);
    autoTable(doc, { html: '#chart-table' });
    doc.save('report.pdf');
  };

  const handleExportExcel = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "report.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  console.log(data);
  return (
    <div className="dashboard">
      {keys.length > 0 && (
        <>
          <h1 className="title">Дэшборд отчета: {keys[0]}</h1>
          <div className="report-description">
            <p>Этот отчет содержит визуализацию данных по выбранным фильтрам, включая процентное распределение задач, распределение задач по приоритетам и динамику выполнения задач.</p>
          </div>
          <div className="dashboard-charts">
            {PieChartElement(data, keys[0])}
            {BarDataElement(data, keys[0])}
            {LineDataElement(data, keys[0])}
          </div>
          <div className="export-buttons">
            <button onClick={handleExportPDF} className="export-button pdf-button">Экспорт в PDF</button>
            <button onClick={handleExportExcel} className="export-button excel-button">Экспорт в Excel</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
