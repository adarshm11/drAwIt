export type ToolType = "pencil" | "eraser" | "rectangle" | "circle" | "line" | "text" | "select";

export interface CanvasState {
  tool: ToolType;
  strokeColor: string;
  fillColor: string;
  strokeWidth: number;
  opacity: number;
  isDrawing: boolean;
}

export interface Point {
  x: number;
  y: number;
}

export interface CanvasSize {
  width: number;
  height: number;
}
