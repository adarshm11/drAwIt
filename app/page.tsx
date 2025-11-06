"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, Palette, X } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import BoardCard from "@/components/BoardCard";

export default function Home() {
  const router = useRouter();
  const boards = useQuery(api.boards.list);
  const createBoard = useMutation(api.boards.create);
  const [showDialog, setShowDialog] = useState(false);
  const [boardName, setBoardName] = useState("");

  const generateUniqueName = (baseName: string) => {
    if (!boards) return baseName;

    const existingNames = boards.map((b) => b.title);

    // If base name doesn't exist, use it
    if (!existingNames.includes(baseName)) {
      return baseName;
    }

    // Find the next available number
    let counter = 2;
    while (existingNames.includes(`${baseName} (${counter})`)) {
      counter++;
    }
    return `${baseName} (${counter})`;
  };

  const handleCreateBoard = async () => {
    try {
      const finalName = boardName.trim() || "Untitled Board";
      const uniqueName = generateUniqueName(finalName);

      const newBoardId = await createBoard({
        title: uniqueName,
        backgroundColor: "#ffffff",
      });

      setShowDialog(false);
      setBoardName("");
      router.push(`/board/${newBoardId}`);
    } catch (error) {
      console.error("Failed to create board:", error);
    }
  };

  const handleOpenDialog = () => {
    setBoardName("");
    setShowDialog(true);
  };

  return (
    <>
      <main className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Palette size={48} className="text-blue-500" />
            <h1 className="text-6xl font-bold text-gray-900">drAwIt</h1>
          </div>
          <p className="text-xl text-gray-600">
            Interactive collaborative whiteboard for drawing and brainstorming
          </p>
        </div>

        {/* Create New Board Button */}
        <div className="flex justify-center">
          <button
            onClick={handleOpenDialog}
            className="flex items-center gap-3 px-8 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all text-lg font-semibold shadow-lg hover:shadow-xl"
          >
            <PlusCircle size={24} />
            Create New Board
          </button>
        </div>

        {/* Boards List */}
        {boards === undefined ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading boards...</p>
            </div>
          </div>
        ) : boards.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">No boards yet</p>
            <p className="text-gray-500 text-sm">
              Click "Create New Board" to get started!
            </p>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Boards</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {boards.map((board) => (
                <BoardCard
                  key={board._id}
                  id={board._id}
                  title={board.title}
                  lastModified={board.lastModified}
                  backgroundColor={board.backgroundColor}
                  thumbnail={board.thumbnail}
                />
              ))}
            </div>
          </div>
        )}
        </div>
      </main>

      {/* Create Board Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Create New Board</h2>
              <button
                onClick={() => setShowDialog(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="boardName" className="block text-sm font-medium text-gray-700 mb-2">
                  Board Name
                </label>
                <input
                  id="boardName"
                  type="text"
                  value={boardName}
                  onChange={(e) => setBoardName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleCreateBoard();
                    }
                  }}
                  placeholder="Untitled Board"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty for "Untitled Board"
                </p>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDialog(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateBoard}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
