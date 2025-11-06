"use client";

import { useState } from "react";
import Link from "next/link";
import { Trash2, Calendar, X } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface BoardCardProps {
  id: Id<"boards">;
  title: string;
  lastModified: number;
  backgroundColor?: string;
  thumbnail?: string;
}

export default function BoardCard({
  id,
  title,
  lastModified,
  backgroundColor = "#ffffff",
  thumbnail,
}: BoardCardProps) {
  const deleteBoard = useMutation(api.boards.remove);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteBoard({ boardId: id });
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Failed to delete board:", error);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      <Link
        href={`/board/${id}`}
        className="group relative block p-6 bg-white border border-gray-300 rounded-lg hover:shadow-lg transition-all"
      >
        {/* Preview area with thumbnail or background color */}
        <div
          className="w-full h-32 rounded-md mb-4 border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center"
          style={{ backgroundColor: thumbnail ? "transparent" : backgroundColor }}
        >
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={`${title} preview`}
              className="w-full h-full object-contain"
            />
          ) : (
            <span className="text-gray-400 text-sm">Empty board</span>
          )}
        </div>

        {/* Board info */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-500 transition-colors">
            {title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar size={14} />
            <span>{formatDate(lastModified)}</span>
          </div>
        </div>

        {/* Delete button */}
        <button
          onClick={handleDeleteClick}
          className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all z-10"
          title="Delete board"
        >
          <Trash2 size={16} />
        </button>
      </Link>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Delete Board</h2>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setShowDeleteDialog(false);
                }}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{title}</strong>? This action cannot be undone.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setShowDeleteDialog(false);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleConfirmDelete();
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
