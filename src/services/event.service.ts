import { ProductData } from 'types';

type EventType = 'route' | 'viewCard' | 'viewCardPromo' | 'addToCard' | 'purchase';

type RoutePayload = {
  url: string;
};

type ViewCardPayload = ProductData & { secretKey?: string };

type AddToCardPayload = ProductData;

type PurchasePayload = {
  orderId: string;
  totalPrice: number;
  productIds: number[];
};

type EventPayload = RoutePayload | ViewCardPayload | AddToCardPayload | PurchasePayload;

class EventService {
  async sendEvent(eventType: EventType, payload: EventPayload) {
    const eventData = {
      type: eventType,
      payload: payload,
      timestamp: Date.now()
    };

    // Вывод в консоль для наглядности
    // console.log('Sending event:', eventData);

    try {
      const response = await fetch('/api/sendEvent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData)
      });

      if (!response.ok) {
        throw new Error('Event sending failed');
      }
    } catch (error) {
      console.error('Error sending event', error);
    }
  }
}

export const eventService = new EventService();
