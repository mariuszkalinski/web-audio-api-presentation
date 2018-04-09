import { observable, computed } from 'mobx';

export class RootStore {
  @observable price = 10;
  @observable amount = 2;

  @computed get total() {
    return this.price * this.amount;
  }
}
