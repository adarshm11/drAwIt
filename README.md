# drAwIt

A real-time collaborative whiteboard application where multiple users can draw, sketch, and create together on a shared canvas. The ultimate goal is to integrate AI-powered drawing capabilities for generating and enhancing artwork.

## Purpose

drAwIt is an interactive whiteboard that enables users to:
- Draw freehand with customizable colors and stroke widths
- Create shapes (rectangles, circles, lines)
- Collaborate in real-time with multiple users
- Save and manage multiple drawing boards
- See other users' cursors and presence in real-time
- *(Coming soon)* Generate drawings using AI from text prompts

Perfect for brainstorming sessions, teaching, design collaboration, or just having fun drawing with friends.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Canvas Rendering**: Konva.js with React Konva
- **Real-time Backend**: Convex
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm, yarn, or pnpm package manager
- A free Convex account ([convex.dev](https://convex.dev))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/adarshm11/drAwIt.git
   cd drAwIt
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Convex**
   ```bash
   npx convex dev
   ```
   This will:
   - Prompt you to create/link a Convex project
   - Generate your environment configuration
   - Start the Convex development server

4. **Start the development server** (in a new terminal)
   ```bash
   npm run dev
   ```

5. **Open the application**
   
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Create a Board**: Click "Create New Board" from the home page
2. **Start Drawing**: 
   - Select a tool from the toolbar (Pencil, Eraser, Rectangle, Circle, Line)
   - Pick a color from the color picker
   - Adjust stroke width as needed
   - Draw on the canvas!
3. **Collaborate**: Share your board URL with others to draw together in real-time
4. **Undo/Redo**: Use the toolbar buttons or keyboard shortcuts (Cmd/Ctrl+Z, Cmd/Ctrl+Shift+Z)
5. **Manage Boards**: Return to the home page to view all your boards or create new ones

## Features

**Drawing Tools**
- Freehand pencil drawing
- Eraser tool
- Shape tools (rectangle, circle, line)
- Color picker with preset colors
- Adjustable stroke width
- Clear canvas

**Board Management**
- Create and delete boards
- Board list with thumbnails
- Auto-save to database
- Load existing boards

**Real-time Collaboration**
- Live drawing synchronization across users
- User presence indicators
- Real-time cursor tracking
- User identification with names and colors
- Join/leave notifications

**User Experience**
- Undo/redo functionality
- Keyboard shortcuts
- Responsive design
- Smooth, optimized rendering

## Future Development

### Ultimate Goal: AI-Powered Drawing
The long-term vision for drAwIt is to integrate AI capabilities that allow users to generate drawings through natural language prompts, auto-complete sketches, and enhance existing drawings with AI assistance.

### Planned Features

**Advanced Drawing Tools**
- Text tool with formatting options
- Image upload and placement
- Selection tool (move, resize, rotate objects)
- Layers panel for managing drawing elements
- Copy/paste functionality
- Export boards (PNG, SVG, PDF)
- Zoom and pan controls
- Grid and snap-to-grid options

**Enhanced Collaboration**
- User authentication system
- Board permissions (public/private)
- User invitations to boards
- Comments and annotations
- Version history and board snapshots
- Pre-made board templates

**AI Features**
- AI-powered drawing generation from text prompts
- Smart shape recognition and refinement
- Auto-complete for partial drawings
- Style transfer and artistic filters
- AI suggestions for composition and layout
- Background generation and removal

**Polish & Optimization**
- Performance improvements for large boards
- Mobile-responsive design enhancements
- Touch support for tablets
- Accessibility improvements
- Dark mode theme
- Advanced keyboard shortcuts
- Infinite canvas
