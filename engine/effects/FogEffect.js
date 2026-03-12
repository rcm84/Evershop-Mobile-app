import * as THREE from 'three';

/**
 * FogEffect wraps Three.js fog to keep atmospheric settings centralized.
 */
export class FogEffect {
  constructor({ enabled = true, color = 0x90a4ae, near = 150, far = 700 } = {}) {
    this.enabled = enabled;
    this.color = new THREE.Color(color);
    this.near = near;
    this.far = far;
  }

  apply(scene) {
    scene.fog = this.enabled ? new THREE.Fog(this.color, this.near, this.far) : null;
    if (this.enabled) {
      scene.background = this.color.clone();
    }
  }
}
