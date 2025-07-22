//@ts-nocheck

import type React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Grid3X3, List, ArrowRight, Package } from "lucide-react";
import { useCategories } from "@/queries/hooks/category";

export const Categories: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const { data: categories, isLoading } = useCategories();

  const filteredCategories = categories?.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const popularCategories = categories?.filter(
    (category) => category.isPopular
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="h-48 bg-gray-200 rounded-lg"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Categories</h1>
          <p className="text-gray-600">
            Explore our product categories and find exactly what you need
          </p>
        </motion.div>

        {/* Search and View Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={
                  viewMode === "grid"
                    ? "bg-[var(--medium)] hover:bg-[var(--dark)]"
                    : ""
                }
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={
                  viewMode === "list"
                    ? "bg-[var(--medium)] hover:bg-[var(--dark)]"
                    : ""
                }
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Popular Categories */}
        {popularCategories && popularCategories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Popular Categories
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularCategories.map((category, index) => (
                <motion.div
                  key={category._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 group">
                    <Link to={`/categories/${category.slug}`}>
                      <div className="relative">
                        <img
                          src={
                            category.image?.url ||
                            "/placeholder.svg?height=200&width=300&query=category"
                          }
                          alt={category.name}
                          className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                        <Badge className="absolute top-3 left-3 bg-[var(--medium)] text-white">
                          Popular
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-gray-900 group-hover:text-[var(--medium)] transition-colors mb-1">
                          {category.name}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                          {category.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            {category.productCount || 0} products
                          </span>
                          <ArrowRight className="h-4 w-4 text-[var(--medium)] group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* All Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">All Categories</h2>
            <span className="text-gray-600">
              {filteredCategories?.length || 0} categories
            </span>
          </div>

          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCategories?.map((category, index) => (
                <motion.div
                  key={category._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 group">
                    <Link to={`/categories/${category.slug}`}>
                      <div className="relative">
                        <img
                          src={
                            category.image?.url ||
                            "/placeholder.svg?height=200&width=300&query=category"
                          }
                          alt={category.name}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                        {category.isPopular && (
                          <Badge className="absolute top-3 left-3 bg-[var(--medium)] text-white">
                            Popular
                          </Badge>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-gray-900 group-hover:text-[var(--medium)] transition-colors mb-2">
                          {category.name}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                          {category.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            {category.productCount || 0} products
                          </span>
                          <ArrowRight className="h-4 w-4 text-[var(--medium)] group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCategories?.map((category, index) => (
                <motion.div
                  key={category._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * index }}
                >
                  <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 group">
                    <CardContent className="p-4">
                      <Link
                        to={`/categories/${category.slug}`}
                        className="flex items-center gap-4"
                      >
                        <img
                          src={
                            category.image?.url ||
                            "/placeholder.svg?height=80&width=80&query=category"
                          }
                          alt={category.name}
                          className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900 group-hover:text-[var(--medium)] transition-colors">
                              {category.name}
                            </h3>
                            {category.isPopular && (
                              <Badge className="bg-[var(--medium)] text-white text-xs">
                                Popular
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-1 mb-2">
                            {category.description}
                          </p>
                          <span className="text-sm text-gray-500">
                            {category.productCount || 0} products
                          </span>
                        </div>
                        <ArrowRight className="h-5 w-5 text-[var(--medium)] group-hover:translate-x-1 transition-transform flex-shrink-0" />
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Empty State */}
        {filteredCategories?.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Package className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No categories found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms
            </p>
            <Button
              onClick={() => setSearchQuery("")}
              className="bg-[var(--medium)] hover:bg-[var(--dark)]"
            >
              Clear Search
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
