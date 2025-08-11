"use client";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// ✅ Fake todo stats
const data = [
  { name: "Completed", value: 20 },
  { name: "Pending", value: 12 },
  { name: "Not Started", value: 19 }
];

// ✅ Colors for each section
const COLORS = ["#4CAF50", "#FF5722", "#2196F3"];

export default function TodoGraph() {
  return (
    <div className="bg-white shadow rounded p-20 max-w-3xl mx-auto my-10">
      <h2 className="text-xl font-bold mb-4">Todo Status</h2>
      <ResponsiveContainer width="100%" height={300} className="mx-auto mt-10 p-10">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
            }
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
