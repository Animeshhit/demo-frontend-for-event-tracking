'use client'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { useShallow } from 'zustand/react/shallow'
import { trackEvent } from '@/lib/tracking'
import type { Cart, CartItem } from '@/types/types'

const initialCart: Cart = { items: [] }

interface CartStore {
  cart: Cart
  isLoading: boolean
  setIsLoading: (value: boolean) => void
  addToCart: (productId: string, quantity?: number, priceMinor?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
  getCartItemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: initialCart,
      isLoading: true,
      setIsLoading: (value) => set({ isLoading: value }),
      addToCart: (productId, quantity = 1, priceMinor = 0) => {
        set((state) => {
          const existing = state.cart.items.find((item) => item.productId === productId)
          const newItems: CartItem[] = existing
            ? state.cart.items.map((item) =>
                item.productId === productId
                  ? { ...item, quantity: item.quantity + quantity, priceMinor }
                  : item,
              )
            : [...state.cart.items, { productId, quantity, priceMinor }]

          const nextCart = { items: newItems }
          trackEvent('ADD_TO_CART', { productId, quantity, priceMinor })
          return { cart: nextCart, isLoading: false }
        })
      },
      removeFromCart: (productId) => {
        set((state) => {
          const nextCart = { items: state.cart.items.filter((item) => item.productId !== productId) }
          trackEvent('REMOVE_FROM_CART', { productId })
          return { cart: nextCart, isLoading: false }
        })
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId)
          return
        }

        set((state) => {
          const nextCart = {
            items: state.cart.items.map((item) =>
              item.productId === productId ? { ...item, quantity, priceMinor: item.priceMinor } : item,
            ),
          }

          trackEvent('UPDATE_CART_QUANTITY', {
            productId,
            quantity,
            priceMinor: nextCart.items.find((item) => item.productId === productId)?.priceMinor,
          })

          return { cart: nextCart, isLoading: false }
        })
      },
      clearCart: () => {
        set({ cart: initialCart, isLoading: false })
      },
      getCartTotal: () => {
        return get().cart.items.reduce((total, item) => total + (item.priceMinor ?? 0) * item.quantity, 0)
      },
      getCartItemCount: () => {
        return get().cart.items.reduce((count, item) => count + item.quantity, 0)
      },
    }),
    {
      name: 'ecommerce_cart',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      onRehydrateStorage: () => (state) => {
        state?.setIsLoading(false)
      },
    },
  ),
)

export function useCart() {
  return useCartStore(
    useShallow((state) => ({
      cart: state.cart,
      isLoading: state.isLoading,
      addToCart: state.addToCart,
      removeFromCart: state.removeFromCart,
      updateQuantity: state.updateQuantity,
      clearCart: state.clearCart,
      getCartTotal: state.getCartTotal,
      getCartItemCount: state.getCartItemCount,
    })),
  )
}
