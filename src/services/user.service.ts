import localforage from 'localforage';
import { genUUID } from '../utils/helpers';

const ID_DB = '__wb-userId';

class UserService {
  private userId: string = ''; // Переменная для хранения ID пользователя
  private readyResolve: Function | null = null; // Для хранения функции, которая разрешит Promise 'ready'

  ready: Promise<void>; // Promise, который разрешается, после инициализации UserService

  constructor() {
    // Создаем Promise 'ready'. Функция resolve сохраняем в readyResolve.
    this.ready = new Promise<void>((resolve) => {
      this.readyResolve = resolve;
    });
  }

  // Метод для инициализации UserService.
  async init() {
    // Выполняем метод ensureId, чтобы убедиться, что userId установлен.
    await this.ensureId();
    // Если функция разрешения существует (т.е. Promise еще не был разрешен),
    // вызываем ее для разрешения Promise 'ready'.
    if (this.readyResolve) {
      this.readyResolve();
    }
    console.warn('UserID: ', this.userId);
  }

  // Метод гарантирует, что userId установлен, либо извлекая его, либо создавая новый.
  private async ensureId(): Promise<void> {
    // Пытаемся получить userId из localforage.
    if (!this.userId) {
      this.userId = (await localforage.getItem(ID_DB)) as string;
    }

    // Если userId всё еще не установлен, создаем новый с помощью _setId.
    if (!this.userId) {
      await this._setId();
    }
  }

  // Метод генерирует новый userId и сохраняет его в localforage.
  private async _setId(): Promise<void> {
    this.userId = genUUID();
    await localforage.setItem(ID_DB, this.userId);
  }

  // Метод возвращает текущий userId.
  public getId(): string {
    return this.userId;
  }
}

export const userService = new UserService();
