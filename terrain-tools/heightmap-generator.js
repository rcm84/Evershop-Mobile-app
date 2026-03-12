#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { NoiseGenerator } from '../engine/utils/NoiseGenerator.js';

/**
 * Generate a grayscale PGM heightmap using octave Perlin noise.
 * Example:
 * node terrain-tools/heightmap-generator.js --width=1024 --height=1024 --output=assets/mountains.pgm
 */
const args = Object.fromEntries(
  process.argv.slice(2).map((entry) => {
    const [key, value] = entry.replace(/^--/, '').split('=');
    return [key, value];
  })
);

const width = Number(args.width ?? 512);
const height = Number(args.height ?? 512);
const scale = Number(args.scale ?? 120);
const octaves = Number(args.octaves ?? 5);
const persistence = Number(args.persistence ?? 0.5);
const lacunarity = Number(args.lacunarity ?? 2.0);
const seed = Number(args.seed ?? 1337);
const output = args.output ?? 'heightmap.pgm';

const noise = new NoiseGenerator(seed);
const values = new Uint8Array(width * height);

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    let frequency = 1;
    let amplitude = 1;
    let maxAmplitude = 0;
    let value = 0;

    for (let o = 0; o < octaves; o++) {
      const nx = (x / scale) * frequency;
      const ny = (y / scale) * frequency;
      value += noise.noise2D(nx, ny) * amplitude;
      maxAmplitude += amplitude;
      amplitude *= persistence;
      frequency *= lacunarity;
    }

    values[y * width + x] = Math.floor((value / maxAmplitude) * 255);
  }
}

let pgm = `P2\n${width} ${height}\n255\n`;
for (let i = 0; i < values.length; i++) {
  pgm += `${values[i]} `;
  if ((i + 1) % width === 0) pgm += '\n';
}

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, pgm);
console.log(`Heightmap generated: ${output}`);
