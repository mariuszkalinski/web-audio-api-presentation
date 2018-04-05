import { loadSample } from './utils/loadSample';
import { SAMPLE_URL } from './consts';

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

