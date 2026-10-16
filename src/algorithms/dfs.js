import { getNeighbors, reconstructPath, key, validateMaze } from "./common.js";

export function solveMazeDFS(maze, start, goal) {
  validateMaze(maze, start, goal);
  const stack = [start];
  const explored = [];
  const visited = new Set();
  const parents = {};

  visited.add(key(start));
  parents[key(start)] = null;

  while (stack.length > 0) {
    const current = stack.pop();
    explored.push(current);

    if (current[0] === goal[0] && current[1] === goal[1]) {
      return { explored, solutionPath: reconstructPath(parents, current) };
    }

    for (let neighbor of getNeighbors(current, maze)) {
      const k = key(neighbor);
      if (!visited.has(k)) {
        visited.add(k);
        parents[k] = current;
        stack.push(neighbor);
      }
    }
  }
  return { explored, solutionPath: null };
}
