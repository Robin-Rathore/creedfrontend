//@ts-nocheck

import type React from 'react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CreditCard, Truck, Shield, Banknote, Loader2 } from 'lucide-react';
import { useAtom } from 'jotai';
import { cartItemsAtom, cartSubtotalAtom } from '@/queries/store/cart';
import { useAddresses } from '@/queries/hooks/user/useAddresses';
import { useProfile } from '@/queries/hooks/user/useProfile';
import { useCreateOrder } from '@/queries/hooks/order/useOrderMutations';
import {
  useCreateRazorpayOrder,
  useVerifyRazorpayPayment,
  useProcessCODOrder,
} from '@/queries/hooks/payment/usePayment';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  paymentMethod: 'razorpay' | 'cod';
  shippingMethod: string;
  couponCode?: string;
  notes?: string;
}

export const CheckoutForm: React.FC = () => {
  const [cartItems] = useAtom(cartItemsAtom);
  const [cartSubtotal] = useAtom(cartSubtotalAtom);
  const { data: addresses } = useAddresses();
  const { data: profile } = useProfile();
  const navigate = useNavigate();

  const createOrderMutation = useCreateOrder();
  const createRazorpayOrderMutation = useCreateRazorpayOrder();
  const verifyRazorpayPaymentMutation = useVerifyRazorpayPayment();
  const processCODOrderMutation = useProcessCODOrder();

  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    paymentMethod: 'razorpay',
    shippingMethod: 'standard',
    couponCode: '',
    notes: '',
  });

  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);

  // Load user profile data
  useEffect(() => {
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email || '',
        phone: profile.phone || '',
      }));
    }
  }, [profile]);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const shippingOptions = [
    {
      id: 'standard',
      name: 'Standard Shipping',
      price: 59,
      time: '5-7 business days',
      description: 'can deliver before the expected date',
    },
    // {
    //   id: 'express',
    //   name: 'Express Shipping',
    //   price: 79,
    //   time: '2-3 business days',
    //   description: 'Fast delivery',
    // },
    // {
    //   id: 'overnight',
    //   name: 'Overnight Shipping',
    //   price: 99,
    //   time: '1 business day',
    //   description: 'Next day delivery',
    // },
  ];

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

  const selectedShipping = shippingOptions.find(
    (option) => option.id === formData.shippingMethod
  );
  const shippingCost =
    cartSubtotal >= 500 && formData.shippingMethod === 'standard'
      ? 0
      : selectedShipping?.price || 0;
  const total = cartSubtotal + shippingCost + tax - couponDiscount;

  const handleAddressSelect = (addressId: string) => {
    const address = addresses?.find((addr) => addr._id === addressId);
    if (address) {
      setFormData({
        ...formData,
        firstName: address.firstName,
        lastName: address.lastName,
        company: address.company || '',
        address1: address.address1,
        address2: address.address2 || '',
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
        country: address.country,
        phone: address.phone || formData.phone,
      });
      setSelectedAddress(addressId);
    }
  };

  const createOrder = async () => {
    const orderData = {
      items: cartItems.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
      })),
      shippingAddress: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        company: formData.company,
        address1: formData.address1,
        address2: formData.address2,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: formData.country,
        phone: formData.phone,
      },
      billingAddress: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        company: formData.company,
        address1: formData.address1,
        address2: formData.address2,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: formData.country,
        phone: formData.phone,
      },
      paymentMethod: formData.paymentMethod,
      couponCode: formData.couponCode,
      shippingMethod: formData.shippingMethod,
      notes: formData.notes,
    };

    return await createOrderMutation.mutateAsync(orderData);
  };

  const handleRazorpayPayment = async () => {
    try {
      setIsProcessing(true);

      // Create order first
      const order = await createOrder();

      // Create Razorpay order
      const razorpayOrder = await createRazorpayOrderMutation.mutateAsync({
        amount: total,
        currency: 'INR',
        orderId: order._id,
      });

      console.log('Razorpay Order Response:', razorpayOrder); // Debug log

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'Creed Store',
        description: 'Order Payment',
        order_id: razorpayOrder.razorpayOrderId, // ← Changed from .id to .razorpayOrderId
        handler: async (response: any) => {
          try {
            console.log('Full Payment Response:', response);
            console.log('Available keys:', Object.keys(response));

            await verifyRazorpayPaymentMutation.mutateAsync({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: order._id,
            });

            toast.success('Payment successful!');
            navigate(`/orders/${order._id}`);
          } catch (error) {
            console.error('Verification Error:', error);
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#3b82f6',
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      setIsProcessing(false);
      toast.error('Failed to initiate payment');
    }
  };

  const handleCODPayment = async () => {
    try {
      setIsProcessing(true);

      // Create order
      const order = await createOrder();

      // Process COD order
      await processCODOrderMutation.mutateAsync({
        orderId: order._id,
      });

      toast.success('Order placed successfully!');
      navigate(`/orders/${order._id}`);
    } catch (error) {
      setIsProcessing(false);
      toast.error('Failed to place order');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (formData.paymentMethod === 'razorpay') {
      await handleRazorpayPayment();
    } else {
      await handleCODPayment();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Form */}
      <div className="lg:col-span-2 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Shipping Information */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-white">
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-600" />
                Shipping Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {/* Saved Addresses */}
              {addresses && addresses.length > 0 && (
                <div className="space-y-3">
                  <Label>Choose from saved addresses</Label>
                  <div className="grid grid-cols-1 gap-3">
                    {addresses.map((address) => (
                      <div
                        key={address._id}
                        onClick={() => handleAddressSelect(address._id)}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedAddress === address._id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">
                              {address.firstName} {address.lastName}
                            </p>
                            <p className="text-sm text-gray-600">
                              {address.address1}, {address.city},{' '}
                              {address.state} {address.postalCode}
                            </p>
                          </div>
                          <Badge className="bg-blue-600 text-white">
                            {address.type}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Separator />
                  <p className="text-sm text-gray-600">
                    Or enter a new address below
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="company">Company (Optional)</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address1">Address Line 1 *</Label>
                  <Input
                    id="address1"
                    value={formData.address1}
                    onChange={(e) =>
                      setFormData({ ...formData, address1: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address2">Address Line 2 (Optional)</Label>
                  <Input
                    id="address2"
                    value={formData.address2}
                    onChange={(e) =>
                      setFormData({ ...formData, address2: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code *</Label>
                  <Input
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={(e) =>
                      setFormData({ ...formData, postalCode: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country *</Label>
                  <Select
                    value={formData.country}
                    onValueChange={(value) =>
                      setFormData({ ...formData, country: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="India">India</SelectItem>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="UK">United Kingdom</SelectItem>
                      <SelectItem value="CA">Canada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Methods */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-white">
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-600" />
                Shipping Method
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <RadioGroup
                value={formData.shippingMethod}
                onValueChange={(value) =>
                  setFormData({ ...formData, shippingMethod: value })
                }
                className="space-y-3"
              >
                {shippingOptions.map((option) => (
                  <div
                    key={option.id}
                    className="flex items-center space-x-3 p-4 border rounded-lg"
                  >
                    <RadioGroupItem value={option.id} id={option.id} />
                    <div className="flex-1">
                      <Label htmlFor={option.id} className="font-medium">
                        {option.name}
                      </Label>
                      <p className="text-sm text-gray-600">
                        {option.description}
                      </p>
                      <p className="text-sm text-gray-500">{option.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {option.price === 0 && cartSubtotal >= 500
                          ? 'Free'
                          : `₹${option.price}`}
                      </p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-white">
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <RadioGroup
                value={formData.paymentMethod}
                onValueChange={(value: 'razorpay' | 'cod') =>
                  setFormData({ ...formData, paymentMethod: value })
                }
                className="space-y-3"
              >
                <div className="flex items-center space-x-3 p-4 border rounded-lg">
                  <RadioGroupItem value="razorpay" id="razorpay" />
                  <div className="flex-1">
                    <Label
                      htmlFor="razorpay"
                      className="font-medium flex items-center gap-2"
                    >
                      <CreditCard className="w-4 h-4" />
                      Online Payment (Razorpay)
                    </Label>
                    <p className="text-sm text-gray-600">
                      Pay securely using UPI, Cards, Net Banking, or Wallets
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 border rounded-lg">
                  <RadioGroupItem value="cod" id="cod" />
                  <div className="flex-1">
                    <Label
                      htmlFor="cod"
                      className="font-medium flex items-center gap-2"
                    >
                      <Banknote className="w-4 h-4" />
                      Cash on Delivery
                    </Label>
                    <p className="text-sm text-gray-600">
                      Pay when your order is delivered
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Order Notes */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Order Notes (Optional)</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                className="w-full p-3 border rounded-lg resize-none"
                rows={3}
                placeholder="Any special instructions for your order..."
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
            </CardContent>
          </Card>

          {/* Place Order Button */}
          <Button
            type="submit"
            disabled={isProcessing || cartItems.length === 0}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>Place Order - ₹{total.toFixed(2)}</>
            )}
          </Button>
        </form>
      </div>

      {/* Order Summary Sidebar */}
      <div className="space-y-6">
        <Card className="border-0 shadow-lg sticky top-24">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-white">
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {/* Cart Items */}
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div key={item._id} className="flex gap-3">
                  <img
                    src={
                      item.product.images?.[0]?.url ||
                      '/placeholder.svg?height=60&width=60' ||
                      '/placeholder.svg'
                    }
                    alt={item.product.name}
                    className="w-15 h-15 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm line-clamp-2">
                      {item.product.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      Qty: {item.quantity}
                    </p>
                    {(item.size || item.color) && (
                      <div className="flex gap-1 mt-1">
                        {item.size && (
                          <Badge variant="outline" className="text-xs">
                            {item.size}
                          </Badge>
                        )}
                        {item.color && (
                          <Badge variant="outline" className="text-xs">
                            {item.color}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      ₹{item.itemTotal.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            {/* Order Totals */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>₹{cartSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>
                  {shippingCost === 0 ? 'Free' : `₹${shippingCost.toFixed(2)}`}
                </span>
              </div>
              <span className="text-[11px] font-bold text-green-900">
                Orders can be cancelled before processing.
              </span>
              {gstBreakdown.gst12 > 0 && (
                <div className="flex justify-between text-sm">
                  <span>GST (12%)</span>
                  <span>₹{gstBreakdown.gst12.toFixed(2)}</span>
                </div>
              )}
              {gstBreakdown.gst18 > 0 && (
                <div className="flex justify-between text-sm">
                  <span>GST (18%)</span>
                  <span>₹{gstBreakdown.gst18.toFixed(2)}</span>
                </div>
              )}
              {couponDiscount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>-₹{couponDiscount.toFixed(2)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Security Badge */}
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
              <Shield className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800">
                  Secure Checkout
                </p>
                <p className="text-xs text-green-600">
                  Your information is protected
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
