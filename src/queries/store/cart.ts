import { atom } from "jotai"
import type { CartItem } from "../types/user"
import { cartStorage } from "../utils/storage"

// Cart state atoms
export const cartItemsAtom = atom<CartItem[]>([])
export const cartCountAtom = atom((get) => {
  const items = get(cartItemsAtom)
  return items.reduce((total, item) => total + item.quantity, 0)
})

export const cartSubtotalAtom = atom((get) => {
  const items = get(cartItemsAtom)
  return items.reduce((total, item) => total + item.itemTotal, 0)
})

// Cart actions
export const addToCartAtom = atom(null, (get, set, item: CartItem) => {
  const currentItems = get(cartItemsAtom)
  const existingItemIndex = currentItems.findIndex(
    (cartItem) =>
      cartItem.product._id === item.product._id && cartItem.size === item.size && cartItem.color === item.color,
  )

  let newItems
  if (existingItemIndex > -1) {
    newItems = [...currentItems]
    newItems[existingItemIndex].quantity += item.quantity
    newItems[existingItemIndex].itemTotal =
      newItems[existingItemIndex].quantity * newItems[existingItemIndex].product.price
  } else {
    newItems = [...currentItems, item]
  }

  set(cartItemsAtom, newItems)
  cartStorage.setCart(newItems)
})

export const updateCartItemAtom = atom(null, (get, set, { itemId, quantity }: { itemId: string; quantity: number }) => {
  const currentItems = get(cartItemsAtom)
  const newItems = currentItems.map((item) =>
    item._id === itemId ? { ...item, quantity, itemTotal: quantity * item.product.price } : item,
  )

  set(cartItemsAtom, newItems)
  cartStorage.setCart(newItems)
})

export const removeFromCartAtom = atom(null, (get, set, itemId: string) => {
  const currentItems = get(cartItemsAtom)
  const newItems = currentItems.filter((item) => item._id !== itemId)

  set(cartItemsAtom, newItems)
  cartStorage.setCart(newItems)
})

export const clearCartAtom = atom(null, (get, set) => {
  set(cartItemsAtom, [])
  cartStorage.clearCart()
})

// Initialize cart from storage
export const initializeCartAtom = atom(null, (get, set) => {
  const storedCart = cartStorage.getCart()
  if (storedCart) {
    set(cartItemsAtom, storedCart)
  }
})
