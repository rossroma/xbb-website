<template>
  <canvas ref="canvasRef" class="gradient-waves-canvas" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  /** 地平线颜色 (hex) */
  horizonColor?: string
  /** 波浪颜色 (hex) */
  waveColor?: string
  /** 波峰高亮色 (hex) */
  crestColor?: string
  /** 动画速度 */
  speed?: number
  /** 波浪幅度 */
  amplitude?: number
  /** 波浪缩放 */
  waveScale?: number
  /** 波浪比例 */
  waveRatio?: number
  /** 膨胀量 */
  swell?: number
  /** 湍流 */
  turbulence?: number
  /** 倾斜角度 */
  tilt?: number
  /** 缩放 */
  zoom?: number
  /** 高度 */
  height?: number
  /** 雾深度 */
  fogDepth?: number
  /** 细节等级: 'low' | 'medium' | 'high' */
  detail?: 'low' | 'medium' | 'high'
  /** 亮度 */
  brightness?: number
  /** 透明度 */
  opacity?: number
  /** 鼠标交互 */
  mouseInteraction?: boolean
  /** 视差强度 */
  parallaxStrength?: number
  /** 胶片颗粒 */
  grain?: boolean
  /** 颗粒强度 */
  grainIntensity?: number
  background?: string
}

const props = withDefaults(defineProps<Props>(), {
  horizonColor: '#5227FF',
  waveColor: '#FF9FFC',
  crestColor: '#FFFFFF',
  speed: 0.4,
  amplitude: 2.5,
  waveScale: 0.6,
  waveRatio: 0.9,
  swell: 35,
  turbulence: 20,
  tilt: 1.11,
  zoom: 1,
  height: 5.5,
  fogDepth: 15,
  detail: 'medium',
  brightness: 1,
  opacity: 1,
  mouseInteraction: true,
  parallaxStrength: 0.5,
  grain: true,
  grainIntensity: 0.05,
  background: '#0A0814;',
})

const canvasRef = ref<HTMLCanvasElement | null>(null)
let animationId = 0
let gl: WebGL2RenderingContext | null = null
let uniforms = {} as Record<string, WebGLUniformLocation | null | undefined>
let startedAt = 0

// Vertex shader
const vertexShaderSource = `#version 300 es
in vec2 position;

void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`

// Fragment shader
const fragmentShaderSource = `#version 300 es
precision highp float;

uniform vec2 iResolution;
uniform float iTime;
uniform float uSpeed;
uniform float uAmplitude;
uniform float uWaveScale;
uniform float uWaveRatio;
uniform float uSwell;
uniform float uTurbulence;
uniform float uTilt;
uniform float uZoom;
uniform float uHeight;
uniform float uFogDepth;
uniform float uSteps;
uniform float uBrightness;
uniform float uOpacity;
uniform float uGrain;
uniform float uGrainIntensity;
uniform vec2 uMouse;
uniform float uParallax;
uniform bool uEnableMouse;
uniform vec3 uHorizonColor;
uniform vec3 uWaveColor;
uniform vec3 uCrestColor;

out vec4 fragColor;

const float MAX_DIST = 20000.0;

float hash21(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float plasma(vec3 r, vec2 freq, vec4 tc) {
  float mx = r.x + tc.x;
  mx += uSwell * sin((r.y + mx) / 20.0 + tc.y);

  float my = r.y - tc.z;
  my += uTurbulence * cos(r.x / 23.0 + tc.w);

  return r.z - (
    sin(mx * freq.x) * uAmplitude +
    sin(my * freq.y) * uAmplitude +
    uHeight
  );
}

float raymarch(vec3 pos, vec3 dir, vec2 freq, vec4 tc) {
  float dist = 0.0;

  for (int i = 0; i < 128; i++) {
    if (float(i) >= uSteps) break;

    float dscene = plasma(pos + dist * dir, freq, tc);

    if (abs(dscene) < 0.1) break;

    dist += 0.9 * dscene;

    if (!(abs(dist) < MAX_DIST)) {
      return MAX_DIST;
    }
  }

  return dist;
}

void main() {
  float T = iTime * uSpeed;

  vec2 freq = vec2(
    uWaveScale / 7.0,
    (uWaveScale * uWaveRatio) / 3.0
  );

  vec4 tc = vec4(
    T / 0.130,
    T / 0.810,
    T / 0.200,
    T / 0.710
  );

  float c;
  float s;

  float vfov = (3.14159 / 2.3) / max(uZoom, 0.05);
  vec3 cam = vec3(0.0, 0.0, 30.0);

  vec2 uv = (gl_FragCoord.xy / iResolution.xy) - 0.5;
  uv.x *= iResolution.x / iResolution.y;
  uv.y *= -1.0;

  vec3 dir = vec3(0.0, 0.0, -1.0);
  float ulen = length(uv);
  float xrot = vfov * ulen;

  c = cos(xrot);
  s = sin(xrot);

  dir = mat3(
    1.0, 0.0, 0.0,
    0.0, c, -s,
    0.0, s, c
  ) * dir;

  vec2 nuv = ulen > 1e-5
    ? uv / ulen
    : vec2(1.0, 0.0);

  c = nuv.x;
  s = nuv.y;

  dir = mat3(
    c, -s, 0.0,
    s, c, 0.0,
    0.0, 0.0, 1.0
  ) * dir;

  c = cos(uTilt);
  s = sin(uTilt);

  dir = mat3(
    c, 0.0, s,
    0.0, 1.0, 0.0,
    -s, 0.0, c
  ) * dir;

  if (uEnableMouse) {
    float yaw = (uMouse.x - 0.5) * uParallax * 0.4;
    float pitch = (uMouse.y - 0.5) * uParallax * 0.4;

    c = cos(yaw);
    s = sin(yaw);

    dir = mat3(
      c, 0.0, s,
      0.0, 1.0, 0.0,
      -s, 0.0, c
    ) * dir;

    c = cos(pitch);
    s = sin(pitch);

    dir = mat3(
      1.0, 0.0, 0.0,
      0.0, c, -s,
      0.0, s, c
    ) * dir;
  }

  float dist = raymarch(cam, dir, freq, tc);
  vec3 pos = cam + dist * dir;

  float t = clamp(
    uFogDepth / max(dist, 0.001),
    0.0,
    1.0
  );

  vec3 body = mix(
    uWaveColor,
    uCrestColor,
    clamp(pos.z * 0.08 + 0.5, 0.0, 1.0)
  );

  vec3 col = mix(uHorizonColor, body, t);
  col = clamp(col * uBrightness, 0.0, 1.0);

  float alpha = clamp(t, 0.0, 1.0) * uOpacity;

  if (uGrain > 0.5) {
    float g = hash21(
      gl_FragCoord.xy +
      mod(iTime, 64.0) * 11.0
    );

    alpha += (g - 0.5) * uGrainIntensity;
  }

  alpha = clamp(alpha, 0.0, 1.0);
  fragColor = vec4(col * alpha, alpha);
}`

function hexToRgb(hex: string): [number, number, number] {
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!match) return [1, 1, 1]
  return [
    parseInt(match[1]!, 16) / 255,
    parseInt(match[2]!, 16) / 255,
    parseInt(match[3]!, 16) / 255,
  ]
}

function detailToSteps(detail: 'low' | 'medium' | 'high'): number {
  if (detail === 'low') return 40
  if (detail === 'high') return 110
  return 70
}

function compileShader(context: WebGL2RenderingContext, type: number, source: string): WebGLShader {
  const shader = context.createShader(type)!
  context.shaderSource(shader, source)
  context.compileShader(shader)
  if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
    const message = context.getShaderInfoLog(shader)
    context.deleteShader(shader)
    throw new Error(message || 'Shader compile error')
  }
  return shader
}

function initWebGL(canvas: HTMLCanvasElement): WebGL2RenderingContext | null {
  const context = canvas.getContext('webgl2', {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    powerPreference: 'high-performance',
  })
  if (!context) return null

  const program = context.createProgram()!
  const vs = compileShader(context, context.VERTEX_SHADER, vertexShaderSource)
  const fs = compileShader(context, context.FRAGMENT_SHADER, fragmentShaderSource)
  context.attachShader(program, vs)
  context.attachShader(program, fs)
  context.linkProgram(program)
  context.deleteShader(vs)
  context.deleteShader(fs)

  if (!context.getProgramParameter(program, context.LINK_STATUS)) {
    const message = context.getProgramInfoLog(program)
    context.deleteProgram(program)
    throw new Error(message || 'Program link error')
  }

  context.useProgram(program)

  // Setup geometry
  const vao = context.createVertexArray()!
  context.bindVertexArray(vao)
  const buffer = context.createBuffer()!
  context.bindBuffer(context.ARRAY_BUFFER, buffer)
  context.bufferData(context.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), context.STATIC_DRAW)

  const posLoc = context.getAttribLocation(program, 'position')
  context.enableVertexAttribArray(posLoc)
  context.vertexAttribPointer(posLoc, 2, context.FLOAT, false, 0, 0)

  // Uniforms
  const uniformNames = [
    'iResolution', 'iTime', 'uSpeed', 'uAmplitude', 'uWaveScale', 'uWaveRatio',
    'uSwell', 'uTurbulence', 'uTilt', 'uZoom', 'uHeight', 'uFogDepth',
    'uSteps', 'uBrightness', 'uOpacity', 'uGrain', 'uGrainIntensity',
    'uMouse', 'uParallax', 'uEnableMouse', 'uHorizonColor', 'uWaveColor', 'uCrestColor',
  ]
  uniforms = {}
  for (const name of uniformNames) {
    uniforms[name] = context.getUniformLocation(program, name)
  }

  // Set static uniforms
  context.uniform1f(uniforms.uSpeed!, props.speed)
  context.uniform1f(uniforms.uAmplitude!, props.amplitude)
  context.uniform1f(uniforms.uWaveScale!, props.waveScale)
  context.uniform1f(uniforms.uWaveRatio!, props.waveRatio)
  context.uniform1f(uniforms.uSwell!, props.swell)
  context.uniform1f(uniforms.uTurbulence!, props.turbulence)
  context.uniform1f(uniforms.uTilt!, props.tilt)
  context.uniform1f(uniforms.uZoom!, props.zoom)
  context.uniform1f(uniforms.uHeight!, props.height)
  context.uniform1f(uniforms.uFogDepth!, props.fogDepth)
  context.uniform1f(uniforms.uSteps!, detailToSteps(props.detail))
  context.uniform1f(uniforms.uBrightness!, props.brightness)
  context.uniform1f(uniforms.uOpacity!, props.opacity)
  context.uniform1f(uniforms.uGrain!, props.grain ? 1 : 0)
  context.uniform1f(uniforms.uGrainIntensity!, props.grainIntensity)
  context.uniform1f(uniforms.uParallax!, props.parallaxStrength)
  context.uniform1i(uniforms.uEnableMouse!, props.mouseInteraction ? 1 : 0)
  context.uniform3fv(uniforms.uHorizonColor!, hexToRgb(props.horizonColor))
  context.uniform3fv(uniforms.uWaveColor!, hexToRgb(props.waveColor))
  context.uniform3fv(uniforms.uCrestColor!, hexToRgb(props.crestColor))

  context.clearColor(0, 0, 0, 0)
  context.enable(context.BLEND)
  context.blendFunc(context.ONE, context.ONE_MINUS_SRC_ALPHA)

  return context
}

function resize(canvas: HTMLCanvasElement, context: WebGL2RenderingContext) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const width = Math.max(1, Math.round(canvas.clientWidth * dpr))
  const height = Math.max(1, Math.round(canvas.clientHeight * dpr))
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width
    canvas.height = height
    context.viewport(0, 0, width, height)
    context.uniform2f(uniforms.iResolution!, width, height)
  }
}

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return

  const context = initWebGL(canvas)
  if (!context) return
  gl = context

  const currentMouse: [number, number] = [0.5, 0.5]
  const targetMouse: [number, number] = [0.5, 0.5]

  canvas.addEventListener('pointermove', (event) => {
    const rect = canvas.getBoundingClientRect()
    targetMouse[0] = (event.clientX - rect.left) / rect.width
    targetMouse[1] = 1 - (event.clientY - rect.top) / rect.height
  })

  canvas.addEventListener('pointerleave', () => {
    targetMouse[0] = 0.5
    targetMouse[1] = 0.5
  })

  startedAt = performance.now()

  function render(now: number) {
    resize(canvas!, gl!)

    const mx = props.mouseInteraction ? targetMouse[0] : 0.5
    const my = props.mouseInteraction ? targetMouse[1] : 0.5
    currentMouse[0] += 0.05 * (mx - currentMouse[0])
    currentMouse[1] += 0.05 * (my - currentMouse[1])

    gl!.uniform1f(uniforms.iTime!, (now - startedAt) * 0.001)
    gl!.uniform2fv(uniforms.uMouse!, currentMouse)
    gl!.clear(gl!.COLOR_BUFFER_BIT)
    gl!.drawArrays(gl!.TRIANGLES, 0, 3)

    animationId = requestAnimationFrame(render)
  }

  animationId = requestAnimationFrame(render)
})

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId)
  // Cleanup WebGL context
  if (gl) {
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    gl = null
  }
})
</script>

<style scoped>
.gradient-waves-canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
