/**
 * Lightweight 2D Perlin noise generator.
 * This is intentionally dependency-free for use in demos and tooling.
 */
export class NoiseGenerator {
  constructor(seed = 1337) {
    this.seed = seed;
    this.permutation = this.#buildPermutationTable(seed);
  }

  noise2D(x, y) {
    const xi = Math.floor(x) & 255;
    const yi = Math.floor(y) & 255;
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);

    const u = this.#fade(xf);
    const v = this.#fade(yf);

    const aa = this.permutation[this.permutation[xi] + yi];
    const ab = this.permutation[this.permutation[xi] + yi + 1];
    const ba = this.permutation[this.permutation[xi + 1] + yi];
    const bb = this.permutation[this.permutation[xi + 1] + yi + 1];

    const x1 = this.#lerp(this.#grad(aa, xf, yf), this.#grad(ba, xf - 1, yf), u);
    const x2 = this.#lerp(this.#grad(ab, xf, yf - 1), this.#grad(bb, xf - 1, yf - 1), u);

    return (this.#lerp(x1, x2, v) + 1) * 0.5;
  }

  #fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
  #lerp(a, b, t) { return a + t * (b - a); }

  #grad(hash, x, y) {
    const h = hash & 3;
    const u = h < 2 ? x : y;
    const v = h < 2 ? y : x;
    return ((h & 1) ? -u : u) + ((h & 2) ? -2 * v : 2 * v);
  }

  #buildPermutationTable(seed) {
    const p = Array.from({ length: 256 }, (_, i) => i);
    let state = seed;

    const random = () => {
      state = (state * 1664525 + 1013904223) >>> 0;
      return state / 0x100000000;
    };

    for (let i = p.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [p[i], p[j]] = [p[j], p[i]];
    }

    return [...p, ...p];
  }
}
