export class TogglePlay extends HTMLElement {
  constructor() {
    super();
    this.shadowRoots = this.attachShadow({
      mode: 'open',
    });
    this.shadowRoots.innerHTML = /* html */ `
      <style>
        :host {
          display: block;
          width: 50px;
          height: 50px;
          background-color: red;
          border-radius: 50%;
        }
      </style>
    `;
  }
}
