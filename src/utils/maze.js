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

// Predefined default maze — 15x15, deterministic across reloads.
// NOTE: `maze` is a shared singleton. Never mutate it in place — use
// `getDefaultMaze()` / `cloneMaze()` to get a fresh editable copy.
export const maze = buildDefaultMaze();

export const numRows = maze.length;
export const numCols = maze[0].length;
export const start = [1, 1];
export const goal = [numRows - 2, numCols - 2];

// Deep-freeze the singleton in dev so accidental mutation throws early
// instead of leaking across mounts.
if (typeof Object.freeze === "function") {
  for (const row of maze) Object.freeze(row);
  Object.freeze(maze);
  Object.freeze(start);
  Object.freeze(goal);
}

/// Return a deep copy of a maze grid (rows are cloned).
export function cloneMaze(grid) {
  return grid.map((row) => [...row]);
}

/// Fresh editable copy of the default maze.
export function getDefaultMaze() {
  return cloneMaze(maze);
}

/// Fresh copies of default start/goal (arrays are mutable by callers).
export function getDefaultStart() {
  return [...start];
}

export function getDefaultGoal() {
  return [...goal];
}

// In src/utils/maze.js
// Seeded RNG utilities — mulberry32 is small, fast, and reproducible.
// `makeRng(seed)` accepts a number or string; undefined/null falls back to
// Math.random (unseeded). `randomSeed()` mints a shareable numeric seed.
export function hashSeed(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function makeRng(seed) {
  if (seed === undefined || seed === null || seed === "") return Math.random;
  const n = typeof seed === "number" ? seed : hashSeed(String(seed));
  return mulberry32(n);
}

export function randomSeed() {
  return Math.floor(Math.random() * 2147483647);
}

function shuffleFisherYates(arr, rng) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function randomOdd(rng, max) {
  // Random odd in [1, max-2] (max is odd). max>=5 guaranteed by caller.
  const half = Math.floor(max / 2);
  return Math.floor(rng() * half) * 2 + 1;
}

function carveDFS(grid, rows, cols, rng, startR, startC) {
  function carve(r, c) {
    grid[r][c] = 0;
    const dirs = shuffleFisherYates([[-2, 0], [2, 0], [0, -2], [0, 2]], rng);
    for (const [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc;
      if (nr > 0 && nr < rows - 1 && nc > 0 && nc < cols - 1 && grid[nr][nc] === 1) {
        grid[r + dr / 2][c + dc / 2] = 0; // remove wall between
        carve(nr, nc);
      }
    }
  }
  carve(startR, startC);
}

// Randomized Prim's: grows from one cell, always expanding a random frontier
// wall. Produces mazes with many short dead-ends (vs DFS long corridors).
function carvePrim(grid, rows, cols, rng, startR, startC) {
  const inBoundsOdd = (r, c) => r > 0 && r < rows - 1 && c > 0 && c < cols - 1;
  const frontier = [];
  const inFrontier = new Set();
  const addFrontier = (r, c) => {
    const k = `${r},${c}`;
    if (!inFrontier.has(k)) {
      inFrontier.add(k);
      frontier.push([r, c]);
    }
  };
  grid[startR][startC] = 0;
  for (const [dr, dc] of [[-2, 0], [2, 0], [0, -2], [0, 2]]) {
    const nr = startR + dr, nc = startC + dc;
    if (inBoundsOdd(nr, nc) && grid[nr][nc] === 1) addFrontier(nr, nc);
  }
  while (frontier.length > 0) {
    const idx = Math.floor(rng() * frontier.length);
    const [fr, fc] = frontier.splice(idx, 1)[0];
    inFrontier.delete(`${fr},${fc}`);
    if (grid[fr][fc] === 0) continue;
    // Visited (carved) neighbors two steps away
    const carved = [];
    for (const [dr, dc] of [[-2, 0], [2, 0], [0, -2], [0, 2]]) {
      const nr = fr + dr, nc = fc + dc;
      if (inBoundsOdd(nr, nc) && grid[nr][nc] === 0) carved.push([nr, nc]);
    }
    if (carved.length === 0) continue;
    const [pr, pc] = carved[Math.floor(rng() * carved.length)];
    grid[(fr + pr) / 2][(fc + pc) / 2] = 0;
    grid[fr][fc] = 0;
    for (const [dr, dc] of [[-2, 0], [2, 0], [0, -2], [0, 2]]) {
      const nr = fr + dr, nc = fc + dc;
      if (inBoundsOdd(nr, nc) && grid[nr][nc] === 1) addFrontier(nr, nc);
    }
  }
}

function braidLoops(grid, rows, cols, rng, loopRatio) {
  const candidates = [];
  for (let r = 1; r < rows - 1; r++) {
    for (let c = 1; c < cols - 1; c++) {
      if (grid[r][c] !== 1) continue;
      const ns = grid[r - 1][c] === 0 && grid[r + 1][c] === 0;
      const ew = grid[r][c - 1] === 0 && grid[r][c + 1] === 0;
      // Exactly one open opposite pair: clean single loop, no big clearings
      if ((ns ? 1 : 0) + (ew ? 1 : 0) === 1) candidates.push([r, c]);
    }
  }
  shuffleFisherYates(candidates, rng);
  const removeCount = Math.floor(candidates.length * Math.min(1, Math.max(0, loopRatio)));
  for (let i = 0; i < removeCount; i++) {
    grid[candidates[i][0]][candidates[i][1]] = 0;
  }
}

export function generateRandomMaze(rows, cols, loopRatio = 0, seed = randomSeed(), generator = "dfs") {
  // Ensure rows and cols are odd numbers for proper maze generation
  if (rows % 2 === 0) rows++;
  if (cols % 2 === 0) cols++;

  const rng = makeRng(seed);
  const grid = Array.from({ length: rows }, () => Array(cols).fill(1));

  // Start carving from a seeded random odd cell
  const startRow = randomOdd(rng, rows);
  const startCol = randomOdd(rng, cols);
  if (generator === "prim") carvePrim(grid, rows, cols, rng, startRow, startCol);
  else carveDFS(grid, rows, cols, rng, startRow, startCol);

  // Set start and goal explicitly if needed
  grid[1][1] = 0;
  grid[rows - 2][cols - 2] = 0;

  // Braid pass: knock down some dead-end walls to create loops.
  // Only removes walls, so the maze stays solvable and start/goal stay open.
  if (loopRatio > 0) braidLoops(grid, rows, cols, rng, loopRatio);
  return grid;
}
