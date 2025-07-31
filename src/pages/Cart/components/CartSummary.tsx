//@ts-nocheck

import type React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  ShoppingCart,
  ArrowRight,
  Truck,
  Shield,
  RotateCcw,
  Tag,
} from 'lucide-react';
import { useAtom } from 'jotai';
import { cartItemsAtom, cartSubtotalAtom } from '@/queries/store/cart';

export const CartSummary: React.FC = () => {
  const [cartItems] = useAtom(cartItemsAtom);
  const [cartSubtotal] = useAtom(cartSubtotalAtom);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    discount: number;
  } | null>(null);

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

  const shipping = 59.0; // Fixed shipping cost for simplicity
  // const promoDiscount = appliedPromo ? appliedPromo.discount : 0;
  const total = cartSubtotal + shipping + tax;

  const handleApplyPromo = () => {
    // Mock promo code validation
    const validCodes = {
      SAVE10: 10,
      WELCOME20: 20,
      FIRST15: 15,
    };

    if (validCodes[promoCode.toUpperCase()]) {
      setAppliedPromo({
        code: promoCode.toUpperCase(),
        discount: validCodes[promoCode.toUpperCase()],
      });
      setPromoCode('');
    } else {
      // Handle invalid promo code
      alert('Invalid promo code');
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
  };

  if (cartItems.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Order Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-0 shadow-lg sticky top-24">
          <CardHeader className="bg-gradient-to-r from-[var(--lightest)] to-white">
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-[var(--medium)]" />
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {/* Promo Code */}
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={handleApplyPromo}
                  disabled={!promoCode.trim()}
                  variant="outline"
                  className="border-[var(--medium)] text-[var(--medium)] hover:bg-[var(--lightest)] bg-transparent"
                >
                  Apply
                </Button>
              </div>

              {appliedPromo && (
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      {appliedPromo.code} Applied
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRemovePromo}
                    className="text-green-600 hover:text-green-700 h-6 px-2"
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>

            <Separator />

            {/* Order Totals */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  Subtotal ({cartItems.length} items)
                </span>
                <span className="font-medium">₹{cartSubtotal.toFixed(2)}</span>
              </div>

              {appliedPromo && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Promo Discount</span>
                  <span className="font-medium text-green-600">
                    -₹{promoDiscount.toFixed(2)}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {shipping === 0 ? (
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      Free
                    </Badge>
                  ) : (
                    `₹${shipping.toFixed(2)}`
                  )}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">₹{tax.toFixed(2)}</span>
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-[var(--medium)]">
                  ₹{total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Free Shipping Progress */}
            {/* {shipping > 0 && ( */}
            {/* <div className="p-4 bg-blue-50 rounded-lg"> */}
            {/* <div className="flex justify-between text-sm mb-2">
                  <span className="text-blue-800 font-medium">
                    Free shipping at $50
                  </span>
                  <span className="text-blue-600 font-semibold">
                    ${(50 - cartSubtotal).toFixed(2)} to go
                  </span>
                </div> */}
            {/* <div className="w-full bg-blue-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min((cartSubtotal / 50) * 100, 100)}%`,
                    }}
                  ></div>
                </div> */}
            {/* </div> */}
            {/* )} */}

            {/* Checkout Button */}
            <Button
              className="w-full bg-[var(--medium)] hover:bg-[var(--dark)] text-white h-12 text-lg group"
              asChild
            >
              <Link to="/checkout">
                Proceed to Checkout
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>

            {/* Continue Shopping */}
            <Button
              variant="outline"
              className="w-full border-[var(--medium)] text-[var(--medium)] hover:bg-[var(--lightest)] bg-transparent"
              asChild
            >
              <Link to="/products">Continue Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Security Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Truck className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Free Shipping</p>
                  <p className="text-sm text-gray-600">On orders over ₹50</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <RotateCcw className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Easy Returns</p>
                  <p className="text-sm text-gray-600">30-day return policy</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Secure Payment</p>
                  <p className="text-sm text-gray-600">
                    SSL encrypted checkout
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
