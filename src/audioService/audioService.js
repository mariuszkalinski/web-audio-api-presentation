import { autorun } from 'mobx';
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

  createSound = (buffer, context, filterType) => {
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

    this.source.buffer = buffer;
    this.source.loop = false;
    this.source.connect(this.filter);
    this.filter.connect(context.destination);
  }

  playSound = () => {
    this.source.start(1);
  }

  stopSound = () => {
    this.source.stop(1);
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
    autorun(() => {
      const {
        bufferLoaded,
        filter,
        isPlaying,
      } = this.store;

      if (bufferLoaded) {
        console.log(bufferLoaded); // eslint-disable-line
        this.createSound(this.samplebuffer, this.audioContext, filter);
        switch (isPlaying) {
          case 'ready':
            this.playSound();
            break;
          case 'playing':
            this.stopSound();
            break;
          default:
            this.stopSound();
            break;
        }
      }
    });
  }
}
