import { reaction } from 'mobx';
import { concatMap, map } from 'rxjs/operators';
import { from } from 'rxjs/observable/from';
import { fromPromise } from 'rxjs/observable/fromPromise';
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

    const processSound = (items) => {
      const source = from(items);

      return source.pipe(
        concatMap(
          (val) => {
            if (val.nodeType === 'bufferSource') {
              return val.callback(val.node).pipe(
                map(bufferArray => bufferArray),
              );
            }

            return of(val.callback(val.node));
          },
        ),
      );
    };

    processSound(audioStream).subscribe(x => console.log(x));
  }

  initBuffer = bufferType =>
    fromPromise(loadSample(bufferType.sourceUrl));

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
