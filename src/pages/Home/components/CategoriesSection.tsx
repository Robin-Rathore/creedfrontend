import type React from "react"
import { Link } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Droplets, Utensils, Coffee, Package } from "lucide-react"
import { useCategories } from "@/queries/hooks/category/useCategories"

export const CategoriesSection: React.FC = () => {
  const { data: categories, isLoading } = useCategories({ featured: true })

  const categoryIcons = {
    "Water Bottles": Droplets,
    "Lunch Boxes": Utensils,
    "Coffee Mugs": Coffee,
    default: Package,
  }

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our carefully curated categories of premium products designed for your lifestyle
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardContent className="p-0">
                  <div className="h-48 bg-muted"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-full"></div>
                    <div className="h-10 bg-muted rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our carefully curated categories of premium products designed for your lifestyle
          </p>
        </div>

        {categories && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.slice(0, 6).map((category) => {
              const IconComponent = categoryIcons[category.name as keyof typeof categoryIcons] || categoryIcons.default
              return (
                <Card key={category._id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative h-48 bg-gradient-to-br from-primary/10 to-accent/10">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <IconComponent className="h-16 w-16 text-primary group-hover:scale-110 transition-transform" />
                      </div>
                      {category.productCount > 0 && (
                        <Badge className="absolute top-4 right-4">{category.productCount} items</Badge>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {category.description || `Discover our premium ${category.name.toLowerCase()} collection`}
                      </p>
                      <Button
                        variant="outline"
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors bg-transparent"
                        asChild
                      >
                        <Link to={`/categories/${category.slug}`}>Explore Collection</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
