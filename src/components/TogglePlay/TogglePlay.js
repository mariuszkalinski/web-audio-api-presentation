
import { autorun } from 'mobx';
import { store } from '../../store/rootStore';

export class TogglePlay extends HTMLElement {
  constructor() {
    super();
    this.store = store;
    this.shadowRoots = this.attachShadow({
      mode: 'open',
    });
    autorun(() => {
      const buttonValue = this.store.isPlaying ? 'Pause' : 'Play';
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

      <span id="playButton">${buttonValue}</span>
    `;
      this.shadowRoots.querySelector('#playButton').onclick = event => this.handleClick(event);
    });
  }

  handleClick = () => {
    this.store.togglePlayPause();
  }
}
