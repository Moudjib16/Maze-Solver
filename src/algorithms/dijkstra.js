import MinHeap from "../utils/MinHeap.js";
import { getNeighbors, reconstructPath, key, validateMaze } from "./common.js";

// Dijkstra's algorithm — uniform-cost search (cost 1 per step on unweighted mazes).
// Equivalent to BFS here, but written with distance + priority queue so it
// stays optimal once weighted terrain is added later.
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
      return { explored, solutionPath: reconstructPath(parents, current) };
    }

    for (const neighbor of getNeighbors(current, maze)) {
      const k = key(neighbor);
      if (visited.has(k)) continue;
      const tentative = dist[currentKey] + 1;
      if (!(k in dist) || tentative < dist[k]) {
        dist[k] = tentative;
        parents[k] = current;
        open.push({ node: neighbor, d: tentative });
      }
    }
  }
  return { explored, solutionPath: null };
}
