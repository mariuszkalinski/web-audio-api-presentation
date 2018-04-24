import { store } from '../../store/rootStore';

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
      .addEventListener('click', () => {
        this.store.addEffect({
          detune: 110,
          frequency: 420,
          gain: 10,
          name: 'filter 3',
          nodeType: 'filter',
          type: 'lowshelf',
        });

        console.log(this.store.effectsList);
      });
  }
}
