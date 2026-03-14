/**
 * MaskEffect updates per-particle alpha attenuation from a circular mask interaction.
 */
export class MaskEffect {
  constructor(radius = 22, softness = 6) {
    this.radius = radius;
    this.softness = softness;
  }

  applyToAttribute(attribute, positions, centerX, centerZ) {
    const arr = attribute.array;
    for (let i = 0, p = 0; i < arr.length; i++, p += 3) {
      const dx = positions[p] - centerX;
      const dz = positions[p + 2] - centerZ;
      const d = Math.sqrt(dx * dx + dz * dz);
      const edge = this.radius + this.softness;
      const mask = d <= this.radius ? 1 : Math.max(0, 1 - (d - this.radius) / (edge - this.radius));
      arr[i] = mask;
    }
    attribute.needsUpdate = true;
  }
}
