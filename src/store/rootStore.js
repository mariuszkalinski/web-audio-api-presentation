import { observable } from 'mobx';

class RootStore {
  @observable filter = {
    type: 'lowpass',
    detune: 0,
    frequency: 0,
    gain: 0,
  };

  @observable bufferLoaded = false;

  @observable isPlaying = 'ready';

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
    switch (this.isPlaying) {
      case 'ready':
        this.isPlaying = 'playing';
        break;
      case 'playing':
        this.isPlaying = 'paused';
        break;
      case 'paused':
        this.isPlaying = 'playing';
        break;
      default:
        this.isPlaying = 'ready';
        break;
    }
    this.isPlaying = !this.isPlaying;
  }
}

export const store = new RootStore();
