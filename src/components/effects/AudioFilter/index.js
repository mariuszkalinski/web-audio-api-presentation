import { RootStore } from '../../store/rootStore';

export class AudioFilter extends HTMLElement {
  constructor() {
    super();
    this.RootStore = new RootStore();
    this.shadowRoots = this.attachShadow({
      mode: 'open',
    });

    console.log(this.getStoreData()); //eslint-disable-line

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
      <h4>BiquadFilterNode attributes</h4>
      <form>
        <div>
          <select name="type" id="type">
            <option value="lowpass">lowpass</option>
            <option value="highpass">highpass</option>
            <option value="bandpass">bandpass</option>
            <option value="lowshelf">lowshelf</option>
            <option value="highshelf">highshelf</option>
            <option value="peaking">peaking</option>
            <option value="notch">notch</option>
            <option value="allpass">allpass</option>
          </select>
        </div>
        <div>
          <label for="detune">Detune</label>
          <input type="number" name="detune" id="detune">
        </div>
        <div>
          <label for="frequency">Frequency</label>
          <input type="number" name="frequency" id="frequency">
        </div>
        <div>
          <label for="gain">Gain</label>
          <input type="number" name="gain" id="gain">
        </div>
      </form>
    `;

    this.shadowRoots.querySelector('select').onchange = this.handleInputChange;
    this.shadowRoots.querySelectorAll('input').forEach((field) => {
      const field2 = field;
      field2.onchange = this.handleInputChange;
    });
  }

  getStoreData() {
    return this.rootStore.total();
  }

  static handleInputChange(event) {
    const { name, value } = event.target;

    return {
      name,
      value,
    };
  }
}
