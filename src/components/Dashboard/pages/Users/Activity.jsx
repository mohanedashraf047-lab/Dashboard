import React, { useEffect, useState } from "react";
import { db } from "../../../../../firebaseConfig";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { useSelector } from "react-redux";

// Lucide icons
import { Plus, Edit3, X } from "lucide-react";

// Map string → icon component
const icons = {
  plus: Plus,
  edit: Edit3,
  x: X,
};

const Activity = () => {
  const [activities, setActivities] = useState([]);
  const userEmail = useSelector((state) => state.products.userEmail);

  useEffect(() => {
    if (!userEmail) return;

    const q = query(
      collection(db, "activities"),
      where("userEmail", "==", userEmail),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setActivities(list);
    });

    return () => unsub();
  }, [userEmail]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-800 dark:text-white">
        Activity Feed
      </h2>

      {activities.length === 0 ? (
        <p className="text-slate-500 dark:text-slate-400">No activity yet.</p>
      ) : (
        activities.map((act) => {
          const Icon = icons[act.iconName] || null;

          return (
            <div
              key={act.id}
              className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl shadow border border-slate-200 dark:border-slate-700"
            >
              {/* Icon */}
              {Icon && (
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${act.bgColor}`}
                >
                  <Icon className={`w-5 h-5 ${act.color}`} />
                </div>
              )}

              {/* Content */}
              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  {act.title}
                </p>
                <p className="text-slate-600 dark:text-slate-300 text-sm">
                  {act.description}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {act.createdAt?.toDate
                    ? act.createdAt.toDate().toLocaleString()
                    : "—"}
                </p>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Activity;
