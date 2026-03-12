import { ParticleLandscape, NoiseGenerator } from '../../engine/index.js';

const canvas = document.createElement('canvas');
canvas.width = canvas.height = 700;
const ctx = canvas.getContext('2d');
const img = ctx.createImageData(canvas.width, canvas.height);
const noise = new NoiseGenerator(20);
for (let y = 0; y < canvas.height; y++) {
  for (let x = 0; x < canvas.width; x++) {
    const ridge = Math.abs(0.5 - noise.noise2D(x / 120, y / 120)) * 2;
    const v = Math.floor((1 - ridge) * 255);
    const i = (y * canvas.width + x) * 4;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
}
ctx.putImageData(img, 0, 0);

new ParticleLandscape({
  container: document.getElementById('app'),
  heightmap: canvas.toDataURL(),
  particleSize: 2.3,
  density: 1,
  fog: true
}).init();
