import '@webcomponents/custom-elements/src/native-shim';
import '@webcomponents/custom-elements';
import '@webcomponents/shadydom';

import { AppRoot } from './components/AppRoot';
import { Knob } from './components/Knob';
import { TogglePlay } from './components/TogglePlay';
import { AudioBuffer } from './components/Sources/AudioBuffer';
import { defineComponents } from './utils/defineComponents';
import { loadSample } from './utils/loadSample';
import { SAMPLE_URL } from './consts';
import { AudioStream } from './components/AudioStream';
import { AudioFilter } from './components/effects/AudioFilter';

defineComponents([
  ['app-root', AppRoot],
  ['audio-knob', Knob],
  ['toggle-play', TogglePlay],
  ['audio-stream', AudioStream],
  ['audio-buffer', AudioBuffer],
  ['audio-filter', AudioFilter],
]);

const audioContext = new AudioContext();
let samplebuffer = null;

const filter = audioContext.createBiquadFilter();
filter.frequency.value = 220;
function playSound(buffer, context) {
  const source = context.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  source.connect(filter);
  filter.connect(context.destination);
  source.start(0);
}

loadSample(SAMPLE_URL).then((bufferArray) => {
  audioContext.decodeAudioData(bufferArray, (buffer) => {
    samplebuffer = buffer;
    playSound(samplebuffer, audioContext);
  }, (error) => {
    console.log(error) // eslint-disable-line
  });
});

