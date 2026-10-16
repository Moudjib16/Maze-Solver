import {
  FaGithub,
  FaRocket,
  FaPuzzlePiece,
  FaRegChartBar,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import gif from "../../public/videos/ezgif.com-video-to-gif-converter.gif";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const MotionLink = motion(Link);

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const animateProgress = () => {
      const duration = 3000; // 3 seconds
      const startTime = Date.now();

      const updateProgress = () => {
        const elapsed = Date.now() - startTime;
        const percentage = Math.min((elapsed / duration) * 100, 100);
        setProgress(percentage);

        if (percentage < 100) {
          requestAnimationFrame(updateProgress);
        }
      };

      requestAnimationFrame(updateProgress);
    };

    animateProgress();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[800px] h-[800px] -top-64 -left-64 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="absolute right-0 top-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <main className="container mx-auto px-4 py-24 relative z-10">
        {/* Hero Section */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-center mb-32"
        >
          <motion.div variants={itemVariants} className="max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent mb-8 py-4">
              Visualize Pathfinding Magic
            </h1>

            <motion.p
              variants={itemVariants}
              className="text-xl text-slate-300 mb-12"
            >
              Watch algorithms dance through labyrinths in real-time
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex justify-center gap-4 mb-16"
            >
              <MotionLink
  whileHover={{ scale: 1.1 }}
  whileTap={{ scale: 0.95 }}
  to="/maze"
  className="flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all duration-300 shadow-lg"
  onClick={() => setIsLoading(true)}
>
  {isLoading ? (
    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
  ) : (
    <>
      <FaRocket className="mr-2" />
      Start Exploring
    </>
  )}
</MotionLink>
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href="https://github.com/Moudjib16/AI-assignment"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-full transition-all duration-300 shadow-lg"
              >
                <FaGithub className="mr-2" />
                GitHub
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Live Preview Section */}
          <motion.div
            variants={itemVariants}
            className="relative overflow-hidden rounded-[2rem] mx-auto max-w-7xl shadow-2xl border border-slate-700/50 mb-20 lg:mr-[5%] lg:w-[90%] backdrop-blur-sm bg-slate-900/50 hover:border-slate-600 transition-all duration-300 group"
          >
            {/* Gradient Background Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/15 via-transparent to-emerald-500/15" />

            <div className="relative p-8 lg:p-16 flex flex-col lg:flex-row items-center gap-24 justify-around">
              {/* Text Content - Left Side */}
              <div className="lg:w-2/5 space-y-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-6"
                >
                  <h3 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                    Watch Algorithms
                    <br />
                    <span className="text-2xl font-medium text-slate-400">
                      Dance Through Dimensions
                    </span>
                  </h3>
                  <p className="text-lg text-slate-400 leading-relaxed">
                    Our intelligent pathfinder navigates complex labyrinths with
                    precision ballet. Witness real-time decisions as multiple
                    algorithms race through:
                    <span className="block mt-4 font-mono text-sm text-blue-400">
                      BFS · DFS · A* · Dijkstra
                    </span>
                  </p>
                </motion.div>
              </div>

              {/* GIF Container - Right Side */}
              <div className="lg:w-2/5 relative overflow-hidden rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-900 to-slate-900/20 transform lg:-translate-x-10">
                {/* Animated Grid Pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:16px_16px] mix-blend-overlay" />

                {/* GIF with Parallax Effect */}
                <motion.img
                  src={gif}
                  alt="Maze solving visualization"
                  className="w-full h-auto max-h-[600px] object-contain p-6 hover:scale-[1.015] transition-transform duration-500 cursor-grab active:cursor-grabbing"
                  loading="lazy"
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.98 }}
                />

                {/* Interactive HUD Overlay */}
                <div className="absolute bottom-6 left-6 backdrop-blur-sm bg-slate-900/50 p-4 rounded-xl border border-slate-700/30">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <span className="text-xs font-mono text-emerald-400">
                        CURRENT ALGORITHM
                      </span>
                      <span className="text-lg font-semibold text-blue-400">
                        BFS Pathfinding
                      </span>
                    </div>
                    <div className="h-8 w-px bg-slate-700/50" />
                    <motion.div
                      className="flex flex-col"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <span className="text-xs font-mono text-emerald-400">
                        PROGRESS
                      </span>
                      <div className="relative">
                        <motion.span
                          className="text-lg font-semibold text-purple-400 block"
                          initial={{ scale: 0.5 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring" }}
                        >
                          {Math.round(progress)}%
                        </motion.span>
                        {/* Progress bar */}
                        <div className="absolute -bottom-2 w-full h-1 bg-slate-800/50 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-purple-400"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: progress / 100 }}
                            transition={{ duration: 2.5, ease: "easeInOut" }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Animated Scanline Effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/10 to-transparent animate-scanline" />
              </div>

              {/* Live Status Badge */}
              <div className="absolute top-6 right-6 flex items-center gap-2 bg-slate-900/80 px-4 py-2 rounded-full border border-slate-700/50 hover:border-emerald-400/30 transition-colors">
                <div className="relative">
                  <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-ping absolute" />
                  <div className="w-2.5 h-2.5 bg-green-400 rounded-full relative" />
                </div>
                <span className="text-sm font-medium text-green-400 tracking-wider">
                  SIMULATION ACTIVE
                </span>
              </div>
            </div>

            {/* Floating Particles */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animation: `float ${5 + Math.random() * 10}s infinite`,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.section>

        {/* Feature Grid */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="mb-32"
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl font-bold text-center mb-16"
          >
            Key Features
          </motion.h2>

          <motion.div
            variants={containerVariants}
            className="grid md:grid-cols-3 gap-8"
          >
            <FeatureCard
              icon={<FaPuzzlePiece className="w-8 h-8" />}
              title="Interactive Mazes"
              description="Craft and solve custom labyrinths with real-time visualization"
              color="from-blue-400 to-emerald-400"
            />
            <FeatureCard
              icon={<FaRegChartBar className="w-8 h-8" />}
              title="Algorithm Analytics"
              description="Compare performance metrics between different approaches"
              color="from-purple-400 to-pink-400"
            />
            <FeatureCard
              icon={<FaGithub className="w-8 h-8" />}
              title="Open Learning"
              description="Educational resources and community-driven development"
              color="from-amber-400 to-orange-400"
            />
          </motion.div>
        </motion.section>

        {/* Algorithm Comparison */}
        <AlgorithmComparisonTable />

        {/* Maze Builder Preview */}
      </main>

      {/* Footer */}

<motion.footer
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true }}
  className="text-center pb-8 text-slate-400 mt-20"
>
  <div className="flex justify-center gap-6 mb-4">
    <motion.div whileHover={{ scale: 1.1 }}>
      <Link 
        to="/docs" 
        className="hover:text-blue-400 transition-colors"
      >
        Documentation
      </Link>
    </motion.div>
    <motion.div whileHover={{ scale: 1.1 }}>
      <Link 
        to="/maze" 
        className="hover:text-blue-400 transition-colors"
      >
        Maze Solver
      </Link>
    </motion.div>
    <motion.div whileHover={{ scale: 1.1 }}>
      <Link 
        to="/contact" 
        className="hover:text-blue-400 transition-colors"
      >
        Contact
      </Link>
    </motion.div>
  </div>
  <p className="text-sm">
    Built with ❤️ using React, Tailwind & Framer Motion
    <br />
    <span className="text-xs opacity-75">Open source on GitHub</span> 🚀
  </p>
</motion.footer>
    </div>
  );
}

function AlgorithmComparisonTable() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      className="max-w-4xl mx-auto mb-32 bg-slate-900/50 rounded-xl p-8 backdrop-blur-sm"
    >
      <h3 className="text-2xl font-bold mb-6">Algorithm Comparison</h3>
      <table className="w-full">
        <thead>
          <tr className="text-left border-b border-slate-700">
            <th className="pb-4">Algorithm</th>
            <th className="pb-4">Complexity</th>
            <th className="pb-4">Path Type</th>
            <th className="pb-4">Guarantees</th>
          </tr>
        </thead>
        <tbody>
          {[
            [
              "Breadth-First Search",
              "O(V + E)",
              "Shortest Path",
              "Unweighted Graphs",
            ],
            ["Depth-First Search", "O(V + E)", "Any Path", "Non-cyclic Graphs"],
            ["A* (A-Star)", "O(E)", "Optimal Path", "Admissible Heuristic"],
          ].map(([algo, complexity, path, guarantee], index) => (
            <motion.tr
              key={algo}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: index * 0.1 }}
              className="border-b border-slate-700 hover:bg-slate-800/50 transition-colors"
            >
              <td className="py-4 font-medium">{algo}</td>
              <td>
                <code>{complexity}</code>
              </td>
              <td>{path}</td>
              <td>{guarantee}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.section>
  );
}



function FeatureCard({ icon, title, description, color }) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.05 }}
      className={`bg-gradient-to-br ${color} p-px rounded-2xl overflow-hidden shadow-2xl relative group`}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute w-32 h-32 bg-[radial-gradient(#ffffff12_1px,transparent_1px)] [background-size:16px_16px] -top-16 -left-16" />
      </div>

      <div className="bg-slate-900 h-full p-6 rounded-2xl shadow-lg relative">
        <div
          className={`mb-4 inline-block p-3 rounded-lg bg-gradient-to-br ${color}`}
        >
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-slate-400">{description}</p>
      </div>
    </motion.div>
  );
}
