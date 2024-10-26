import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Legend } from 'recharts';
import './Dashboard.css';  
import { useLocation } from 'react-router';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard = () => {
//  const RADIAN = Math.PI / 180;
  const location = useLocation();
  const data = location.state?.data;
  const keys = Object.keys(data);

  const PieChartElement = (data, key) => {
    let sum = 0;
    data[key].entities.map((entity) => {sum += entity.count});

     return <>
     {data && (
        <div className="chart-container">
          <h3>Процентное распределение</h3>
          <h3>Всего проектов: {sum}</h3>
          <PieChart width={300} height={300}>
              <Pie
                  data={data[key].entities}
                  cx="50%"
                  cy="50%"
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="count"
              >
                  {data[key].entities.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
              </Pie>
              <Tooltip />
          </PieChart>
        </div>
      )}</>
  }

  const BarDataElement = (data, key) => {
    return <>{data && (
        <div className="chart-container">
          <h3>Распределение задач по приоритетам</h3>
          <BarChart width={350} height={300} data={data[key].entities}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#0088FE" />
          </BarChart>
        </div>
      )}</>
  }

  const LineDataElement = (data, key) => {
    return <>{data && (
        <div className="chart-container">
          <h3>Динамика выполнения задач</h3>
          <LineChart width={350} height={300} data={data[key].entities}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="tasksCompleted" stroke="#FF8042" strokeWidth={2} />
          </LineChart>
        </div>
      )}</>
  }

//   const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
//     const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
//     const x = cx + radius * Math.cos(-midAngle * RADIAN);
//     const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
//     return (
//       <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
//         {`${(percent * 100).toFixed(0)}%`}
//       </text>
//     );
//  }

  console.log(data);
  let sum = 0;

  data[keys[0]].entities.map((entity) => {sum += entity.count});
  return (
    <div className="dashboard">
      <h1 className="title">Дэшборд отчета: {keys[0]}</h1>
      <div className="dashboard-charts">
        {PieChartElement(data, keys[0])}
        {BarDataElement(data, keys[0])}
        {LineDataElement(data, keys[0])}
      </div>
    </div>
  );
};

export default Dashboard;
