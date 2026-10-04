type EventType =
  | 'PRODUCT_VIEW'
  | 'SEARCH'
  | 'ADD_TO_CART'
  | 'REMOVE_FROM_CART'
  | 'UPDATE_CART_QUANTITY'
  | 'BUY_NOW'
  | 'CHECKOUT_STARTED'
  | 'PAYMENT_SUCCESS'
  | 'PAYMENT_FAILED'
  | 'LOGIN'
  | 'LOGOUT'

interface TrackingEvent {
  type: EventType
  timestamp: Date
  data: Record<string, any>
}

const events: TrackingEvent[] = []

export function trackEvent(type: EventType, data: Record<string, any> = {}): void {
  const event: TrackingEvent = {
    type,
    timestamp: new Date(),
    data,
  }
  events.push(event)

  console.log(`[Event] ${type}:`, data)
}


