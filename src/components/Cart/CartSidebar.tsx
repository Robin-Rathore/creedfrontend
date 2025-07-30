//@ts-nocheck

import type React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { X, Plus, Minus, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useAtom } from 'jotai';
import {
  cartItemsAtom,
  cartSubtotalAtom,
  updateCartItemAtom,
  removeFromCartAtom,
} from '@/queries/store/cart';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({
  isOpen,
  onClose,
}) => {
  const [cartItems] = useAtom(cartItemsAtom);
  const [cartSubtotal] = useAtom(cartSubtotalAtom);
  const [, updateCartItem] = useAtom(updateCartItemAtom);
  const [, removeFromCart] = useAtom(removeFromCartAtom);
  const [promoCode, setPromoCode] = useState('');

  const calculateGST = () => {
    let totalGST = 0;

    cartItems.forEach((item) => {
      // Get the GST rate from the product (12% or 18%)
      const gstRate = item.product.gst || 18; // Default to 18% if not specified

      // Calculate GST for this item
      const itemGST = (item.itemTotal * gstRate) / 100;
      totalGST += itemGST;
    });

    return Math.round(totalGST); // Round to nearest rupee
  };

  console.log('Cart Items:', cartItems);

  // Get detailed GST breakdown by rate
  const getGSTBreakdown = () => {
    const gstBreakdown = { 12: 0, 18: 0 };

    cartItems.forEach((item) => {
      const gstRate = item.product.gst || 18;
      const itemGST = (item.itemTotal * gstRate) / 100;

      if (gstRate === 12) {
        gstBreakdown[12] += itemGST;
      } else {
        gstBreakdown[18] += itemGST;
      }
    });

    return {
      gst12: Math.round(gstBreakdown[12]),
      gst18: Math.round(gstBreakdown[18]),
      total: Math.round(gstBreakdown[12] + gstBreakdown[18]),
    };
  };

  // Replace the existing tax calculation
  const tax = calculateGST();
  const gstBreakdown = getGSTBreakdown();

  const shippingCost = 59;
  const total = cartSubtotal + shippingCost + tax;

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateCartItem({ itemId, quantity: newQuantity });
  };

  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-[var(--lightest)] to-white">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-[var(--medium)]" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Cart ({cartItems.length})
                </h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden flex flex-col">
              {cartItems.length === 0 ? (
                /* Empty State */
                <div className="flex-1 flex items-center justify-center p-6">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                      <ShoppingBag className="h-8 w-8 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Your cart is empty
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Add some products to get started
                      </p>
                      <Button
                        onClick={onClose}
                        className="bg-[var(--medium)] hover:bg-[var(--dark)] text-white"
                        asChild
                      >
                        <Link to="/products">Browse Products</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Cart Items */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    <AnimatePresence>
                      {cartItems.map((item) => (
                        <motion.div
                          key={item._id}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex gap-4 p-4 bg-gray-50 rounded-lg"
                        >
                          {/* Product Image */}
                          <Link
                            to={`/products/${item.product.slug}`}
                            onClick={onClose}
                            className="flex-shrink-0"
                          >
                            <img
                              src={
                                item.product.images?.[0]?.url ||
                                '/placeholder.svg?height=80&width=80'
                              }
                              alt={item.product.name}
                              className="w-16 h-16 object-cover rounded-lg hover:scale-105 transition-transform"
                            />
                          </Link>

                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <Link
                              to={`/products/${item.product.slug}`}
                              onClick={onClose}
                              className="block"
                            >
                              <h3 className="font-medium text-gray-900 hover:text-[var(--medium)] transition-colors line-clamp-2">
                                {item.product.name}
                              </h3>
                            </Link>

                            {/* Variants */}
                            {(item.size || item.color) && (
                              <div className="flex gap-2 mt-1">
                                {item.size && (
                                  <Badge variant="outline" className="text-xs">
                                    Size: {item.size}
                                  </Badge>
                                )}
                                {item.color && (
                                  <Badge variant="outline" className="text-xs">
                                    Color: {item.color}
                                  </Badge>
                                )}
                              </div>
                            )}

                            {/* Price and Quantity */}
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleQuantityChange(
                                      item._id,
                                      item.quantity - 1
                                    )
                                  }
                                  disabled={item.quantity <= 1}
                                  className="h-7 w-7 p-0"
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center text-sm font-medium">
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleQuantityChange(
                                      item._id,
                                      item.quantity + 1
                                    )
                                  }
                                  disabled={item.quantity >= item.product.stock}
                                  className="h-7 w-7 p-0"
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>

                              <div className="text-right">
                                <div className="font-semibold text-gray-900">
                                  ${item.itemTotal.toFixed(2)}
                                </div>
                                <div className="text-xs text-gray-600">
                                  ${item.product.price.toFixed(2)} each
                                </div>
                              </div>
                            </div>

                            {/* Remove Button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveItem(item._id)}
                              className="mt-2 h-7 text-red-600 hover:text-red-700 hover:bg-red-50 p-0 justify-start"
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Remove
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Footer */}
                  <div className="border-t bg-white p-6 space-y-4">
                    {/* Promo Code */}
                    {/* <div className="flex gap-2">
                      <Input
                        placeholder="Promo code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        className="border-[var(--medium)] text-[var(--medium)] hover:bg-[var(--lightest)] bg-transparent"
                      >
                        Apply
                      </Button>
                    </div> */}

                    {/* Order Summary */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">
                          ${cartSubtotal.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping</span>
                        <span className="font-medium">59.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax</span>
                        <span className="font-medium">${tax.toFixed(2)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-base font-semibold">
                        <span>Total</span>
                        <span className="text-[var(--medium)]">
                          ${total.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Free Shipping Progress */}
                    {/* {shipping > 0 && (
                      <div className="bg-blue-50 rounded-lg p-3">
                        {/* <div className="flex justify-between text-sm mb-2">
                          <span className="text-blue-800 font-medium">
                            Free shipping at $50
                          </span>
                          <span className="font-medium text-blue-600">
                            ${(50 - cartSubtotal).toFixed(2)} to go
                          </span>
                        </div> */}
                    {/* <div className="w-full bg-blue-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${Math.min(
                                (cartSubtotal / 50) * 100,
                                100
                              )}%`,
                            }}
                          ></div>
                        </div> */}
                    {/* </div> */}
                    {/* )} */}

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <Button
                        className="w-full bg-[var(--medium)] hover:bg-[var(--dark)] text-white h-12 group"
                        asChild
                      >
                        <Link to="/checkout" onClick={onClose}>
                          Checkout
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full border-[var(--medium)] text-[var(--medium)] hover:bg-[var(--lightest)] bg-transparent"
                        asChild
                      >
                        <Link to="/cart" onClick={onClose}>
                          View Full Cart
                        </Link>
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
