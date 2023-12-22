import { ProductData } from 'types';

// Определяем возможные типы событий
type EventType = 'route' | 'viewCard' | 'viewCardPromo' | 'addToCart' | 'purchase';

// Данные для перехода по страницам
type RoutePayload = {
  url: string;
};

// Данные для просмотра карточки товара
type ViewCardPayload = ProductData & { secretKey?: string };

// Данные для добавления товара в корзину
type AddToCartPayload = ProductData;

// Данные для  оформления покупки
type PurchasePayload = {
  orderId: string;
  totalPrice: number;
  productIds: number[];
};

// Объединяем все типы данных для событий
type EventPayload = RoutePayload | ViewCardPayload | AddToCartPayload | PurchasePayload;

class EventService {
  // Асинхронный метод для отправки события.
  async sendEvent(eventType: EventType, payload: EventPayload) {
    const eventData = {
      type: eventType,
      payload: payload,
      timestamp: Date.now()
    };

    // Вывод в консоль
    // console.log('Sending event:', eventData);

    // Пытаемся отправить сформированное событие на сервер.
    try {
      const response = await fetch('/api/sendEvent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData) // Конвертируем данные события в JSON.
      });

      // Проверяем, был ли запрос успешным.
      if (!response.ok) {
        throw new Error('Event sending failed');
      }
    } catch (error) {
      console.error('Error sending event', error); // Выводим ошибку в консоль, если отправка не удалась.
    }
  }
}

export const eventService = new EventService();
