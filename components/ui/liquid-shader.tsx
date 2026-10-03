import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export interface LiquidShaderProps {
  className?: string;
  style?: React.CSSProperties;
}

const VERTEX_SHADER = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_iterations;
uniform float u_reduced_motion;

varying vec2 vUv;

// Exact MAK BUILD Color Flow: Deep Navy -> Architectural Blue -> Subtle Metallic Gold -> Soft White
const vec3 cDeepNavy  = vec3(0.0275, 0.0667, 0.1216); // #07111F
const vec3 cNavy1     = vec3(0.0431, 0.1647, 0.2902); // #0B2A4A
const vec3 cBlueMid   = vec3(0.0706, 0.2471, 0.4392); // #123F70
const vec3 cBlueHigh  = vec3(0.1059, 0.3608, 0.6196); // #1B5C9E

const vec3 cGoldBase  = vec3(0.8314, 0.6863, 0.2157); // #D4AF37
const vec3 cGoldMid   = vec3(0.9059, 0.7804, 0.4000); // #E7C766
const vec3 cGoldLight = vec3(0.9529, 0.8314, 0.4667); // #F3D477

const vec3 cSoftWhite = vec3(0.9176, 0.9412, 0.9647); // #EAF0F6

mat2 rot2D(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat2(c, -s, s, c);
}

float map(vec3 p, float t) {
  p.xz *= rot2D(t * 0.08);
  p.xy *= rot2D(t * 0.05);
  vec3 q = p * 1.25 + vec3(t * 0.07, t * 0.045, t * 0.06);
  float s = sin(q.x + sin(q.z + sin(q.y))) * 0.52;
  return length(p * 0.72) * log(length(p) + 1.0) + s - 1.15;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
  
  // Lively flow: time multiplier about 0.5 on desktop
  float t = u_time * (u_reduced_motion > 0.5 ? 0.0 : 0.50);
  
  // Slow drifting of the uv origin (a gentle sin/cos offset) so the nebula floats across the screen
  vec2 drift = vec2(sin(t * 0.20) * 0.16, cos(t * 0.15) * 0.12);
  uv += drift;
  
  // Optional very gentle mouse parallax (small offset, smoothed)
  uv += u_mouse * 0.035;

  vec3 col = cDeepNavy;
  float d = 2.4;
  vec3 ro = vec3(0.0, 0.0, 4.6);
  vec3 rd = normalize(vec3(uv, -1.0));
  
  // 4 loop iterations accumulating col
  for (int i = 0; i < 4; i++) {
    vec3 p = ro + rd * d;
    float rz = map(p, t);
    float f = clamp((rz - map(p + 0.14, t)) * 0.5, -0.1, 1.0);
    
    // Base navy/blue (#0B2A4A, #123F70, #1B5C9E)
    vec3 blueCol = mix(cNavy1, cBlueMid, clamp(f * 1.3, 0.0, 1.0));
    blueCol = mix(blueCol, cBlueHigh, clamp(f * 2.2 - 0.6, 0.0, 1.0));
    col += blueCol * (smoothstep(2.4, 0.0, rz) * 0.34);
    
    // The f-driven highlight in gold (#D4AF37, #E7C766, #F3D477)
    float goldWave = sin(p.x * 0.58 + p.y * 0.42 - t * 0.32);
    float goldFactor = smoothstep(0.72, 0.98, goldWave) * clamp(f * 1.45, 0.0, 1.0);
    vec3 goldCol = mix(cGoldBase, cGoldMid, clamp(goldFactor * 1.4, 0.0, 1.0));
    goldCol = mix(goldCol, cGoldLight, clamp(goldFactor * 2.0 - 0.6, 0.0, 1.0));
    col += goldCol * (goldFactor * 0.36);
    
    // A faint soft white (#EAF0F6) in the brightest spots. No pink, purple, teal or green.
    float whiteFactor = pow(clamp(f, 0.0, 1.0), 3.2) * smoothstep(0.86, 1.0, goldWave) * 0.28;
    col += cSoftWhite * whiteFactor;
    
    d += min(rz, 1.0);
  }
  
  // Mix over #07111F so it is never black and never neon
  col = mix(cDeepNavy, col, 0.88);
  col = clamp(col, 0.0, 1.0);
  
  gl_FragColor = vec4(col, 1.0);
}
`;

export const LiquidShader: React.FC<LiquidShaderProps> = ({ className = '', style = {} }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Adaptive Quality & Feature Flags
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    const isNarrow = window.innerWidth < 768;
    const isMobile = isCoarse || isNarrow;
    const isTablet = !isMobile && window.innerWidth < 1024;

    // Capped Pixel Ratio (Rule 8: Mobile ~1.0, Desktop max 1.25)
    const rawDpr = window.devicePixelRatio || 1;
    const pixelRatio = isMobile ? 1.0 : Math.min(rawDpr, isTablet ? 1.15 : 1.25);

    // Iterations (4 loop iterations desktop)
    const iterations = 4.0;

    // Reduced Motion Detection (Rule 13)
    let reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 2. Three.js Scene Setup (Single Quad)
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const geometry = new THREE.PlaneGeometry(2, 2);

    const uniforms = {
      u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      u_time: { value: 0 },
      u_mouse: { value: new THREE.Vector2(0, 0) },
      u_iterations: { value: iterations },
      u_reduced_motion: { value: reducedMotion ? 1.0 : 0.0 }
    };

    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms,
      depthWrite: false,
      depthTest: false
    });

    const quad = new THREE.Mesh(geometry, material);
    scene.add(quad);

    // 3. WebGLRenderer with Power Preference & Capped DPR
    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: false,
        depth: false,
        stencil: false,
        alpha: false,
        powerPreference: isMobile ? 'low-power' : 'default'
      });
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      container.appendChild(renderer.domElement);
    } catch {
      // Fallback gracefully if WebGL context creation fails
      return;
    }

    // 4. Animation State stored in local scope (Zero React state updates in loop)
    let rafId = 0;
    let isRunning = true;
    const startTime = performance.now();
    const targetMouse = { x: 0, y: 0 };
    const currentMouse = { x: 0, y: 0 };

    // 5. Mouse Interaction (Desktop only, Rule 11)
    const handleMouseMove = (e: MouseEvent) => {
      if (isMobile) return;
      // Normalize to [-0.5, 0.5]
      targetMouse.x = (e.clientX / window.innerWidth) - 0.5;
      targetMouse.y = 0.5 - (e.clientY / window.innerHeight);
    };

    if (!isMobile) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }

    // 6. Responsive Window Resize
    let resizeTimer = 0;
    const handleResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (!renderer) return;
        const w = window.innerWidth;
        const h = window.innerHeight;
        renderer.setSize(w, h);
        uniforms.u_resolution.value.set(w * pixelRatio, h * pixelRatio);
      }, 120);
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // 7. Page Visibility Listener (Rule 12)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isRunning = false;
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
      } else {
        isRunning = true;
        if (!rafId) {
          rafId = requestAnimationFrame(animate);
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 8. Reduced Motion Listener (Rule 13)
    const motionMql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = (e: MediaQueryListEvent) => {
      reducedMotion = e.matches;
      uniforms.u_reduced_motion.value = reducedMotion ? 1.0 : 0.0;
    };
    if (motionMql.addEventListener) {
      motionMql.addEventListener('change', handleMotionChange);
    }

    // 9. Animation Loop (Smooth 60fps / Capped RAF)
    const animate = (now: number) => {
      if (!isRunning) return;

      // Update time uniform
      uniforms.u_time.value = (now - startTime) * 0.001;

      // Smooth mouse interpolation on desktop
      if (!isMobile) {
        currentMouse.x += (targetMouse.x - currentMouse.x) * 0.03;
        currentMouse.y += (targetMouse.y - currentMouse.y) * 0.03;
        uniforms.u_mouse.value.set(currentMouse.x, currentMouse.y);
      }

      if (renderer) {
        renderer.render(scene, camera);
      }

      rafId = requestAnimationFrame(animate);
    };

    // Start initial frame
    uniforms.u_resolution.value.set(window.innerWidth * pixelRatio, window.innerHeight * pixelRatio);
    rafId = requestAnimationFrame(animate);

    // 10. Complete Memory & Resource Cleanup (Rule 21)
    return () => {
      isRunning = false;
      if (rafId) cancelAnimationFrame(rafId);
      window.clearTimeout(resizeTimer);

      if (!isMobile) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (motionMql.removeEventListener) {
        motionMql.removeEventListener('change', handleMotionChange);
      }

      geometry.dispose();
      material.dispose();

      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && renderer.domElement.parentElement) {
          renderer.domElement.parentElement.removeChild(renderer.domElement);
        }
        renderer = null;
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`mak-liquid-shader-bg ${className}`}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        background: '#07111F',
        ...style
      }}
    />
  );
};

export default LiquidShader;
