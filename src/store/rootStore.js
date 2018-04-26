import { observable } from 'mobx';
// import { SAMPLE_GUITAR } from '../consts';

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

  removeEffect(effectId) {
    const effectPosition = this.effectsList.findIndex(element => element.id === effectId);

    if (effectPosition === 0) {
      this.effectsList = [
        {
          name: 'destination',
          nodeType: 'destination',
        },
      ];
    } else {
      this.effectsList = this.effectsList.filter(effect => effect.id !== effectId);
    }
  }

  updateEffect(effect) {
    const effects = this.effectsList;
    const effectId = effects.findIndex(element => element.id === effect.id);
    effects[effectId] = effect;
    this.effectsList = [...effects];
  }
}

export const store = new RootStore();
