//@ts-nocheck

import type React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Grid3X3,
  List,
  ArrowRight,
  Package,
  TrendingUp,
  Eye,
} from "lucide-react";
import { useCategories } from "@/queries/hooks/category";

type CategoriesProps = {};

export const Categories: React.FC<CategoriesProps> = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const { data: categories, isLoading } = useCategories({
    search: searchQuery || undefined,
    sort: `${sortOrder === "desc" ? "-" : ""}${sortBy}`,
  });

  const filteredCategories =
    categories?.filter(
      (category) =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.description?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const CategoryCard = ({
    category,
    index,
  }: {
    category: any;
    index: number;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Card className="overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 h-full">
        <div className="relative overflow-hidden">
          <Link to={`/categories/${category.slug}`}>
            <img
              src={
                category.image?.url ||
                `/placeholder.svg?height=200&width=300&text=${category.name}`
              }
              alt={category.name}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </Link>

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Category Stats */}
          <div className="absolute top-3 right-3">
            <Badge className="bg-white/90 text-gray-900">
              {category.productCount || 0} products
            </Badge>
          </div>

          {/* View Button */}
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Link to={`/categories/${category.slug}`}>
              <Button
                size="sm"
                className="bg-white text-gray-900 hover:bg-gray-100"
              >
                <Eye className="h-4 w-4 mr-2" />
                View
              </Button>
            </Link>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <Link to={`/categories/${category.slug}`}>
                <h3 className="text-xl font-semibold text-gray-900 hover:text-[var(--medium)] transition-colors group-hover:text-[var(--medium)]">
                  {category.name}
                </h3>
              </Link>

              {category.isPopular && (
                <Badge className="bg-[var(--medium)] text-white">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Popular
                </Badge>
              )}
            </div>

            {category.description && (
              <p className="text-gray-600 text-sm line-clamp-2">
                {category.description}
              </p>
            )}

            {/* Subcategories */}
            {category.subcategories?.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-900">
                  Subcategories:
                </h4>
                <div className="flex flex-wrap gap-1">
                  {category.subcategories.slice(0, 3).map((sub) => (
                    <Link
                      key={sub._id}
                      to={`/categories/${sub.slug}`}
                      className="text-xs text-gray-600 hover:text-[var(--medium)] transition-colors"
                    >
                      {sub.name}
                    </Link>
                  ))}
                  {category.subcategories.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{category.subcategories.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Package className="h-4 w-4" />
                {category.productCount || 0} products
              </div>

              <Link to={`/categories/${category.slug}`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[var(--medium)] hover:text-[var(--dark)] p-0"
                >
                  Explore
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const CategoryListItem = ({
    category,
    index,
  }: {
    category: any;
    index: number;
  }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group"
    >
      <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex gap-6">
            <Link to={`/categories/${category.slug}`} className="flex-shrink-0">
              <img
                src={
                  category.image?.url ||
                  `/placeholder.svg?height=80&width=80&text=${category.name}`
                }
                alt={category.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
            </Link>

            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <Link to={`/categories/${category.slug}`}>
                    <h3 className="text-xl font-semibold text-gray-900 hover:text-[var(--medium)] transition-colors">
                      {category.name}
                    </h3>
                  </Link>
                  {category.description && (
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {category.isPopular && (
                    <Badge className="bg-[var(--medium)] text-white">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Popular
                    </Badge>
                  )}
                  <Badge variant="outline">
                    {category.productCount || 0} products
                  </Badge>
                </div>
              </div>

              {category.subcategories?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {category.subcategories.slice(0, 5).map((sub) => (
                    <Link
                      key={sub._id}
                      to={`/categories/${sub.slug}`}
                      className="text-xs bg-gray-100 hover:bg-[var(--lightest)] text-gray-700 px-2 py-1 rounded transition-colors"
                    >
                      {sub.name}
                    </Link>
                  ))}
                  {category.subcategories.length > 5 && (
                    <span className="text-xs text-gray-500 px-2 py-1">
                      +{category.subcategories.length - 5} more
                    </span>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Package className="h-4 w-4" />
                    {category.productCount || 0} products
                  </div>
                </div>

                <Link to={`/categories/${category.slug}`}>
                  <Button className="bg-[var(--medium)] hover:bg-[var(--dark)] text-white">
                    <Eye className="h-4 w-4 mr-2" />
                    View Category
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
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
            Browse our product categories to find exactly what you're looking
            for
          </p>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Sort */}
            <Select
              value={`${sortBy}-${sortOrder}`}
              onValueChange={(value) => {
                const [newSortBy, newSortOrder] = value.split("-");
                setSortBy(newSortBy);
                setSortOrder(newSortOrder);
              }}
            >
              <SelectTrigger className="w-full lg:w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Name: A to Z</SelectItem>
                <SelectItem value="name-desc">Name: Z to A</SelectItem>
                <SelectItem value="productCount-desc">Most Products</SelectItem>
                <SelectItem value="productCount-asc">Least Products</SelectItem>
                <SelectItem value="createdAt-desc">Newest First</SelectItem>
                <SelectItem value="createdAt-asc">Oldest First</SelectItem>
              </SelectContent>
            </Select>

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

        {/* Results Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between mb-6"
        >
          <p className="text-gray-600">
            Showing {filteredCategories.length} categories
          </p>
        </motion.div>

        {/* Categories Grid/List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredCategories.map((category, index) => (
                  <CategoryCard
                    key={category._id}
                    category={category}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {filteredCategories.map((category, index) => (
                  <CategoryListItem
                    key={category._id}
                    category={category}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        {/* Empty State */}
        {filteredCategories.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No categories found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria
            </p>
            <Button
              onClick={() => setSearchQuery("")}
              className="bg-[var(--medium)] hover:bg-[var(--dark)]"
            >
              Clear Search
            </Button>
          </motion.div>
        )}

        {/* Popular Categories Section */}
        {!searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Popular Categories
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories
                ?.filter((cat) => cat.isPopular)
                .slice(0, 6)
                .map((category, index) => (
                  <motion.div
                    key={category._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ scale: 1.05 }}
                    className="group"
                  >
                    <Link to={`/categories/${category.slug}`}>
                      <Card className="overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 text-center">
                        <CardContent className="p-4">
                          <div className="w-16 h-16 mx-auto mb-3 bg-[var(--lightest)] rounded-full flex items-center justify-center group-hover:bg-[var(--lighter)] transition-colors">
                            <img
                              src={
                                category.image?.url ||
                                `/placeholder.svg?height=32&width=32&text=${category.name.charAt(
                                  0
                                )}`
                              }
                              alt={category.name}
                              className="w-8 h-8 object-cover rounded"
                            />
                          </div>
                          <h3 className="font-medium text-gray-900 group-hover:text-[var(--medium)] transition-colors text-sm">
                            {category.name}
                          </h3>
                          <p className="text-xs text-gray-600 mt-1">
                            {category.productCount || 0} products
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
