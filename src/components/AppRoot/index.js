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
          color: ${COLORS.SILVER};
          display: block;
          width: 100%;
          height: 100%;
          background-color: ${COLORS.MOONROCK};
        }
      </style>
      <add-nodes></add-nodes>
      <audio-stream></audio-stream>
    `;
  }
}
