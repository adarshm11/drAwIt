"use client";

import { useState } from "react";
import { User } from "lucide-react";

interface UserNameDialogProps {
  onSubmit: (name: string) => void;
}

export default function UserNameDialog({ onSubmit }: UserNameDialogProps) {
  const [name, setName] = useState("");

  const handleSubmit = () => {
    const trimmedName = name.trim();
    if (trimmedName) {
      onSubmit(trimmedName);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-100 rounded-full">
            <User size={24} className="text-blue-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Welcome to drAwIt</h2>
            <p className="text-sm text-gray-600">Enter your name to get started</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-2">
              Your Name
            </label>
            <input
              id="userName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
              placeholder="John Doe"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              autoFocus
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="w-full px-4 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold"
          >
            Join Board
          </button>
        </div>
      </div>
    </div>
  );
}
