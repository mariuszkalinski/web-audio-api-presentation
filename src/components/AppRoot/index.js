import { COLORS } from '../../consts/colors';

export class AppRoot extends HTMLElement {
  constructor() {
    super();
    this.shadowRoots = this.attachShadow({
      mode: 'open',
    });
    this.shadowRoots.innerHTML = /* html */ `
      <style>
        :host {
          display: block;
          width: 100%;
          height: 100%;
          background-color: ${COLORS.MOONROCK};
        }
      </style>
      <toggle-play></toggle-play>
      <audio-stream></audio-stream>
    `;
  }
}
