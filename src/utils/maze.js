// Default maze dimensions — must stay in the MAZE_SIZES list in MazeGrid.jsx
export const DEFAULT_MAZE_SIZE = 15;

// Deterministic PRNG so the default maze is identical on every load
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function carveMaze(grid, rows, cols, rng) {
  function shuffle(dirs) {
    const arr = [...dirs];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function carve(r, c) {
    grid[r][c] = 0;
    for (const [dr, dc] of shuffle([[-2, 0], [2, 0], [0, -2], [0, 2]])) {
      const nr = r + dr, nc = c + dc;
      if (nr > 0 && nr < rows - 1 && nc > 0 && nc < cols - 1 && grid[nr][nc] === 1) {
        grid[r + dr / 2][c + dc / 2] = 0; // remove wall between
        carve(nr, nc);
      }
    }
  }

  carve(1, 1);
  grid[1][1] = 0;
  grid[rows - 2][cols - 2] = 0;
  return grid;
}

function buildDefaultMaze() {
  const rows = DEFAULT_MAZE_SIZE;
  const cols = DEFAULT_MAZE_SIZE;
  const grid = Array.from({ length: rows }, () => Array(cols).fill(1));
  return carveMaze(grid, rows, cols, mulberry32(1337));
}

// Predefined default maze — 15x15, deterministic across reloads
export const maze = buildDefaultMaze();

export const numRows = maze.length;
export const numCols = maze[0].length;
export const start = [1, 1];
export const goal = [numRows - 2, numCols - 2];

// In src/utils/maze.js
export function generateRandomMaze(rows, cols, loopRatio = 0) {
  // Ensure rows and cols are odd numbers for proper maze generation
  if (rows % 2 === 0) rows++;
  if (cols % 2 === 0) cols++;

  const maze = Array.from({ length: rows }, () => Array(cols).fill(1));

  function carve(r, c) {
    maze[r][c] = 0;
    const directions = [
      [-2, 0], [2, 0], [0, -2], [0, 2]
    ].sort(() => Math.random() - 0.5);

    for (const [dr, dc] of directions) {
      const nr = r + dr, nc = c + dc;
      if (nr > 0 && nr < rows - 1 && nc > 0 && nc < cols - 1 && maze[nr][nc] === 1) {
        maze[r + dr / 2][c + dc / 2] = 0; // remove wall between
        carve(nr, nc);
      }
    }
  }

  // Start carving from a random odd cell (clamped in-bounds)
  const startRow = Math.floor(Math.random() * Math.floor(rows / 2)) * 2 + 1;
  const startCol = Math.floor(Math.random() * Math.floor(cols / 2)) * 2 + 1;
  carve(startRow, startCol);

  // Set start and goal explicitly if needed
  maze[1][1] = 0;
  maze[rows - 2][cols - 2] = 0;

  // Braid pass: knock down some dead-end walls to create loops.
  // Only removes walls, so the maze stays solvable and start/goal stay open.
  if (loopRatio > 0) {
    const candidates = [];
    for (let r = 1; r < rows - 1; r++) {
      for (let c = 1; c < cols - 1; c++) {
        if (maze[r][c] !== 1) continue;
        const ns = maze[r - 1][c] === 0 && maze[r + 1][c] === 0;
        const ew = maze[r][c - 1] === 0 && maze[r][c + 1] === 0;
        // Exactly one open opposite pair: clean single loop, no big clearings
        if ((ns ? 1 : 0) + (ew ? 1 : 0) === 1) candidates.push([r, c]);
      }
    }
    // Shuffle and remove a fraction of candidates
    for (let i = candidates.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
    }
    const removeCount = Math.floor(candidates.length * Math.min(1, Math.max(0, loopRatio)));
    for (let i = 0; i < removeCount; i++) {
      maze[candidates[i][0]][candidates[i][1]] = 0;
    }
  }
  return maze;
}
