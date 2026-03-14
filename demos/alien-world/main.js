import { ParticleLandscape, NoiseGenerator } from '../../engine/index.js';

const c = document.createElement('canvas');
c.width = c.height = 768;
const ctx = c.getContext('2d');
const img = ctx.createImageData(c.width, c.height);
const noise = new NoiseGenerator(999);
for (let y = 0; y < c.height; y++) {
  for (let x = 0; x < c.width; x++) {
    const n1 = noise.noise2D(x / 90, y / 90);
    const n2 = noise.noise2D(x / 30, y / 30) * 0.35;
    const crater = Math.sin(x * 0.03) * Math.cos(y * 0.03) * 0.1;
    const v = Math.floor(Math.min(1, Math.max(0, n1 + n2 + crater)) * 255);
    const i = (y * c.width + x) * 4;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
}
ctx.putImageData(img, 0, 0);

new ParticleLandscape({
  container: document.getElementById('app'),
  heightmap: c.toDataURL(),
  particleSize: 1.7,
  density: 1,
  fog: true,
  infinite: true
}).init();
