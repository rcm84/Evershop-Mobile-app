// Reusable fog blend function for screen-space style atmospheric scattering.
vec4 applyFog(vec4 color, float depth, vec3 fogColor, float fogNear, float fogFar) {
  float fogFactor = smoothstep(fogNear, fogFar, depth);
  return vec4(mix(color.rgb, fogColor, fogFactor), color.a);
}
