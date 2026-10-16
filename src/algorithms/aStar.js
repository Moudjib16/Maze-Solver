import MinHeap from "../utils/MinHeap.js";
import {
  getNeighbors,
  reconstructPath,
  key,
  manhattan,
  getCost,
  pathCost,
  validateMaze,
} from "./common.js";

// A* — optimal on 4-dir grids with Manhattan heuristic (g + h).
// Respects weighted terrain (mud cost 5, water cost 10). Heuristic uses
// minimum step cost 1, so it stays admissible with weights.
export function solveMazeAStar(maze, start, goal) {
  validateMaze(maze, start, goal);
  const explored = [];
  const parents = {};
  const gScores = { [key(start)]: 0 };
  const closed = new Set();
  // Heap of { node, f }; stale entries skipped via closed set + g check.
  const open = new MinHeap((a, b) => a.f - b.f);

  parents[key(start)] = null;
  open.push({ node: start, f: manhattan(start, goal) });

  while (!open.isEmpty()) {
    const { node: current } = open.pop();
    const currentKey = key(current);
    if (closed.has(currentKey)) continue;
    closed.add(currentKey);
    explored.push(current);

    if (current[0] === goal[0] && current[1] === goal[1]) {
      const solutionPath = reconstructPath(parents, current);
      return { explored, solutionPath, cost: pathCost(maze, solutionPath) };
    }

    for (let neighbor of getNeighbors(current, maze)) {
      const k = key(neighbor);
      if (closed.has(k)) continue;
      const tentativeG = gScores[currentKey] + getCost(maze, neighbor[0], neighbor[1]);

      if (!(k in gScores) || tentativeG < gScores[k]) {
        parents[k] = current;
        gScores[k] = tentativeG;
        open.push({ node: neighbor, f: tentativeG + manhattan(neighbor, goal) });
      }
    }
  }
  return { explored, solutionPath: null };
}
