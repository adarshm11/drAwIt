import Konva from "konva";
import { Point } from "@/types/canvas";

export function getRelativePointerPosition(stage: Konva.Stage): Point | null {
  const pointerPosition = stage.getPointerPosition();
  if (!pointerPosition) return null;

  const transform = stage.getAbsoluteTransform().copy();
  transform.invert();

  return transform.point(pointerPosition);
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function rgbaToHex(r: number, g: number, b: number, a: number = 1): string {
  const toHex = (n: number) => {
    const hex = Math.round(n).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  if (a === 1) {
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  return `#${toHex(r)}${toHex(g)}${toHex(b)}${toHex(a * 255)}`;
}

export function hexToRgba(hex: string): { r: number; g: number; b: number; a: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(hex);

  if (!result) {
    return { r: 0, g: 0, b: 0, a: 1 };
  }

  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
    a: result[4] ? parseInt(result[4], 16) / 255 : 1,
  };
}
