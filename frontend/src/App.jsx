import { useEffect, useState } from "react";
import { Routes, Route, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/utils/supabase/client";
import { getProducts } from "@/api";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import AuthButton from "@/components/AuthButton";

export default function App() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUserAndProducts = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);

      if (session?.user) {
        const data = await getProducts();
        setProducts(data);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAndProducts();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const currentUser = session?.user || null;
        setUser(currentUser);
        
        if (_event === 'SIGNED_IN' && currentUser) {
           navigate('/dashboard');
        }
        
        fetchUserAndProducts();
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleProductAdded = () => {
    fetchUserAndProducts();
  };

  const handleProductDeleted = () => {
    fetchUserAndProducts();
  };

  return (
    <main className="min-h-screen flex flex-col bg-linear-to-br from-orange-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/deal-drop-logo.png"
              alt="Deal Drop Logo"
              className="h-10 w-auto"
            />
          </Link>

          <div className="flex items-center gap-6">
            <nav className="hidden md:flex gap-6 items-center">
              <Link to="/" className="text-sm font-medium text-gray-700 hover:text-orange-600">Home</Link>
              <Link to="/" className="text-sm font-medium text-gray-700 hover:text-orange-600">About</Link>
              <Link to="/" className="text-sm font-medium text-gray-700 hover:text-orange-600">Contact</Link>
              {user && (
                <Link to="/dashboard" className="text-sm font-medium text-gray-700 hover:text-orange-600">Dashboard</Link>
              )}
            </nav>
            <AuthButton user={user} />
          </div>
        </div>
      </header>
      
      <div className="flex-grow flex flex-col">
        <Routes>
          <Route path="/" element={<Landing user={user} />} />
          <Route 
            path="/dashboard" 
            element={
              <Dashboard 
                user={user} 
                products={products} 
                loading={loading}
                onProductAdded={handleProductAdded}
                onProductDeleted={handleProductDeleted}
              />
            } 
          />
        </Routes>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/80 mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center text-center">
          <p className="text-gray-900 font-semibold mb-2">Get in touch</p>
          <a href="mailto:soundarsundaram2512@gmail.com" className="text-orange-600 hover:underline">
            soundarsundaram2512@gmail.com
          </a>
        </div>
      </footer>
    </main>
  );
}
