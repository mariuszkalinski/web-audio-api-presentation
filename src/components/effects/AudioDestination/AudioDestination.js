export class AudioDestination extends HTMLElement {
  constructor() {
    super();
    this.shadowRoots = this.attachShadow({
      mode: 'open',
    });

    const {
      name,
    } = this.attributes;

    this.shadowRoots.innerHTML = /* html */ `
      <style>
        :host {
          display: block;
          width: 200px;
          height: 100%;
          background: green;
          border-radius: 5px;
        }
      </style>
      <h3>${name.value}</h3>
    `;
  }
}
