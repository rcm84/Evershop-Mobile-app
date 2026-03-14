# ParticleLandscapeEngine

A production-focused starter kit for building **particle-based heightmap terrains** with Three.js.

This project turns the heightmap-to-particles concept into a reusable engine with:

- configurable particle terrain generation
- GPU shader rendering with distance fade
- atmospheric fog support
- interactive hover displacement
- circular mask interaction
- infinite terrain tiling
- procedural heightmap tooling with Perlin noise

## Installation

```bash
npm install
npm run dev
```

Open `http://localhost:5173` to browse demos.

## Usage

```js
import { ParticleLandscape } from './engine/index.js';

const terrain = new ParticleLandscape({
  container: document.getElementById('app'),
  heightmap: 'mountains.png',
  particleSize: 2,
  density: 1,
  fog: true,
  infinite: false
});

await terrain.init();

// Controls: mouse drag = orbit, wheel = zoom, WASD/arrow keys = move camera
```

### Config options

- `container`: target DOM element (`document.body` default)
- `heightmap`: image URL or image element
- `particleSize`: point sprite size multiplier
- `density`: particle sampling density (`1` = every pixel)
- `heightScale`: vertical amplitude
- `fog`: toggles atmospheric fog
- `infinite`: enable infinite tiled terrain mode
- `tileGrid`: odd-number tile grid (e.g., 3, 5)
- `cameraControls`: enables OrbitControls (default `true`)
- `moveSpeed`: keyboard movement speed for WASD/arrow input

## Architecture

```txt
engine/
 core/
   ParticleLandscape.js
   ParticleRenderer.js
   TerrainManager.js
 loaders/
   HeightmapLoader.js
 shaders/
   particle.vert
   particle.frag
   fog.frag
 effects/
   FogEffect.js
   HoverEffect.js
   MaskEffect.js
 utils/
   HeightmapUtils.js
   NoiseGenerator.js
```

## Heightmap conversion model

The engine uses `THREE.BufferGeometry` and maps each heightmap pixel as:

- `x = pixel x`
- `y = height value`
- `z = pixel y`

At `density: 1`, a 640×480 map generates 307,200 particles, meeting the 300k+ target.

## Demos

Each demo has `index.html` + `main.js`:

- `demos/basic-terrain`
- `demos/infinite-terrain`
- `demos/fog-landscape`
- `demos/alien-world`

Run directly with Vite:

```bash
npm run dev
```

Or open a specific demo directly:

```bash
npm run demo:basic
npm run demo:infinite
npm run demo:fog
npm run demo:alien
```

## Terrain tool: Perlin heightmap generator

Generate grayscale heightmaps from Perlin noise:

```bash
node terrain-tools/heightmap-generator.js --width=1024 --height=1024 --scale=120 --output=assets/mountains.pgm
```

Parameters:

- `--width`, `--height`
- `--scale`
- `--octaves`
- `--persistence`
- `--lacunarity`
- `--seed`
- `--output`

## Performance tips

- Start with `density: 0.5` on low-end GPUs.
- Cap pixel ratio with `Math.min(devicePixelRatio, 2)`.
- Use smaller point sizes when particle count is high.
- Keep infinite tile grids small (`3x3`) unless necessary.
- Prefer pre-baked heightmaps for predictable memory usage.

## Production notes

- Shader-based rendering minimizes CPU overhead.
- Typed arrays + BufferGeometry reduce GC pressure.
- Modular architecture is designed for extension (biomes, LOD, post effects).
