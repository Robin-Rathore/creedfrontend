//@ts-nocheck

import type React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Star,
  Heart,
  ShoppingCart,
  Minus,
  Plus,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Zap,
  Users,
  MessageCircle,
} from "lucide-react";
import { useProducts } from "@/queries/hooks/product";
import { useProductReviews } from "@/queries/hooks/product";
import { useCart } from "@/queries/hooks/user";

type ProductDetailProps = {};

export const ProductDetail: React.FC<ProductDetailProps> = () => {
  const { slug } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [activeTab, setActiveTab] = useState("description");

  const { data: product, isLoading } = useProducts({ slug });
  const { data: reviews } = useProductReviews(product?._id);
  const { data: relatedProducts } = useProducts({
    category: product?.category?._id,
    limit: 4,
    exclude: product?._id,
  });
  const { addToCart } = useCart();

  useEffect(() => {
    if (product?.variants?.length > 0) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);

  const handleAddToCart = async () => {
    try {
      await addToCart.mutateAsync({
        productId: product._id,
        quantity,
        variant: selectedVariant?._id,
      });
    } catch (error) {
      console.error("Add to cart error:", error);
    }
  };

  const currentPrice = selectedVariant?.price || product?.price || 0;
  const currentStock = selectedVariant?.stock || product?.stock || 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="h-96 bg-gray-200 rounded-lg"></div>
                <div className="grid grid-cols-4 gap-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-20 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Product Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            The product you're looking for doesn't exist.
          </p>
          <Link to="/products">
            <Button className="bg-[var(--medium)] hover:bg-[var(--dark)]">
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 text-sm text-gray-600 mb-8"
        >
          <Link to="/" className="hover:text-[var(--medium)]">
            Home
          </Link>
          <span>/</span>
          <Link to="/products" className="hover:text-[var(--medium)]">
            Products
          </Link>
          <span>/</span>
          <Link
            to={`/categories/${product.category?.slug}`}
            className="hover:text-[var(--medium)]"
          >
            {product.category?.name}
          </Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </motion.nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div className="relative overflow-hidden rounded-lg bg-white shadow-sm">
              <img
                src={
                  product.images?.[selectedImage]?.url ||
                  "/placeholder.svg?height=500&width=500"
                }
                alt={product.name}
                className="w-full h-96 lg:h-[500px] object-cover"
              />

              {/* Image Navigation */}
              {product.images?.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={() =>
                      setSelectedImage(
                        selectedImage > 0
                          ? selectedImage - 1
                          : product.images.length - 1
                      )
                    }
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={() =>
                      setSelectedImage(
                        selectedImage < product.images.length - 1
                          ? selectedImage + 1
                          : 0
                      )
                    }
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isFeatured && (
                  <Badge className="bg-[var(--medium)] text-white">
                    Featured
                  </Badge>
                )}
                {product.comparePrice &&
                  product.comparePrice > product.price && (
                    <Badge variant="destructive">
                      -
                      {Math.round(
                        ((product.comparePrice - product.price) /
                          product.comparePrice) *
                          100
                      )}
                      %
                    </Badge>
                  )}
                {currentStock === 0 && (
                  <Badge variant="secondary">Out of Stock</Badge>
                )}
                {currentStock <= product.lowStockThreshold &&
                  currentStock > 0 && (
                    <Badge className="bg-orange-500 text-white">
                      Low Stock
                    </Badge>
                  )}
              </div>
            </div>

            {/* Thumbnail Images */}
            {product.images?.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedImage(index)}
                    className={`relative overflow-hidden rounded-lg border-2 transition-all ${
                      selectedImage === index
                        ? "border-[var(--medium)]"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={image.url || "/placeholder.svg"}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{product.category?.name}</Badge>
                {product.brand && (
                  <Badge variant="secondary">{product.brand}</Badge>
                )}
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.ratings?.average || 0)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">
                    {(product.ratings?.average || 0).toFixed(1)} (
                    {product.ratings?.count || 0} reviews)
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="h-4 w-4" />
                  {product.soldCount || 0} sold
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-gray-900">
                  ${currentPrice.toLocaleString()}
                </span>
                {product.comparePrice &&
                  product.comparePrice > currentPrice && (
                    <span className="text-xl text-gray-500 line-through">
                      ${product.comparePrice.toLocaleString()}
                    </span>
                  )}
              </div>

              {product.comparePrice && product.comparePrice > currentPrice && (
                <p className="text-green-600 font-medium">
                  You save $
                  {(product.comparePrice - currentPrice).toLocaleString()}(
                  {Math.round(
                    ((product.comparePrice - currentPrice) /
                      product.comparePrice) *
                      100
                  )}
                  %)
                </p>
              )}
            </div>

            {/* Short Description */}
            {product.shortDescription && (
              <p className="text-gray-600 text-lg leading-relaxed">
                {product.shortDescription}
              </p>
            )}

            {/* Variants */}
            {product.variants?.length > 0 && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Options:</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {product.variants.map((variant, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedVariant(variant)}
                        className={`p-3 border rounded-lg text-left transition-all ${
                          selectedVariant?._id === variant._id
                            ? "border-[var(--medium)] bg-[var(--lightest)]"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="font-medium">
                          {variant.size && `Size: ${variant.size}`}
                          {variant.size && variant.color && " • "}
                          {variant.color && `Color: ${variant.color}`}
                        </div>
                        <div className="text-sm text-gray-600">
                          ${variant.price} • {variant.stock} in stock
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <div className="flex items-center border rounded-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      min="1"
                      max={currentStock}
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(
                          Math.max(1, Number.parseInt(e.target.value) || 1)
                        )
                      }
                      className="w-20 text-center border-0 focus:ring-0"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setQuantity(Math.min(currentStock, quantity + 1))
                      }
                      disabled={quantity >= currentStock}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  {currentStock} available
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={currentStock === 0}
                  className="flex-1 bg-[var(--medium)] hover:bg-[var(--dark)] text-white h-12"
                  size="lg"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {currentStock === 0 ? "Out of Stock" : "Add to Cart"}
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 px-4 bg-transparent"
                >
                  <Heart className="h-5 w-5" />
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 px-4 bg-transparent"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6 border-t border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[var(--lightest)] rounded-full flex items-center justify-center">
                  <Truck className="h-5 w-5 text-[var(--medium)]" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Free Shipping</div>
                  <div className="text-sm text-gray-600">
                    On orders over $50
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[var(--lightest)] rounded-full flex items-center justify-center">
                  <RotateCcw className="h-5 w-5 text-[var(--medium)]" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Easy Returns</div>
                  <div className="text-sm text-gray-600">
                    30-day return policy
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[var(--lightest)] rounded-full flex items-center justify-center">
                  <Shield className="h-5 w-5 text-[var(--medium)]" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    Secure Payment
                  </div>
                  <div className="text-sm text-gray-600">SSL encrypted</div>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">SKU:</span>
                <span className="font-medium">{product.sku}</span>
              </div>
              {product.brand && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Brand:</span>
                  <span className="font-medium">{product.brand}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Availability:</span>
                <span
                  className={`font-medium ${
                    currentStock > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {currentStock > 0 ? "In Stock" : "Out of Stock"}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Product Details Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16"
        >
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">
                Reviews ({product.ratings?.count || 0})
              </TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {product.description}
                    </p>

                    {product.features?.length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                          Key Features:
                        </h3>
                        <ul className="space-y-2">
                          {product.features.map((feature, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Zap className="h-4 w-4 text-[var(--medium)] mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="specifications" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  {product.specifications &&
                  Object.keys(product.specifications).length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(product.specifications).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="flex justify-between py-2 border-b border-gray-100"
                          >
                            <span className="font-medium text-gray-900">
                              {key}:
                            </span>
                            <span className="text-gray-700">{value}</span>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-600">
                      No specifications available for this product.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">
                {/* Reviews Summary */}
                <Card>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-gray-900 mb-2">
                          {(product.ratings?.average || 0).toFixed(1)}
                        </div>
                        <div className="flex items-center justify-center gap-1 mb-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-5 w-5 ${
                                i < Math.floor(product.ratings?.average || 0)
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-gray-600">
                          Based on {product.ratings?.count || 0} reviews
                        </p>
                      </div>

                      <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <div key={rating} className="flex items-center gap-2">
                            <span className="text-sm w-8">{rating}★</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-yellow-400 h-2 rounded-full"
                                style={{
                                  width: `${Math.random() * 100}%`, // Replace with actual data
                                }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600 w-8">
                              {Math.floor(Math.random() * 50)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Individual Reviews */}
                <div className="space-y-4">
                  {reviews?.data?.map((review, index) => (
                    <Card key={review._id}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-[var(--lightest)] rounded-full flex items-center justify-center">
                            <span className="font-medium text-[var(--medium)]">
                              {review.user?.name?.charAt(0) || "U"}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium text-gray-900">
                                {review.user?.name || "Anonymous"}
                              </span>
                              <div className="flex items-center gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating
                                        ? "text-yellow-400 fill-current"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-600">
                                {new Date(
                                  review.createdAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-gray-700">{review.comment}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Write Review Button */}
                <Card>
                  <CardContent className="p-6 text-center">
                    <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Share your experience
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Help others make informed decisions by writing a review.
                    </p>
                    <Button className="bg-[var(--medium)] hover:bg-[var(--dark)]">
                      Write a Review
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="shipping" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Shipping Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">
                            Standard Shipping
                          </h4>
                          <p className="text-gray-600 mb-2">
                            5-7 business days
                          </p>
                          <p className="text-gray-600">
                            Free on orders over $50
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">
                            Express Shipping
                          </h4>
                          <p className="text-gray-600 mb-2">
                            2-3 business days
                          </p>
                          <p className="text-gray-600">$9.99</p>
                        </div>
                      </div>
                    </div>

                    {product.weight?.value && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">
                          Product Weight
                        </h4>
                        <p className="text-gray-600">
                          {product.weight.value} {product.weight.unit}
                        </p>
                      </div>
                    )}

                    {product.dimensions?.length && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">
                          Dimensions
                        </h4>
                        <p className="text-gray-600">
                          {product.dimensions.length} ×{" "}
                          {product.dimensions.width} ×{" "}
                          {product.dimensions.height} {product.dimensions.unit}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Related Products */}
        {relatedProducts?.data?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.data.map((relatedProduct, index) => (
                <motion.div
                  key={relatedProduct._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300">
                    <Link to={`/products/${relatedProduct.slug}`}>
                      <img
                        src={
                          relatedProduct.images?.[0]?.url ||
                          "/placeholder.svg?height=200&width=200"
                        }
                        alt={relatedProduct.name}
                        className="w-full h-48 object-cover"
                      />
                    </Link>
                    <CardContent className="p-4">
                      <Link to={`/products/${relatedProduct.slug}`}>
                        <h3 className="font-semibold text-gray-900 hover:text-[var(--medium)] transition-colors line-clamp-2 mb-2">
                          {relatedProduct.name}
                        </h3>
                      </Link>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">
                          ${relatedProduct.price.toLocaleString()}
                        </span>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">
                            {(relatedProduct.ratings?.average || 0).toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
