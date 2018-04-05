export function loadSample(url) {
  return new Promise((resolve) => {
    const request = new XMLHttpRequest();

    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    request.onload = () => resolve(request.response);

    request.send();
  });
}
