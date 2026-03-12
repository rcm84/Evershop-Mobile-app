import { ParticleLandscape, NoiseGenerator } from '../../engine/index.js';

function generateHeightmap(size = 512) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(size, size);
  const noise = new NoiseGenerator(42);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const v = Math.floor(noise.noise2D(x / 90, y / 90) * 255);
      const i = (y * size + x) * 4;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
  }

  ctx.putImageData(img, 0, 0);
  return canvas.toDataURL();
}

const terrain = new ParticleLandscape({
  container: document.getElementById('app'),
  heightmap: generateHeightmap(640),
  particleSize: 2,
  density: 1,
  fog: false
});

terrain.init();
