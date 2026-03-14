import * as THREE from 'three';
import particleVertex from '../shaders/particle.vert?raw';
import particleFragment from '../shaders/particle.frag?raw';

/**
 * ParticleRenderer owns material creation and point cloud lifecycle.
 */
export class ParticleRenderer {
  constructor({ particleSize = 2, density = 1, fadeStart = 380, fadeEnd = 900 } = {}) {
    this.uniforms = {
      uPointSize: { value: particleSize },
      uDensity: { value: density },
      uHover: { value: new THREE.Vector2(1e5, 1e5) },
      uHoverRadius: { value: 35 },
      uTime: { value: 0 },
      uColorLow: { value: new THREE.Color('#29434e') },
      uColorHigh: { value: new THREE.Color('#dcedc8') },
      uFadeStart: { value: fadeStart },
      uFadeEnd: { value: fadeEnd }
    };
  }

  createPoints(geometry) {
    const material = new THREE.ShaderMaterial({
      vertexShader: particleVertex,
      fragmentShader: particleFragment,
      uniforms: this.uniforms,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false
    });

    return new THREE.Points(geometry, material);
  }

  update(timeSeconds, hover) {
    this.uniforms.uTime.value = timeSeconds;
    if (hover) this.uniforms.uHover.value.copy(hover);
  }
}
