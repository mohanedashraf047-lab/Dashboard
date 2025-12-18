import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import Dashboard from "./components/Dashboard/Dashboard";
import Settings from "./components/Dashboard/pages/Settings.jsx";
import { DarkModeProvider } from "./DarkModeContext.jsx";
import Notifications from "./components/Dashboard/pages/Notifications.jsx";
import EcommerceCustomers from "./components/Dashboard/pages/Ecommerce/Customers.jsx";
import EcommerceOrders from "./components/Dashboard/pages/Ecommerce/Orders.jsx";
import EcommerceProduct from "./components/Dashboard/pages/Ecommerce/Product.jsx";
import Inventory from "./components/Dashboard/pages/Inventory.jsx";
import Transactions from "./components/Dashboard/pages/Transactions.jsx";
import CalendarPage from "./components/Dashboard/pages/Calendar.jsx";
import Reports from "./components/Dashboard/pages/Reports.jsx";
import UsersActivity from "./components/Dashboard/pages/Users/Activity.jsx";
import UsersAll from "./components/Dashboard/pages/Users/AllUsers.jsx";
import AnalyticsInsights from "./components/Dashboard/pages/analytics/Insights.jsx";
import AnalyticsReports from "./components/Dashboard/pages/analytics/Reports.jsx";
import AnalyticsOverview from "./components/Dashboard/pages/analytics/Overview.jsx";

import { auth } from "../firebaseConfig.js";
import { onAuthStateChanged } from "firebase/auth";
import Auth from "./components/Dashboard/Auth.jsx";
import UserProfile from "./components/Dashboard/pages/UserProfile.jsx";
import { UserProvider } from "./UserContext.jsx";
import { PulseLoader } from "react-spinners";

const App = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen to Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <p className="text-center items-center justify-center flex h-screen"><PulseLoader color="#36d7b7" size={30} /></p>;

  return (
    <DarkModeProvider>
      <UserProvider>
        <Router>
          {user ? (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-500 flex h-screen overflow-hidden">
              {/* Sidebar */}
              <Sidebar
                collapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
              />

              {/* Main content */}
              <div className="flex-1 flex flex-col overflow-hidden">
                <Header
                  collapsed={sidebarCollapsed}
                  onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
                />

                <main className="flex-1 overflow-y-auto bg-transparent">
                  <div className="p-6 space-y-6">
                    <Routes>
                      <Route path="/" element={<Navigate to="/dashboard" />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/settings" element={<Settings />} />

                      {/* Analytics */}
                      <Route
                        path="/analytics/overview"
                        element={<AnalyticsOverview />}
                      />
                      <Route
                        path="/analytics/reports"
                        element={<AnalyticsReports />}
                      />
                      <Route
                        path="/analytics/insights"
                        element={<AnalyticsInsights />}
                      />

                      {/* Users */}
                      <Route path="/users/all-users" element={<UsersAll />} />
                      <Route
                        path="/users/activity"
                        element={<UsersActivity />}
                      />

                      {/* E-commerce */}
                      <Route
                        path="/ecommerce/product"
                        element={<EcommerceProduct />}
                      />
                      <Route
                        path="/ecommerce/orders"
                        element={<EcommerceOrders />}
                      />
                      <Route
                        path="/ecommerce/customers"
                        element={<EcommerceCustomers />}
                      />

                      {/* Other Pages */}
                      <Route path="/inventory" element={<Inventory />} />
                      <Route path="/transactions" element={<Transactions />} />
                      <Route
                        path="/notifications"
                        element={<Notifications />}
                      />
                      <Route path="/calendar" element={<CalendarPage />} />
                      <Route path="/reports" element={<Reports />} />
                      <Route path="/users/profile" element={<UserProfile />} />
                    </Routes>
                  </div>
                </main>
              </div>
            </div>
          ) : (
            <Routes>
              {/* Redirect all routes to login for unauthenticated users */}
              <Route path="*" element={<Auth />} />
            </Routes>
          )}
        </Router>
      </UserProvider>
    </DarkModeProvider>
  );
};

export default App;
