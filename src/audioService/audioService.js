import { reaction } from 'mobx';
import { store } from '../store/rootStore';
import { loadSample } from '../utils/loadSample';
import { SAMPLE_URL } from '../consts';

export class AudioService {
  constructor() {
    this.audioContext = new AudioContext();
    this.samplebuffer = null;
    this.store = store;
    this.filter = this.audioContext.createBiquadFilter();
    this.source = this.audioContext.createBufferSource();
  }

  generateSound = () => {
    this.source.buffer = this.samplebuffer;
    this.source.loop = true;
    this.source.connect(this.filter);
    this.filter.connect(this.audioContext.destination);
  }

  modifyFilter = (filterType) => {
    const {
      type,
      detune,
      frequency,
      gain,
    } = filterType;
    this.filter.frequency.value = frequency;
    this.filter.gain.value = gain;
    this.filter.type = type;
    this.filter.detune.value = detune;
  }

  playSound = () => {
    if (!this.store.playTouched) {
      this.source.start(1);
      this.store.togglePlayTouched();
    }
    this.filter.connect(this.audioContext.destination);
  }

  stopSound = () => {
    this.filter.disconnect(this.audioContext.destination);
  }

  initializePlayer = () => {
    loadSample(SAMPLE_URL).then((bufferArray) => {
      this.audioContext.decodeAudioData(bufferArray, (buffer) => {
        this.samplebuffer = buffer;
        this.store.toggleBuffer();
      }, (error) => {
        console.log(error) // eslint-disable-line
      });
    });

    reaction(
      () => this.store.filter,
      (filter) => {
        this.modifyFilter(filter);
      },
    );

    reaction(
      () => this.store.bufferLoaded,
      (bufferStatus) => {
        if (bufferStatus) this.generateSound();
      },
    );

    reaction(
      () => this.store.isPlaying,
      (playerState) => {
        if (playerState) {
          this.playSound();
        } else {
          this.stopSound();
        }
      },
    );
  }
}
