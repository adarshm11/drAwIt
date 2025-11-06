"use client";

import { Users } from "lucide-react";

interface ActiveUser {
  userId: string;
  userName: string;
  userColor: string;
}

interface ActiveUsersProps {
  users: ActiveUser[];
  currentUserId?: string;
}

export default function ActiveUsers({ users, currentUserId }: ActiveUsersProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-300 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Users size={20} className="text-gray-600" />
        <h3 className="font-semibold text-gray-900">
          Active Users ({users.length})
        </h3>
      </div>

      <div className="space-y-2">
        {users.length === 0 ? (
          <p className="text-sm text-gray-500">No other users online</p>
        ) : (
          users.map((user) => (
            <div
              key={user.userId}
              className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 transition-colors"
            >
              {/* User color indicator */}
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: user.userColor }}
              />

              {/* User name */}
              <span className="text-sm text-gray-900 truncate">
                {user.userName}
                {user.userId === currentUserId && (
                  <span className="text-xs text-gray-500 ml-1">(You)</span>
                )}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
