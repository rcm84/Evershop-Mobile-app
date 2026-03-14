import { ParticleLandscape, NoiseGenerator } from '../../engine/index.js';

const build = (size = 384) => {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  const d = ctx.createImageData(size, size);
  const noise = new NoiseGenerator(7);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const v = Math.floor(noise.noise2D(x / 64, y / 64) * 255);
      const i = (y * size + x) * 4;
      d.data[i] = d.data[i + 1] = d.data[i + 2] = v;
      d.data[i + 3] = 255;
    }
  }
  ctx.putImageData(d, 0, 0);
  return c.toDataURL();
};

const terrain = new ParticleLandscape({
  container: document.getElementById('app'),
  heightmap: build(),
  particleSize: 1.8,
  density: 1,
  fog: true,
  infinite: true,
  tileGrid: 3
});
terrain.init();
