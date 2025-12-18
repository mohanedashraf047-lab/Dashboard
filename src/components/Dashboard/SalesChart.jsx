import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useSelector } from "react-redux";

const SalesChart = () => {
  const products = useSelector((state) => state.products.items);

  // Aggregate by category
  const categoryData = [];
  const map = {};
  products.forEach((p) => {
    if (!map[p.category]) {
      map[p.category] = 0;
    }
    map[p.category] += 1;
  });
  Object.keys(map).forEach((key, i) => {
    categoryData.push({
      name: key,
      value: map[key],
      color: ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b"][i % 4],
    });
  });

  return (
    <div className="bg-white dark:bg-slate-900 backdrop-blur-xl rounded-b-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 transition-colors">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">
          Sales by Category
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Production Distribution
        </p>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData}
              dataKey="value"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={5}
              cx="50%"
              cy="50%"
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-3 mt-4">
        {categoryData.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {item.name}
              </span>
            </div>
            <span className="text-sm font-semibold text-slate-800 dark:text-white">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalesChart;
