# drAwIt - Interactive Whiteboard Application

An interactive collaborative whiteboard application built with Next.js, Konva.js, and Convex.

## Phase 1: Basic Drawing ✅

Phase 1 is complete! Basic drawing functionality implemented.

## Phase 2: Backend Persistence ✅

Phase 2 is now complete! The application now includes:

### Features Implemented

**Phase 1 Features:**
- ✅ Basic canvas implementation with Konva.js
- ✅ Drawing tools: Pencil, Eraser, Rectangle, Circle, Line
- ✅ Color picker with preset colors
- ✅ Stroke width selector
- ✅ Clear canvas functionality
- ✅ Local undo/redo with full history
- ✅ Keyboard shortcuts (Ctrl/Cmd + Z for undo, Ctrl/Cmd + Shift + Z for redo)
- ✅ Responsive UI with Tailwind CSS

**Phase 2 Features:**
- ✅ Convex backend integration
- ✅ Real-time stroke persistence
- ✅ Auto-save drawings to database
- ✅ Board management:
  - Create new boards
  - Delete boards
  - Board list view with previews
- ✅ Load existing boards from database
- ✅ Board metadata (title, last modified date)

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm, yarn, or pnpm package manager
- Convex account (free at [convex.dev](https://convex.dev))

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Setup Convex:
```bash
npx convex dev
```
This will:
- Create a new Convex project (or link to an existing one)
- Generate your `NEXT_PUBLIC_CONVEX_URL`
- Start the Convex development server

3. Run the development server (in a new terminal):
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Usage

1. **Create a Board**: Click "Create New Board" on the home page
2. **Draw**: Use the toolbar on the left:
   - Select tools: Pencil, Eraser, Rectangle, Circle, Line
   - Choose colors with the color picker
   - Adjust stroke width with the slider
   - Use Undo/Redo buttons or keyboard shortcuts
   - Clear canvas to start fresh
3. **Save**: Drawings auto-save to Convex in real-time
4. **Manage Boards**:
   - View all boards on the home page
   - Delete boards by hovering and clicking the trash icon
   - Click any board to open and continue editing

## Project Structure

```
drAwIt/
├── app/                    # Next.js app router
├── components/            # React components
│   ├── canvas/           # Canvas-related components
│   ├── collaboration/    # (Phase 3)
│   └── layout/          # Layout components
├── convex/              # Convex backend (Phase 2)
├── lib/                 # Utilities and stores
│   ├── hooks/          # Custom React hooks
│   ├── store/          # Zustand state management
│   └── utils/          # Utility functions
├── types/              # TypeScript type definitions
└── public/            # Static assets
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Canvas**: Konva.js + React Konva
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Backend**: Convex (setup complete, Phase 2)
- **Icons**: Lucide React

## Next Steps

See [PLAN.md](./PLAN.md) for the complete implementation roadmap.

### Coming in Phase 3:
- Real-time collaboration
- Multi-user presence system
- Live cursor tracking
- User names and colors
- Collaborative drawing synchronization

### Future Phases:
- Text tool with formatting
- Image upload and placement
- Selection tool (move, resize, rotate)
- Layers panel
- Export (PNG, SVG, PDF)
- Board templates
- Version history

## License

MIT