"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Palette } from "lucide-react";
import Canvas from "@/components/canvas/Canvas";
import Toolbar from "@/components/canvas/Toolbar";
import ActiveUsers from "@/components/collaboration/ActiveUsers";
import UserCursor from "@/components/collaboration/UserCursor";
import UserNameDialog from "@/components/UserNameDialog";
import { useCanvasStore } from "@/lib/store/canvasStore";
import { useUser } from "@/lib/hooks/useUser";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface BoardPageProps {
  params: {
    boardId: string;
  };
}

export default function BoardPage({ params }: BoardPageProps) {
  const router = useRouter();
  const [actualBoardId, setActualBoardId] = useState<Id<"boards"> | null>(null);
  const { user, isLoading: isUserLoading, createUser } = useUser();
  const [showNameDialog, setShowNameDialog] = useState(false);

  const createBoard = useMutation(api.boards.create);
  const updatePresence = useMutation(api.presence.update);
  const removePresence = useMutation(api.presence.remove);

  const board = useQuery(
    api.boards.get,
    actualBoardId ? { boardId: actualBoardId } : "skip"
  );
  const activeUsers = useQuery(
    api.presence.list,
    actualBoardId ? { boardId: actualBoardId } : "skip"
  );

  // Initialize or create board
  useEffect(() => {
    const initBoard = async () => {
      // Check if params.boardId is a valid Convex ID
      if (params.boardId.startsWith("k") || params.boardId.startsWith("j")) {
        // Likely a Convex ID
        setActualBoardId(params.boardId as Id<"boards">);
      } else {
        // Create a new board
        try {
          const newBoardId = await createBoard({
            title: `Board ${Date.now()}`,
            backgroundColor: "#ffffff",
          });
          setActualBoardId(newBoardId);
          // Update URL to use the real board ID
          router.replace(`/board/${newBoardId}`);
        } catch (error) {
          console.error("Failed to create board:", error);
        }
      }
    };

    initBoard();
  }, [params.boardId, createBoard, router]);

  // Show name dialog if user doesn't have a name
  useEffect(() => {
    if (!isUserLoading && !user) {
      setShowNameDialog(true);
    }
  }, [isUserLoading, user]);

  // Handle cursor movement and presence updates (throttled)
  const lastPresenceUpdate = useRef<number>(0);
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!user || !actualBoardId) return;

      const now = Date.now();
      // Throttle to max 20 updates per second (50ms)
      if (now - lastPresenceUpdate.current < 50) return;

      lastPresenceUpdate.current = now;

      updatePresence({
        boardId: actualBoardId,
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        cursorX: e.clientX,
        cursorY: e.clientY,
      });
    },
    [user, actualBoardId, updatePresence]
  );

  // Track mouse movement
  useEffect(() => {
    if (!user || !actualBoardId) return;

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [user, actualBoardId, handleMouseMove]);

  // Clean up presence on unmount
  useEffect(() => {
    if (!user || !actualBoardId) return;

    return () => {
      removePresence({
        boardId: actualBoardId,
        userId: user.id,
      });
    };
  }, [user, actualBoardId, removePresence]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Z for undo (check both lowercase and uppercase)
      if ((e.ctrlKey || e.metaKey) && (e.key === "z" || e.key === "Z") && !e.shiftKey) {
        e.preventDefault();
        console.log("Undo triggered");
        useCanvasStore.getState().undo();
      }
      // Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y for redo
      if (
        ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "z" || e.key === "Z")) ||
        ((e.ctrlKey || e.metaKey) && (e.key === "y" || e.key === "Y"))
      ) {
        e.preventDefault();
        console.log("Redo triggered");
        useCanvasStore.getState().redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!actualBoardId) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading whiteboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-white border-b border-gray-300 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft size={20} />
                <span className="text-sm font-medium">Back to Home</span>
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center gap-2">
                <Palette size={24} className="text-blue-500" />
                <h1 className="text-xl font-bold text-gray-900">drAwIt</h1>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Board: <span className="font-semibold">{board?.title || "Untitled"}</span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex gap-6 p-6 h-[calc(100vh-80px)] overflow-hidden">
          {/* Sidebar with Toolbar and Active Users */}
          <aside className="w-80 flex-shrink-0 overflow-y-auto space-y-6">
            <Toolbar boardId={actualBoardId} />
            {user && activeUsers && (
              <ActiveUsers
                users={activeUsers.map((u: any) => ({
                  userId: u.userId,
                  userName: u.userName,
                  userColor: u.userColor,
                }))}
                currentUserId={user.id}
              />
            )}
          </aside>

          {/* Canvas Area with User Cursors */}
          <div className="flex-1 flex items-center justify-center overflow-hidden relative">
            <div className="w-full h-full max-w-full max-h-full flex items-center justify-center">
              <Canvas boardId={actualBoardId} />
            </div>

            {/* Other users' cursors */}
            {user &&
              activeUsers?.map(
                (activeUser: any) =>
                  activeUser.userId !== user.id && (
                    <UserCursor
                      key={activeUser.userId}
                      x={activeUser.cursorX}
                      y={activeUser.cursorY}
                      name={activeUser.userName}
                      color={activeUser.userColor}
                    />
                  )
              )}
          </div>
        </main>

        {/* Keyboard shortcuts info */}
        <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-xs text-gray-600">
          <p className="font-semibold mb-2">Keyboard Shortcuts:</p>
          <p>Ctrl/Cmd + Z: Undo</p>
          <p>Ctrl/Cmd + Shift + Z: Redo</p>
        </div>
      </div>

      {/* User Name Dialog */}
      {showNameDialog && (
        <UserNameDialog
          onSubmit={(name) => {
            createUser(name);
            setShowNameDialog(false);
          }}
        />
      )}
    </>
  );
}
