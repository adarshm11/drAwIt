export type StrokeType = "path" | "rectangle" | "circle" | "line" | "text";

export interface BaseStroke {
  id: string;
  type: StrokeType;
  x: number;
  y: number;
  strokeColor: string;
  fillColor?: string;
  strokeWidth: number;
  opacity: number;
  order: number;
}

export interface PathStroke extends BaseStroke {
  type: "path";
  points: number[]; // [x1, y1, x2, y2, ...]
}

export interface RectangleStroke extends BaseStroke {
  type: "rectangle";
  width: number;
  height: number;
}

export interface CircleStroke extends BaseStroke {
  type: "circle";
  radius: number;
}

export interface LineStroke extends BaseStroke {
  type: "line";
  points: number[]; // [x1, y1, x2, y2]
}

export interface TextStroke extends BaseStroke {
  type: "text";
  text: string;
  fontSize?: number;
}

export type Stroke = PathStroke | RectangleStroke | CircleStroke | LineStroke | TextStroke;
