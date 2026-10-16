import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { FaGithub, FaPlay, FaBook, FaRoute, FaCompass, FaStopwatch } from "react-icons/fa";
import { generateRandomMaze } from "../utils/maze";
import { solveMazeBFS } from "../algorithms/bfs";

const RACERS = [
  { name: "BFS", color: "bg-sky-400", card: "border-sky-500 bg-sky-50", title: "The Perfectionist", text: "Checks every corridor level by level. Always finds the shortest way out.", stat: "O(V + E) · shortest" },
  { name: "DFS", color: "bg-amber-400", card: "border-amber-500 bg-amber-50", title: "The Daredevil", text: "Sprints down each tunnel as far as it goes before turning back. Fast, wild, not always optimal.", stat: "O(V + E) · any path" },
  { name: "A*", color: "bg-violet-500", card: "border-violet-500 bg-violet-50", title: "The Navigator", text: "Uses a Manhattan compass to sniff out the goal. Shortest path with fewer steps explored.", stat: "O(E) · shortest, guided" },
  { name: "Dijkstra", color: "bg-teal-400", card: "border-teal-500 bg-teal-50", title: "The Accountant", text: "Counts every step, always expands the cheapest tile. Optimal now, and ready for weighted terrain.", stat: "O(V²) · shortest" },
  { name: "Greedy", color: "bg-rose-400", card: "border-rose-500 bg-rose-50", title: "The Sprinter", text: "Chases the goal with pure instinct. Explores almost nothing, but the route can wander.", stat: "O(E) · fast, not optimal" },
  { name: "Bi-BFS", color: "bg-lime-400", card: "border-lime-500 bg-lime-50", title: "The Pincer", text: "Attacks from both ends at once and meets in the middle. Shortest path, tiny sniff trail.", stat: "O(V + E) · shortest, 2-sided" },
];

const STEPS = [
  { icon: <FaCompass />, bg: "bg-emerald-400", title: "Build a labyrinth", text: "Start with the cozy 15×15 or roll a wild random maze up to 31×31." },
  { icon: <FaRoute />, bg: "bg-sky-400", title: "Pick your racer", text: "Choose BFS, DFS, A*, Dijkstra, Greedy, or Bi-BFS and dial the speed from chill to zoom." },
  { icon: <FaStopwatch />, bg: "bg-amber-400", title: "Race and compare", text: "Watch the explored trail fill in, then check path length and solve time." },
];

const LEGEND = [
  { swatch: "bg-slate-900", label: "Wall" },
  { swatch: "bg-amber-200", label: "Explored" },
  { swatch: "bg-emerald-400", label: "Path" },
  { swatch: "bg-sky-500", label: "Start" },
  { swatch: "bg-rose-500", label: "Goal" },
];

export default function Home() {
  return (
    <div className="bg-amber-50 text-slate-900">
      <main className="mx-auto max-w-6xl px-4 pb-16">
        {/* Hero */}
        <section className="relative overflow-hidden py-12 md:py-16">
          <div className="playful-dots pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
          <div className="relative">
            <div className="inline-flex rotate-[-2deg] items-center gap-2 rounded-full border-2 border-slate-900 bg-white px-3 py-1 text-xs font-extrabold uppercase tracking-widest shadow-[2px_2px_0_0_#0f172a]">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              Pathfinding playground
            </div>
            <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight tracking-tight md:text-6xl">
              Race algorithms
              <br />
              through the{" "}
              <span className="relative inline-block">
                <span className="relative z-10">maze!</span>
                <span className="absolute -bottom-1 left-0 z-0 h-4 w-full -rotate-1 rounded bg-amber-300" aria-hidden="true" />
              </span>
            </h1>
            <p className="mt-4 max-w-2xl text-base font-medium leading-relaxed text-slate-700 md:text-lg">
              Pit BFS, DFS, A*, Dijkstra, Greedy, and Bi-BFS against twisty labyrinths. Watch who explores
              the most, who finds the shortcut, and who gets gloriously lost.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                to="/maze"
                className="inline-flex items-center gap-2 rounded-full border-2 border-slate-900 bg-violet-600 px-6 py-3 text-sm font-extrabold text-white shadow-[3px_3px_0_0_#0f172a] transition-transform hover:-translate-y-0.5 hover:bg-violet-500"
              >
                <FaPlay className="text-xs" />
                Start racing
              </Link>
              <Link
                to="/docs"
                className="inline-flex items-center gap-2 rounded-full border-2 border-slate-900 bg-white px-6 py-3 text-sm font-extrabold text-slate-900 shadow-[3px_3px_0_0_#0f172a] transition-transform hover:-translate-y-0.5"
              >
                <FaBook className="text-xs" />
                How they think
              </Link>
              <a
                href="https://github.com/Moudjib16/AI-assignment"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-2 py-3 text-sm font-bold text-slate-600 transition-colors hover:text-slate-900"
              >
                <FaGithub />
                GitHub
              </a>
            </div>
          </div>
        </section>

        {/* Demo */}
        <section className="animate-pop-in overflow-hidden rounded-3xl border-2 border-slate-900 bg-white shadow-[4px_4px_0_0_#0f172a]">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-slate-900 bg-violet-100 px-5 py-3">
            <p className="flex items-center gap-2 text-sm font-extrabold">
              Live demo — BFS escaping a fresh maze
              <span className="inline-flex items-center gap-1 rounded-full border border-slate-900 bg-emerald-300 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest">
                <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-slate-900" />
                Auto-play
              </span>
            </p>
            <div className="flex flex-wrap gap-2">
              {LEGEND.map((item) => (
                <span key={item.label} className="inline-flex items-center gap-1.5 rounded-full border border-slate-900 bg-white px-2 py-0.5 text-[11px] font-bold text-slate-700">
                  <span className={`inline-block h-2.5 w-2.5 rounded-full ${item.swatch}`} />
                  {item.label}
                </span>
              ))}
            </div>
          </div>
          <DemoMaze />
        </section>

        {/* Racers */}
        <section className="py-12">
          <h2 className="text-2xl font-black tracking-tight">Meet the racers</h2>
          <p className="mt-1 text-sm font-medium text-slate-600">Six strategies, six personalities. Same maze, very different road trips.</p>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {RACERS.map((racer) => (
              <div key={racer.name} className={`rounded-3xl border-2 border-slate-900 ${racer.card} p-5 shadow-[4px_4px_0_0_#0f172a] transition-transform hover:-translate-y-1`}>
                <div className="flex items-center gap-2">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-2xl border-2 border-slate-900 ${racer.color} text-sm font-black text-slate-900`}>
                    {racer.name}
                  </span>
                  <h3 className="text-base font-extrabold">{racer.title}</h3>
                </div>
                <p className="mt-3 text-sm font-medium leading-relaxed text-slate-700">{racer.text}</p>
                <p className="mt-3 inline-block rounded-full border border-slate-900 bg-white px-2.5 py-1 font-mono text-xs font-bold">{racer.stat}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How to play */}
        <section className="rounded-3xl border-2 border-slate-900 bg-slate-900 p-6 text-white shadow-[4px_4px_0_0_#c4b5fd] md:p-8">
          <h2 className="text-2xl font-black tracking-tight">How to play</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <div key={step.title} className="rounded-2xl bg-white/10 p-5 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <span className={`flex h-9 w-9 items-center justify-center rounded-xl border-2 border-slate-900 ${step.bg} text-slate-900`}>
                    {step.icon}
                  </span>
                  <span className="font-mono text-xs font-bold text-white/60">STEP {i + 1}</span>
                </div>
                <h3 className="mt-3 font-extrabold">{step.title}</h3>
                <p className="mt-1 text-sm font-medium leading-relaxed text-white/75">{step.text}</p>
              </div>
            ))}
          </div>
          <Link
            to="/maze"
            className="mt-6 inline-flex items-center gap-2 rounded-full border-2 border-white bg-amber-400 px-6 py-3 text-sm font-extrabold text-slate-900 shadow-[3px_3px_0_0_#ffffff] transition-transform hover:-translate-y-0.5"
          >
            <FaPlay className="text-xs" />
            Enter the maze
          </Link>
        </section>
      </main>

      <footer className="border-t-2 border-slate-900 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-5 text-sm font-semibold text-slate-500">
          <p>Maze Runner — built with React and Tailwind. Go get lost (then found).</p>
          <div className="flex gap-4">
            <Link to="/docs" className="transition-colors hover:text-violet-600">Learn</Link>
            <Link to="/maze" className="transition-colors hover:text-violet-600">Play</Link>
            <Link to="/contact" className="transition-colors hover:text-violet-600">Say hi</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Auto-playing BFS demo rendered with the same arcade palette as the solver,
// so the home page always matches the site style (no more stale GIF).
function DemoMaze() {
  const maze = useMemo(() => generateRandomMaze(15, 15), []);
  const start = [1, 1];
  const goal = [13, 13];
  const result = useMemo(() => solveMazeBFS(maze, start, goal), [maze]);
  const explored = result.explored;
  const solution = result.solutionPath ?? [];
  const [tick, setTick] = useState(0);

  const GAP = 10; // pause between exploration and path phases
  const HOLD = 60; // hold the finished maze before looping
  const total = explored.length + GAP + solution.length + HOLD;

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setTick(total);
      return;
    }
    const id = setInterval(() => setTick((t) => (t + 1) % (total + 1)), 45);
    return () => clearInterval(id);
  }, [total]);

  const exploredCount = Math.min(tick, explored.length);
  const pathCount = Math.max(0, Math.min(tick - explored.length - GAP, solution.length));
  const done = tick >= explored.length + GAP + solution.length;

  const exploredSet = useMemo(
    () => new Set(explored.slice(0, exploredCount).map(([r, c]) => `${r},${c}`)),
    [explored, exploredCount]
  );
  const pathSet = useMemo(
    () => new Set(solution.slice(0, pathCount).map(([r, c]) => `${r},${c}`)),
    [solution, pathCount]
  );

  return (
    <div className="px-5 py-5">
      <div
        className="playful-dots grid w-full gap-[3px] rounded-2xl border-2 border-slate-900 bg-violet-100 p-2.5"
        style={{ gridTemplateColumns: "repeat(15, minmax(0, 1fr))", maxWidth: "420px", margin: "0 auto" }}
        role="img"
        aria-label={done ? `Demo finished: BFS found a ${solution.length}-step path` : "Demo: BFS exploring a maze"}
      >
        {maze.map((row, r) =>
          row.map((cell, c) => {
            const isStart = r === start[0] && c === start[1];
            const isGoal = r === goal[0] && c === goal[1];
            const key = `${r},${c}`;
            let cls = "bg-white border-slate-300";
            let label = null;
            if (cell === 1) cls = "bg-slate-900 border-slate-900";
            else if (isStart) { cls = "bg-sky-500 border-slate-900"; label = "S"; }
            else if (isGoal) { cls = "bg-rose-500 border-slate-900"; label = "G"; }
            else if (pathSet.has(key)) cls = "bg-emerald-400 border-slate-900";
            else if (exploredSet.has(key)) cls = "bg-amber-200 border-amber-300";
            return (
              <div
                key={`${r}-${c}`}
                className={`flex aspect-square w-full items-center justify-center rounded-[4px] border text-[8px] font-black ${cls}`}
              >
                {label && <span className="text-slate-900">{label}</span>}
              </div>
            );
          })
        )}
      </div>
      <p className="mx-auto mt-3 max-w-[420px] text-center text-xs font-bold text-slate-500" aria-live="polite">
        {done ? (
          <>BFS escaped in {solution.length} steps — a fresh maze every visit. <Link to="/maze" className="text-violet-700 underline">Try it yourself</Link></>
        ) : (
          <>BFS is sniffing around… {exploredCount}/{explored.length} tiles</>
        )}
      </p>
    </div>
  );
}
