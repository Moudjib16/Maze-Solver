import MinHeap from "../utils/MinHeap.js";
import { getNeighbors, reconstructPath, key, getCost, pathCost, validateMaze } from "./common.js";

// Dijkstra's algorithm — optimal with weighted terrain (mud cost 5,
// water cost 10). Reduces to BFS-like behavior on uniform open mazes.
export function solveMazeDijkstra(maze, start, goal) {
  validateMaze(maze, start, goal);
  const explored = [];
  const dist = { [key(start)]: 0 };
  const parents = { [key(start)]: null };
  const visited = new Set();
  const open = new MinHeap((a, b) => a.d - b.d);
  open.push({ node: start, d: 0 });

  while (!open.isEmpty()) {
    const { node: current } = open.pop();
    const currentKey = key(current);
    if (visited.has(currentKey)) continue;
    visited.add(currentKey);
    explored.push(current);

    if (current[0] === goal[0] && current[1] === goal[1]) {
      const solutionPath = reconstructPath(parents, current);
      return { explored, solutionPath, cost: pathCost(maze, solutionPath) };
    }

    for (const neighbor of getNeighbors(current, maze)) {
      const k = key(neighbor);
      if (visited.has(k)) continue;
      const tentative = dist[currentKey] + getCost(maze, neighbor[0], neighbor[1]);
      if (!(k in dist) || tentative < dist[k]) {
        dist[k] = tentative;
        parents[k] = current;
        open.push({ node: neighbor, d: tentative });
      }
    }
  }
  return { explored, solutionPath: null };
}
