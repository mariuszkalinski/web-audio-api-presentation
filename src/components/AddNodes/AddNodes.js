// import { COLORS } from '../../consts/colors';

export class AddNodes extends HTMLElement {
  constructor() {
    super();
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
    `;
  }
}
