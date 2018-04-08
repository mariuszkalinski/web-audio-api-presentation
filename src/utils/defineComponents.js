export function defineComponents(componentsList) {
  componentsList.forEach((component) => {
    const [name, customElement] = component;
    customElements.define(name, customElement);
  });
}
