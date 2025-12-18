import {
  Bell,
  ChevronDown,
  Filter,
  Menu,
  Search,
  Settings,
  Sun,
  Moon,
} from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { DarkModeContext } from "../../DarkModeContext";
import { Link } from "react-router-dom";
import { auth } from "../../../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const Header = ({ onToggleSidebar }) => {
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
  const [user, setUser] = useState(null);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <button
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            onClick={onToggleSidebar}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden md:block">
            <h1 className="text-xl font-black text-slate-800 dark:text-white">
              Dashboard
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Welcome back, {user ? user.displayName || user.email : "Guest"}!
            </p>
          </div>
        </div>

        {/* Center Section */}
        <div className="hidden md:flex flex-1 max-w-md mx-5">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-10 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              <Filter />
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2">
          {/* Toggle Theme */}
          <button
            className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            onClick={toggleDarkMode}
          >
            {darkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          {/* Notification */}
          <Link to="/notifications">
            <button className="relative p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>
          </Link>

          {/* Setting */}
          <Link to="/settings">
            <button className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </Link>

          {/* User Profile */}
          <Link to={user ? "/users/profile" : "/login"}>
            <div className="flex items-center space-x-3 pl-3 border-l border-slate-200 dark:border-slate-700">
              <img
                src={
                  user?.photoURL ||
                  "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2"
                }
                alt="User"
                className="w-8 h-8 rounded-full ring-2 ring-blue-500"
              />
              <div className="hidden md:block">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {user ? user.displayName || user.email : "Guest"}
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
