# Maze Solver — Pathfinding Visualizer

Interactive React + Vite app that visualizes BFS, DFS, A*, Dijkstra, Greedy Best-First,
and Bidirectional BFS navigating mazes,
with a 15×15 default maze and procedurally generated mazes up to 31×31.

## Features

- Animated solver: explored nodes vs. final path, with node counts
- Algorithms: BFS (shortest), DFS (any path), A* with Manhattan heuristic (optimal), Dijkstra (optimal, uniform-cost), Greedy Best-First (fast, not optimal), Bidirectional BFS (optimal, two-sided)
- Random maze generation (recursive backtracker), responsive grid
- Playback controls: 0.5x–4x speed, Reset/cancel, solve-time stat, no-path feedback
- Pages: Home, Maze Solver (`/maze`), Documentation (`/docs`), Contact (`/contact`)

## Getting started

```bash
npm install
npm run dev
```

Build / preview:

```bash
npm run build
npm run preview
```

## Project structure

- `src/algorithms/` — `bfs.js`, `dfs.js`, `aStar.js`, `dijkstra.js`, `greedy.js`, `bidirectionalBfs.js` (each returns `{ explored, solutionPath }`)
- `src/utils/maze.js` — default maze, `start`/`goal`, `generateRandomMaze(rows, cols)`
- `src/components/MazeGrid.jsx` — grid rendering + batched animation + controls
- `src/components/PathTables.jsx` — explored/path stats and coordinate tables
- `src/pages/` — `Home.jsx`, `Solver.jsx`, `Documentation.jsx`, `Contact.jsx`

## Tech

React 19, Vite 6, Tailwind CSS 4, Framer Motion, React Router, Lucide/React Icons.
