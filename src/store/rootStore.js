import { observable } from 'mobx';
import { SAMPLE_GUITAR } from '../consts';

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
      nodeType: 'bufferSource',
      sourceUrl: SAMPLE_GUITAR,
      name: 'buffer',
    },
    {
      detune: 0,
      frequency: 220,
      gain: 0,
      name: 'filter 1',
      nodeType: 'filter',
      type: 'lowpass',
    },
    {
      detune: 110,
      frequency: 420,
      gain: 10,
      name: 'filter 2',
      nodeType: 'filter',
      type: 'lowshelf',
    },
    {
      name: 'gain1',
      nodeType: 'gain',
      value: 1,
    },
    {
      name: 'destination',
      nodeType: 'destination',
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
    const list = this.effectsList.filter(element => element.nodeType !== 'destination');
    this.effectsList = [
      ...list,
      effect,
      {
        name: 'destination',
        nodeType: 'destination',
      },
    ];
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
