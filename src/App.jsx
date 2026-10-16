import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MazeSolver from './pages/Solver';
import Documentation from './pages/Documentation';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    // BASE_URL lets the app run from a sub-path (e.g. GitHub Pages) when
    // vite.config `base` is set, while staying "/" in local dev.
    <Router basename={import.meta.env.BASE_URL}>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/maze" element={<MazeSolver />} />
          <Route path="/docs" element={<Documentation />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}
