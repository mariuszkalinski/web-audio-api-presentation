import { store } from '../../store/rootStore';
import { makeid } from '../../utils/makeId';

// import { COLORS } from '../../consts/colors';

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
      </style>
      <h1>Add Audio Node</h1>
      <div>
        <button id="addFilter">Add Filter</button>
        <button id="addGain">Add Gain</button>
      </div>
    `;
    this.shadowRoots.querySelector('#addFilter')
      .addEventListener('click', this.addFilter);

    this.shadowRoots.querySelector('#addGain')
      .addEventListener('click', this.addGain);
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
}
