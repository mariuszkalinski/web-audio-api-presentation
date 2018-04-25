
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
      type: { value: type },
      detune: { value: detune },
      frequency: { value: frequency },
      gain: { value: gain },
      id: { value: id },
    } = this.attributes;

    const selected = 'selected';

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

        .tooltip {
          position: absolute;
          visibility: visible;
          background: ${COLORS.GRAY};
          border-radius: 5px;
          top: calc(100% + 15px);
          padding: 10px;
          box-shadow: rgba(0, 0, 0, 0.31) 0px 2px 10px;
          text-align: center;
          color: ${COLORS.SILVER};
        }

         .tooltip:after {
          content: '';
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 0 7.5px 10px 7.5px;
          border-color: transparent transparent #355471 transparent;
          top: -10px;
          left: calc(50% - 7px);
          position: absolute;
        }

        .tooltip h3 {
          font-size: 16px;
          margin: 18px 0;
        }

        .tooltip label {
          font-size: 11px;
          margin: 18px 0;
        }

        .delete {
          position: absolute;
          top: -15px;
          right: -15px;
          width: 20px;
          height: 20px;
          cursor: pointer;
        }

        svg {
          width: 100%;
          height: 100%;
        }
      </style>
      <span>F</span>
      <div class="delete">
      <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
        x="0px" y="0px"
        width="44px" height="44px" viewBox="0 0 44 44" enable-background="new 0 0 44 44" xml:space="preserve">
      <g>
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          fill="#DADADA"
          d="M38.824,0L44,5.178L5.176,44L0,38.825L38.824,0z"/>
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          fill="#DADADA"
          d="M5.176,0L44,38.825L38.824,44L0,5.178L5.176,0z"/>
      </g>
      </svg>
      </div>
      <div class="tooltip">
        <h3>Filter</h3>
        <form>
          <div>
            <select name="type" id="type">
              <option ${type === 'lowpass' && selected} value="lowpass">lowpass</option>
              <option ${type === 'highpass' && selected} value="highpass">highpass</option>
              <option ${type === 'bandpass' && selected} value="bandpass">bandpass</option>
              <option ${type === 'lowshelf' && selected} value="lowshelf">lowshelf</option>
              <option ${type === 'highshelf' && selected} value="highshelf">highshelf</option>
              <option ${type === 'peaking' && selected} value="peaking">peaking</option>
              <option ${type === 'notch' && selected} value="notch">notch</option>
              <option ${type === 'allpass' && selected} value="allpass">allpass</option>
            </select>
          </div>
          <div>
            <label for="detune">Detune</label>
            <input type="range" name="detune" id="detune" value="${detune}">
          </div>
          <div>
            <label for="frequency">Frequency</label>
            <input type="range" name="frequency" id="frequency" min="0" max="3000" value="${frequency}">
          </div>
          <div>
            <label for="gain">Gain</label>
            <input type="range" name="gain" id="gain"  value="${gain}">
          </div>
        </form>
      </div>
    `;

    this.shadowRoots.querySelector('select').onchange = event => this.handleInputChange(event, this.attributes);
    this.shadowRoots.querySelectorAll('input').forEach((field) => {
      const field2 = field;
      field2.onchange = event => this.handleInputChange(event, this.attributes);
    });
    this.shadowRoots.querySelector('.delete')
      .addEventListener('click', () => this.handleDelete(id));
  }

  handleInputChange = (event, values) => {
    const { name, value } = event.target;

    const {
      detune: { value: detune },
      frequency: { value: frequency },
      gain: { value: gain },
      nodeType: { value: nodeType },
      type: { value: type },
      id: { value: id },
    } = values;

    const oldValues = {
      detune,
      frequency,
      gain,
      nodeType,
      type,
      id,
    };

    this.store.updateEffect({
      ...oldValues,
      [name]: value,
    });
  }

  handleDelete = (id) => {
    this.store.removeEffect(id);
  }
}
