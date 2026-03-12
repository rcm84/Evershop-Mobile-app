// Fragment shader for particles with circular sprite, mask attenuation and distance fade.
precision highp float;
varying float vHeight;
varying float vMask;
varying float vDepth;

uniform vec3 uColorLow;
uniform vec3 uColorHigh;
uniform float uFadeStart;
uniform float uFadeEnd;

void main() {
  // Draw circular particles from point sprites.
  vec2 center = gl_PointCoord - vec2(0.5);
  float r = length(center);
  if (r > 0.5) {
    discard;
  }

  float h = clamp(vHeight / 255.0, 0.0, 1.0);
  vec3 baseColor = mix(uColorLow, uColorHigh, h);

  // Distance-based alpha for depth fading.
  float depthFade = 1.0 - smoothstep(uFadeStart, uFadeEnd, vDepth);
  float alpha = (1.0 - smoothstep(0.38, 0.5, r)) * depthFade * vMask;

  gl_FragColor = vec4(baseColor, alpha);
}
