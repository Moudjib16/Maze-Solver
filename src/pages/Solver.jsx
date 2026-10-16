import { useState } from 'react';
import MazeGrid from '../components/MazeGrid';
import PathTables from '../components/PathTables';

const ALGORITHMS = [
  { value: 'BFS', label: 'BFS', hint: 'The Perfectionist', active: 'border-sky-600 bg-sky-400', soft: 'bg-sky-50' },
  { value: 'DFS', label: 'DFS', hint: 'The Daredevil', active: 'border-amber-600 bg-amber-400', soft: 'bg-amber-50' },
  { value: 'A*', label: 'A*', hint: 'The Navigator', active: 'border-violet-600 bg-violet-500', soft: 'bg-violet-50' },
];

const Solver = () => {
  const [algorithm, setAlgorithm] = useState('BFS');
  const [explored, setExplored] = useState([]);
  const [path, setPath] = useState([]);
  const [running, setRunning] = useState(false);

  const handleAlgorithmChange = (value) => {
    if (running) return;
    setAlgorithm(value);
    setExplored([]);
    setPath([]);
  };

  return (
    <div className="bg-amber-50 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        <header>
          <p className="inline-block rotate-[-1deg] rounded-full border-2 border-slate-900 bg-emerald-300 px-3 py-1 text-xs font-extrabold uppercase tracking-widest shadow-[2px_2px_0_0_#0f172a]">
            Race track
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight">Pick your racer, run the maze</h1>
          <p className="mt-1 text-sm font-medium text-slate-600">
            Generate a labyrinth, choose a strategy, and watch the trail unfold.
          </p>
        </header>

        <div className="flex flex-wrap gap-3" role="tablist" aria-label="Algorithm">
          {ALGORITHMS.map((algo) => {
            const active = algorithm === algo.value;
            return (
              <button
                key={algo.value}
                role="tab"
                aria-selected={active}
                onClick={() => handleAlgorithmChange(algo.value)}
                disabled={running}
                className={`rounded-2xl border-2 border-slate-900 px-5 py-3 text-left shadow-[3px_3px_0_0_#0f172a] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 ${
                  active ? algo.active + ' text-slate-900' : 'bg-white text-slate-700'
                }`}
              >
                <span className="block font-mono text-lg font-black">{algo.label}</span>
                <span className={`block text-xs font-bold ${active ? 'text-slate-900' : 'text-slate-500'}`}>
                  {algo.hint}
                </span>
              </button>
            );
          })}
        </div>

        <section className="grid items-start gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <MazeGrid
              algorithm={algorithm}
              explored={explored}
              path={path}
              running={running}
              setExplored={setExplored}
              setPath={setPath}
              setRunning={setRunning}
            />
          </div>
          <div className="lg:col-span-2">
            <PathTables explored={explored} path={path} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Solver;
