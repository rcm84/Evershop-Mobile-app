import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { HeightmapLoader } from '../loaders/HeightmapLoader.js';
import { HeightmapUtils } from '../utils/HeightmapUtils.js';
import { ParticleRenderer } from './ParticleRenderer.js';
import { TerrainManager } from './TerrainManager.js';
import { FogEffect } from '../effects/FogEffect.js';
import { HoverEffect } from '../effects/HoverEffect.js';
import { MaskEffect } from '../effects/MaskEffect.js';

/**
 * Main engine entry point.
 *
 * Usage:
 * const terrain = new ParticleLandscape({ heightmap: 'mountains.png', particleSize: 2, density: 1, fog: true })
 */
export class ParticleLandscape {
  constructor(config = {}) {
    this.config = {
      container: document.body,
      heightmap: '',
      particleSize: 2,
      density: 1,
      heightScale: 95,
      fog: true,
      infinite: false,
      tileGrid: 3,
      cameraControls: true,
      moveSpeed: 140,
      ...config
    };

    this.scene = new THREE.Scene();
    this.clock = new THREE.Clock();
    this.camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 3000);
    this.camera.position.set(130, 180, 250);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.config.container.appendChild(this.renderer.domElement);

    this.controls = null;
    if (this.config.cameraControls) {
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.target.set(110, 30, 110);
      this.controls.update();
    }

    this.keys = new Set();
    this.heightmapLoader = new HeightmapLoader();
    this.particleRenderer = new ParticleRenderer(this.config);
    this.maskEffect = new MaskEffect();
    this.hoverEffect = new HoverEffect(this.camera, this.renderer.domElement);
    this.fogEffect = new FogEffect({ enabled: this.config.fog });
    this.terrainManager = null;

    this.#onResize = this.#onResize.bind(this);
    this.#onKeyDown = this.#onKeyDown.bind(this);
    this.#onKeyUp = this.#onKeyUp.bind(this);

    window.addEventListener('resize', this.#onResize);
    window.addEventListener('keydown', this.#onKeyDown);
    window.addEventListener('keyup', this.#onKeyUp);
  }

  async init() {
    const map = await this.heightmapLoader.load(this.config.heightmap);
    const geometry = this.#buildGeometry(map, this.config.density, this.config.heightScale);

    if (this.config.infinite) {
      this.terrainManager = new TerrainManager(map.width, this.config.tileGrid);
      const half = Math.floor(this.config.tileGrid / 2);
      for (let x = -half; x <= half; x++) {
        for (let z = -half; z <= half; z++) {
          const tile = this.particleRenderer.createPoints(geometry.clone());
          this.terrainManager.addTile(tile, x, z);
        }
      }
      this.scene.add(this.terrainManager.group);
    } else {
      this.points = this.particleRenderer.createPoints(geometry);
      this.scene.add(this.points);
    }

    this.fogEffect.apply(this.scene);
    this.animate();
  }

  animate() {
    this._raf = requestAnimationFrame(() => this.animate());
    const delta = this.clock.getDelta();
    const t = this.clock.elapsedTime;

    this.#updateKeyboardMove(delta);
    if (this.controls) this.controls.update();

    const hover = this.hoverEffect.update();
    this.particleRenderer.update(t, hover);

    const target = this.points || this.terrainManager?.tileMeshes[0];
    if (target) {
      this.maskEffect.applyToAttribute(
        target.geometry.getAttribute('aMask'),
        target.geometry.getAttribute('position').array,
        hover.x - target.position.x,
        hover.y - target.position.z
      );
    }

    if (this.terrainManager) this.terrainManager.update(this.camera);
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    cancelAnimationFrame(this._raf);
    this.hoverEffect.dispose();
    if (this.controls) this.controls.dispose();
    window.removeEventListener('resize', this.#onResize);
    window.removeEventListener('keydown', this.#onKeyDown);
    window.removeEventListener('keyup', this.#onKeyUp);
    this.renderer.dispose();
  }

  #updateKeyboardMove(delta) {
    const speed = this.config.moveSpeed * delta;
    if (!speed) return;

    const forward = new THREE.Vector3();
    this.camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

    if (this.keys.has('w') || this.keys.has('arrowup')) this.camera.position.addScaledVector(forward, speed);
    if (this.keys.has('s') || this.keys.has('arrowdown')) this.camera.position.addScaledVector(forward, -speed);
    if (this.keys.has('a') || this.keys.has('arrowleft')) this.camera.position.addScaledVector(right, speed);
    if (this.keys.has('d') || this.keys.has('arrowright')) this.camera.position.addScaledVector(right, -speed);

  }

  #buildGeometry(heightmap, density, heightScale) {
    const { width, height, data } = heightmap;
    const step = Math.max(1, Math.floor(1 / density));
    const countX = Math.ceil(width / step);
    const countZ = Math.ceil(height / step);
    const count = countX * countZ;

    const positions = new Float32Array(count * 3);
    const heights = new Float32Array(count);
    const mask = new Float32Array(count);

    let p = 0;
    let i = 0;
    for (let z = 0; z < height; z += step) {
      for (let x = 0; x < width; x += step) {
        const value = HeightmapUtils.sample(data, width, x, z);
        positions[p++] = x;
        positions[p++] = HeightmapUtils.normalize(value) * heightScale;
        positions[p++] = z;

        heights[i] = value;
        mask[i] = 1;
        i++;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aHeight', new THREE.BufferAttribute(heights, 1));
    geometry.setAttribute('aMask', new THREE.BufferAttribute(mask, 1));
    geometry.computeBoundingSphere();
    return geometry;
  }

  #onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  #onKeyDown(event) {
    this.keys.add(event.key.toLowerCase());
  }

  #onKeyUp(event) {
    this.keys.delete(event.key.toLowerCase());
  }
}
