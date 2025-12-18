import React, { useContext } from "react";
import { DarkModeContext } from "../../../DarkModeContext";
import { logoutUser } from "../../layout/Logout.jsx";

const Settings = () => {
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
        Settings
      </h2>

      <div className="space-y-4">
        {/* Dark Mode Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-slate-700 dark:text-slate-300">Dark Mode</span>
          <button
            onClick={toggleDarkMode}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white"
          >
            {darkMode ? "Disable" : "Enable"}
          </button>
        </div>

        {/* Logout */}
        <div className="flex items-center justify-between pt-4 border-t dark:border-slate-700">
          <span className="text-slate-700 dark:text-slate-300">Logout</span>
          <button
            onClick={logoutUser}
            className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {/* Other Settings */}
        <div>
          <h1 className="text-slate-700 dark:text-slate-300">Other Settings</h1>
        </div>
      </div>
    </div>
  );
};

export default Settings;
