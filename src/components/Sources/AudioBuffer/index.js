export class AudioBuffer extends HTMLElement {
  constructor() {
    super();
    this.shadowRoots = this.attachShadow({
      mode: 'open',
    });
    this.shadowRoots.innerHTML = /* html */ `
      <style>
        :host {
          display: block;
          width: 200px;
          height: 100%;
          background: blue;
          border-radius: 5px;
        }
        div {
          background: red;
        }
      </style>
      <div>siema</div>
    `;
  }
}
