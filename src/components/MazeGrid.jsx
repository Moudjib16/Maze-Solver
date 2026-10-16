import React, { useState, useMemo, useRef } from "react";
import { solveMazeBFS } from "../algorithms/bfs";
import { solveMazeDFS } from "../algorithms/dfs";
import { solveMazeAStar } from "../algorithms/aStar";
import { maze as defaultMaze, start as defaultStart, goal as defaultGoal, generateRandomMaze } from "../utils/maze";

const SPEED_OPTIONS = [
  { label: "0.5x", value: 0.5 },
  { label: "1x", value: 1 },
  { label: "2x", value: 2 },
  { label: "4x", value: 4 },
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Maze cell component — fluid size so large mazes don't overflow on mobile
const MazeCell = React.memo(({ isWall, isStart, isGoal, isExplored, isPath }) => {
  let bgColor = "bg-white";
  if (isWall) bgColor = "bg-gray-800";
  else if (isStart) bgColor = "bg-blue-500";
  else if (isGoal) bgColor = "bg-red-500";
  else if (isPath) bgColor = "bg-green-500";
  else if (isExplored) bgColor = "bg-yellow-300";
  return (
    <div
      className={`aspect-square w-full rounded-[2px] border border-gray-700/40 transition-colors duration-200 ${bgColor}`}
    ></div>
  );
});

const MazeGrid = ({ algorithm, explored, path, running, setExplored, setPath, setRunning }) => {
  // State for current maze and its start/goal points.
  // By default, use the predefined maze and its start/goal.
  const [currentMaze, setCurrentMaze] = useState(defaultMaze);
  const [currentStart, setCurrentStart] = useState(defaultStart);
  const [currentGoal, setCurrentGoal] = useState(defaultGoal);
  const [speed, setSpeed] = useState(1);
  const [status, setStatus] = useState("idle"); // idle | running | done | no-path | error | cancelled
  const [solveMs, setSolveMs] = useState(null);
  const runIdRef = useRef(0);

  // O(1) lookups — old code used explored.some()/path.some() per cell
  const exploredSet = useMemo(() => new Set(explored.map(([r, c]) => `${r},${c}`)), [explored]);
  const pathSet = useMemo(() => new Set(path.map(([r, c]) => `${r},${c}`)), [path]);
  const cols = currentMaze[0].length;

  // Batched animation: one setState per chunk instead of per cell.
  // Checks runId so Reset / re-run cancels an in-flight animation.
  const animateArray = async (arr, setter, delay, chunkSize, runId) => {
    setter([]);
    for (let i = chunkSize; i <= arr.length; i += chunkSize) {
      if (runIdRef.current !== runId) return false;
      setter(arr.slice(0, i));
      await sleep(delay);
    }
    if (runIdRef.current !== runId) return false;
    setter([...arr]);
    return true;
  };

  // Run the selected algorithm on the current maze
  const runAlgorithm = async () => {
    if (running) return;
    const runId = ++runIdRef.current;
    setRunning(true);
    setStatus("running");
    setSolveMs(null);
    setExplored([]);
    setPath([]);
    let result;
    try {
      const t0 = performance.now();
      switch (algorithm) {
        case "BFS":
          result = solveMazeBFS(currentMaze, currentStart, currentGoal);
          break;
        case "DFS":
          result = solveMazeDFS(currentMaze, currentStart, currentGoal);
          break;
        case "A*":
          result = solveMazeAStar(currentMaze, currentStart, currentGoal);
          break;
        default:
          throw new Error("Invalid algorithm");
      }
      setSolveMs(Math.round(performance.now() - t0));
      const exploredDelay = Math.max(4, Math.round(40 / speed));
      const pathDelay = Math.max(4, Math.round(60 / speed));
      const chunkSize = speed >= 2 ? Math.ceil(speed * 2) : 1;
      const finished = await animateArray(result.explored, setExplored, exploredDelay, chunkSize, runId);
      if (!finished) {
        setStatus("cancelled");
        return;
      }
      if (result.solutionPath) {
        const pathChunk = Math.max(1, Math.floor(chunkSize / 2));
        const pathFinished = await animateArray(result.solutionPath, setPath, pathDelay, pathChunk, runId);
        if (!pathFinished) {
          setStatus("cancelled");
          return;
        }
        setStatus("done");
      } else {
        setStatus("no-path");
      }
    } catch (error) {
      console.error("Algorithm error:", error);
      if (runIdRef.current === runId) setStatus("error");
    } finally {
      if (runIdRef.current === runId) setRunning(false);
    }
  };

  const handleReset = () => {
    ++runIdRef.current; // cancel any in-flight animation
    setExplored([]);
    setPath([]);
    setStatus("idle");
    setSolveMs(null);
    setRunning(false);
  };

  // Generate a random maze (e.g., 21x21) ensuring it's solvable,
  // and update the start and goal to fixed positions (e.g., [1,1] and [rows-2, cols-2])
  const handleGenerateRandomMaze = () => {
    if (running) return;
    ++runIdRef.current; // cancel any in-flight animation
    const rows = 21; // New maze rows (should be odd for proper generation)
    const cols = 21; // New maze columns (should be odd for proper generation)
    const newMaze = generateRandomMaze(rows, cols);
    setCurrentMaze(newMaze);
    setExplored([]);
    setPath([]);
    // For random maze, set start and goal to fixed positions
    setCurrentStart([1, 1]);
    setCurrentGoal([rows - 2, cols - 2]);
    setStatus("idle");
    setSolveMs(null);
  };

  const statusBanner = () => {
    if (status === "running") {
      return (
        <div className="mb-4 text-center text-sm font-medium text-blue-300 animate-pulse" role="status">
          Visualizing {algorithm} — {explored.length} nodes explored…
        </div>
      );
    }
    if (status === "done") {
      return (
        <div className="mb-4 text-center text-sm font-medium text-green-300" role="status">
          Path found: {path.length} steps, {explored.length} explored
          {solveMs !== null ? ` in ${solveMs} ms` : ""}
        </div>
      );
    }
    if (status === "no-path") {
      return (
        <div className="mb-4 text-center text-sm font-medium text-red-300" role="alert">
          No path found — the goal is unreachable in this maze.
        </div>
      );
    }
    if (status === "error") {
      return (
        <div className="mb-4 text-center text-sm font-medium text-red-300" role="alert">
          Something went wrong while running the algorithm.
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gray-900 p-4 rounded-xl shadow-lg">
      {statusBanner()}
      {/* Maze Grid Rendering — fluid columns so 21x21 fits on mobile */}
      <div className="overflow-x-auto mb-4">
        <div
          className="grid gap-[2px] mx-auto w-full"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            maxWidth: cols > 15 ? "640px" : "420px",
          }}
        >
          {currentMaze.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const isStart = rowIndex === currentStart[0] && colIndex === currentStart[1];
              const isGoal = rowIndex === currentGoal[0] && colIndex === currentGoal[1];
              const isWall = cell === 1;
              const key = `${rowIndex},${colIndex}`;
              const isExplored = exploredSet.has(key);
              const isPath = pathSet.has(key);
              return (
                <MazeCell
                  key={`${rowIndex}-${colIndex}`}
                  isWall={isWall}
                  isStart={isStart}
                  isGoal={isGoal}
                  isExplored={isExplored}
                  isPath={isPath}
                />
              );
            })
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-2">
        <button
          onClick={runAlgorithm}
          disabled={running}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {running ? "Visualizing..." : "Start Visualization"}
        </button>
        <button
          onClick={handleGenerateRandomMaze}
          disabled={running}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Generate Random Maze
        </button>
        <button
          onClick={handleReset}
          disabled={running && explored.length === 0 && path.length === 0}
          className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-all duration-300 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Reset
        </button>
        <label className="flex items-center gap-2 text-sm text-slate-300">
          Speed:
          <select
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            disabled={running}
            className="px-2 py-1 bg-black rounded-lg border border-slate-700 focus:outline-none text-sm disabled:opacity-50"
          >
            {SPEED_OPTIONS.map((opt) => (
              <option key={opt.label} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
};

export default MazeGrid;
