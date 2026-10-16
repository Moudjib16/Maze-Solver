import React, { useState } from 'react';
import MazeGrid from '../components/MazeGrid';
import PathTables from '../components/PathTables';

const Solver = () => {
  const [algorithm, setAlgorithm] = useState('BFS');
  const [explored, setExplored] = useState([]);
  const [path, setPath] = useState([]);
  const [running, setRunning] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-[rgb(var(--color-bg))] text-[rgb(var(--color-text))] p-8 space-y-12">
      {/* Header Section */}
      <header className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[rgb(var(--color-primary))] to-[rgb(var(--color-secondary))] bg-clip-text text-transparent mb-4">
          Pathfinding Visualizer
        </h1>
        <p className="text-lg text-[rgb(var(--color-text)/0.8)]">
          Watch {algorithm} algorithm navigate through the maze
        </p>
      </header>

      {/* Algorithm Selector Section */}
      <section className="w-full max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 bg-[rgb(var(--color-surface))] p-4 rounded-xl shadow-md">
          <label className="text-sm font-medium">Algorithm:</label>
          <select
            className="px-4 py-2 bg-black rounded-lg border dark:border-slate-700 border-slate-300 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
          >
            <option value="BFS">Breadth-First Search</option>
            <option value="DFS">Depth-First Search</option>
            <option value="A*">A* Algorithm</option>
          </select>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Maze Grid (Left) */}
        <div className="lg:w-3/5">
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
        
        {/* Path Tables (Right) */}
        <div className="lg:w-2/7">
          <PathTables explored={explored} path={path} />
        </div>
      </section>
    </div>
  );
};

export default Solver;
