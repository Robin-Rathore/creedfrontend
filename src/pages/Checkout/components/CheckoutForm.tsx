//@ts-nocheck

import type React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Truck, Shield } from "lucide-react";
import { useAtom } from "jotai";
import { cartItemsAtom, cartSubtotalAtom } from "@/queries/store/cart";
import { useAddresses } from "@/queries/hooks/user";

interface CheckoutFormData {
  // Shipping Address
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;

  // Payment
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardName: string;

  // Options
  shippingMethod: string;
  saveAddress: boolean;
  sameAsBilling: boolean;
}

export const CheckoutForm: React.FC = () => {
  const [cartItems] = useAtom(cartItemsAtom);
  const [cartSubtotal] = useAtom(cartSubtotalAtom);
  const { data: addresses } = useAddresses();

  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "US",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
    shippingMethod: "standard",
    saveAddress: false,
    sameAsBilling: true,
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState<string>("");

  const shippingOptions = [
    {
      id: "standard",
      name: "Standard Shipping",
      price: 0,
      time: "5-7 business days",
      description: "Free shipping on orders over $50",
    },
    {
      id: "express",
      name: "Express Shipping",
      price: 9.99,
      time: "2-3 business days",
      description: "Fast delivery",
    },
    {
      id: "overnight",
      name: "Overnight Shipping",
      price: 24.99,
      time: "1 business day",
      description: "Next day delivery",
    },
  ];

  const selectedShipping = shippingOptions.find(
    (option) => option.id === formData.shippingMethod
  );
  const shippingCost =
    cartSubtotal >= 50 && formData.shippingMethod === "standard"
      ? 0
      : selectedShipping?.price || 0;
  const tax = cartSubtotal * 0.08;
  const total = cartSubtotal + shippingCost + tax;

  const handleAddressSelect = (addressId: string) => {
    const address = addresses?.find((addr) => addr._id === addressId);
    if (address) {
      setFormData({
        ...formData,
        firstName: address.firstName,
        lastName: address.lastName,
        company: address.company || "",
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2 || "",
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
        country: address.country,
        phone: address.phone || formData.phone,
      });
      setSelectedAddress(addressId);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle checkout submission
    console.log("Checkout data:", formData);
  };

  const steps = [
    { id: 1, name: "Shipping", icon: Truck },
    { id: 2, name: "Payment", icon: CreditCard },
    { id: 3, name: "Review", icon: Shield },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Form */}
      <div className="lg:col-span-2 space-y-6">
        {/* Progress Steps */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                      currentStep >= step.id
                        ? "bg-[var(--medium)] border-[var(--medium)] text-white"
                        : "border-gray-300 text-gray-400"
                    }`}
                  >
                    {step.icon && <step.icon className="w-5 h-5" />}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-16 h-0.5 mx-4 transition-all ${
                        currentStep > step.id
                          ? "bg-[var(--medium)]"
                          : "bg-gray-300"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4">
              {steps.map((step) => (
                <div key={step.id} className="text-center">
                  <p
                    className={`text-sm font-medium ${
                      currentStep >= step.id
                        ? "text-[var(--medium)]"
                        : "text-gray-400"
                    }`}
                  >
                    {step.name}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Shipping Information */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-[var(--lightest)] to-white">
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-[var(--medium)]" />
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
                                ? "border-[var(--medium)] bg-[var(--lightest)]"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">
                                  {address.firstName} {address.lastName}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {address.addressLine1}, {address.city},{" "}
                                  {address.state} {address.postalCode}
                                </p>
                              </div>
                              <Badge className="bg-[var(--medium)] text-white">
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
                          setFormData({
                            ...formData,
                            firstName: e.target.value,
                          })
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
                      <Label htmlFor="addressLine1">Address Line 1 *</Label>
                      <Input
                        id="addressLine1"
                        value={formData.addressLine1}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            addressLine1: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="addressLine2">
                        Address Line 2 (Optional)
                      </Label>
                      <Input
                        id="addressLine2"
                        value={formData.addressLine2}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            addressLine2: e.target.value,
                          })
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
                          setFormData({
                            ...formData,
                            postalCode: e.target.value,
                          })
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
                          <SelectItem value="US">United States</SelectItem>
                          <SelectItem value="CA">Canada</SelectItem>
                          <SelectItem value="UK">United Kingdom</SelectItem>
                          <SelectItem value="AU">Australia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="saveAddress"
                      checked={formData.saveAddress}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          saveAddress: e.target.checked,
                        })
                      }
                      className="rounded border-gray-300 text-[var(--medium)] focus:ring-[var(--medium)]"
                    />
                    <Label htmlFor="saveAddress">
                      Save this address for future orders
                    </Label>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Methods */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-[var(--lightest)] to-white">
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-[var(--medium)]" />
                    Shipping Method
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {shippingOptions.map((option) => (
                      <div
                        key={option.id}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            shippingMethod: option.id,
                          })
                        }
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          formData.shippingMethod === option.id
                            ? "border-[var(--medium)] bg-[var(--lightest)]"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="shipping"
                              checked={formData.shippingMethod === option.id}
                              onChange={() =>
                                setFormData({
                                  ...formData,
                                  shippingMethod: option.id,
                                })
                              }
                              className="text-[var(--medium)] focus:ring-[var(--medium)]"
                            />
                            <div>
                              <p className="font-medium">{option.name}</p>
                              <p className="text-sm text-gray-600">
                                {option.description}
                              </p>
                              <p className="text-sm text-gray-500">
                                {option.time}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">
                              {option.price === 0 && cartSubtotal >= 50
                                ? "Free"
                                : `$${option.price.toFixed(2)}`}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="bg-[var(--medium)] hover:bg-[var(--dark)] text-white"
                >
                  Continue to Payment
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Payment Information */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-[var(--lightest)] to-white">
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[var(--medium)]" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardName">Cardholder Name *</Label>
                      <Input
                        id="cardName"
                        value={formData.cardName}
                        onChange={(e) =>
                          setFormData({ ...formData, cardName: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number *</Label>
                      <Input
                        id="cardNumber"
                        value={formData.cardNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            cardNumber: e.target.value,
                          })
                        }
                        placeholder="1234 5678 9012 3456"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Expiry Date *</Label>
                        <Input
                          id="expiryDate"
                          value={formData.expiryDate}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              expiryDate: e.target.value,
                            })
                          }
                          placeholder="MM/YY"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV *</Label>
                        <Input
                          id="cvv"
                          value={formData.cvv}
                          onChange={(e) =>
                            setFormData({ ...formData, cvv: e.target.value })
                          }
                          placeholder="123"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="sameAsBilling"
                      checked={formData.sameAsBilling}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sameAsBilling: e.target.checked,
                        })
                      }
                      className="rounded border-gray-300 text-[var(--medium)] focus:ring-[var(--medium)]"
                    />
                    <Label htmlFor="sameAsBilling">
                      Billing address same as shipping
                    </Label>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                >
                  Back to Shipping
                </Button>
                <Button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="bg-[var(--medium)] hover:bg-[var(--dark)] text-white"
                >
                  Review Order
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Order Review */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-[var(--lightest)] to-white">
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[var(--medium)]" />
                    Order Review
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {/* Shipping Address Review */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Shipping Address
                    </h3>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium">
                        {formData.firstName} {formData.lastName}
                      </p>
                      {formData.company && <p>{formData.company}</p>}
                      <p>{formData.addressLine1}</p>
                      {formData.addressLine2 && <p>{formData.addressLine2}</p>}
                      <p>
                        {formData.city}, {formData.state} {formData.postalCode}
                      </p>
                      <p>{formData.country}</p>
                      <p>{formData.phone}</p>
                    </div>
                  </div>

                  {/* Payment Method Review */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Payment Method
                    </h3>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium">Credit Card</p>
                      <p>**** **** **** {formData.cardNumber.slice(-4)}</p>
                      <p>{formData.cardName}</p>
                    </div>
                  </div>

                  {/* Shipping Method Review */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Shipping Method
                    </h3>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium">{selectedShipping?.name}</p>
                      <p className="text-sm text-gray-600">
                        {selectedShipping?.description}
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedShipping?.time}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(2)}
                >
                  Back to Payment
                </Button>
                <Button
                  type="submit"
                  className="bg-[var(--medium)] hover:bg-[var(--dark)] text-white"
                >
                  Place Order
                </Button>
              </div>
            </motion.div>
          )}
        </form>
      </div>

      {/* Order Summary Sidebar */}
      <div className="space-y-6">
        <Card className="border-0 shadow-lg sticky top-24">
          <CardHeader className="bg-gradient-to-r from-[var(--lightest)] to-white">
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
                      "/placeholder.svg?height=60&width=60"
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
                      ${item.itemTotal.toFixed(2)}
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
                <span>${cartSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>
                  {shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
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
