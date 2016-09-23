import { Map } from "immutable";

export default class ConfigStore {
  private store: Map<any, any>;
  constructor() {
    this.store = Map<any, any>();
  }

  set(key, value) {
    this.store = this.store.set(key, value);
  }

  get(key) {
    return this.store.get(key);
  }
}
