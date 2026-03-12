/**
 * HeightmapLoader loads images and converts pixel luminance to a typed height array.
 * This works in the browser and keeps image parsing detached from rendering concerns.
 */
export class HeightmapLoader {
  /**
   * @param {string|HTMLImageElement} source - URL or preloaded image.
   * @returns {Promise<{width:number,height:number,data:Uint8Array}>}
   */
  async load(source) {
    const image = typeof source === 'string' ? await this.#loadImage(source) : source;

    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(image, 0, 0);

    const { data: rgba } = ctx.getImageData(0, 0, image.width, image.height);
    const heights = new Uint8Array(image.width * image.height);

    for (let i = 0, p = 0; i < rgba.length; i += 4, p++) {
      // Standard luminance calculation from RGB.
      heights[p] = Math.round(0.2126 * rgba[i] + 0.7152 * rgba[i + 1] + 0.0722 * rgba[i + 2]);
    }

    return { width: image.width, height: image.height, data: heights };
  }

  #loadImage(src) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.onload = () => resolve(image);
      image.onerror = (error) => reject(new Error(`Failed to load heightmap: ${src} (${error})`));
      image.src = src;
    });
  }
}
