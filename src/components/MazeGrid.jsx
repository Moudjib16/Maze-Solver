import React, { useState } from "react";
import { solveMazeBFS } from "../algorithms/bfs";
import { solveMazeDFS } from "../algorithms/dfs";
import { solveMazeAStar } from "../algorithms/aStar";
import { maze as defaultMaze, start as defaultStart, goal as defaultGoal, generateRandomMaze } from "../utils/maze";

const MazeGrid = ({ algorithm, explored, path, running, setExplored, setPath, setRunning }) => {
  // State for current maze and its start/goal points.
  // By default, use the predefined maze and its start/goal.
  const [currentMaze, setCurrentMaze] = useState(defaultMaze);
  const [currentStart, setCurrentStart] = useState(defaultStart);
  const [currentGoal, setCurrentGoal] = useState(defaultGoal);

  // Maze cell component
  const MazeCell = ({ isWall, isStart, isGoal, isExplored, isPath }) => {
    let bgColor = "bg-white";
    if (isWall) bgColor = "bg-gray-800";
    else if (isStart) bgColor = "bg-blue-500";
    else if (isGoal) bgColor = "bg-red-500";
    else if (isPath) bgColor = "bg-green-500";
    else if (isExplored) bgColor = "bg-yellow-300";
    return (
      <div
        className={`w-10 h-10 border border-gray-300 flex items-center justify-center transition-colors duration-300 ${bgColor}`}
      ></div>
    );
  };

  // Helper function to animate state updates
  const animateArray = async (arr, setter, delay) => {
    for (let i = 0; i < arr.length; i++) {
      setter(prev => [...prev, arr[i]]);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  };

  // Run the selected algorithm on the current maze
  const runAlgorithm = async () => {
    setRunning(true);
    setExplored([]);
    setPath([]);
    let result;
    try {
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
      console.log("Algorithm result:", result);
      await animateArray(result.explored, setExplored, 50);
      if (result.solutionPath) {
        await animateArray(result.solutionPath, setPath, 100);
      }
    } catch (error) {
      console.error("Algorithm error:", error);
    } finally {
      setRunning(false);
    }
  };

  // Generate a random maze (e.g., 21x21) ensuring it's solvable,
  // and update the start and goal to fixed positions (e.g., [1,1] and [rows-2, cols-2])
  const handleGenerateRandomMaze = () => {
    const rows = 21; // New maze rows (should be odd for proper generation)
    const cols = 21; // New maze columns (should be odd for proper generation)
    const newMaze = generateRandomMaze(rows, cols);
    setCurrentMaze(newMaze);
    setExplored([]);
    setPath([]);
    // For random maze, set start and goal to fixed positions
    setCurrentStart([1, 1]);
    setCurrentGoal([rows - 2, cols - 2]);
  };

  return (
    <div className="bg-gray-900 p-4 rounded-xl shadow-lg">
      {/* Maze Grid Rendering */}
      <div
        className="grid gap-1 mx-auto mb-4"
        style={{ gridTemplateColumns: `repeat(${currentMaze[0].length}, 2.5rem)` }}
      >
        {currentMaze.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const currentCell = [rowIndex, colIndex];
            const isStart = currentCell[0] === currentStart[0] && currentCell[1] === currentStart[1];
            const isGoal = currentCell[0] === currentGoal[0] && currentCell[1] === currentGoal[1];
            const isWall = cell === 1;
            const isExplored = explored.some(([r, c]) => r === rowIndex && c === colIndex);
            const isPath = path.some(([r, c]) => r === rowIndex && c === colIndex);
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

      {/* Buttons */}
      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={runAlgorithm}
          disabled={running}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 font-medium text-sm"
        >
          {running ? "Visualizing..." : "Start Visualization"}
        </button>
        <button
          onClick={handleGenerateRandomMaze}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 font-medium text-sm"
        >
          Generate Random Maze
        </button>
      </div>
    </div>
  );
};

export default MazeGrid;
