// Bidirectional BFS — searches from start AND goal simultaneously,
// meeting in the middle. Optimal on unweighted mazes, usually explores
// far fewer tiles than plain BFS.
export function solveMazeBidirectionalBFS(maze, start, goal) {
  if (start[0] === goal[0] && start[1] === goal[1]) {
    return { explored: [start], solutionPath: [start] };
  }

  let frontierStart = [start];
  let frontierGoal = [goal];
  const visitedStart = new Map([[start.toString(), null]]);
  const visitedGoal = new Map([[goal.toString(), null]]);
  const explored = [];
  let meeting = null;

  while (frontierStart.length > 0 && frontierGoal.length > 0) {
    // Expand the smaller frontier first to keep explored count low
    const expandFromStart = frontierStart.length <= frontierGoal.length;

    const nextFrontier = [];
    const activeFrontier = expandFromStart ? frontierStart : frontierGoal;
    const activeVisited = expandFromStart ? visitedStart : visitedGoal;
    const otherVisited = expandFromStart ? visitedGoal : visitedStart;

    for (const current of activeFrontier) {
      explored.push(current);
      for (const neighbor of getNeighbors(current, maze)) {
        const key = neighbor.toString();
        if (activeVisited.has(key)) continue;
        activeVisited.set(key, current);
        if (otherVisited.has(key)) {
          meeting = neighbor;
          break;
        }
        nextFrontier.push(neighbor);
      }
      if (meeting) break;
    }
    if (meeting) break;

    if (expandFromStart) frontierStart = nextFrontier;
    else frontierGoal = nextFrontier;
  }

  if (!meeting) {
    return { explored, solutionPath: null };
  }

  return { explored, solutionPath: buildPath(visitedStart, visitedGoal, meeting) };
}

function buildPath(visitedStart, visitedGoal, meeting) {
  // Path from start -> meeting
  const fromStart = [];
  let current = meeting;
  while (current !== null) {
    fromStart.push(current);
    current = visitedStart.get(current.toString());
  }
  fromStart.reverse();

  // Path from meeting -> goal (skip meeting itself, already included)
  current = visitedGoal.get(meeting.toString());
  const toGoal = [];
  while (current !== null && current !== undefined) {
    toGoal.push(current);
    current = visitedGoal.get(current.toString());
  }

  return [...fromStart, ...toGoal];
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
