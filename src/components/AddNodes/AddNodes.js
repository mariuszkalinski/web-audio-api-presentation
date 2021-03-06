import { store } from '../../store/rootStore';
import { makeid } from '../../utils/makeId';
import { SAMPLE_GUITAR } from '../../consts';
import { COLORS } from '../../consts/colors';

export class AddNodes extends HTMLElement {
  constructor() {
    super();
    this.store = store;
    this.shadowRoots = this.attachShadow({
      mode: 'open',
    });
    this.shadowRoots.innerHTML = /* html */ `
      <style>
        :host {
          display: block;
        }

        .section {
          padding: 10px 0;
        }

        button {
          background: none;
          border: 2px solid white;
          color: white;
          border-radius: 4px;
          padding: 10px;
          text-transform: uppercase;
          margin: 10px;
          cursor: pointer;
        }

        button:hover {
          background: white;
          color: ${COLORS.MOONROCK}
        }
      </style>
      <h1>Add Audio Node</h1>
      <div>
        <div class="section">
          <span>Sources</span>
          <button id="addOscillator">Add Oscillator</button>
          <button id="addBuffer">Add Buffer</button>
        </div>
        <div class="section">
          <span>Effects</span>
          <button id="addFilter">Add Filter</button>
          <button id="addGain">Add Gain</button>
        </div>
      </div>
    `;
    this.shadowRoots.querySelector('#addFilter')
      .addEventListener('click', this.addFilter);

    this.shadowRoots.querySelector('#addGain')
      .addEventListener('click', this.addGain);

    this.shadowRoots.querySelector('#addOscillator')
      .addEventListener('click', this.addOscillator);
    this.shadowRoots.querySelector('#addBuffer')
      .addEventListener('click', this.addBuffer);
  }

  addFilter = () => {
    this.store.addEffect({
      detune: 110,
      frequency: 420,
      gain: 10,
      nodeType: 'filter',
      type: 'lowshelf',
      id: makeid(),
    });
  }

  addGain = () => {
    this.store.addEffect({
      nodeType: 'gain',
      value: 1,
      id: makeid(),
    });
  }

  addOscillator = () => {
    this.store.addEffect({
      nodeType: 'oscillator',
      type: 'square',
      frequency: 0,
      detune: 0,
      id: makeid(),
    });
  }

  addBuffer = () => {
    this.store.addEffect({
      nodeType: 'bufferSource',
      sourceUrl: SAMPLE_GUITAR,
      id: makeid(),
    });
  }
}
