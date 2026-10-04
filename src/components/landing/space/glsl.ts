// GLSL shared by the landing shaders.

export const noiseGlsl = `
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);

  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p);
    p *= 2.03;
    amplitude *= 0.5;
  }
  return value;
}
`;

// finish() writes the pixel: tone-mapped light in the dark theme, or 1-bit
// ordered dithering in the page's ink color, where brighter light means
// denser dots on a transparent background.
export const finishGlsl = `
uniform float uInk;
uniform vec3 uInkColor;

float bayer(vec2 pixel) {
  vec2 p = mod(floor(pixel), 4.0);
  float index = p.x + p.y * 4.0;

  if (index < 1.0) return 0.0;
  if (index < 2.0) return 8.0;
  if (index < 3.0) return 2.0;
  if (index < 4.0) return 10.0;
  if (index < 5.0) return 12.0;
  if (index < 6.0) return 4.0;
  if (index < 7.0) return 14.0;
  if (index < 8.0) return 6.0;
  if (index < 9.0) return 3.0;
  if (index < 10.0) return 11.0;
  if (index < 11.0) return 1.0;
  if (index < 12.0) return 9.0;
  if (index < 13.0) return 15.0;
  if (index < 14.0) return 7.0;
  if (index < 15.0) return 13.0;
  return 5.0;
}

void finish(vec3 light) {
  vec3 mapped = 1.0 - exp(-light * 1.4);

  if (uInk < 0.5) {
    gl_FragColor = vec4(mapped, 1.0);
    return;
  }

  float luminance = dot(mapped, vec3(0.299, 0.587, 0.114));
  float threshold = (bayer(gl_FragCoord.xy / 2.0) + 0.5) / 16.0;
  float ink = step(threshold, pow(luminance, 0.8));

  gl_FragColor = vec4(uInkColor * ink, ink);
}
`;
