import { COLORS } from '../../../consts/colors';

export class AudioBuffer extends HTMLElement {
  constructor() {
    super();
    this.shadowRoots = this.attachShadow({
      mode: 'open',
    });
    this.shadowRoots.innerHTML = /* html */ `
      <style>
        :host {
          align-items: center;
          background: ${COLORS.GREEN_LIGHT};
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
          background: red;
          position: absolute;
          visibility: hidden;
        }
      </style>
      <span>B</span>
      <div>Buffer source</div>
    `;
  }
}
