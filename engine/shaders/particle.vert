// Vertex shader for GPU-driven particle terrain rendering.
attribute float aHeight;
attribute float aMask;
varying float vHeight;
varying float vMask;
varying float vDepth;

uniform float uPointSize;
uniform float uDensity;
uniform vec2 uHover;
uniform float uHoverRadius;
uniform float uTime;

void main() {
  vec3 transformed = position;

  // Subtle animated movement can help avoid static-looking landscapes.
  transformed.y += sin((position.x + position.z) * 0.05 + uTime * 0.35) * 0.45;

  // Interactive hover lift.
  float hoverDistance = distance(position.xz, uHover);
  if (hoverDistance < uHoverRadius) {
    transformed.y += (1.0 - hoverDistance / uHoverRadius) * 6.0;
  }

  vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  // Keep point size perspective-correct and user-configurable.
  gl_PointSize = uPointSize * uDensity * (300.0 / -mvPosition.z);
  vHeight = aHeight;
  vMask = aMask;
  vDepth = -mvPosition.z;
}
