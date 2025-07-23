import React, { useEffect, useState } from "react";
import { Heart, ShoppingCart, X, Eye, Share2, Star } from "lucide-react";

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  discount?: number;
}

const Wishlist: React.FC = () => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Sample data for demonstration
  const dummyData: WishlistItem[] = [
    {
      id: "1",
      name: "Premium Stainless Steel Water Bottle",
      price: 399,
      originalPrice: 499,
      image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300&h=300&fit=crop",
      category: "Bottles",
      rating: 4.5,
      reviewCount: 124,
      inStock: true,
      discount: 20
    },
    {
      id: "2",
      name: "Kids Insulated Tiffin Box Set",
      price: 249,
      originalPrice: 299,
      image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=300&h=300&fit=crop",
      category: "Tiffins",
      rating: 4.3,
      reviewCount: 89,
      inStock: true,
      discount: 17
    },
    {
      id: "3",
      name: "BPA-Free Baby Feeding Bottle",
      price: 199,
      image: "https://images.unsplash.com/photo-1540479859555-17af45c78602?w=300&h=300&fit=crop",
      category: "Baby Products",
      rating: 4.7,
      reviewCount: 203,
      inStock: false
    },
    {
      id: "4",
      name: "Thermosteel Casserole Dish",
      price: 599,
      originalPrice: 799,
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop",
      category: "Casseroles",
      rating: 4.2,
      reviewCount: 67,
      inStock: true,
      discount: 25
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setWishlist(dummyData);
      setLoading(false);
    }, 1000);
  }, []);

  const removeFromWishlist = (id: string) => {
    setWishlist(prev => prev.filter(item => item.id !== id));
  };

  const addToCart = (item: WishlistItem) => {
    // Add to cart logic here
    console.log("Added to cart:", item);
  };

  const shareProduct = (item: WishlistItem) => {
    // Share product logic here
    console.log("Share product:", item);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-48 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white rounded-lg p-4">
                  <div className="h-48 bg-gray-300 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
            <div className="max-w-md mx-auto">
              <Heart size={64} className="mx-auto text-gray-300 mb-6" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">Your Wishlist is Empty</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Save items you love by clicking the heart icon on any product. 
                We'll keep them safe here for you!
              </p>
              <button className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium">
                Start Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
          <p className="text-gray-600">
            {wishlist.length} item{wishlist.length !== 1 ? 's' : ''} saved for later
          </p>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map(item => (
            <div key={item.id} className="group bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Discount Badge */}
                {item.discount && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                    {item.discount}% OFF
                  </div>
                )}

                {/* Action Buttons */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="bg-white p-2 rounded-full shadow-md hover:bg-red-50 hover:text-red-500 transition-colors"
                    title="Remove from wishlist"
                  >
                    <X size={16} />
                  </button>
                  <button
                    onClick={() => shareProduct(item)}
                    className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors"
                    title="Share product"
                  >
                    <Share2 size={16} />
                  </button>
                  <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors" title="Quick view">
                    <Eye size={16} />
                  </button>
                </div>

                {/* Stock Status */}
                {!item.inStock && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="bg-white text-gray-900 px-3 py-1 rounded-md font-medium text-sm">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="mb-2">
                  <span className="text-xs text-gray-500 uppercase tracking-wide">{item.category}</span>
                  <h3 className="font-semibold text-gray-900 text-sm leading-tight mt-1 line-clamp-2">
                    {item.name}
                  </h3>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  <div className="flex items-center">
                    <Star size={14} className="text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-700 ml-1">{item.rating}</span>
                  </div>
                  <span className="text-xs text-gray-500">({item.reviewCount})</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="font-bold text-lg text-gray-900">₹{item.price}</span>
                  {item.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">₹{item.originalPrice}</span>
                  )}
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => addToCart(item)}
                  disabled={!item.inStock}
                  className={`w-full py-2.5 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                    item.inStock
                      ? 'bg-black text-white hover:bg-gray-800'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart size={16} />
                  {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Continue Shopping */}
        <div className="text-center mt-12">
          <button className="text-gray-600 hover:text-gray-800 transition-colors font-medium">
            ← Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;