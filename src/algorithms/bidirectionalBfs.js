import { getNeighbors, key, validateMaze } from "./common.js";

// Bidirectional BFS — searches from start AND goal simultaneously,
// meeting in the middle. Optimal on unweighted mazes, usually explores
// far fewer tiles than plain BFS.
export function solveMazeBidirectionalBFS(maze, start, goal) {
  validateMaze(maze, start, goal);
  if (start[0] === goal[0] && start[1] === goal[1]) {
    return { explored: [start], solutionPath: [start] };
  }

  let frontierStart = [start];
  let frontierGoal = [goal];
  const visitedStart = new Map([[key(start), null]]);
  const visitedGoal = new Map([[key(goal), null]]);
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
        const k = key(neighbor);
        if (activeVisited.has(k)) continue;
        activeVisited.set(k, current);
        if (otherVisited.has(k)) {
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
    current = visitedStart.get(key(current));
  }
  fromStart.reverse();

  // Path from meeting -> goal (skip meeting itself, already included)
  current = visitedGoal.get(key(meeting));
  const toGoal = [];
  while (current !== null && current !== undefined) {
    toGoal.push(current);
    current = visitedGoal.get(key(current));
  }

  return [...fromStart, ...toGoal];
}
