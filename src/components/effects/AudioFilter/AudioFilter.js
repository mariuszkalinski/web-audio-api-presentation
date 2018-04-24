import { store } from '../../../store/rootStore';
import { COLORS } from '../../../consts/colors';

export class AudioFilter extends HTMLElement {
  constructor() {
    super();
    this.store = store;
    this.shadowRoots = this.attachShadow({
      mode: 'open',
    });

    const {
      type,
      detune,
      name,
      frequency,
      gain,
    } = this.attributes;

    this.shadowRoots.innerHTML = /* html */ `
      <style>
        :host {
          align-items: center;
          background: ${COLORS.YELLOW};
          border-radius: 50%;
          border: 15px solid ${COLORS.MOONROCK};
          display: flex;
          height: 75px;
          justify-content: center;
          position: relative;
          width: 75px;
          z-index: 2;
        }

        span {
          color: ${COLORS.SILVER};
          font-size: 24px;
        }

        div {
          position: absolute;
          visibility: hidden;
        }
      </style>
      <span>F</span>
      <div>
        <h4>BiquadFilterNode attributes</h4>
        <h3>${name.value}</h3>
        <form>
          <div>
            <select name="type" id="type" selected="${type.value}">
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
            <input type="range" name="detune" id="detune" value="${detune.value}">
          </div>
          <div>
            <label for="frequency">Frequency</label>
            <input type="range" name="frequency" id="frequency" min="0" max="3000" value="${frequency.value}">
          </div>
          <div>
            <label for="gain">Gain</label>
            <input type="range" name="gain" id="gain"  value="${gain.value}">
          </div>
        </form>
      </div>
    `;

    this.shadowRoots.querySelector('select').onchange = event => this.handleInputChange(event);
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
