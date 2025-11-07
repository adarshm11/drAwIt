# drAwIt - Interactive Whiteboard Application Plan

## Project Overview
An interactive whiteboard application enabling real-time collaborative drawing and writing with multiple users simultaneously. The ultimate goal is to integrate AI-powered drawing generation and enhancement capabilities.

## Tech Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **UI Library**: React 18+
- **Canvas Rendering**:
  - **Konva.js** (React Konva) - High-performance canvas library with great event handling
  - Alternative: Fabric.js or native HTML5 Canvas with optimizations
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**:
  - Convex React hooks for server state
  - Zustand for local UI state
- **Real-time Communication**: Convex real-time subscriptions

### Backend
- **Database & Backend**: Convex (TypeScript)
- **Authentication**: Convex Auth or Clerk
- **File Storage**: Convex file storage for image uploads/exports

### Development Tools
- **Package Manager**: pnpm or npm
- **Linting**: ESLint + Prettier
- **Type Checking**: TypeScript strict mode
- **Version Control**: Git

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                       Next.js Frontend                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Drawing Canvas (Konva.js)                             │ │
│  │  - Pencil, Brush, Shapes, Text                         │ │
│  │  - Real-time cursor tracking                           │ │
│  │  - Layer management                                    │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Toolbar & Controls                                    │ │
│  │  - Color picker, stroke width, tools                   │ │
│  │  - Undo/redo, zoom, pan                                │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Collaboration UI                                      │ │
│  │  - Active users list                                   │ │
│  │  - User cursors with names                             │ │
│  │  - Presence indicators                                 │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ Real-time Subscriptions & Mutations
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                    Convex Backend                            │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Database Tables                                       │ │
│  │  - boards (whiteboard sessions)                        │ │
│  │  - strokes (drawing data)                              │ │
│  │  - users (user profiles)                               │ │
│  │  - presence (active users per board)                   │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Convex Functions                                      │ │
│  │  - Mutations: addStroke, updateStroke, deleteStroke    │ │
│  │  - Queries: getBoard, getStrokes, getUsers             │ │
│  │  - Actions: exportBoard, uploadImage                   │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Data Model (Convex Schema)

### boards
```typescript
{
  _id: Id<"boards">,
  _creationTime: number,
  title: string,
  ownerId: Id<"users">,
  isPublic: boolean,
  backgroundColor: string,
  thumbnail?: string,
  lastModified: number,
}
```

### strokes
```typescript
{
  _id: Id<"strokes">,
  _creationTime: number,
  boardId: Id<"boards">,
  userId: Id<"users">,
  type: "path" | "rectangle" | "circle" | "line" | "text",
  points?: number[], // For freehand paths [x1, y1, x2, y2, ...]
  x: number,
  y: number,
  width?: number,
  height?: number,
  text?: string, // For text elements
  strokeColor: string,
  fillColor?: string,
  strokeWidth: number,
  opacity: number,
  order: number, // Z-index for layering
}
```

### presence
```typescript
{
  _id: Id<"presence">,
  _creationTime: number,
  boardId: Id<"boards">,
  userId: Id<"users">,
  userName: string,
  userColor: string, // Unique color for cursor
  cursorX: number,
  cursorY: number,
  lastSeen: number,
}
```

### users
```typescript
{
  _id: Id<"users">,
  _creationTime: number,
  name: string,
  email: string,
  avatar?: string,
  color: string, // Default color for their drawings
}
```

## Core Features

### Phase 1: Basic Drawing (Week 1-2)
- [ ] Project setup (Next.js + Convex)
- [ ] Basic canvas implementation with Konva.js
- [ ] Drawing tools:
  - Pencil (freehand drawing)
  - Eraser
  - Basic shapes (rectangle, circle, line)
- [ ] Color picker
- [ ] Stroke width selector
- [ ] Clear canvas
- [ ] Local undo/redo (single user)

### Phase 2: Persistence & Backend (Week 2-3)
- [ ] Convex setup and schema definition
- [ ] Save strokes to Convex in real-time
- [ ] Load existing board data
- [ ] Create/delete boards
- [ ] Board list view
- [ ] Auto-save functionality

### Phase 3: Real-time Collaboration (Week 3-4)
- [ ] Real-time stroke synchronization
- [ ] Presence system:
  - Show active users
  - Display user cursors with names
  - User join/leave notifications
- [ ] Conflict resolution for simultaneous edits
- [ ] Optimistic updates for smooth UX
- [ ] Debouncing/throttling for cursor updates

### Phase 4: Advanced Features (Week 4-5)
- [ ] Text tool with formatting
- [ ] Image upload and placement
- [ ] Selection tool (move, resize, rotate objects)
- [ ] Layers panel
- [ ] Copy/paste functionality
- [ ] Export board (PNG, SVG, PDF)
- [ ] Zoom and pan controls
- [ ] Grid/snap-to-grid option

### Phase 5: Collaboration Features (Week 5-6)
- [ ] User authentication
- [ ] Board permissions (public/private)
- [ ] Invite users to boards
- [ ] User comments/annotations
- [ ] Version history
- [ ] Board templates

### Phase 6: Polish & Optimization (Week 6-7)
- [ ] Performance optimization:
  - Virtualization for large boards
  - Stroke batching
  - Lazy loading for historical data
- [ ] Keyboard shortcuts
- [ ] Mobile responsive design
- [ ] Touch support for tablets
- [ ] Accessibility improvements
- [ ] Dark mode

### Phase 7: AI Integration (Week 7-9)
- [ ] AI drawing generation from text prompts
  - Integration with image generation APIs (DALL-E, Stable Diffusion, etc.)
  - Convert generated images to editable canvas objects
  - Prompt history and refinement
- [ ] Smart shape recognition
  - Recognize hand-drawn shapes and convert to perfect geometric shapes
  - Suggest improvements to drawings
- [ ] AI-powered auto-complete
  - Predict and complete partial drawings
  - Style-consistent continuation of sketches
- [ ] Intelligent canvas features
  - Auto-arrange elements on canvas
  - Smart alignment and spacing suggestions
  - Background generation/removal
- [ ] Style transfer and filters
  - Apply artistic styles to drawings
  - Color palette suggestions
  - Composition recommendations
- [ ] AI assistant integration
  - Natural language commands for drawing operations
  - Conversational interface for creating and editing

## Implementation Strategy

### Real-time Synchronization Approach

**1. Stroke Broadcasting**
```typescript
// Client side - when user draws
const addStroke = useMutation(api.strokes.add);

onDrawEnd = async (strokeData) => {
  // Optimistically render locally
  setLocalStrokes([...localStrokes, strokeData]);

  // Send to Convex
  await addStroke({
    boardId,
    ...strokeData
  });
};

// Subscribe to new strokes from others
const strokes = useQuery(api.strokes.list, { boardId });
```

**2. Presence Updates**
```typescript
// Throttled cursor position updates (every 50ms)
const updatePresence = useMutation(api.presence.update);

onMouseMove = throttle((e) => {
  updatePresence({
    boardId,
    cursorX: e.clientX,
    cursorY: e.clientY,
  });
}, 50);

// Subscribe to other users' presence
const activeUsers = useQuery(api.presence.list, { boardId });
```

**3. Conflict Resolution**
- Use timestamps and user IDs to resolve conflicts
- Last-write-wins for simple operations
- Operational Transformation (OT) for complex scenarios
- Optimistic updates with rollback on conflict

### Performance Optimizations

1. **Stroke Batching**: Group multiple small strokes into compound paths
2. **Lazy Loading**: Load visible viewport data first, lazy load off-screen content
3. **Debouncing**: Throttle database writes for continuous operations (drawing)
4. **Caching**: Use Convex's built-in caching for queries
5. **Canvas Optimization**:
   - Use layers for static vs. dynamic content
   - Implement dirty region rendering
   - Cache complex shapes as images

## File Structure

```
drAwIt/
├── convex/
│   ├── schema.ts
│   ├── boards.ts          # Board CRUD operations
│   ├── strokes.ts         # Stroke operations
│   ├── presence.ts        # Real-time presence
│   ├── users.ts           # User management
│   └── lib/
│       └── utils.ts
├── app/
│   ├── layout.tsx
│   ├── page.tsx           # Home/board list
│   ├── board/
│   │   └── [boardId]/
│   │       └── page.tsx   # Main whiteboard view
│   └── api/
├── components/
│   ├── canvas/
│   │   ├── Canvas.tsx
│   │   ├── Toolbar.tsx
│   │   ├── ColorPicker.tsx
│   │   └── tools/
│   │       ├── PencilTool.tsx
│   │       ├── ShapeTool.tsx
│   │       └── TextTool.tsx
│   ├── collaboration/
│   │   ├── UserCursor.tsx
│   │   ├── ActiveUsers.tsx
│   │   └── PresenceIndicator.tsx
│   ├── ui/              # shadcn/ui components
│   └── layout/
│       ├── Header.tsx
│       └── Sidebar.tsx
├── lib/
│   ├── hooks/
│   │   ├── useCanvas.ts
│   │   ├── useDrawing.ts
│   │   └── usePresence.ts
│   ├── store/
│   │   └── canvasStore.ts  # Zustand store
│   └── utils/
│       ├── canvas.ts
│       └── geometry.ts
├── types/
│   ├── canvas.ts
│   └── stroke.ts
└── public/
```

## Key Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "convex": "^1.7.0",
    "react-konva": "^18.2.0",
    "konva": "^9.2.0",
    "zustand": "^4.4.0",
    "tailwindcss": "^3.3.0",
    "@radix-ui/react-*": "latest",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "lucide-react": "^0.294.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "eslint": "^8.55.0",
    "prettier": "^3.1.0"
  }
}
```

## Getting Started Steps

1. **Initialize Project**
   ```bash
   npx create-next-app@latest drawit --typescript --tailwind --app
   cd drawit
   ```

2. **Setup Convex**
   ```bash
   npm install convex
   npx convex dev
   ```

3. **Install Canvas Library**
   ```bash
   npm install konva react-konva
   npm install -D @types/konva
   ```

4. **Install UI Dependencies**
   ```bash
   npx shadcn-ui@latest init
   npm install zustand lucide-react
   ```

5. **Define Convex Schema** (convex/schema.ts)

6. **Create Basic Canvas Component**

7. **Implement Drawing Tools**

8. **Add Convex Mutations/Queries**

9. **Implement Real-time Subscriptions**

10. **Add Presence System**

## Testing Strategy

- **Unit Tests**: Test utility functions, stroke generation
- **Integration Tests**: Test Convex functions
- **E2E Tests**: Test real-time collaboration with multiple clients
- **Performance Tests**: Test with 100+ strokes, multiple users

## Deployment

- **Frontend**: Vercel (native Next.js support)
- **Backend**: Convex (automatically deployed with convex deploy)
- **Domain**: Configure custom domain in Vercel

## Success Metrics

- **Performance**: < 16ms render time for smooth 60 FPS drawing
- **Latency**: < 100ms for stroke synchronization
- **Scale**: Support 10+ simultaneous users per board
- **Reliability**: 99.9% uptime

## Future Enhancements

- Mobile native apps (React Native)
- Voice/video chat integration
- Whiteboard recording and playback
- Integration with other tools (Figma, Miro)
- Advanced AI features:
  - 3D object generation
  - Animation creation from static drawings
  - Collaborative AI suggestions in real-time
  - Custom AI model training on user's drawing style
  - Multi-modal input (voice + sketch + text prompts)

---

**Note**: This plan is flexible and can be adjusted based on specific requirements, timeline, and resources available.
