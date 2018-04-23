import { store } from '../../../store/rootStore';

export class AudioGain extends HTMLElement {
  constructor() {
    super();
    this.store = store;
    this.shadowRoots = this.attachShadow({
      mode: 'open',
    });

    const {
      value,
      name,
    } = this.attributes;

    this.shadowRoots.innerHTML = /* html */ `
      <style>
        :host {
          display: block;
          width: 200px;
          height: 100%;
          background: green;
          border-radius: 5px;
        }
      </style>
      <h4>Gain attributes</h4>
      <h3>${name.value}</h3>
      <form>
        <div>
          <label for="value">Value</label>
          <input type="range" name="value" id="value" value="${value}">
        </div>
      </form>
    `;

    this.shadowRoots.querySelectorAll('input').forEach((field) => {
      const field2 = field;
      field2.onchange = event => this.handleInputChange(event);
    });
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.store.changeFilter({
      [name]: value,
    });
  }
}
