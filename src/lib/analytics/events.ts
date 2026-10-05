export const EVENTS = {
  PRODUCT_VIEW: "product_view", //done
  SEARCH: "search", //done
  CATEGORY_CLICK: "category_click", // done
  ADD_TO_CART: "add_to_cart", //done
  REMOVE_FROM_CART: "remove_from_cart", //done
  BUY_NOW: "buy_now",  // done
  WISHLIST: "wishlist",
  CHECKOUT: "checkout", //done
  PAYMENT: "payment", // done
  PURCHASE: "purchase", //done
} as const;

export type EventName = (typeof EVENTS)[keyof typeof EVENTS];