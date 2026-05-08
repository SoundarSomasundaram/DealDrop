import { TrendingDown } from "lucide-react";
import AddProductForm from "@/components/AddProductForm";
import ProductCard from "@/components/ProductCard";

export default function Dashboard({ user, products, loading, onProductAdded, onProductDeleted }) {
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-orange-50">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-600">Please sign in to view your dashboard and track products.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <AddProductForm user={user} onProductAdded={onProductAdded} />
        </div>
      </section>

      {/* Products Grid */}
      {products.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pb-20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              Your Tracked Products
            </h3>
            <span className="text-sm text-gray-500">
              {products.length} {products.length === 1 ? "product" : "products"}
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2 items-start">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onProductDeleted={onProductDeleted} 
              />
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {products.length === 0 && (
        <section className="max-w-2xl mx-auto px-4 pb-20 text-center">
          <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12">
            <TrendingDown className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No products yet
            </h3>
            <p className="text-gray-600">
              Add your first product above to start tracking prices!
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
