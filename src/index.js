import '@webcomponents/custom-elements/src/native-shim';
import '@webcomponents/custom-elements';
import '@webcomponents/shadydom';
import 'babel-polyfill';

import { AudioService } from './audioService/audioService';

import { AppRoot } from './components/AppRoot';
import { Knob } from './components/Knob';
import { TogglePlay } from './components/TogglePlay/TogglePlay';
import { AudioBuffer } from './components/Sources/AudioBuffer';
import { defineComponents } from './utils/defineComponents';
import { AudioStream } from './components/AudioStream';
import { AudioFilter } from './components/effects/AudioFilter/AudioFilter';

defineComponents([
  ['app-root', AppRoot],
  ['audio-knob', Knob],
  ['toggle-play', TogglePlay],
  ['audio-stream', AudioStream],
  ['audio-buffer', AudioBuffer],
  ['audio-filter', AudioFilter],
]);

const audio = new AudioService();

audio.initializePlayer();
