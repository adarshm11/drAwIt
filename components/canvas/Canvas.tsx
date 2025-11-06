"use client";

import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Line, Rect, Circle } from "react-konva";
import Konva from "konva";
import { useCanvasStore } from "@/lib/store/canvasStore";
import { getRelativePointerPosition, generateId } from "@/lib/utils/canvas";
import { calculateCircleRadius, calculateRectangleDimensions } from "@/lib/utils/geometry";
import { Stroke } from "@/types/stroke";
import { Point } from "@/types/canvas";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface CanvasProps {
  boardId: Id<"boards">;
  width?: number;
  height?: number;
}

export default function Canvas({ boardId, width: fixedWidth, height: fixedHeight }: CanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const [currentShape, setCurrentShape] = useState<Stroke | null>(null);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [dimensions, setDimensions] = useState({ width: fixedWidth || 1200, height: fixedHeight || 700 });

  // Convex hooks
  const convexStrokes = useQuery(api.strokes.list, { boardId });
  const addStrokeMutation = useMutation(api.strokes.add);
  const updateBoardMutation = useMutation(api.boards.update);

  const {
    tool,
    strokeColor,
    fillColor,
    strokeWidth,
    opacity,
    strokes,
    addStroke,
    setIsDrawing,
  } = useCanvasStore();

  // Clear strokes when boardId changes to prevent flashing old content
  useEffect(() => {
    useCanvasStore.setState({ strokes: [], history: [[]], historyStep: 0 });
  }, [boardId]);

  // Handle responsive canvas sizing
  useEffect(() => {
    if (!fixedWidth || !fixedHeight) {
      const updateDimensions = () => {
        if (containerRef.current) {
          const container = containerRef.current;
          const padding = 32; // Account for padding/margins
          const newWidth = Math.min(container.clientWidth - padding, 1400);
          const newHeight = Math.min(container.clientHeight - padding, 800);
          setDimensions({ width: newWidth, height: newHeight });
        }
      };

      updateDimensions();
      window.addEventListener("resize", updateDimensions);
      return () => window.removeEventListener("resize", updateDimensions);
    }
  }, [fixedWidth, fixedHeight]);

  // Load strokes from Convex when they change
  useEffect(() => {
    if (convexStrokes !== undefined) {
      // Convert Convex strokes to local format with proper type narrowing
      const localStrokes: Stroke[] = convexStrokes.map((s): Stroke => {
        const baseStroke = {
          id: s._id,
          x: s.x,
          y: s.y,
          strokeColor: s.strokeColor,
          fillColor: s.fillColor,
          strokeWidth: s.strokeWidth,
          opacity: s.opacity,
          order: s.order,
        };

        switch (s.type) {
          case "path":
            return {
              ...baseStroke,
              type: "path",
              points: s.points || [],
            };
          case "rectangle":
            return {
              ...baseStroke,
              type: "rectangle",
              width: s.width!,
              height: s.height!,
            };
          case "circle":
            return {
              ...baseStroke,
              type: "circle",
              radius: s.radius!,
            };
          case "line":
            return {
              ...baseStroke,
              type: "line",
              points: s.points || [],
            };
          case "text":
            return {
              ...baseStroke,
              type: "text",
              text: s.text || "",
              fontSize: 16,
            };
          default:
            throw new Error(`Unknown stroke type: ${s.type}`);
        }
      });

      // Only update strokes if different, but preserve history for undo/redo
      if (JSON.stringify(localStrokes) !== JSON.stringify(strokes)) {
        const currentState = useCanvasStore.getState();

        // Initialize history with loaded strokes if it's empty (first load)
        if (currentState.history.length === 1 && currentState.history[0].length === 0) {
          useCanvasStore.setState({
            strokes: localStrokes,
            history: [localStrokes],
            historyStep: 0
          });
        } else {
          // Just update strokes without touching history (for subsequent updates)
          useCanvasStore.setState({ strokes: localStrokes });
        }
      }
    }
  }, [convexStrokes]);

  // Function to generate and save thumbnail
  const generateThumbnail = async () => {
    try {
      const stage = stageRef.current;
      if (!stage) {
        console.log("No stage ref");
        return;
      }

      // Small delay to ensure rendering is complete
      await new Promise(resolve => setTimeout(resolve, 100));

      // Generate thumbnail at lower resolution
      const thumbnail = stage.toDataURL({
        pixelRatio: 0.2, // Lower resolution for smaller file size
        mimeType: "image/jpeg",
        quality: 0.7,
      });

      console.log("Generated thumbnail, length:", thumbnail.length);

      await updateBoardMutation({
        boardId,
        thumbnail,
      });

      console.log("Thumbnail saved successfully");
    } catch (error) {
      console.error("Failed to generate thumbnail:", error);
    }
  };

  const handleMouseDown = () => {
    if (!stageRef.current) return;

    setIsDrawing(true);
    const pos = getRelativePointerPosition(stageRef.current);
    if (!pos) return;

    setStartPoint(pos);

    if (tool === "pencil") {
      const newStroke: Stroke = {
        id: generateId(),
        type: "path",
        points: [pos.x, pos.y],
        x: 0,
        y: 0,
        strokeColor,
        strokeWidth,
        opacity,
        order: strokes.length,
      };
      setCurrentShape(newStroke);
    } else if (tool === "eraser") {
      const newStroke: Stroke = {
        id: generateId(),
        type: "path",
        points: [pos.x, pos.y],
        x: 0,
        y: 0,
        strokeColor: "#ffffff",
        strokeWidth: strokeWidth * 3,
        opacity: 1,
        order: strokes.length,
      };
      setCurrentShape(newStroke);
    }
  };

  const handleMouseMove = () => {
    if (!stageRef.current || !startPoint) return;

    const pos = getRelativePointerPosition(stageRef.current);
    if (!pos) return;

    if (tool === "pencil" || tool === "eraser") {
      if (currentShape && currentShape.type === "path") {
        const updatedShape: Stroke = {
          ...currentShape,
          points: [...currentShape.points, pos.x, pos.y],
        };
        setCurrentShape(updatedShape);
      }
    } else if (tool === "rectangle") {
      const dims = calculateRectangleDimensions(startPoint, pos);
      const newStroke: Stroke = {
        id: currentShape?.id || generateId(),
        type: "rectangle",
        x: dims.x,
        y: dims.y,
        width: dims.width,
        height: dims.height,
        strokeColor,
        fillColor,
        strokeWidth,
        opacity,
        order: strokes.length,
      };
      setCurrentShape(newStroke);
    } else if (tool === "circle") {
      const radius = calculateCircleRadius(startPoint, pos);
      const newStroke: Stroke = {
        id: currentShape?.id || generateId(),
        type: "circle",
        x: startPoint.x,
        y: startPoint.y,
        radius,
        strokeColor,
        fillColor,
        strokeWidth,
        opacity,
        order: strokes.length,
      };
      setCurrentShape(newStroke);
    } else if (tool === "line") {
      const newStroke: Stroke = {
        id: currentShape?.id || generateId(),
        type: "line",
        points: [startPoint.x, startPoint.y, pos.x, pos.y],
        x: 0,
        y: 0,
        strokeColor,
        strokeWidth,
        opacity,
        order: strokes.length,
      };
      setCurrentShape(newStroke);
    }
  };

  const handleMouseUp = async () => {
    if (currentShape) {
      // Save to Convex
      try {
        const strokeId = await addStrokeMutation({
          boardId,
          type: currentShape.type,
          x: currentShape.x,
          y: currentShape.y,
          points: currentShape.type === "path" || currentShape.type === "line" ? currentShape.points : undefined,
          width: currentShape.type === "rectangle" ? currentShape.width : undefined,
          height: currentShape.type === "rectangle" ? currentShape.height : undefined,
          radius: currentShape.type === "circle" ? currentShape.radius : undefined,
          text: currentShape.type === "text" ? currentShape.text : undefined,
          strokeColor: currentShape.strokeColor,
          fillColor: currentShape.fillColor,
          strokeWidth: currentShape.strokeWidth,
          opacity: currentShape.opacity,
          order: currentShape.order,
        });

        // Add to history with Convex ID for undo/redo support
        const strokeWithConvexId = {
          ...currentShape,
          id: strokeId,
        };
        addStroke(strokeWithConvexId);

        // Generate thumbnail after stroke is saved
        generateThumbnail();
      } catch (error) {
        console.error("Failed to save stroke:", error);
      }

      setCurrentShape(null);
    }
    setStartPoint(null);
    setIsDrawing(false);
  };

  const renderStroke = (stroke: Stroke) => {
    switch (stroke.type) {
      case "path":
        return (
          <Line
            key={stroke.id}
            points={stroke.points}
            stroke={stroke.strokeColor}
            strokeWidth={stroke.strokeWidth}
            opacity={stroke.opacity}
            tension={0.5}
            lineCap="round"
            lineJoin="round"
            globalCompositeOperation={
              stroke.strokeColor === "#ffffff" ? "destination-out" : "source-over"
            }
          />
        );
      case "rectangle":
        return (
          <Rect
            key={stroke.id}
            x={stroke.x}
            y={stroke.y}
            width={stroke.width}
            height={stroke.height}
            stroke={stroke.strokeColor}
            fill={stroke.fillColor}
            strokeWidth={stroke.strokeWidth}
            opacity={stroke.opacity}
          />
        );
      case "circle":
        return (
          <Circle
            key={stroke.id}
            x={stroke.x}
            y={stroke.y}
            radius={stroke.radius}
            stroke={stroke.strokeColor}
            fill={stroke.fillColor}
            strokeWidth={stroke.strokeWidth}
            opacity={stroke.opacity}
          />
        );
      case "line":
        return (
          <Line
            key={stroke.id}
            points={stroke.points}
            stroke={stroke.strokeColor}
            strokeWidth={stroke.strokeWidth}
            opacity={stroke.opacity}
            lineCap="round"
            lineJoin="round"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      ref={containerRef}
      className="border border-gray-300 rounded-lg overflow-hidden bg-white w-full h-full flex items-center justify-center"
    >
      <Stage
        ref={stageRef}
        width={dimensions.width}
        height={dimensions.height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
      >
        {/* Background layer */}
        <Layer>
          <Rect
            x={0}
            y={0}
            width={dimensions.width}
            height={dimensions.height}
            fill="#ffffff"
          />
        </Layer>
        {/* Drawing layer */}
        <Layer>
          {strokes.map((stroke) => renderStroke(stroke))}
          {currentShape && renderStroke(currentShape)}
        </Layer>
      </Stage>
    </div>
  );
}
