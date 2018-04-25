import { reaction } from 'mobx';
import { concatMap, reduce, map } from 'rxjs/operators';
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
    this.currentlyPlaying = null;
    this.store = store;
    this.buildStream(this.store.effectsList);
    this.onUpdateStream();
  }

  generateSound = () => {
    this.filter = this.audioContext.createBiquadFilter();
    this.source = this.audioContext.createBufferSource();
    this.source.buffer = this.samplebuffer;
    this.source.loop = true;
    this.source.connect(this.filter);
    this.filter.connect(this.audioContext.destination);
  }

  buildStream = (effectsList) => {
    const audioStream = effectsList.reduce((stream, node) => {
      const { nodeType } = node;
      const callback = (type) => {
        if (type === 'bufferSource') return this.initBuffer;
        if (type === 'filter') return this.initFilter;
        if (type === 'gain') return this.initGain;
        if (type === 'destination') return this.initDestination;
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
                concatMap(
                  bufferArray => fromPromise(
                    this.audioContext.decodeAudioData(bufferArray, buffer => buffer),
                  ),
                ),
                map((buffer) => {
                  const musicSource = this.audioContext.createBufferSource();
                  musicSource.buffer = buffer;
                  musicSource.loop = true;

                  return musicSource;
                }),
              );
            }

            return of(val.callback(val.node, this.audioContext));
          },
        ),
        reduce((acc, val) => [
          ...acc,
          val,
        ], []),
      );
    };

    processSound(audioStream).subscribe((audioNodes) => {
      audioNodes.forEach((node, index) => {
        if (audioNodes[index + 1]) {
          node.connect(audioNodes[index + 1]);
        } else {
          audioNodes[0].start(1);
        }
      });
    });
  }

  initBuffer = bufferType =>
    fromPromise(loadSample(bufferType.sourceUrl));

  initFilter = (filter, context) => {
    const {
      type,
      detune,
      frequency,
      gain,
    } = filter;

    const filterNode = context.createBiquadFilter();
    filterNode.frequency.value = frequency;
    filterNode.gain.value = gain;
    filterNode.type = type;
    filterNode.detune.value = detune;

    return filterNode;
  }

  initGain = (gain, context) => {
    const { value } = gain;

    const gainNode = context.createGain();
    gainNode.gain.value = value;
    return gainNode;
  }

  initDestination = (_, context) => context.destination;

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
  onUpdateStream = () => {
    reaction(
      () => this.store.effectsList,
      (effectsList) => {
        this.audioContext.close();
        this.audioContext = new AudioContext();
        this.buildStream(effectsList);
      },
    );
  };
}
