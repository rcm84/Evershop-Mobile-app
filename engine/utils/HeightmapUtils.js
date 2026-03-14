/**
 * Utility helpers for transforming heightmaps into terrain-friendly data.
 */
export const HeightmapUtils = {
  normalize(value, min = 0, max = 255) {
    return (value - min) / (max - min);
  },

  sample(data, width, x, y) {
    return data[y * width + x];
  }
};
