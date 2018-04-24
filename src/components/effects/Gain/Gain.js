import { store } from '../../../store/rootStore';
import { COLORS } from '../../../consts/colors';

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
          align-items: center;
          background: ${COLORS.GREEN_DARK};
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
      <span>G</span>
      <div>
        <h4>Gain attributes</h4>
        <h3>${name.value}</h3>
        <form>
          <div>
            <label for="value">Value</label>
            <input type="range" name="value" id="value" value="${value}">
          </div>
        </form>
      </div>
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
