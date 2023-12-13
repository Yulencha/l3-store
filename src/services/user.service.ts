import localforage from 'localforage';
import { genUUID } from '../utils/helpers';

const ID_DB = '__wb-userId';

class UserService {
  private userId: string = '';

  async init() {
    await this.ensureId();

    console.warn('UserID: ', this.userId);
  }

  private async ensureId(): Promise<void> {
    if (!this.userId) {
      this.userId = (await localforage.getItem(ID_DB)) as string;
    }

    if (!this.userId) {
      await this._setId();
    }
  }

  private async _setId(): Promise<void> {
    this.userId = genUUID();
    await localforage.setItem(ID_DB, this.userId);
  }

  public getId(): string {
    return this.userId;
  }
}

export const userService = new UserService();
