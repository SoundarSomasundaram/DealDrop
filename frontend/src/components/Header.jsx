import { Link } from "react-router-dom";
import AuthButton from "./AuthButton";

export default function Header({ user }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/60 backdrop-blur-md shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src="/deal-drop-logo.png"
                alt="DealDrop Logo"
                className="h-8 w-auto transition-transform duration-300 group-hover:scale-105"
              />
              <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-500 hidden sm:block">
                DealDrop
              </span>
            </Link>
            
            <nav className="hidden md:flex gap-6">
              <Link to="/" className="text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors">Home</Link>
              <Link to="/" className="text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors">About</Link>
              <Link to="/" className="text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors">Contact</Link>
              {user && (
                <Link to="/dashboard" className="text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors">Dashboard</Link>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <AuthButton user={user} />
          </div>
        </div>
      </div>
    </header>
  );
}
