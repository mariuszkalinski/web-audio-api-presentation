import { observable, computed } from 'mobx';

class RootStore {
  @observable filter = {
    type: 'lowpass',
    detune: 0,
    frequency: 0,
    gain: 0,
  }

  @computed get filterValues() {
    return this.filter;
  }

  changeFilter(value) {
    debugger; //eslint-disable-line
    const newFilter = {
      ...this.filter,
      ...value,
    };
    this.filter = newFilter;
  }
}

export const store = new RootStore();
