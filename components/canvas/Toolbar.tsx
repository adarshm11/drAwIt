"use client";

import {
  Pencil,
  Eraser,
  Square,
  Circle,
  Minus,
  Undo2,
  Redo2,
  Trash2,
} from "lucide-react";
import { useCanvasStore } from "@/lib/store/canvasStore";
import { ToolType } from "@/types/canvas";
import { cn } from "@/lib/utils";
import ColorPicker from "./ColorPicker";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface ToolbarProps {
  boardId?: Id<"boards">;
}

export default function Toolbar({ boardId }: ToolbarProps) {
  const clearStrokesMutation = useMutation(api.strokes.clear);
  const updateBoardMutation = useMutation(api.boards.update);

  const {
    tool,
    strokeColor,
    fillColor,
    strokeWidth,
    setTool,
    setStrokeColor,
    setFillColor,
    setStrokeWidth,
    undo,
    redo,
    canUndo,
    canRedo,
    clearCanvas,
  } = useCanvasStore();

  const handleClearCanvas = async () => {
    if (boardId) {
      try {
        await clearStrokesMutation({ boardId });
        // Also clear the thumbnail
        await updateBoardMutation({
          boardId,
          thumbnail: undefined,
        });
      } catch (error) {
        console.error("Failed to clear canvas:", error);
      }
    } else {
      // Fallback to local clear if no boardId
      clearCanvas();
    }
  };

  const tools: { type: ToolType; icon: React.ReactNode; label: string }[] = [
    { type: "pencil", icon: <Pencil size={20} />, label: "Pencil" },
    { type: "eraser", icon: <Eraser size={20} />, label: "Eraser" },
    { type: "rectangle", icon: <Square size={20} />, label: "Rectangle" },
    { type: "circle", icon: <Circle size={20} />, label: "Circle" },
    { type: "line", icon: <Minus size={20} />, label: "Line" },
  ];

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-50 border border-gray-300 rounded-lg">
      {/* Tools */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-gray-700">Tools</p>
        <div className="flex flex-wrap gap-2">
          {tools.map((t) => (
            <button
              key={t.type}
              onClick={() => setTool(t.type)}
              className={cn(
                "p-3 rounded-md border transition-all hover:bg-gray-200",
                tool === t.type
                  ? "bg-blue-500 text-white border-blue-600 hover:bg-blue-600"
                  : "bg-white border-gray-300"
              )}
              title={t.label}
            >
              {t.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-gray-700">Stroke Color</p>
        <ColorPicker color={strokeColor} onChange={setStrokeColor} />
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-gray-700">Fill Color</p>
        <ColorPicker color={fillColor} onChange={setFillColor} />
      </div>

      {/* Stroke Width */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-gray-700">
          Stroke Width: {strokeWidth}px
        </p>
        <input
          type="range"
          min="1"
          max="20"
          value={strokeWidth}
          onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-gray-700">Actions</p>
        <div className="flex gap-2">
          <button
            onClick={undo}
            disabled={!canUndo()}
            className={cn(
              "flex-1 p-2 rounded-md border transition-all",
              canUndo()
                ? "bg-white border-gray-300 hover:bg-gray-200"
                : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
            )}
            title="Undo"
          >
            <Undo2 size={20} className="mx-auto" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo()}
            className={cn(
              "flex-1 p-2 rounded-md border transition-all",
              canRedo()
                ? "bg-white border-gray-300 hover:bg-gray-200"
                : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
            )}
            title="Redo"
          >
            <Redo2 size={20} className="mx-auto" />
          </button>
        </div>
        <button
          onClick={handleClearCanvas}
          className="w-full p-2 rounded-md border bg-red-500 text-white border-red-600 hover:bg-red-600 transition-all flex items-center justify-center gap-2"
        >
          <Trash2 size={20} />
          Clear Canvas
        </button>
      </div>
    </div>
  );
}
