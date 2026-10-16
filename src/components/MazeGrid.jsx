import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { solveMazeBFS } from "../algorithms/bfs";
import { solveMazeDFS } from "../algorithms/dfs";
import { solveMazeAStar } from "../algorithms/aStar";
import { solveMazeDijkstra } from "../algorithms/dijkstra";
import { solveMazeGreedy } from "../algorithms/greedy";
import { solveMazeBidirectionalBFS } from "../algorithms/bidirectionalBfs";
import { getDefaultMaze, getDefaultStart, getDefaultGoal, generateRandomMaze, randomSeed } from "../utils/maze";
import { pathCost } from "../algorithms/common";

const GENERATOR_OPTIONS = [
  { value: "dfs", label: "DFS carve" },
  { value: "prim", label: "Prim's" },
];

const SPEED_OPTIONS = [
  { label: "Chill 0.5x", value: 0.5 },
  { label: "Normal 1x", value: 1 },
  { label: "Zippy 2x", value: 2 },
  { label: "Zoom 4x", value: 4 },
];

const MAZE_SIZES = [11, 15, 21, 25, 31];

const LOOP_OPTIONS = [
  { label: "Classic", value: 0 },
  { label: "Loopy", value: 0.12 },
  { label: "Wild", value: 0.3 },
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Chunky arcade cells. Start/goal show a letter.
// Pointer handlers are stable refs from the parent (row/col passed as props)
// so React.memo still skips unchanged cells during animation.
const MazeCell = React.memo(({ row, col, isWall, isMud, isWater, isStart, isGoal, isExplored, isPath, disabled, onCellDown, onCellEnter }) => {
  let cls = "bg-white border-slate-300";
  let label = null;
  if (isWall) cls = "bg-slate-900 border-slate-900";
  else if (isStart) { cls = "bg-sky-500 border-slate-900"; label = "S"; }
  else if (isGoal) { cls = "bg-rose-500 border-slate-900"; label = "G"; }
  else if (isPath) cls = "bg-emerald-400 border-slate-900";
  else if (isMud) cls = "bg-amber-700 border-slate-900";
  else if (isWater) cls = "bg-cyan-500 border-slate-900";
  else if (isExplored) cls = "bg-amber-200 border-amber-300";
  return (
    <div
      role={disabled ? undefined : "button"}
      aria-label={isStart ? "Start" : isGoal ? "Goal" : isWall ? `Wall at ${row},${col}` : `Open at ${row},${col}`}
      aria-disabled={disabled}
      onPointerDown={(e) => { if (e.button === 0 || e.button === 2) { e.preventDefault(); onCellDown(row, col); } }}
      onPointerEnter={(e) => { if (e.buttons !== 0) onCellEnter(row, col); }}
      onContextMenu={(e) => e.preventDefault()}
      className={`flex aspect-square w-full items-center justify-center rounded-md border-2 text-[10px] font-black text-white transition-colors duration-150 ${cls} ${disabled ? "" : "cursor-crosshair"}`}
    >
      {label && <span className="text-slate-900">{label}</span>}
    </div>
  );
});

const MazeGrid = ({ algorithm, explored, path, running, setExplored, setPath, setRunning }) => {
  const [currentMaze, setCurrentMaze] = useState(() => getDefaultMaze());
  const [currentStart, setCurrentStart] = useState(() => getDefaultStart());
  const [currentGoal, setCurrentGoal] = useState(() => getDefaultGoal());
  const [speed, setSpeed] = useState(1);
  const [mazeSize, setMazeSize] = useState(15);
  const [loops, setLoops] = useState(0);
  const [status, setStatus] = useState("idle"); // idle | running | done | no-path | error | cancelled
  const [solveMs, setSolveMs] = useState(null);
  const [tool, setTool] = useState("wall"); // wall | erase | mud | water | start | goal
  const [compare, setCompare] = useState(null); // { rows: [{algo, steps, cost, explored, ms, ok}], bestCost, bestSteps } | null
  const [paused, setPaused] = useState(false);
  const [seed, setSeed] = useState("");
  const [generator, setGenerator] = useState("dfs");
  const [shareNote, setShareNote] = useState("");
  const runIdRef = useRef(0);
  const pausedRef = useRef(false);
  const stepOnceRef = useRef(false);
  const speedRef = useRef(speed);
  useEffect(() => { speedRef.current = speed; }, [speed]);
  // Drag state: { kind: 'paint', value: 0|1 } | { kind: 'move-start' } | { kind: 'move-goal' } | null
  const dragRef = useRef(null);

  // End any paint/move drag on global pointer-up (covers release outside grid).
  useEffect(() => {
    const up = () => { dragRef.current = null; };
    window.addEventListener("pointerup", up);
    return () => window.removeEventListener("pointerup", up);
  }, []);

  // Shareable mazes: ?seed=..&size=..&loops=..&gen=.. — same link, same maze.
  const writeUrl = useCallback((s, size, lp, gen) => {
    try {
      const url = new URL(window.location.href);
      if (s === "" || s === null || s === undefined) url.searchParams.delete("seed");
      else url.searchParams.set("seed", String(s));
      url.searchParams.set("size", String(size));
      url.searchParams.set("loops", String(lp));
      url.searchParams.set("gen", gen);
      window.history.replaceState(null, "", url);
    } catch { /* non-browser / file URLs: ignore */ }
  }, []);

  // On first mount, reproduce a shared maze link if present.
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (!params.has("seed") && !params.has("gen") && !params.has("size")) return;
      const urlSeed = params.get("seed") ?? "";
      const urlGen = params.get("gen") === "prim" ? "prim" : "dfs";
      let urlSize = Math.round(Number(params.get("size")) || 15);
      if (urlSize % 2 === 0) urlSize += 1;
      urlSize = Math.min(31, Math.max(5, urlSize));
      const rawLoops = Number(params.get("loops"));
      const urlLoops = Number.isFinite(rawLoops) ? Math.min(1, Math.max(0, rawLoops)) : 0;
      if (urlSeed === "" && params.get("seed") !== "") return;
      const grid = generateRandomMaze(urlSize, urlSize, urlLoops, urlSeed === "" ? randomSeed() : urlSeed, urlGen);
      setCurrentMaze(grid);
      setCurrentStart([1, 1]);
      setCurrentGoal([urlSize - 2, urlSize - 2]);
      setMazeSize(MAZE_SIZES.includes(urlSize) ? urlSize : 15);
      setLoops(urlLoops);
      setGenerator(urlGen);
      setSeed(urlSeed);
      setStatus("idle");
    } catch { /* ignore malformed URLs */ }
  }, []);

  const clearTrail = useCallback(() => {
    // Skip redundant resets during long paint drags (new [] would re-render).
    if (explored.length === 0 && path.length === 0 && status === "idle" && solveMs === null && compare === null && !paused) return;
    ++runIdRef.current;
    pausedRef.current = false;
    stepOnceRef.current = false;
    setPaused(false);
    setExplored([]);
    setPath([]);
    setStatus("idle");
    setSolveMs(null);
    setCompare(null);
  }, [explored.length, path.length, status, solveMs, compare, paused, setExplored, setPath]);

  const paintCell = useCallback((r, c, value) => {
    setCurrentMaze((prev) => {
      if (prev[r][c] === value) return prev;
      const next = prev.map((row) => [...row]);
      next[r][c] = value;
      return next;
    });
  }, []);

  const movePoint = useCallback((r, c, which) => {
    // Landing on a wall clears it to open; landing on mud/water keeps the
    // terrain (S/G can sit on weighted tiles, entry cost still counts).
    setCurrentMaze((prev) => {
      if (prev[r][c] !== 1) return prev;
      const next = prev.map((row) => [...row]);
      next[r][c] = 0;
      return next;
    });
    if (which === "start") setCurrentStart([r, c]);
    else setCurrentGoal([r, c]);
  }, []);

  const applyToolToCell = useCallback((r, c) => {
    const isStartCell = r === currentStart[0] && c === currentStart[1];
    const isGoalCell = r === currentGoal[0] && c === currentGoal[1];
    if (tool === "start") {
      if (!isStartCell) { movePoint(r, c, "start"); clearTrail(); }
      return { kind: "move-start" };
    }
    if (tool === "goal") {
      if (!isGoalCell) { movePoint(r, c, "goal"); clearTrail(); }
      return { kind: "move-goal" };
    }
    // Wall / erase / terrain painting never covers start/goal.
    if (isStartCell || isGoalCell) return null;
    const value = tool === "erase" ? 0 : tool === "mud" ? 2 : tool === "water" ? 3 : 1;
    paintCell(r, c, value);
    clearTrail();
    return { kind: "paint", value };
  }, [tool, currentStart, currentGoal, movePoint, paintCell, clearTrail]);

  const handleCellDown = useCallback((r, c) => {
    if (running) return;
    const isStartCell = r === currentStart[0] && c === currentStart[1];
    const isGoalCell = r === currentGoal[0] && c === currentGoal[1];
    // Dragging the S/G markers directly always moves them, whatever the tool.
    if (isStartCell) { dragRef.current = { kind: "move-start" }; return; }
    if (isGoalCell) { dragRef.current = { kind: "move-goal" }; return; }
    dragRef.current = applyToolToCell(r, c);
  }, [running, currentStart, currentGoal, applyToolToCell]);

  const handleCellEnter = useCallback((r, c) => {
    if (running || !dragRef.current) return;
    const drag = dragRef.current;
    if (drag.kind === "move-start") {
      if (r !== currentStart[0] || c !== currentStart[1]) { movePoint(r, c, "start"); clearTrail(); }
    } else if (drag.kind === "move-goal") {
      if (r !== currentGoal[0] || c !== currentGoal[1]) { movePoint(r, c, "goal"); clearTrail(); }
    } else if (drag.kind === "paint") {
      if ((r === currentStart[0] && c === currentStart[1]) || (r === currentGoal[0] && c === currentGoal[1])) return;
      paintCell(r, c, drag.value);
      clearTrail();
    }
  }, [running, currentStart, currentGoal, movePoint, paintCell, clearTrail]);

  // O(1) lookups for cell rendering
  const exploredSet = useMemo(() => new Set(explored.map(([r, c]) => `${r},${c}`)), [explored]);
  const pathSet = useMemo(() => new Set(path.map(([r, c]) => `${r},${c}`)), [path]);
  const cols = currentMaze[0].length;

  // Batched animation: one setState per chunk. runId cancels stale runs.
  // Frame-budgeted: caps re-renders to ~80 for explored / ~40 for path so a
  // 31x31 maze doesn't do 900 setStates + 900 full-grid renders.
  // Pause-aware: waits while pausedRef is set (Step advances one chunk via
  // stepOnceRef). Delay + chunk read speedRef live, so Pace applies mid-race.
  const animateArray = async (arr, setter, runId, maxFrames = 80, baseDelay = 40) => {
    if (arr.length === 0) {
      setter([]);
      return true;
    }
    const minChunk = Math.ceil(arr.length / maxFrames);
    setter([]);
    let i = 0;
    while (i < arr.length) {
      if (runIdRef.current !== runId) return false;
      // Pause gate (checked before every chunk, including the first).
      while (pausedRef.current && !stepOnceRef.current) {
        if (runIdRef.current !== runId) return false;
        await sleep(50);
      }
      stepOnceRef.current = false;
      if (runIdRef.current !== runId) return false;
      const spd = speedRef.current || 1;
      const baseChunk = spd >= 2 ? Math.ceil(spd * 2) : 1;
      const effectiveChunk = Math.max(1, baseChunk, minChunk);
      i = Math.min(arr.length, (i === 0 ? effectiveChunk : i + effectiveChunk));
      // Avoid an extra render when the final chunk lands exactly on length:
      // transfer ownership of the solver array instead of copying.
      setter(i === arr.length && (arr.length % effectiveChunk !== 0 || i !== effectiveChunk) ? arr : arr.slice(0, i));
      if (i >= arr.length) break;
      await sleep(Math.max(4, Math.round(baseDelay / spd)));
    }
    if (runIdRef.current !== runId) return false;
    return true;
  };

  const handlePauseToggle = () => {
    if (!running) return;
    const next = !pausedRef.current;
    pausedRef.current = next;
    stepOnceRef.current = false;
    setPaused(next);
  };

  const handleStep = () => {
    if (!running || !pausedRef.current) return;
    stepOnceRef.current = true;
  };

  const runAlgorithm = async () => {
    if (running) return;
    const runId = ++runIdRef.current;
    pausedRef.current = false;
    stepOnceRef.current = false;
    setPaused(false);
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
        case "Dijkstra":
          result = solveMazeDijkstra(currentMaze, currentStart, currentGoal);
          break;
        case "Greedy":
          result = solveMazeGreedy(currentMaze, currentStart, currentGoal);
          break;
        case "Bi-BFS":
          result = solveMazeBidirectionalBFS(currentMaze, currentStart, currentGoal);
          break;
        default:
          throw new Error("Invalid algorithm");
      }
      setSolveMs(Math.round(performance.now() - t0));
      const finished = await animateArray(result.explored, setExplored, runId, 80, 40);
      if (!finished) {
        setStatus("cancelled");
        return;
      }
      if (result.solutionPath) {
        const pathFinished = await animateArray(result.solutionPath, setPath, runId, 40, 60);
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
      if (runIdRef.current === runId) {
        pausedRef.current = false;
        stepOnceRef.current = false;
        setPaused(false);
        setRunning(false);
      }
    }
  };

  const handleReset = () => {
    ++runIdRef.current;
    pausedRef.current = false;
    stepOnceRef.current = false;
    setPaused(false);
    setExplored([]);
    setPath([]);
    setStatus("idle");
    setSolveMs(null);
    setCompare(null);
    setRunning(false);
  };

  const handleCompareAll = () => {
    if (running) return;
    const racers = [
      ["BFS", solveMazeBFS],
      ["DFS", solveMazeDFS],
      ["A*", solveMazeAStar],
      ["Dijkstra", solveMazeDijkstra],
      ["Greedy", solveMazeGreedy],
      ["Bi-BFS", solveMazeBidirectionalBFS],
    ];
    const rows = racers.map(([algo, fn]) => {
      try {
        const t0 = performance.now();
        const result = fn(currentMaze, currentStart, currentGoal);
        const ms = Math.max(0, Math.round((performance.now() - t0) * 10) / 10);
        if (!result.solutionPath) {
          return { algo, steps: null, cost: null, explored: result.explored.length, ms, ok: false };
        }
        return {
          algo,
          steps: result.solutionPath.length,
          cost: result.cost ?? pathCost(currentMaze, result.solutionPath),
          explored: result.explored.length,
          ms,
          ok: true,
        };
      } catch {
        return { algo, steps: null, cost: null, explored: 0, ms: 0, ok: false };
      }
    });
    const okRows = rows.filter((r) => r.ok);
    const bestCost = okRows.length ? Math.min(...okRows.map((r) => r.cost)) : null;
    const bestSteps = okRows.length ? Math.min(...okRows.map((r) => r.steps)) : null;
    setCompare({ rows, bestCost, bestSteps });
  };

  const handleGenerateRandomMaze = (nextSeed) => {
    if (running) return;
    ++runIdRef.current;
    pausedRef.current = false;
    stepOnceRef.current = false;
    setPaused(false);
    // Clamp to 5..31 and force odd so the carver always gets valid dims
    let size = Math.round(Number(mazeSize) || 21);
    if (size % 2 === 0) size += 1;
    size = Math.min(31, Math.max(5, size));
    const useSeed = nextSeed !== undefined ? nextSeed : (seed === "" ? randomSeed() : seed);
    const newMaze = generateRandomMaze(size, size, loops, useSeed, generator);
    setCurrentMaze(newMaze);
    setExplored([]);
    setPath([]);
    setCurrentStart([1, 1]);
    setCurrentGoal([size - 2, size - 2]);
    setStatus("idle");
    setSolveMs(null);
    setCompare(null);
    setSeed(String(useSeed));
    writeUrl(String(useSeed), size, loops, generator);
  };

  const handleShare = async () => {
    try {
      const s = seed === "" ? randomSeed() : seed;
      if (seed === "") {
        setSeed(String(s));
        writeUrl(String(s), mazeSize, loops, generator);
      }
      const url = new URL(window.location.href);
      url.searchParams.set("seed", String(s));
      url.searchParams.set("size", String(mazeSize));
      url.searchParams.set("loops", String(loops));
      url.searchParams.set("gen", generator);
      await navigator.clipboard.writeText(url.toString());
      setShareNote("Link copied!");
    } catch {
      setShareNote("Copy failed");
    }
    setTimeout(() => setShareNote(""), 2000);
  };

  return (
    <div className="animate-pop-in rounded-3xl border-2 border-slate-900 bg-white shadow-[4px_4px_0_0_#0f172a]">
      {/* Status sticker */}
      <div className="border-b-2 border-slate-900 bg-amber-100 px-5 py-3 text-sm font-bold" aria-live="polite">
        {status === "running" && (
          <p>
            {algorithm} is racing!
            <span className="text-slate-600"> — {explored.length} tiles sniffed…</span>
            {paused && <span className="ml-2 rounded-full border border-slate-900 bg-white px-2 py-0.5 text-xs font-black">PAUSED — Resume or Step ↓</span>}
          </p>
        )}
        {status === "done" && (
          <p>
            <span className="rounded-full border border-slate-900 bg-emerald-300 px-2 py-0.5 text-xs font-black">ESCAPED!</span>{" "}
            {path.length} steps · cost {pathCost(currentMaze, path)} · {explored.length} explored
            {solveMs !== null ? ` · ${solveMs} ms` : ""}
          </p>
        )}
        {status === "no-path" && (
          <p className="text-rose-700" role="alert">Oh no — this maze has no way out. Roll a new one!</p>
        )}
        {status === "error" && (
          <p className="text-rose-700" role="alert">Yikes, the racer tripped. Try again!</p>
        )}
        {(status === "idle" || status === "cancelled") && (
          <p className="text-slate-600">
            {currentMaze.length}×{cols} playground — paint walls or drag S/G, then press GO to let {algorithm} loose!
          </p>
        )}
      </div>

      {/* Grid */}
      <div className="overflow-x-auto px-5 py-5">
        {/* Edit tools */}
        <div className="mx-auto mb-3 flex max-w-[620px] flex-wrap items-center gap-2" role="toolbar" aria-label="Maze editing tools">
          {[
            { value: "wall", label: "🧱 Wall" },
            { value: "erase", label: "🧽 Erase" },
            { value: "mud", label: "🟤 Mud ×5" },
            { value: "water", label: "🌊 Water ×10" },
            { value: "start", label: "S Start" },
            { value: "goal", label: "G Goal" },
          ].map((t) => (
            <button
              key={t.value}
              onClick={() => setTool(t.value)}
              disabled={running}
              aria-pressed={tool === t.value}
              className={`rounded-full border-2 border-slate-900 px-3 py-1 text-xs font-black shadow-[2px_2px_0_0_#0f172a] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 ${tool === t.value ? "bg-slate-900 text-white" : "bg-white text-slate-700"}`}
            >
              {t.label}
            </button>
          ))}
          <span className="ml-auto text-[11px] font-bold text-slate-500">Tip: drag to paint · drag S/G to move</span>
        </div>
        <div
          className="playful-dots grid w-full touch-none gap-1 rounded-2xl border-2 border-slate-900 bg-violet-100 p-2.5 select-none"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            maxWidth: cols > 15 ? "620px" : "400px",
            margin: "0 auto",
          }}
        >
          {currentMaze.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const isStart = rowIndex === currentStart[0] && colIndex === currentStart[1];
              const isGoal = rowIndex === currentGoal[0] && colIndex === currentGoal[1];
              const key = `${rowIndex},${colIndex}`;
              return (
                <MazeCell
                  key={`${rowIndex}-${colIndex}`}
                  row={rowIndex}
                  col={colIndex}
                  isWall={cell === 1}
                  isMud={cell === 2}
                  isWater={cell === 3}
                  isStart={isStart}
                  isGoal={isGoal}
                  isExplored={exploredSet.has(key)}
                  isPath={pathSet.has(key)}
                  disabled={running}
                  onCellDown={handleCellDown}
                  onCellEnter={handleCellEnter}
                />
              );
            })
          )}
        </div>
        <div className="mx-auto mt-3 flex max-w-[620px] flex-wrap gap-2 text-[11px] font-bold text-slate-600">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-900 bg-white px-2 py-0.5"><span className="inline-block h-2.5 w-2.5 rounded-full bg-slate-900" /> Wall</span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-900 bg-white px-2 py-0.5"><span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-700" /> Mud ×5</span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-900 bg-white px-2 py-0.5"><span className="inline-block h-2.5 w-2.5 rounded-full bg-cyan-500" /> Water ×10</span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-900 bg-white px-2 py-0.5"><span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-200" /> Sniffed</span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-900 bg-white px-2 py-0.5"><span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-400" /> Escape route</span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-900 bg-white px-2 py-0.5"><span className="inline-block h-2.5 w-2.5 rounded-full bg-sky-500" /> Start</span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-900 bg-white px-2 py-0.5"><span className="inline-block h-2.5 w-2.5 rounded-full bg-rose-500" /> Treat (goal)</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2 border-t-2 border-slate-900 bg-orange-50 px-5 py-3 rounded-b-3xl">
        <button
          onClick={runAlgorithm}
          disabled={running}
          className="rounded-full border-2 border-slate-900 bg-emerald-400 px-5 py-2 text-sm font-black text-slate-900 shadow-[2px_2px_0_0_#0f172a] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {running ? "Racing…" : "GO!"}
        </button>
        {running && (
          <>
            <button
              onClick={handlePauseToggle}
              aria-pressed={paused}
              className={`rounded-full border-2 border-slate-900 px-4 py-2 text-sm font-black shadow-[2px_2px_0_0_#0f172a] transition-transform hover:-translate-y-0.5 ${paused ? "bg-emerald-300 text-slate-900" : "bg-amber-300 text-slate-900"}`}
            >
              {paused ? "▶ Resume" : "⏸ Pause"}
            </button>
            <button
              onClick={handleStep}
              disabled={!paused}
              title="Advance one animation chunk while paused"
              className="rounded-full border-2 border-slate-900 bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-[2px_2px_0_0_#0f172a] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              ⏭ Step
            </button>
          </>
        )}
        <button
          onClick={handleCompareAll}
          disabled={running}
          title="Run all 6 algorithms instantly on this exact maze (no animation)"
          className="rounded-full border-2 border-slate-900 bg-violet-500 px-4 py-2 text-sm font-black text-white shadow-[2px_2px_0_0_#0f172a] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          ⚔️ Compare
        </button>
        <button
          onClick={() => handleGenerateRandomMaze()}
          disabled={running}
          title={seed === "" ? "Generate a brand-new random maze" : "Regenerate this exact seed (same maze)"}
          className="rounded-full border-2 border-slate-900 bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-[2px_2px_0_0_#0f172a] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          New {mazeSize}×{mazeSize} maze
        </button>
        <button
          onClick={() => handleGenerateRandomMaze(randomSeed())}
          disabled={running}
          title="Roll a fresh random seed"
          aria-label="Random seed and new maze"
          className="rounded-full border-2 border-slate-900 bg-white px-3 py-2 text-sm font-black text-slate-700 shadow-[2px_2px_0_0_#0f172a] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          🎲
        </button>
        <button
          onClick={handleReset}
          disabled={!running && !paused && explored.length === 0 && path.length === 0}
          title={running ? "Stop the race and clear the trail" : "Clear the trail"}
          className="rounded-full px-3 py-2 text-sm font-black text-slate-500 transition-colors hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {running ? "⏹ Stop" : "Reset"}
        </button>
        <label className="flex items-center gap-2 text-sm font-bold text-slate-600">
          Size
          <select
            value={mazeSize}
            onChange={(e) => setMazeSize(Number(e.target.value))}
            disabled={running}
            className="rounded-full border-2 border-slate-900 bg-white px-2 py-1.5 text-sm font-bold focus:outline-none disabled:opacity-50"
            aria-label="Maze size"
          >
            {MAZE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}×{size}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm font-bold text-slate-600">
          Loops
          <select
            value={loops}
            onChange={(e) => setLoops(Number(e.target.value))}
            disabled={running}
            className="rounded-full border-2 border-slate-900 bg-white px-2 py-1.5 text-sm font-bold focus:outline-none disabled:opacity-50"
            aria-label="Extra loops"
            title="Add loops for alternate routes (applies on New maze)"
          >
            {LOOP_OPTIONS.map((opt) => (
              <option key={opt.label} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm font-bold text-slate-600">
          Carve
          <select
            value={generator}
            onChange={(e) => setGenerator(e.target.value)}
            disabled={running}
            className="rounded-full border-2 border-slate-900 bg-white px-2 py-1.5 text-sm font-bold focus:outline-none disabled:opacity-50"
            aria-label="Maze generator"
            title="DFS = long corridors, Prim's = many short dead-ends (applies on New maze)"
          >
            {GENERATOR_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm font-bold text-slate-600">
          Seed
          <input
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !running) handleGenerateRandomMaze(e.target.value === "" ? randomSeed() : e.target.value); }}
            disabled={running}
            placeholder="random"
            spellCheck={false}
            className="w-24 rounded-full border-2 border-slate-900 bg-white px-2 py-1.5 font-mono text-sm font-bold focus:outline-none disabled:opacity-50"
            aria-label="Maze seed"
            title="Same seed + size + loops + carver = same maze. Enter regenerates."
          />
        </label>
        <button
          onClick={handleShare}
          disabled={running}
          title="Copy a link that reproduces this exact maze"
          className="rounded-full border-2 border-slate-900 bg-white px-3 py-2 text-sm font-black text-slate-700 shadow-[2px_2px_0_0_#0f172a] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          🔗 {shareNote || "Share"}
        </button>
        <label className="ml-auto flex items-center gap-2 text-sm font-bold text-slate-600">
          Pace
          <select
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            title="Applies instantly, even mid-race"
            className="rounded-full border-2 border-slate-900 bg-white px-2 py-1.5 text-sm font-bold focus:outline-none disabled:opacity-50"
          >
            {SPEED_OPTIONS.map((opt) => (
              <option key={opt.label} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Compare-all results (instant, same maze — no animation) */}
      {compare && (
        <div className="border-t-2 border-slate-900 bg-violet-50 px-5 py-3 rounded-b-3xl">
          <div className="mb-2 flex items-center gap-2">
            <p className="text-sm font-black">Same maze, all racers</p>
            <button
              onClick={() => setCompare(null)}
              className="ml-auto rounded-full px-2 py-1 text-xs font-black text-slate-500 hover:text-slate-900"
              aria-label="Clear comparison"
            >
              ✕ Clear
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-300 text-left text-[11px] font-black uppercase tracking-wider text-slate-500">
                  <th className="py-1 pr-2">Racer</th>
                  <th className="py-1 pr-2 text-right">Steps</th>
                  <th className="py-1 pr-2 text-right">Cost</th>
                  <th className="py-1 pr-2 text-right">Sniffed</th>
                  <th className="py-1 text-right">Time</th>
                </tr>
              </thead>
              <tbody>
                {compare.rows.map((r) => {
                  const cheapest = r.ok && r.cost === compare.bestCost;
                  return (
                    <tr key={r.algo} className={`border-b border-slate-200 last:border-0 ${cheapest ? "bg-emerald-100/70 font-black" : ""}`}>
                      <td className="py-1 pr-2 font-mono font-black">
                        {r.algo} {cheapest ? "⭐" : ""} {r.algo === algorithm ? "(you)" : ""}
                      </td>
                      <td className="py-1 pr-2 text-right font-mono">{r.ok ? r.steps : "—"}</td>
                      <td className="py-1 pr-2 text-right font-mono">{r.ok ? r.cost : "—"}</td>
                      <td className="py-1 pr-2 text-right font-mono">{r.explored}</td>
                      <td className="py-1 text-right font-mono">{r.ms} ms</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-1 text-[11px] font-bold text-slate-500">
            ⭐ cheapest cost (Dijkstra/A* guarantee it) · fewest steps {compare.bestSteps ?? "—"} · mud ×5, water ×10
          </p>
        </div>
      )}
    </div>
  );
};

export default MazeGrid;
