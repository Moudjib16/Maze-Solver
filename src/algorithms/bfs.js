import { getNeighbors, reconstructPath, key, validateMaze } from "./common.js";

// Use the maze passed as a parameter
export function solveMazeBFS(maze, start, goal) {
  validateMaze(maze, start, goal);
  const queue = [start];
  let head = 0; // O(1) dequeue via index instead of shift()
  const explored = [];
  const visited = new Set();
  const parents = {};

  visited.add(key(start));
  parents[key(start)] = null;

  while (head < queue.length) {
    const current = queue[head++];
    explored.push(current);

    if (current[0] === goal[0] && current[1] === goal[1]) {
      return { explored, solutionPath: reconstructPath(parents, current) };
    }

    for (let neighbor of getNeighbors(current, maze)) {
      const k = key(neighbor);
      if (!visited.has(k)) {
        visited.add(k);
        parents[k] = current;
        queue.push(neighbor);
      }
    }
  }
  return { explored, solutionPath: null };
}
