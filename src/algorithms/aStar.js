// Manhattan distance — admissible for 4-directional grid movement
function heuristic(coord, goal) {
  return Math.abs(coord[0] - goal[0]) + Math.abs(coord[1] - goal[1]);
}

export function solveMazeAStar(maze, start, goal) {
  const openList = [start];
  const explored = [];
  const parents = {};
  const gScores = { [start.toString()]: 0 };
  const fScores = { [start.toString()]: heuristic(start, goal) };
  
  parents[start.toString()] = null;
  
  while (openList.length > 0) {
    // Sort openList by fScores (lowest first)
    openList.sort((a, b) => fScores[a.toString()] - fScores[b.toString()]);
    const current = openList.shift();
    explored.push(current);
    
    if (current[0] === goal[0] && current[1] === goal[1]) {
      return { explored, solutionPath: reconstructPath(parents, current) };
    }
    
    for (let neighbor of getNeighbors(current, maze)) {
      const tentativeGScore = gScores[current.toString()] + 1;
      const key = neighbor.toString();
      
      if (!(key in gScores) || tentativeGScore < gScores[key]) {
        parents[key] = current;
        gScores[key] = tentativeGScore;
        fScores[key] = tentativeGScore + heuristic(neighbor, goal);
        if (!openList.some(cell => cell.toString() === key)) {
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
  for (let [dr, dc] of directions) {
    const r = row + dr, c = col + dc;
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
