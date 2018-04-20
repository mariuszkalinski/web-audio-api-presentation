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
          height: auto;
        }
      </style>
      <toggle-play></toggle-play>
      <audio-stream></audio-stream>
    `;
  }
}
