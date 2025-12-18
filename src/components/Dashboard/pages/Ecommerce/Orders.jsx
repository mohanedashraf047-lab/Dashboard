import React, { useState } from "react";

const EcommerceOrders = () => {
  const [orders] = useState([
    {
      id: "#1021",
      customer: "John Carter",
      total: 149.99,
      status: "Processing",
      date: "2025-01-12",
    },
    {
      id: "#1022",
      customer: "Amina Rahim",
      total: 89.5,
      status: "Shipped",
      date: "2025-01-10",
    },
    {
      id: "#1023",
      customer: "Sophia Lee",
      total: 230,
      status: "Delivered",
      date: "2025-01-09",
    },
    {
      id: "#1024",
      customer: "Carlos Martinez",
      total: 69.99,
      status: "Cancelled",
      date: "2025-01-05",
    },
  ]);

  const statusColor = {
    Processing: "bg-yellow-500",
    Shipped: "bg-blue-500",
    Delivered: "bg-green-600",
    Cancelled: "bg-red-600",
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
        Orders
      </h1>
      <p className="text-slate-500 dark:text-slate-400">
        View and manage customer orders.
      </p>

      <div className="mt-6 bg-white dark:bg-slate-900 shadow-lg border rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-200 dark:bg-slate-800 text-sm">
            <tr>
              <th className="p-3">Order ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((o) => (
              <tr
                key={o.id}
                className="border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                <td className="p-3 font-medium">{o.id}</td>
                <td className="p-3">{o.customer}</td>
                <td className="p-3">${o.total}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 text-xs text-white rounded-full ${
                      statusColor[o.status]
                    }`}
                  >
                    {o.status}
                  </span>
                </td>
                <td className="p-3">{o.date}</td>
                <td className="p-3 text-right">
                  <button className="px-3 py-1 bg-blue-600 text-white rounded-lg mr-2">
                    View
                  </button>
                  <button className="px-3 py-1 bg-red-600 text-white rounded-lg">
                    Refund
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EcommerceOrders;
