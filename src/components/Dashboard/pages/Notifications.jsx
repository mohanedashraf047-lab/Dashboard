import React from "react";

const notifications = [
  {
    id: 1,
    user: "Amina Rahim",
    avatar: "https://i.pravatar.cc/150?img=1",
    message: "Sent you a new message regarding the project.",
    time: "2 min ago",
  },
  {
    id: 2,
    user: "John Carter",
    avatar: "https://i.pravatar.cc/150?img=2",
    message: "Requested access to the analytics dashboard.",
    time: "5 min ago",
  },
  {
    id: 3,
    user: "Sophia Lee",
    avatar: "https://i.pravatar.cc/150?img=3",
    message: "Commented on your recent post.",
    time: "12 min ago",
  },
  {
    id: 4,
    user: "Mohammed Ali",
    avatar: "https://i.pravatar.cc/150?img=4",
    message: "Uploaded new documents for review.",
    time: "18 min ago",
  },
  {
    id: 5,
    user: "Emily Walker",
    avatar: "https://i.pravatar.cc/150?img=5",
    message: "Started following your account.",
    time: "25 min ago",
  },
  {
    id: 6,
    user: "David Kim",
    avatar: "https://i.pravatar.cc/150?img=6",
    message: "Liked your recent dashboard update.",
    time: "30 min ago",
  },
  {
    id: 7,
    user: "Nadia Hassan",
    avatar: "https://i.pravatar.cc/150?img=7",
    message: "Tagged you in a new comment.",
    time: "45 min ago",
  },
  {
    id: 8,
    user: "Lucas Silva",
    avatar: "https://i.pravatar.cc/150?img=8",
    message: "Completed task assignment.",
    time: "1 hour ago",
  },
  {
    id: 9,
    user: "Hannah Schwartz",
    avatar: "https://i.pravatar.cc/150?img=9",
    message: "Shared a file with you.",
    time: "2 hours ago",
  },
  {
    id: 10,
    user: "Carlos Martinez",
    avatar: "https://i.pravatar.cc/150?img=10",
    message: "Mentioned you in their status update.",
    time: "3 hours ago",
  },
  {
    id: 11,
    user: "Yuki Tanaka",
    avatar: "https://i.pravatar.cc/150?img=11",
    message: "Sent a collaboration request.",
    time: "5 hours ago",
  },
  {
    id: 12,
    user: "Olivia Brown",
    avatar: "https://i.pravatar.cc/150?img=12",
    message: "Reacted to your recent activity.",
    time: "8 hours ago",
  },
];

const Notifications = () => {
  return (
    <div className="p-6 space-y-4">
      {/* Page Title */}
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
        Notifications
      </h1>
      <p className="text-slate-500 dark:text-slate-400">
        You have {notifications.length} new notifications.
      </p>

      {/* Notification List */}
      <div className="space-y-4 mt-4">
        {notifications.map((n) => (
          <div
            key={n.id}
            className="flex items-center p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
          >
            <img
              src={n.avatar}
              className="w-12 h-12 rounded-full object-cover"
              alt={n.user}
            />

            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                {n.user}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {n.message}
              </p>
            </div>

            <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
              {n.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
