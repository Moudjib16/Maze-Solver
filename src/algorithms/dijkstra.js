// Dijkstra's algorithm — uniform-cost search (cost 1 per step on unweighted mazes).
// Equivalent to BFS here, but written with distance + priority selection so it
// stays optimal once weighted terrain is added later.
export function solveMazeDijkstra(maze, start, goal) {
  const explored = [];
  const dist = { [start.toString()]: 0 };
  const parents = { [start.toString()]: null };
  const visited = new Set();
  // Simple priority queue via sorted array — fine for <= 31x31 mazes.
  const openList = [start];

  while (openList.length > 0) {
    openList.sort((a, b) => dist[a.toString()] - dist[b.toString()]);
    const current = openList.shift();
    const currentKey = current.toString();
    if (visited.has(currentKey)) continue;
    visited.add(currentKey);
    explored.push(current);

    if (current[0] === goal[0] && current[1] === goal[1]) {
      return { explored, solutionPath: reconstructPath(parents, current) };
    }

    for (const neighbor of getNeighbors(current, maze)) {
      const key = neighbor.toString();
      if (visited.has(key)) continue;
      const tentative = dist[currentKey] + 1;
      if (!(key in dist) || tentative < dist[key]) {
        dist[key] = tentative;
        parents[key] = current;
        if (!openList.some((cell) => cell.toString() === key)) {
          openList.push(neighbor);
        }
      }
    }
  }
  return { explored, solutionPath: null };
}

function getNeighbors([row, col], maze) {
  const directions = [
    [-1, 0], [1, 0], [0, -1], [0, 1]
  ];
  const neighbors = [];
  for (const [dr, dc] of directions) {
    const r = row + dr;
    const c = col + dc;
    if (r >= 0 && r < maze.length && c >= 0 && c < maze[0].length && maze[r][c] === 0) {
      neighbors.push([r, c]);
    }
  }
  return neighbors;
}

function reconstructPath(parents, end) {
  const path = [];
  let current = end;
  while (current !== null) {
    path.push(current);
    current = parents[current.toString()];
  }
  return path.reverse();
}
