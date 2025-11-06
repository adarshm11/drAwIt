import { create } from "zustand";
import { ToolType } from "@/types/canvas";
import { Stroke } from "@/types/stroke";

interface CanvasStore {
  // Tool state
  tool: ToolType;
  strokeColor: string;
  fillColor: string;
  strokeWidth: number;
  opacity: number;
  isDrawing: boolean;

  // Strokes state
  strokes: Stroke[];
  history: Stroke[][];
  historyStep: number;

  // Actions
  setTool: (tool: ToolType) => void;
  setStrokeColor: (color: string) => void;
  setFillColor: (color: string) => void;
  setStrokeWidth: (width: number) => void;
  setOpacity: (opacity: number) => void;
  setIsDrawing: (isDrawing: boolean) => void;

  addStroke: (stroke: Stroke) => void;
  updateStroke: (id: string, updates: Partial<Stroke>) => void;
  removeStroke: (id: string) => void;
  clearCanvas: () => void;

  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

export const useCanvasStore = create<CanvasStore>((set, get) => ({
  // Initial state
  tool: "pencil",
  strokeColor: "#000000",
  fillColor: "#000000",
  strokeWidth: 2,
  opacity: 1,
  isDrawing: false,

  strokes: [],
  history: [[]],
  historyStep: 0,

  // Actions
  setTool: (tool) => set({ tool }),
  setStrokeColor: (strokeColor) => set({ strokeColor }),
  setFillColor: (fillColor) => set({ fillColor }),
  setStrokeWidth: (strokeWidth) => set({ strokeWidth }),
  setOpacity: (opacity) => set({ opacity }),
  setIsDrawing: (isDrawing) => set({ isDrawing }),

  addStroke: (stroke) => {
    const state = get();
    const newStrokes = [...state.strokes, stroke];
    const newHistory = state.history.slice(0, state.historyStep + 1);
    newHistory.push(newStrokes);

    set({
      strokes: newStrokes,
      history: newHistory,
      historyStep: newHistory.length - 1,
    });
  },

  updateStroke: (id, updates) => {
    const state = get();
    const newStrokes = state.strokes.map((stroke) =>
      stroke.id === id ? ({ ...stroke, ...updates } as Stroke) : stroke
    );

    set({ strokes: newStrokes });
  },

  removeStroke: (id) => {
    const state = get();
    const newStrokes = state.strokes.filter((stroke) => stroke.id !== id);
    const newHistory = state.history.slice(0, state.historyStep + 1);
    newHistory.push(newStrokes);

    set({
      strokes: newStrokes,
      history: newHistory,
      historyStep: newHistory.length - 1,
    });
  },

  clearCanvas: () => {
    const state = get();
    const newHistory = state.history.slice(0, state.historyStep + 1);
    newHistory.push([]);

    set({
      strokes: [],
      history: newHistory,
      historyStep: newHistory.length - 1,
    });
  },

  undo: () => {
    const state = get();
    if (state.historyStep > 0) {
      const newStep = state.historyStep - 1;
      set({
        strokes: state.history[newStep],
        historyStep: newStep,
      });
    }
  },

  redo: () => {
    const state = get();
    if (state.historyStep < state.history.length - 1) {
      const newStep = state.historyStep + 1;
      set({
        strokes: state.history[newStep],
        historyStep: newStep,
      });
    }
  },

  canUndo: () => {
    const state = get();
    return state.historyStep > 0;
  },

  canRedo: () => {
    const state = get();
    return state.historyStep < state.history.length - 1;
  },
}));
