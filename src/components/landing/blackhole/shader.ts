// A Schwarzschild black hole with a thin accretion disc, ray traced in a
// fragment shader. Units are Schwarzschild radii: the horizon is at r = 1, the
// photon sphere at 1.5 and the disc spans 2.6..9. Light bends with the usual
// photon-orbit trick: a ray's acceleration is -1.5 h² r / |r|⁵, where h is its
// constant angular momentum, which gives the lensed arcs and the photon ring.

import { finishGlsl, noiseGlsl } from "../space/glsl";

export const fragmentSource = `
precision highp float;

uniform vec2 uResolution;
uniform float uTime;
uniform vec3 uDiscColor;
uniform float uZoom;

const float discInner = 2.6;
const float discOuter = 9.0;

${noiseGlsl}
${finishGlsl}

// Emission of the disc where a ray crosses it, with turbulent bands that orbit
// faster near the hole and a brighter side moving towards the camera. The
// alpha channel is how much light behind the disc it blocks.
vec4 disc(vec3 hit, vec3 direction) {
  float radius = length(hit.xz);
  float t = (radius - discInner) / (discOuter - discInner);

  float angle = atan(hit.z, hit.x);
  float orbit = angle + uTime * 2.2 / pow(radius, 1.5);

  float bands = noise(vec2(radius * 2.4, orbit * 3.0)) * 0.6 + noise(vec2(radius * 7.0, orbit * 9.0)) * 0.4;
  float falloff = pow(1.0 - t, 1.6) * smoothstep(0.0, 0.06, t);

  vec3 velocity = normalize(vec3(-hit.z, 0.0, hit.x));
  float doppler = 1.0 + 0.75 * dot(velocity, -direction);

  float intensity = falloff * (0.45 + 0.85 * bands) * doppler * doppler;
  vec3 hot = mix(uDiscColor, vec3(1.0, 0.97, 0.9), clamp(intensity * 0.55, 0.0, 1.0));

  return vec4(hot * intensity * 1.6, clamp(falloff * 1.4, 0.0, 0.85));
}

vec3 trace(vec2 uv) {
  vec3 origin = vec3(0.0, 1.15, -15.0);
  vec3 forward = normalize(-origin);
  vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), forward));
  vec3 up = cross(forward, right);

  vec3 direction = normalize(forward * uZoom + uv.x * right + uv.y * up);
  vec3 position = origin;

  vec3 momentum = cross(position, direction);
  float h2 = dot(momentum, momentum);

  vec3 color = vec3(0.0);
  float transmittance = 1.0;

  for (int i = 0; i < 360; i++) {
    float radius = length(position);
    if (radius < 1.0) {
      break;
    }
    if (radius > 60.0) {
      break;
    }

    float stepSize = clamp(0.06 * radius, 0.03, 0.6);
    vec3 next = position + direction * stepSize;

    if (position.y * next.y < 0.0) {
      vec3 hit = mix(position, next, position.y / (position.y - next.y));
      float hitRadius = length(hit.xz);

      if (hitRadius > discInner && hitRadius < discOuter) {
        vec4 emission = disc(hit, direction);
        color += transmittance * emission.rgb;
        transmittance *= 1.0 - emission.a;
      }
    }

    direction += -1.5 * h2 * position / pow(radius, 5.0) * stepSize;
    direction = normalize(direction);
    position = next;
  }

  return color;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / uResolution.y;

  finish(trace(uv));
}
`;
