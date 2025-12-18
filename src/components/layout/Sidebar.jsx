// Sidebar.jsx
import {
  BarChart3,
  Calendar,
  ChevronDown,
  CreditCard,
  FileText,
  LayoutDashboard,
  MessageSquare,
  Package,
  Settings,
  ShoppingBag,
  Users,
} from "lucide-react";
import { useContext, useState } from "react";
import { DarkModeContext } from "../../DarkModeContext";
import { Link, useLocation } from "react-router-dom";
import { UserContext } from "../../UserContext";

const menuItems = [
  {
    id: "dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
    badge: "New",
    path: "/dashboard",
  },
  {
    id: "analytics",
    icon: BarChart3,
    label: "Analytics",
    submenu: [
      { id: "overview", label: "Overview", path: "/analytics/overview" },
      { id: "reports", label: "Reports", path: "/analytics/reports" },
      { id: "insights", label: "Insights", path: "/analytics/insights" },
    ],
  },
  {
    id: "users",
    icon: Users,
    label: "Users",
    count: "2.4k",
    submenu: [
      { id: "all-users", label: "All Users", path: "/users/all-users" },
      { id: "activity", label: "User Activity", path: "/users/activity" },
    ],
  },
  {
    id: "ecommerce",
    icon: ShoppingBag,
    label: "E-commerce",
    submenu: [
      { id: "product", label: "Product", path: "/ecommerce/product" },
      { id: "customers", label: "Customers", path: "/ecommerce/customers" },
      { id: "orders", label: "Orders", path: "/ecommerce/orders" },
    ],
  },
  {
    id: "inventory",
    icon: Package,
    label: "Inventory",
    count: "847",
    path: "/inventory",
  },
  {
    id: "transactions",
    icon: CreditCard,
    label: "Transactions",
    path: "/transactions",
  },
  {
    id: "messages",
    icon: MessageSquare,
    label: "Messages",
    badge: "12",
    path: "/notifications",
  },
  { id: "calendar", icon: Calendar, label: "Calendar", path: "/calendar" },
  { id: "reports", icon: FileText, label: "Reports", path: "/reports" },
  { id: "settings", icon: Settings, label: "Settings", path: "/settings" },
];

const Sidebar = ({ collapsed }) => {
  const { darkMode } = useContext(DarkModeContext);
  const { user } = useContext(UserContext); // ✅ Get user from context
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState(new Set(["analytics"]));

  const toggleExpanded = (itemId) => {
    const newExpanded = new Set(expandedItems);
    newExpanded.has(itemId)
      ? newExpanded.delete(itemId)
      : newExpanded.add(itemId);
    setExpandedItems(newExpanded);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div
      className={`${
        collapsed ? "w-20" : "w-72"
      } transition-all duration-300 ease-in-out bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50 flex flex-col relative z-10`}
    >
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <div key={item.id}>
            {item.submenu ? (
              <>
                <button
                  onClick={() => toggleExpanded(item.id)}
                  className="w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5" />
                    {!collapsed && (
                      <span className="font-mono font-medium">
                        {item.label}
                      </span>
                    )}
                  </div>
                  {!collapsed && (
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        expandedItems.has(item.id) ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>
                {!collapsed && expandedItems.has(item.id) && (
                  <div className="ml-8 mt-2 space-y-1">
                    {item.submenu.map((sub) => (
                      <Link
                        key={sub.id}
                        to={sub.path}
                        className={`block w-full text-left p-2 text-sm rounded-lg transition-all ${
                          isActive(sub.path)
                            ? "bg-blue-500 text-white"
                            : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                        }`}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
                to={item.path}
                className={`flex items-center p-3 rounded-xl transition-all duration-200 ${
                  isActive(item.path)
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {!collapsed && (
                  <span className="ml-3 font-mono font-medium">
                    {item.label}
                  </span>
                )}
                {!collapsed && item.badge && (
                  <span className="ml-2 px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                    {item.badge}
                  </span>
                )}
                {!collapsed && item.count && (
                  <span className="ml-2 px-2 py-1 text-xs bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full">
                    {item.count}
                  </span>
                )}
              </Link>
            )}
          </div>
        ))}
      </nav>

      {!collapsed && (
        <div className="p-4 border-t border-slate-200/50 dark:border-slate-700/50">
          <Link
            to="/users/profile"
            className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          >
            <img
              src={
                user?.photoURL ||
                "https://cdn-icons-png.flaticon.com/512/3177/3177440.png"
              }
              alt="user"
              className="w-10 h-10 rounded-full ring-2 ring-blue-500 object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 dark:text-white truncate">
                {user?.displayName || "Guest"}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {user ? "Administrator" : "Visitor"}
              </p>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
