export class AudioStream extends HTMLElement {
  constructor() {
    super();
    this.shadowRoots = this.attachShadow({
      mode: 'open',
    });
    this.shadowRoots.innerHTML = /* html */ `
      <style>
        :host {
          display: flex;
          width: 100%;
          height: 200px;
          background-color: silver;
          border-radius: 5px;
        }
      </style>
      <audio-buffer></audio-buffer>
      <audio-filter></audio-filter>
      <audio-destination></audio-destination>
    `;
  }
}
