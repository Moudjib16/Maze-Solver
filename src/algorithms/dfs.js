// Helper function to get neighbors (ignores weights)
function getNeighbors([row, col], maze) {
  const neighbors = [];
  const directions = [
    [-1, 0], // up
    [1, 0],  // down
    [0, -1], // left
    [0, 1]   // right
  ];
  for (let [dr, dc] of directions) {
    const r = row + dr, c = col + dc;
    if (r >= 0 && r < maze.length && c >= 0 && c < maze[0].length && maze[r][c] === 0) {
      neighbors.push([r, c]);
    }
  }
  return neighbors;
}

export function solveMazeDFS(maze, start, goal) {
  const stack = [start];
  const explored = [];
  const visited = new Set();
  const parents = {};
  
  visited.add(start.toString());
  parents[start.toString()] = null;
  
  while (stack.length > 0) {
    const current = stack.pop();
    explored.push(current);
    
    if (current[0] === goal[0] && current[1] === goal[1]) {
      return { explored, solutionPath: reconstructPath(parents, current) };
    }
    
    for (let neighbor of getNeighbors(current, maze)) {
      const key = neighbor.toString();
      if (!visited.has(key)) {
        visited.add(key);
        parents[key] = current;
        stack.push(neighbor);
      }
    }
  }
  return { explored, solutionPath: null };
}

function reconstructPath(parents, end) {
  const path = [];
  let current = end;
  while (current) {
    path.push(current);
    current = parents[current.toString()];
  }
  return path.reverse();
}
