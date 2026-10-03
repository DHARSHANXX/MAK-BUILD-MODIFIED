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

// MAK BUILD Architectural Palette Constants
const vec3 cDeepNavy   = vec3(0.027, 0.067, 0.122); // #07111F
const vec3 cDarkBlue   = vec3(0.043, 0.122, 0.212); // #0B1F36
const vec3 cArchBlue   = vec3(0.071, 0.227, 0.388); // #123A63
const vec3 cPremGold   = vec3(0.831, 0.686, 0.216); // #D4AF37
const vec3 cSoftGold   = vec3(0.906, 0.780, 0.400); // #E7C766
const vec3 cSoftWhite  = vec3(0.918, 0.941, 0.965); // #EAF0F6

mat2 rot2D(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat2(c, -s, s, c);
}

float map(vec3 p, float t) {
  // Ultra-slow atmospheric movement
  p.xz *= rot2D(t * 0.04);
  p.xy *= rot2D(t * 0.025);
  vec3 q = p * 1.35 + vec3(t * 0.05, t * 0.03, t * 0.04);
  float s = sin(q.x + sin(q.z + sin(q.y))) * 0.5;
  return length(p * 0.72) * log(length(p) + 1.0) + s - 1.15;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
  
  // Subtle desktop mouse influence (very gentle parallax)
  uv += u_mouse * 0.05;

  float t = u_time * (u_reduced_motion > 0.5 ? 0.08 : 0.40);
  
  // Base atmosphere: Deep Navy to Dark Blue smooth gradient
  vec3 color = mix(cDeepNavy, cDarkBlue, clamp(gl_FragCoord.y / u_resolution.y, 0.0, 1.0));
  
  float dist = 2.6;
  float maxIter = u_iterations;
  
  // Raymarch loop - optimized for smoothness (3-4 iterations)
  for (int i = 0; i < 4; i++) {
    if (float(i) >= maxIter) break;
    
    vec3 p = vec3(0.0, 0.0, 4.8) + normalize(vec3(uv, -1.0)) * dist;
    float rz = map(p, t);
    float grad = clamp((rz - map(p + 0.12, t)) * 0.5, -0.1, 1.0);
    
    // Atmospheric Blue volumetric body
    vec3 blueVolume = mix(cDarkBlue, cArchBlue, clamp(grad * 1.4, 0.0, 1.0));
    color += blueVolume * (smoothstep(2.5, 0.0, rz) * 0.36);
    
    // ONE subtle metallic gold glossy light travel (architectural luxury accent)
    float goldSweep = sin(p.x * 0.60 + p.y * 0.40 - t * 0.25);
    float goldFactor = smoothstep(0.82, 0.98, goldSweep) * clamp(grad * 1.5, 0.0, 1.0);
    vec3 goldColor = mix(cPremGold, cSoftGold, 0.45);
    color += goldColor * (goldFactor * 0.40);
    
    // Soft white highlight on peak density
    float whiteFactor = pow(clamp(grad, 0.0, 1.0), 3.5) * smoothstep(0.88, 1.0, goldSweep + 0.12) * 0.32;
    color += cSoftWhite * whiteFactor;
    
    dist += min(rz, 1.0);
  }
  
  // Restrained contrast & subtle edge vignette
  float centerDist = length(uv);
  float softVignette = smoothstep(1.3, 0.25, centerDist);
  color = mix(cDeepNavy, color, 0.85 + softVignette * 0.15);
  
  // Content readability guarantee: tone down brightness slightly
  color = clamp(color, 0.0, 1.0);
  
  gl_FragColor = vec4(color, 1.0);
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

    // Iterations (Rule 9: Mobile 3, Tablet 3.5, Desktop 4)
    const iterations = isMobile ? 3.0 : isTablet ? 3.5 : 4.0;

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
