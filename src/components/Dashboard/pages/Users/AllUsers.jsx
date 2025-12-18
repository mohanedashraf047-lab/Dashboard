import React, { useState } from "react";
import { Search, Users, UserCheck, UserX, UserPlus } from "lucide-react";

const usersData = [
  { id: 1, name: "John Smith", email: "john@example.com", role: "Admin", status: "Active", lastLogin: "2024-11-24" },
  { id: 2, name: "Sarah Johnson", email: "sarah@example.com", role: "Editor", status: "Inactive", lastLogin: "2024-11-20" },
  { id: 3, name: "Mike Wilson", email: "mike@example.com", role: "User", status: "Active", lastLogin: "2024-11-25" },
  { id: 4, name: "Emily Davis", email: "emily@example.com", role: "User", status: "Inactive", lastLogin: "2024-11-18" },
];

const AllUsers = () => {
  const [search, setSearch] = useState("");

  const filteredUsers = usersData.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "Active": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "Inactive": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default: return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400";
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Search */}
      <div className="flex items-center space-x-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-xl p-2">
        <Search className="w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent focus:outline-none text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 px-2 py-2 rounded-xl"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead className="border-b border-slate-200/50 dark:border-slate-700/50">
            <tr>
              <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Name</th>
              <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Email</th>
              <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Role</th>
              <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Status</th>
              <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Last Login</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="p-4 text-slate-800 dark:text-white">{user.name}</td>
                <td className="p-4 text-slate-800 dark:text-white">{user.email}</td>
                <td className="p-4 text-slate-800 dark:text-white">{user.role}</td>
                <td className="p-4">
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusColor(user.status)}`}>
                    {user.status}
                  </span>
                </td>
                <td className="p-4 text-slate-800 dark:text-white">{user.lastLogin}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUsers;
