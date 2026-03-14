import * as THREE from 'three';

/**
 * HoverEffect converts mouse coordinates into x/z world positions for shader interaction.
 */
export class HoverEffect {
  constructor(camera, domElement) {
    this.camera = camera;
    this.domElement = domElement;
    this.pointer = new THREE.Vector2();
    this.hover = new THREE.Vector2(1e5, 1e5);
    this.raycaster = new THREE.Raycaster();
    this.plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

    this.#onPointerMove = this.#onPointerMove.bind(this);
    domElement.addEventListener('pointermove', this.#onPointerMove);
  }

  update() {
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hit = new THREE.Vector3();
    this.raycaster.ray.intersectPlane(this.plane, hit);
    this.hover.set(hit.x, hit.z);
    return this.hover;
  }

  dispose() {
    this.domElement.removeEventListener('pointermove', this.#onPointerMove);
  }

  #onPointerMove(event) {
    const rect = this.domElement.getBoundingClientRect();
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }
}
