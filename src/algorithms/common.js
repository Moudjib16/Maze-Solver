// Shared helpers for all maze solvers.
// Maze contract: maze[r][c] === 0 is walkable, 1 is wall.
// Coordinates are [row, col] tuples.

export function key([r, c]) {
  return `${r},${c}`;
}

export function isWalkable(maze, r, c) {
  return (
    r >= 0 &&
    r < maze.length &&
    c >= 0 &&
    c < maze[0].length &&
    maze[r][c] === 0
  );
}

export function getNeighbors([row, col], maze) {
  const neighbors = [];
  // Order: up, down, left, right (kept stable for deterministic animation)
  if (isWalkable(maze, row - 1, col)) neighbors.push([row - 1, col]);
  if (isWalkable(maze, row + 1, col)) neighbors.push([row + 1, col]);
  if (isWalkable(maze, row, col - 1)) neighbors.push([row, col - 1]);
  if (isWalkable(maze, row, col + 1)) neighbors.push([row, col + 1]);
  return neighbors;
}

export function reconstructPath(parents, end) {
  const path = [];
  let current = end;
  while (current !== null && current !== undefined) {
    path.push(current);
    current = parents[key(current)];
  }
  return path.reverse();
}

export function manhattan(a, b) {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

export function validateMaze(maze, start, goal) {
  if (!Array.isArray(maze) || maze.length === 0 || !Array.isArray(maze[0])) {
    throw new Error("Invalid maze: expected non-empty 2D array");
  }
  const cols = maze[0].length;
  for (const row of maze) {
    if (!Array.isArray(row) || row.length !== cols) {
      throw new Error("Invalid maze: jagged rows");
    }
  }
  for (const [label, pt] of [
    ["start", start],
    ["goal", goal],
  ]) {
    if (!Array.isArray(pt) || pt.length !== 2) {
      throw new Error(`Invalid ${label}: expected [row, col]`);
    }
    const [r, c] = pt;
    if (r < 0 || r >= maze.length || c < 0 || c >= cols) {
      throw new Error(`Invalid ${label}: out of bounds`);
    }
    if (maze[r][c] !== 0) {
      throw new Error(`Invalid ${label}: is a wall`);
    }
  }
}
