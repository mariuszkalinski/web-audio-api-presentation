import { reaction } from 'mobx';
import { store } from '../../store/rootStore';

export class AudioStream extends HTMLElement {
  constructor() {
    super();
    this.store = store;
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
      <div id="streamView"></div>
    `;
    this.onComponentLoad();
    this.onUpdateStream();
  }

  onComponentLoad = () => {
    const properHtml = this.store.effectsList.reduce((accumulator, element) => {
      if (element.nodeType === 'filter') {
        return `${accumulator}
          <audio-filter
           frequency="${element.frequency}"
           name="${element.name}"
           gain="${element.gain}"
           detune="${element.detune}"
           type="${element.type}"
          ></audio-filter>
        `;
      }
      if (element.nodeType === 'bufferSource') {
        return `${accumulator}
          <audio-buffer></audio-buffer>
        `;
      }
      return accumulator;
    }, '');
    this.shadowRoots.querySelector('#streamView').innerHTML = properHtml;
  }

  onUpdateStream = () => {
    reaction(
      () => this.store.effectsList,
      (effectsList) => {
        const properHtml = effectsList.reduce((accumulator, element) => {
          if (element.nodeType === 'filter') {
            return `${accumulator}<audio-filter></audio-filter>`;
          }
          return accumulator;
        }, '');
        this.shadowRoots.innerHTML = properHtml;
      },
    );
  }
}

