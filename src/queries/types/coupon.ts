export interface Coupon {
  _id: string
  code: string
  description?: string
  type: "percentage" | "fixed"
  value: number
  minimumOrderAmount: number
  maximumDiscountAmount?: number
  usageLimit?: number
  usageLimitPerUser: number
  usedCount: number
  validFrom: string
  validUntil: string
  applicableProducts: string[]
  applicableCategories: string[]
  excludedProducts: string[]
  excludedCategories: string[]
  applicableUsers: string[]
  firstTimeUserOnly: boolean
  isActive: boolean
  createdBy: {
    _id: string
    firstName: string
    lastName: string
  }
  createdAt: string
  updatedAt: string
}

export interface ValidateCouponRequest {
  code: string
  orderAmount: number
}

export interface ValidateCouponResponse {
  success: boolean
  message: string
  data: {
    code: string
    description?: string
    type: "percentage" | "fixed"
    value: number
    discountAmount: number
    minimumOrderAmount: number
    maximumDiscountAmount?: number
  }
}

export interface CreateCouponRequest {
  code?: string
  description?: string
  type: "percentage" | "fixed"
  value: number
  minimumOrderAmount?: number
  maximumDiscountAmount?: number
  usageLimit?: number
  usageLimitPerUser?: number
  validFrom: string
  validUntil: string
  applicableProducts?: string[]
  applicableCategories?: string[]
  excludedProducts?: string[]
  excludedCategories?: string[]
  applicableUsers?: string[]
  firstTimeUserOnly?: boolean
}
