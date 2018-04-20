import { reaction } from 'mobx';
import { store } from '../store/rootStore';
import { loadSample } from '../utils/loadSample';
import { SAMPLE_URL } from '../consts';

export class AudioService {
  constructor() {
    this.audioContext = new AudioContext();
    this.samplebuffer = null;
    this.store = store;
    this.buildStream();
  }

  generateSound = () => {
    this.filter = this.audioContext.createBiquadFilter();
    this.source = this.audioContext.createBufferSource();
    this.source.buffer = this.samplebuffer;
    this.source.loop = true;
    this.source.connect(this.filter);
    this.filter.connect(this.audioContext.destination);
  }

  buildStream = () => {
    const { effectsList } = this.store;

    const audioStream = effectsList.reduce((stream, node) => {
      const { nodeType } = node;
      const callback = (type) => {
        if (type === 'bufferSource') return this.initBuffer;
        if (type === 'filter') return this.initFilter;
        return () => {};
      };

      return [
        ...stream,
        {
          node,
          callback: callback(nodeType),
          nodeType,
        },
      ];
    }, []);
    console.log(audioStream); // eslint-disable-line

    async function processSound(array) {
      await array.reduce((aggr, node) => aggr.then(async () => {
        await node.callback();
      }));
    }

    processSound(audioStream);
  }

  initBuffer = () => {
    console.log('initBuffer'); // eslint-disable-line
  }

  initFilter = () => {
    console.log('initFilter'); // eslint-disable-line
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
