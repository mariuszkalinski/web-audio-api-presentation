import { observable } from 'mobx';

class RootStore {
  @observable filter = {
    type: 'lowpass',
    detune: 0,
    frequency: 0,
    gain: 0,
  };

  @observable bufferLoaded = false;

  @observable isPlaying = false;

  @observable playTouched = false;

  @observable effectsList = [
    {
      detune: 0,
      frequency: 220,
      gain: 0,
      name: 'filter 1',
      nodeType: 'filter',
      type: 'lowpass',
    },
    {
      detune: 0,
      frequency: 220,
      gain: 10,
      name: 'filter 1',
      nodeType: 'filter',
      type: 'lowshelf',
    },
  ];

  changeFilter(value) {
    const newFilter = {
      ...this.filter,
      ...value,
    };
    this.filter = newFilter;
  }

  toggleBuffer() {
    this.bufferLoaded = !this.bufferLoaded;
  }

  togglePlayPause() {
    this.isPlaying = !this.isPlaying;
  }

  togglePlayTouched() {
    this.playTouched = !this.playTouched;
  }

  addEffect(effect) {
    this.effectsList = [...this.effectsList, effect];
  }

  removeEffect(effectName) {
    this.effectsList = this.effectsList.filter(effect => effect.name !== effectName);
  }
  // TODO
  // updateEffect(effectName) {
  //   this.effectsList = this.effectsList
  // }
}

export const store = new RootStore();
