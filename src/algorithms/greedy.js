import MinHeap from "../utils/MinHeap.js";
import {
  getNeighbors,
  reconstructPath,
  key,
  manhattan,
  validateMaze,
} from "./common.js";

// Greedy Best-First Search — always expands the node closest to the goal
// (Manhattan distance). Fast and bold, but NOT guaranteed to find the
// shortest path. Great contrast to A* which adds cost-so-far (g + h).
export function solveMazeGreedy(maze, start, goal) {
  validateMaze(maze, start, goal);
  const explored = [];
  const visited = new Set([key(start)]);
  const parents = { [key(start)]: null };
  const open = new MinHeap((a, b) => a.h - b.h);
  open.push({ node: start, h: manhattan(start, goal) });

  while (!open.isEmpty()) {
    const { node: current } = open.pop();
    explored.push(current);

    if (current[0] === goal[0] && current[1] === goal[1]) {
      return { explored, solutionPath: reconstructPath(parents, current) };
    }

    for (const neighbor of getNeighbors(current, maze)) {
      const k = key(neighbor);
      if (!visited.has(k)) {
        visited.add(k);
        parents[k] = current;
        open.push({ node: neighbor, h: manhattan(neighbor, goal) });
      }
    }
  }
  return { explored, solutionPath: null };
}
