import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Legend } from 'recharts';
import './Dashboard.css';  
import { useLocation } from 'react-router';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard = () => {
  const location = useLocation();
  const data = location.state?.data;
  console.log(data);
  let sum = 0;
  data.map((entity) => {sum += entity.count});
  return (
    <div className="dashboard">
      <h1 className="title">Дэшборд отчета: {"selectedPreset"}</h1>
      <div className="dashboard-charts">
        {data && (
          <div className="chart-container">
            <h3>Процентное распределение</h3>
            <h3>Всего проектов: {sum}</h3>
            <PieChart width={400} height={400}>
              <Pie
                data={data}
                dataKey="count"
                name='name'
                cx="50%"
                cy="50%"
                outerRadius={150}
                fill="#8884d8"
                label
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </div>
        )}

        {data.barData && (
          <div className="chart-container">
            <h3>Распределение задач по приоритетам</h3>
            <BarChart width={500} height={300} data={data.barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#0088FE" />
            </BarChart>
          </div>
        )}

        {data.lineData && (
          <div className="chart-container">
            <h3>Динамика выполнения задач</h3>
            <LineChart width={500} height={300} data={data.lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="tasksCompleted" stroke="#FF8042" strokeWidth={2} />
            </LineChart>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
