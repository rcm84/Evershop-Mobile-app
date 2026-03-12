import * as THREE from 'three';

/**
 * TerrainManager supports infinite terrain by repositioning terrain tiles around the camera.
 */
export class TerrainManager {
  constructor(tileSize = 256, tiles = 3) {
    this.tileSize = tileSize;
    this.tiles = tiles;
    this.tileMeshes = [];
    this.group = new THREE.Group();
  }

  addTile(points, tx, tz) {
    points.position.set(tx * this.tileSize, 0, tz * this.tileSize);
    points.userData.tile = { tx, tz };
    this.tileMeshes.push(points);
    this.group.add(points);
  }

  update(camera) {
    const half = Math.floor(this.tiles / 2);
    const cx = Math.floor(camera.position.x / this.tileSize);
    const cz = Math.floor(camera.position.z / this.tileSize);

    for (const points of this.tileMeshes) {
      const data = points.userData.tile;
      let dx = data.tx - cx;
      let dz = data.tz - cz;

      if (dx > half) data.tx -= this.tiles;
      else if (dx < -half) data.tx += this.tiles;

      if (dz > half) data.tz -= this.tiles;
      else if (dz < -half) data.tz += this.tiles;

      points.position.set(data.tx * this.tileSize, 0, data.tz * this.tileSize);
    }
  }
}
