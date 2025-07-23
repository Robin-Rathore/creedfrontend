//@ts-nocheck

import type React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Heart,
  Package,
  LogOut,
  Settings,
  Shield,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/queries/hooks/auth/useAuth";
import { useLogout } from "@/queries/hooks/auth/useAuth";
import { useAtom } from "jotai";
import { cartCountAtom } from "@/queries/store/cart";
import { CartSidebar } from "@/components/Cart";

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showHeader, setShowHeader] = useState(true);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const logoutMutation = useLogout();
  const [cartCount] = useAtom(cartCountAtom);

  // Handle scroll behavior for mobile
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setIsScrolled(currentScrollY > 10);

      // Only apply hide/show behavior on mobile
      if (window.innerWidth < 768) {
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setShowHeader(false);
        } else {
          setShowHeader(true);
        }
      } else {
        setShowHeader(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleProfileClick = () => {
    if (user?.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/profile");
    }
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/categories", label: "Categories" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: showHeader ? 0 : -100 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`fixed top-0 left-0 right-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50"
            : "bg-white/80 backdrop-blur-sm border-b border-gray-100"
        }`}
      >
        <div className="container mx-auto px-4">
          {/* Main Header */}
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/" className="flex items-center space-x-2">
                <div className="relative">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--medium)] to-[var(--dark)] text-white shadow-lg">
                    <Package className="h-5 w-5" />
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-br from-[var(--medium)] to-[var(--dark)] rounded-xl blur opacity-20"></div>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-[var(--medium)] to-[var(--dark)] bg-clip-text text-transparent">
                  AquaStore
                </span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <motion.div
                  key={link.href}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                >
                  <Link
                    to={link.href}
                    className="relative text-sm font-medium text-gray-700 hover:text-[var(--medium)] transition-all duration-200 group"
                  >
                    {link.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[var(--medium)] to-[var(--dark)] transition-all duration-200 group-hover:w-full"></span>
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Desktop Search Bar */}
            <div className="hidden lg:flex flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="relative w-full group">
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--medium)]/20 to-[var(--dark)]/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--medium)] transition-colors" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm pl-12 pr-4 py-3 text-sm placeholder:text-gray-400 focus:border-[var(--medium)] focus:outline-none focus:ring-2 focus:ring-[var(--medium)]/20 transition-all duration-200"
                  />
                </div>
              </form>
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-2">
              {/* Wishlist */}
              {isAuthenticated && (
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative group"
                    asChild
                  >
                    <Link to="/wishlist">
                      <Heart className="h-5 w-5 text-gray-600 group-hover:text-red-500 transition-colors" />
                    </Link>
                  </Button>
                </motion.div>
              )}

              {/* Cart */}
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative group"
                  onClick={() => setIsCartOpen(true)}
                >
                  <ShoppingCart className="h-5 w-5 text-gray-600 group-hover:text-[var(--medium)] transition-colors" />
                  {cartCount > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2"
                    >
                      <Badge className="h-5 w-5 rounded-full p-0 text-xs bg-gradient-to-r from-[var(--medium)] to-[var(--dark)] border-0 shadow-lg">
                        {cartCount > 99 ? "99+" : cartCount}
                      </Badge>
                    </motion.div>
                  )}
                </Button>
              </motion.div>

              {/* User Menu */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="relative group"
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--medium)] to-[var(--dark)] flex items-center justify-center text-white text-sm font-medium shadow-lg">
                          {user?.firstName?.charAt(0) || "U"}
                        </div>
                      </Button>
                    </motion.div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-64 p-2 bg-white/95 backdrop-blur-md border border-gray-200/50 shadow-xl"
                  >
                    <div className="px-3 py-2 bg-gradient-to-r from-[var(--lightest)] to-white rounded-lg mb-2">
                      <p className="text-sm font-semibold text-gray-900">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-gray-600">{user?.email}</p>
                      {user?.role === "admin" && (
                        <Badge className="mt-1 bg-gradient-to-r from-[var(--medium)] to-[var(--dark)] text-white text-xs">
                          <Shield className="w-3 h-3 mr-1" />
                          Admin
                        </Badge>
                      )}
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleProfileClick}
                      className="cursor-pointer group"
                    >
                      <User className="mr-3 h-4 w-4 text-gray-500 group-hover:text-[var(--medium)]" />
                      {user?.role === "admin" ? "Admin Dashboard" : "Profile"}
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/orders" className="cursor-pointer group">
                        <Package className="mr-3 h-4 w-4 text-gray-500 group-hover:text-[var(--medium)]" />
                        Orders
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/wishlist" className="cursor-pointer group">
                        <Heart className="mr-3 h-4 w-4 text-gray-500 group-hover:text-red-500" />
                        Wishlist
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="cursor-pointer group">
                        <Settings className="mr-3 h-4 w-4 text-gray-500 group-hover:text-[var(--medium)]" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer text-red-600 group"
                    >
                      <LogOut className="mr-3 h-4 w-4 group-hover:text-red-700" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden md:flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    className="text-gray-700 hover:text-[var(--medium)]"
                    asChild
                  >
                    <Link to="/login">Login</Link>
                  </Button>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      className="bg-gradient-to-r from-[var(--medium)] to-[var(--dark)] hover:from-[var(--dark)] hover:to-[var(--medium)] text-white shadow-lg"
                      asChild
                    >
                      <Link to="/signup">Sign Up</Link>
                    </Button>
                  </motion.div>
                </div>
              )}

              {/* Mobile menu button */}
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <AnimatePresence mode="wait">
                    {isMenuOpen ? (
                      <motion.div
                        key="close"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <X className="h-5 w-5" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="menu"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Menu className="h-5 w-5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden border-t border-gray-200/50 bg-white/95 backdrop-blur-md overflow-hidden"
            >
              <div className="container mx-auto px-4 py-4">
                {/* Mobile Search */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mb-4"
                >
                  <form onSubmit={handleSearch} className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 py-3 text-sm focus:border-[var(--medium)] focus:outline-none focus:ring-2 focus:ring-[var(--medium)]/20"
                    />
                  </form>
                </motion.div>

                {/* Mobile Navigation Links */}
                <nav className="space-y-2">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                    >
                      <Link
                        to={link.href}
                        className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-[var(--medium)] hover:bg-[var(--lightest)] rounded-lg transition-all duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}

                  {!isAuthenticated && (
                    <>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <Link
                          to="/login"
                          className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-[var(--medium)] hover:bg-[var(--lightest)] rounded-lg transition-all duration-200"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Login
                        </Link>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.45 }}
                      >
                        <Link
                          to="/signup"
                          className="block px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-[var(--medium)] to-[var(--dark)] rounded-lg hover:from-[var(--dark)] hover:to-[var(--medium)] transition-all duration-200"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Sign Up
                        </Link>
                      </motion.div>
                    </>
                  )}
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Spacer to prevent content from hiding behind fixed header */}
      <div className="h-16"></div>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};
