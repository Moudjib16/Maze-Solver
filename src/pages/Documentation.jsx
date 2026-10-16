import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const algorithms = [
  {
    id: 'bfs',
    name: 'BFS',
    title: 'The Perfectionist',
    badge: 'bg-sky-400',
    complexity: 'O(V + E)',
    path: 'Shortest path',
    description: 'BFS sniffs every tile layer by layer, starting from home base. Because it never skips a closer tile, the first time it reaches the treat it has found the shortest route.',
    when: 'Pick BFS when you want the guaranteed shortest escape.',
    code: `function bfs(maze, start, goal) {
  const queue = [start];
  const visited = new Set([start.toString()]);
  const parent = { [start]: null };

  while (queue.length > 0) {
    const current = queue.shift();
    if (isGoal(current, goal)) return buildPath(parent, current);

    for (const next of neighbors(current, maze)) {
      if (!visited.has(next.toString())) {
        visited.add(next.toString());
        parent[next] = current;
        queue.push(next);
      }
    }
  }
  return null; // no way out
}`
  },
  {
    id: 'dfs',
    name: 'DFS',
    title: 'The Daredevil',
    badge: 'bg-amber-400',
    complexity: 'O(V + E)',
    path: 'Any path',
    description: 'DFS charges down each tunnel as far as it goes before backtracking. It remembers little and runs fast, but the escape it finds can be a scenic detour.',
    when: 'Pick DFS to watch a bold, loopy adventure — not for the shortest route.',
    code: `function dfs(maze, start, goal) {
  const stack = [start];
  const visited = new Set([start.toString()]);
  const parent = { [start]: null };

  while (stack.length > 0) {
    const current = stack.pop();
    if (isGoal(current, goal)) return buildPath(parent, current);

    for (const next of neighbors(current, maze)) {
      if (!visited.has(next.toString())) {
        visited.add(next.toString());
        parent[next] = current;
        stack.push(next);
      }
    }
  }
  return null; // no way out
}`
  },
  {
    id: 'a-star',
    name: 'A*',
    title: 'The Navigator',
    badge: 'bg-violet-500',
    complexity: 'O(E)',
    path: 'Shortest path',
    description: 'A* carries a compass: the Manhattan distance to the goal. It adds steps-taken (g) plus estimated steps-left (h) and always explores the most promising tile next.',
    when: 'Pick A* as your everyday racer — shortest path with less sniffing around.',
    code: `function aStar(maze, start, goal) {
  const open = [start];
  const g = { [start]: 0 };
  const parent = { [start]: null };
  const h = (cell) => manhattan(cell, goal);

  while (open.length > 0) {
    open.sort((a, b) => (g[a] + h(a)) - (g[b] + h(b)));
    const current = open.shift();
    if (isGoal(current, goal)) return buildPath(parent, current);

    for (const next of neighbors(current, maze)) {
      const cost = g[current] + 1;
      if (!(next in g) || cost < g[next]) {
        parent[next] = current;
        g[next] = cost;
        if (!open.some((c) => c.toString() === next.toString())) open.push(next);
      }
    }
  }
  return null; // no way out
}`
  },
  {
    id: 'dijkstra',
    name: 'Dijkstra',
    title: 'The Accountant',
    badge: 'bg-teal-400',
    complexity: 'O(V²)',
    path: 'Shortest path',
    description: 'Dijkstra counts every step like coins. It always expands the tile with the smallest distance-from-start, so the first time it reaches the treat the route is optimal — even once walls get different costs.',
    when: 'Pick Dijkstra when steps have different prices, or to see uniform-cost search done right.',
    code: `function dijkstra(maze, start, goal) {
  const dist = { [start]: 0 };
  const parent = { [start]: null };
  const visited = new Set();
  const open = [start];

  while (open.length > 0) {
    open.sort((a, b) => dist[a] - dist[b]);
    const current = open.shift();
    if (visited.has(current.toString())) continue;
    visited.add(current.toString());
    if (isGoal(current, goal)) return buildPath(parent, current);

    for (const next of neighbors(current, maze)) {
      const cost = dist[current] + 1;
      if (!(next in dist) || cost < dist[next]) {
        dist[next] = cost;
        parent[next] = current;
        open.push(next);
      }
    }
  }
  return null; // no way out
}`
  },
  {
    id: 'greedy',
    name: 'Greedy',
    title: 'The Sprinter',
    badge: 'bg-rose-400',
    complexity: 'O(E)',
    path: 'Any path',
    description: 'Greedy only looks at the finish line: the Manhattan distance to the goal. It sprints straight at the treat, explores very little, but can get fooled by dead ends into a longer escape.',
    when: 'Pick Greedy for speed — watch it beat A* to the goal, then compare path lengths.',
    code: `function greedy(maze, start, goal) {
  const open = [start];
  const visited = new Set([start.toString()]);
  const parent = { [start]: null };
  const h = (cell) => manhattan(cell, goal);

  while (open.length > 0) {
    open.sort((a, b) => h(a) - h(b));
    const current = open.shift();
    if (isGoal(current, goal)) return buildPath(parent, current);

    for (const next of neighbors(current, maze)) {
      if (!visited.has(next.toString())) {
        visited.add(next.toString());
        parent[next] = current;
        open.push(next);
      }
    }
  }
  return null; // no way out
}`
  },
  {
    id: 'bi-bfs',
    name: 'Bi-BFS',
    title: 'The Pincer',
    badge: 'bg-lime-400',
    complexity: 'O(V + E)',
    path: 'Shortest path',
    description: 'Bidirectional BFS sends two racers at once — one from home, one from the treat. When their sniff trails touch, the two halves join into one shortest escape. Usually sniffs far fewer tiles than plain BFS.',
    when: 'Pick Bi-BFS when you want the shortest path with the smallest sniff count.',
    code: `function biBFS(maze, start, goal) {
  let frontS = [start], frontG = [goal];
  const seenS = new Map([[start, null]]);
  const seenG = new Map([[goal, null]]);

  while (frontS.length && frontG.length) {
    const fromStart = frontS.length <= frontG.length;
    const next = [];
    const active = fromStart ? frontS : frontG;
    for (const cur of active) {
      for (const nxt of neighbors(cur, maze)) {
        const seen = fromStart ? seenS : seenG;
        const other = fromStart ? seenG : seenS;
        if (seen.has(nxt.toString())) continue;
        seen.set(nxt.toString(), cur);
        if (other.has(nxt.toString())) return joinPath(seenS, seenG, nxt);
        next.push(nxt);
      }
    }
    if (fromStart) frontS = next; else frontG = next;
  }
  return null; // no way out
}`
  }
];

export default function Documentation() {
  const [selected, setSelected] = useState(algorithms[0]);

  return (
    <div className="bg-amber-50 text-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <p className="inline-block rotate-[-1deg] rounded-full border-2 border-slate-900 bg-violet-300 px-3 py-1 text-xs font-extrabold uppercase tracking-widest shadow-[2px_2px_0_0_#0f172a]">
          Field guide
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-tight">How the racers think</h1>
        <p className="mt-1 max-w-2xl text-sm font-medium text-slate-600">
          The same six pals from the home page, explained like a game manual.
        </p>

        <div className="mt-6 grid items-start gap-6 md:grid-cols-4">
          <aside className="rounded-3xl border-2 border-slate-900 bg-white p-2 shadow-[3px_3px_0_0_#0f172a] md:sticky md:top-20">
            {algorithms.map((algo) => (
              <button
                key={algo.id}
                onClick={() => setSelected(algo)}
                className={`mb-1 flex w-full items-center gap-2.5 rounded-2xl border-2 px-3 py-2.5 text-left transition-transform last:mb-0 hover:-translate-y-0.5 ${
                  selected.id === algo.id
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-transparent text-slate-700 hover:border-slate-900 hover:bg-amber-100'
                }`}
              >
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 border-slate-900 ${algo.badge} font-mono text-xs font-black text-slate-900`}>
                  {algo.name}
                </span>
                <span>
                  <span className="block text-sm font-extrabold">{algo.title}</span>
                  <span className={`block font-mono text-xs font-bold ${selected.id === algo.id ? 'text-white/70' : 'text-slate-500'}`}>
                    {algo.complexity} · {algo.path}
                  </span>
                </span>
              </button>
            ))}
          </aside>

          <article className="md:col-span-3">
            <div className="rounded-3xl border-2 border-slate-900 bg-white p-5 shadow-[3px_3px_0_0_#0f172a] md:p-6">
              <div className="flex items-center gap-2">
                <span className={`flex h-10 w-10 items-center justify-center rounded-2xl border-2 border-slate-900 ${selected.badge} font-mono text-xs font-black text-slate-900`}>
                  {selected.name}
                </span>
                <h2 className="text-xl font-black">{selected.title}</h2>
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-900 bg-amber-100 px-3 py-2">
                  <p className="text-[11px] font-black uppercase tracking-widest text-slate-500">Speed class</p>
                  <p className="font-mono text-sm font-black">{selected.complexity}</p>
                </div>
                <div className="rounded-2xl border border-slate-900 bg-emerald-100 px-3 py-2">
                  <p className="text-[11px] font-black uppercase tracking-widest text-slate-500">Prize</p>
                  <p className="text-sm font-black">{selected.path}</p>
                </div>
                <div className="rounded-2xl border border-slate-900 bg-violet-100 px-3 py-2">
                  <p className="text-[11px] font-black uppercase tracking-widest text-slate-500">Nickname</p>
                  <p className="font-mono text-sm font-black">{selected.name}</p>
                </div>
              </div>
              <p className="mt-4 text-sm font-medium leading-relaxed text-slate-700">{selected.description}</p>
              <p className="mt-2 rounded-2xl bg-amber-50 px-3 py-2 text-sm font-bold text-slate-700">{selected.when}</p>
            </div>

            <div className="mt-4 overflow-hidden rounded-3xl border-2 border-slate-900 shadow-[3px_3px_0_0_#0f172a]">
              <div className="flex items-center gap-1.5 border-b-2 border-slate-900 bg-slate-900 px-5 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <h3 className="ml-2 font-mono text-xs font-bold text-white/70">racer-brain.js</h3>
              </div>
              <SyntaxHighlighter
                language="javascript"
                style={vscDarkPlus}
                customStyle={{ margin: 0, fontSize: 13 }}
              >
                {selected.code}
              </SyntaxHighlighter>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
