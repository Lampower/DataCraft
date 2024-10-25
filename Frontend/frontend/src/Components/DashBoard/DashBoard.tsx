import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Legend } from 'recharts';
import './Dashboard.css';  

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard = () => {
  const [data, setData] = useState({
    pieData: [],
    lineData: [],
    barData: []
  });

  useEffect(() => {
    fetch('/api/dashboard-data')  
      .then(response => response.json())
      .then(data => {
        setData({
          pieData: data.pieData,
          lineData: data.lineData,
          barData: data.barData
        });
      });
  }, []);

  return (
    <div className="dashboard">
      <h1>Конструктор отчетов</h1>
      <div className="dashboard-charts">
        {/* Круговой график */}
        <div className="chart pie-chart">
          <h3>Процентное соотношение</h3>
          <PieChart width={400} height={400}>
            <Pie
              data={data.pieData}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={150}
              fill="#8884d8"
              label
            >
              {data.pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </div>

        {/* Линейный график */}
        <div className="chart line-chart">
          <h3>Выполнение задач за последний месяц</h3>
          <LineChart width={300} height={300} data={data.lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="tasksCompleted" stroke="#ffbf00" strokeWidth={2} />
          </LineChart>
        </div>

        {/* Столбчатый график */}
        <div className="chart bar-chart">
          <h3>Владельцы и редакторы задач за последний месяц</h3>
          <BarChart width={300} height={300} data={data.barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="owners" fill="#0088FE" />
            <Bar dataKey="editors" fill="#FF8042" />
          </BarChart>
        </div>
      </div>
      <button className="finish-button-center" >
        Загрузить
      </button>
    </div>
  );
};

export default Dashboard;
