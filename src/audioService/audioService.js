import { reaction } from 'mobx';
// import { map, concatAll } from 'rxjs/operators';
import { concatMap } from 'rxjs/operators';
import { from } from 'rxjs/observable/from';
// import { forkJoin } from 'rxjs/observable/forkJoin';
// import { zip } from 'rxjs/observable/zip';
import { of } from 'rxjs/observable/of';

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
    // async function processSound(array) {
    //   await array.reduce((aggr, node) => aggr.then(async () => {
    //     await node.callback();
    //   }));
    // }
    // function* processSound(nodesList) {
    //   for (let i = 0; i < nodesList.length; i += 1) {
    //     debugger; // eslint-disable-line
    //     yield nodesList[i].callback();
    //   }
    // }

    // const processSound = async (items) => {
    //   for (let i = 0; i < items.length; i += 1) {
    //     await items[i].callback(); // eslint-disable-line
    //   }
    // };

    // const processSound = (items) => {
    //   const source = from(items);

    //   const example = source.pipe(switchMap(node => console.log(node) || // eslint-disable-line
    //     concat(of(node.callback()))));

    //   return example.subscribe(val => console.log(val)); // eslint-disable-line
    // };
    const processSound = (items) => {
      const source = from(items);

      const result = source.pipe(concatMap(val => of(val.callback(val.node))));

      result.subscribe(x => console.log(x)); // eslint-disable-line
    };

    processSound(audioStream);
  }

  initBuffer = () => {
    loadSample(SAMPLE_URL).then((bufferArray) => {
      this.audioContext.decodeAudioData(bufferArray, (buffer) => {
        this.store.toggleBuffer();
        return buffer;
      }, (error) => {
        console.log(error) // eslint-disable-line
      });
    });
  }

  initFilter = (filterType) => {
    const {
      type,
      detune,
      frequency,
      gain,
    } = filterType;

    const filter = this.audioContext.createBiquadFilter();
    filter.frequency.value = frequency;
    filter.gain.value = gain;
    filter.type = type;
    filter.detune.value = detune;

    return filter;
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
