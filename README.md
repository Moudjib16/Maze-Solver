# Maze Solver — Pathfinding Visualizer

Interactive React + Vite app that visualizes BFS, DFS, A\*, Dijkstra, Greedy Best-First,
and Bidirectional BFS navigating mazes — now with weighted terrain, seeded sharing,
and side-by-side comparison.

Live demo: paint walls, drag start/goal, race all six algorithms on the same maze.

## Features

- Animated solver: explored nodes vs. final path, with steps / cost / solve-time stats
- Algorithms: BFS (fewest steps), DFS (any path), A\* with Manhattan heuristic
  (cheapest, weight-aware), Dijkstra (cheapest, weight-aware), Greedy Best-First
  (fast, not optimal), Bidirectional BFS (fewest steps, two-sided)
- Weighted terrain: open ×1, mud ×5, water ×10 — Dijkstra/A\* route around it,
  BFS chases the short expensive way
- Interactive editing: drag-to-paint walls/mud/water, drag S/G markers
- Seeded mazes: DFS (long corridors) and Prim's (many dead-ends) carvers,
  sizes 11–31, loop control, `?seed=&size=&loops=&gen=` share links
- Compare mode: ⚔️ runs all 6 racers instantly on the same maze
- Playback: pause/resume, step-through, mid-race speed (0.5x–4x), reduced-motion support
- Pages: Home, Maze Solver (`/maze`), Documentation (`/docs`), Contact (`/contact`), 404

## Getting started

```bash
npm install
npm run dev
```

Checks:

```bash
npm run lint
npm test
npm run build
npm run preview
```

## Project structure

- `src/algorithms/` — `bfs.js`, `dfs.js`, `aStar.js`, `dijkstra.js`, `greedy.js`,
  `bidirectionalBfs.js` (each returns `{ explored, solutionPath[, cost] }`),
  plus `common.js` (neighbors, terrain costs, validation) and `solvers.test.js`
- `src/utils/maze.js` — default maze, `cloneMaze`/`getDefaultMaze`,
  `generateRandomMaze(rows, cols, loops, seed, generator)` (`dfs` | `prim`)
- `src/utils/MinHeap.js` — binary heap used by A\*/Dijkstra/Greedy
- `src/components/MazeGrid.jsx` — grid rendering + frame-budgeted animation,
  editing, playback, compare table, seed/share controls
- `src/components/PathTables.jsx` — explored/path stats and coordinate tables
- `src/pages/` — `Home.jsx`, `Solver.jsx`, `Documentation.jsx`, `Contact.jsx`, `NotFound.jsx`

## Tech

React 19, Vite 6, Tailwind CSS 4, React Router, React Icons, Vitest.
