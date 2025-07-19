export interface Order {
  _id: string
  orderNumber: string
  user: {
    _id: string
    firstName: string
    lastName: string
    email: string
  }
  items: Array<{
    product: {
      _id: string
      name: string
      images: Array<{
        url: string
        alt?: string
      }>
    }
    name: string
    price: number
    quantity: number
    size?: string
    color?: string
    sku: string
    subtotal: number
  }>
  shippingAddress: {
    firstName: string
    lastName: string
    company?: string
    address1: string
    address2?: string
    city: string
    state: string
    postalCode: string
    country: string
    phone?: string
  }
  billingAddress: {
    firstName: string
    lastName: string
    company?: string
    address1: string
    address2?: string
    city: string
    state: string
    postalCode: string
    country: string
    phone?: string
  }
  pricing: {
    subtotal: number
    tax: number
    shipping: number
    discount: number
    total: number
  }
  coupon?: {
    code: string
    discount: number
    type: "percentage" | "fixed"
  }
  payment: {
    method: "credit_card" | "debit_card" | "paypal" | "stripe" | "razorpay" | "cod"
    status: "pending" | "processing" | "completed" | "failed" | "refunded"
    transactionId?: string
    paymentIntentId?: string
    paidAt?: string
  }
  shipping: {
    method?: string
    carrier?: string
    trackingNumber?: string
    estimatedDelivery?: string
    shippedAt?: string
    deliveredAt?: string
  }
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded" | "returned"
  statusHistory: Array<{
    status: string
    timestamp: string
    note?: string
    updatedBy?: string
  }>
  createdAt: string
  updatedAt: string
}

export interface CreateOrderRequest {
  items: Array<{
    product: string
    quantity: number
    size?: string
    color?: string
  }>
  shippingAddress: {
    firstName: string
    lastName: string
    company?: string
    address1: string
    address2?: string
    city: string
    state: string
    postalCode: string
    country: string
    phone?: string
  }
  billingAddress?: {
    firstName: string
    lastName: string
    company?: string
    address1: string
    address2?: string
    city: string
    state: string
    postalCode: string
    country: string
    phone?: string
  }
  paymentMethod: "credit_card" | "debit_card" | "paypal" | "stripe" | "razorpay" | "cod"
  couponCode?: string
  shippingMethod?: string
  notes?: string
}

export interface OrdersQuery {
  page?: number
  limit?: number
  status?: string
  paymentStatus?: string
  dateFrom?: string
  dateTo?: string
  search?: string
}
