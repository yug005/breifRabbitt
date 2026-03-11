import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-t-0 border-x-0 rounded-none">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-2xl">🐇</span>
          <span className="text-xl font-bold glow-text group-hover:opacity-80 transition-opacity">
            BriefRabbit
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="text-white/60 hover:text-white text-sm font-medium transition-colors"
          >
            Home
          </Link>
          <Link
            to="/upload"
            className="btn-primary text-sm !py-2 !px-5"
          >
            Upload Data
          </Link>
        </div>
      </div>
    </nav>
  );
}
