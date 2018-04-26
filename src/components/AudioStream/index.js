import { reaction } from 'mobx';
import { store } from '../../store/rootStore';
import { COLORS } from '../../consts/colors';

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
          flex-direction: row;
          width: calc(100% - 180px);
          height: 100px;
          border-radius: 5px;
          padding: 0 90px;
        }

        :host div {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          width: 100%;
          position: relative;
          margin-top: 100px;
        }

        :host div:after {
          content: '';
          width: 100%;
          height: 3px;
          background: ${COLORS.SILVER};
          position: absolute;
          top: 49%;
          z-index: 1;
        }
      </style>
      <div id="streamView"></div>
    `;
    this.onComponentLoad(this.store.effectsList);
    this.onUpdateStream();
  }

  onComponentLoad = (effects) => {
    const properHtml = effects.reduce((accumulator, element) => {
      if (element.nodeType === 'filter') {
        return `${accumulator}
          <audio-filter
           frequency="${element.frequency}"
           name="${element.name}"
           gain="${element.gain}"
           detune="${element.detune}"
           type="${element.type}"
           nodeType="${element.nodeType}"
           id="${element.id}"
          ></audio-filter>
        `;
      }

      if (element.nodeType === 'bufferSource') {
        return `${accumulator}
          <audio-buffer
            id="${element.id}"
            sourceUrl="${element.sourceUrl}"
            nodeType="${element.nodeType}"
          ></audio-buffer>
        `;
      }

      if (element.nodeType === 'gain') {
        return `${accumulator}
          <audio-gain
            id="${element.id}"
            value="${element.value}"
            nodeType="${element.nodeType}"
          ></audio-gain>
        `;
      }

      if (element.nodeType === 'destination') {
        return `${accumulator}
          <audio-destination
            name="${element.name}"
          ></audio-destination>
        `;
      }

      if (element.nodeType === 'oscillator') {
        return `${accumulator}
          <audio-oscillator
            nodeType="${element.nodeType}"
            type="${element.type}"
            frequency="${element.frequency}"
            detune="${element.detune}"
            id="${element.id}"
          ></audio-oscillator>
        `;
      }

      return accumulator;
    }, '');
    this.shadowRoots.querySelector('#streamView').innerHTML = properHtml;
  }

  onUpdateStream = () => {
    reaction(
      () => this.store.effectsList,
      effectsList => this.onComponentLoad(effectsList),
    );
  }
}

