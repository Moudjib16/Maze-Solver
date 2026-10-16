// Greedy Best-First Search — always expands the node closest to the goal
// (Manhattan distance). Fast and bold, but NOT guaranteed to find the
// shortest path. Great contrast to A* which adds cost-so-far (g + h).
function heuristic(coord, goal) {
  return Math.abs(coord[0] - goal[0]) + Math.abs(coord[1] - goal[1]);
}

export function solveMazeGreedy(maze, start, goal) {
  const explored = [];
  const visited = new Set([start.toString()]);
  const parents = { [start.toString()]: null };
  const openList = [start];

  while (openList.length > 0) {
    openList.sort((a, b) => heuristic(a, goal) - heuristic(b, goal));
    const current = openList.shift();
    explored.push(current);

    if (current[0] === goal[0] && current[1] === goal[1]) {
      return { explored, solutionPath: reconstructPath(parents, current) };
    }

    for (const neighbor of getNeighbors(current, maze)) {
      const key = neighbor.toString();
      if (!visited.has(key)) {
        visited.add(key);
        parents[key] = current;
        openList.push(neighbor);
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
