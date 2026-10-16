import { describe, it, expect } from "vitest";
import { solveMazeBFS } from "./bfs.js";
import { solveMazeDFS } from "./dfs.js";
import { solveMazeAStar } from "./aStar.js";
import { solveMazeDijkstra } from "./dijkstra.js";
import { solveMazeGreedy } from "./greedy.js";
import { solveMazeBidirectionalBFS } from "./bidirectionalBfs.js";
import { pathCost } from "./common.js";
import MinHeap from "../utils/MinHeap.js";
import {
  generateRandomMaze,
  getDefaultMaze,
  maze as singleton,
} from "../utils/maze.js";

const OPEN_5 = Array.from({ length: 5 }, () => Array(5).fill(0));
const MAZE = [
  [0, 0, 0, 0, 1],
  [1, 1, 0, 1, 1],
  [0, 0, 0, 0, 0],
  [0, 1, 1, 1, 0],
  [0, 0, 0, 0, 0],
];
const WATER_MAZE = [
  [0, 3, 0],
  [0, 3, 0],
  [0, 0, 0],
];

function assertValidPath(maze, path, start, goal) {
  expect(path).not.toBeNull();
  expect(path[0]).toEqual(start);
  expect(path[path.length - 1]).toEqual(goal);
  for (let i = 1; i < path.length; i++) {
    const [r1, c1] = path[i - 1];
    const [r2, c2] = path[i];
    expect(Math.abs(r1 - r2) + Math.abs(c1 - c2)).toBe(1);
    expect(maze[r2][c2]).not.toBe(1);
  }
}

describe("optimal solvers agree on unweighted mazes", () => {
  const s = [0, 0];
  const g = [4, 4];
  it("BFS finds the 9-step shortest path on OPEN_5 corner-to-corner", () => {
    const r = solveMazeBFS(OPEN_5, [0, 0], [4, 4]);
    expect(r.solutionPath.length).toBe(9);
  });
  it("A*, Dijkstra and Bi-BFS match BFS length", () => {
    const bfs = solveMazeBFS(MAZE, s, g).solutionPath.length;
    expect(solveMazeAStar(MAZE, s, g).solutionPath.length).toBe(bfs);
    expect(solveMazeDijkstra(MAZE, s, g).solutionPath.length).toBe(bfs);
    expect(solveMazeBidirectionalBFS(MAZE, s, g).solutionPath.length).toBe(bfs);
  });
  it("DFS and Greedy return valid (not necessarily optimal) paths", () => {
    assertValidPath(MAZE, solveMazeDFS(MAZE, s, g).solutionPath, s, g);
    assertValidPath(MAZE, solveMazeGreedy(MAZE, s, g).solutionPath, s, g);
  });
});

describe("weighted terrain", () => {
  it("BFS takes the short expensive route, Dijkstra/A* go around", () => {
    const s = [0, 0];
    const g = [0, 2];
    const b = solveMazeBFS(WATER_MAZE, s, g);
    const d = solveMazeDijkstra(WATER_MAZE, s, g);
    const a = solveMazeAStar(WATER_MAZE, s, g);
    expect(b.solutionPath.length).toBe(3);
    expect(pathCost(WATER_MAZE, b.solutionPath)).toBe(11);
    expect(d.cost).toBe(6);
    expect(a.cost).toBe(6);
    assertValidPath(WATER_MAZE, d.solutionPath, s, g);
  });
});

describe("edge cases + validation", () => {
  it("start == goal returns a single-step path", () => {
    expect(solveMazeBFS([[0]], [0, 0], [0, 0]).solutionPath).toEqual([[0, 0]]);
  });
  it("no-path returns null solutionPath", () => {
    const blocked = [
      [0, 1, 0],
      [1, 1, 1],
      [0, 1, 0],
    ];
    expect(solveMazeBFS(blocked, [0, 0], [0, 2]).solutionPath).toBeNull();
    expect(solveMazeAStar(blocked, [0, 0], [0, 2]).solutionPath).toBeNull();
  });
  it("throws on wall start/goal, OOB, and jagged rows", () => {
    expect(() => solveMazeBFS(MAZE, [0, 4], [4, 4])).toThrow();
    expect(() => solveMazeBFS(MAZE, [0, 0], [0, 4])).toThrow();
    expect(() => solveMazeBFS([[0, 0], [0]] /* jagged */, [0, 0], [0, 1])).toThrow();
    expect(() => solveMazeDFS(MAZE, [9, 9], [4, 4])).toThrow(/out of bounds/);
  });
});

describe("MinHeap", () => {
  it("pops in priority order", () => {
    const h = new MinHeap((a, b) => a.p - b.p);
    h.push({ p: 5 });
    h.push({ p: 1 });
    h.push({ p: 3 });
    expect([h.pop().p, h.pop().p, h.pop().p]).toEqual([1, 3, 5]);
    expect(h.isEmpty()).toBe(true);
  });
});

describe("maze generators", () => {
  it("same seed reproduces the same maze (dfs + prim + string seeds)", () => {
    const a = generateRandomMaze(15, 15, 0, 123, "dfs");
    const b = generateRandomMaze(15, 15, 0, 123, "dfs");
    expect(a).toEqual(b);
    expect(generateRandomMaze(15, 15, 0, 123, "prim")).toEqual(
      generateRandomMaze(15, 15, 0, 123, "prim")
    );
    expect(generateRandomMaze(15, 15, 0, "hello", "dfs")).toEqual(
      generateRandomMaze(15, 15, 0, "hello", "dfs")
    );
  });
  it("dfs and prim carvers differ but both stay solvable", () => {
    const dfs = generateRandomMaze(15, 15, 0, 7, "dfs");
    const prim = generateRandomMaze(15, 15, 0, 7, "prim");
    expect(dfs).not.toEqual(prim);
    for (const grid of [dfs, prim]) {
      const r = solveMazeBFS(grid, [1, 1], [13, 13]);
      expect(r.solutionPath).not.toBeNull();
    }
  });
  it("default-maze copies are isolated from the frozen singleton", () => {
    expect(Object.isFrozen(singleton)).toBe(true);
    const copy = getDefaultMaze();
    copy[1][1] = 99;
    expect(singleton[1][1]).not.toBe(99);
  });
});
