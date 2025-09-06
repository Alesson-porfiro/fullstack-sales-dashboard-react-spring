import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from "recharts";
import { motion } from "framer-motion";

const lineData = [
  { name: "Jan", users: 30 },
  { name: "Feb", users: 45 },
  { name: "Mar", users: 60 },
  { name: "Apr", users: 80 },
  { name: "May", users: 70 },
];

const barData = [
  { name: "Produto A", sales: 400 },
  { name: "Produto B", sales: 300 },
  { name: "Produto C", sales: 500 },
];

const pieData = [
  { name: "Chrome", value: 50 },
  { name: "Firefox", value: 20 },
  { name: "Edge", value: 15 },
  { name: "Outros", value: 15 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

function Dashboard() {
  return (
    <div className="dashboard">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>📊 Dashboard</h1>
        <p>Resumo visual dos dados</p>
      </motion.div>

      <div className="cards">
        <motion.div className="card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3>Usuários por mês</h3>
          <LineChart width={400} height={250} data={lineData}>
            <Line type="monotone" dataKey="users" stroke="#8884d8" strokeWidth={2} />
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
          </LineChart>
        </motion.div>

        <motion.div className="card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3>Vendas por produto</h3>
          <BarChart width={400} height={250} data={barData}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="sales" fill="#82ca9d" />
          </BarChart>
        </motion.div>

        <motion.div className="card pie-card"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h3>Uso de Navegadores</h3>
          <PieChart width={400} height={300}>
            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} label>
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </motion.div>
      </div>
    </div>
  );
}

export default Dashboard;
