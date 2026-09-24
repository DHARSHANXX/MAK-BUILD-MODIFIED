/**
 * ============================================================================
 * InteractiveNebulaShader — Architectural Luxury Edition for MAK BUILD
 * ============================================================================
 * Visual Direction:
 *   90% Clean White / Warm Alabaster Ivory (#FFFFFF -> #FAF7F0 -> #F4EFE6)
 *   7% Soft Champagne Gold Glow (#D4AF37 / #DFC382)
 *   3% Subtle Architectural Gray & Charcoal Depth (#E2E5EA / #2C323E)
 *
 * Designed as a subtle combination of:
 *   Architectural glass + polished white surface + champagne gold lighting + soft shadows.
 * ============================================================================
 */

(function (global) {
  "use strict";

  const VERTEX_SHADER_SOURCE = `
    attribute vec2 a_position;
    varying vec2 vUv;
    void main() {
      vUv = a_position * 0.5 + 0.5;
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  const FRAGMENT_SHADER_SOURCE = `
    precision highp float;
    varying vec2 vUv;

    uniform vec2 u_resolution;
    uniform float u_time;
    uniform vec2 u_pointer;
    uniform float u_disableCenterDimming;
    uniform float u_hasActiveReminders;
    uniform float u_hasUpcomingReminders;
    uniform float u_intensity;

    // Simplex / Value Noise helpers for silky architectural glass & marble flow
    float hash(vec2 p) {
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 45.32);
      return fract(p.x * p.y);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
        mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
        u.y
      );
    }

    // Fractional Brownian Motion (FBM) - Smooth, low-frequency architectural silk waves
    float fbm(vec2 p) {
      float value = 0.0;
      float amp = 0.5;
      mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
      for (int i = 0; i < 5; i++) {
        value += amp * noise(p);
        p = rot * p * 1.92 + vec2(0.18, -0.11);
        amp *= 0.5;
      }
      return value;
    }

    void main() {
      vec2 uv = vUv;
      float aspect = u_resolution.x / max(u_resolution.y, 1.0);
      vec2 p = (uv - 0.5) * vec2(aspect, 1.0);

      // Ultra-slow, elegant time progression
      float t = u_time * 0.085;

      // Subtle interactive pointer influence (damped & wide radius)
      vec2 ptr = (u_pointer - 0.5) * vec2(aspect, 1.0);
      float ptrDist = length(p - ptr);
      float ptrInfluence = exp(-ptrDist * 2.4) * 0.14;

      // Domain warping for architectural glass & brushed ivory caustics
      vec2 q = vec2(
        fbm(p * 1.35 + vec2(t * 0.4, -t * 0.25)),
        fbm(p * 1.35 + vec2(-t * 0.3, t * 0.35))
      );

      vec2 r = vec2(
        fbm(p * 1.6 + 1.4 * q + vec2(1.7, 9.2) + t * 0.22 + ptrInfluence),
        fbm(p * 1.6 + 1.4 * q + vec2(8.3, 2.8) - t * 0.18 - ptrInfluence)
      );

      float f = fbm(p * 1.2 + r * 1.15);

      // Architectural Color Palette (90% White/Ivory, 7% Champagne Gold, 3% Gray/Charcoal)
      vec3 pureWhite      = vec3(0.996, 0.995, 0.990); // #FEFEFC
      vec3 warmIvory      = vec3(0.978, 0.968, 0.945); // #F9F7F1
      vec3 lightBeige     = vec3(0.953, 0.937, 0.902); // #F3EFE6
      vec3 softGray       = vec3(0.910, 0.918, 0.930); // #E8EAED
      vec3 champagneGold  = vec3(0.855, 0.745, 0.505); // Soft Champagne Gold highlight
      vec3 charcoalWhisper= vec3(0.790, 0.800, 0.820); // Delicate architectural shadow line

      // Base transition: Pure White -> Warm Ivory -> Light Beige
      vec3 col = mix(pureWhite, warmIvory, smoothstep(0.15, 0.72, f));
      col = mix(col, lightBeige, smoothstep(0.45, 0.88, length(q)));

      // Subtle architectural depth (light gray & soft shadow)
      float shadowWave = smoothstep(0.55, 0.86, r.y * f);
      col = mix(col, softGray, shadowWave * 0.38);
      col = mix(col, charcoalWhisper, pow(shadowWave, 2.5) * 0.14);

      // Soft Champagne Gold Caustic Glow (carefully controlled ~7% visual weight)
      float goldRibbon = smoothstep(0.60, 0.82, f * r.x + ptrInfluence * 0.5);
      float goldEdgeShimmer = smoothstep(0.22, 0.78, length(p)) * goldRibbon;
      float reminderBoost = 1.0 + (u_hasActiveReminders * 0.12) + (u_hasUpcomingReminders * 0.06);

      col = mix(col, champagneGold, goldEdgeShimmer * 0.22 * reminderBoost * u_intensity);

      // Center calming zone so headings & CTAs remain ultra-crisp
      float centerDist = length((uv - 0.5) * vec2(1.1, 1.0));
      float edgeFocus = mix(
        smoothstep(0.18, 0.65, centerDist),
        smoothstep(0.08, 0.52, centerDist),
        u_disableCenterDimming * 0.45
      );

      // Blend shader softly over pure architectural white in the center
      vec3 finalColor = mix(pureWhite, col, mix(0.45, 0.92, edgeFocus) * u_intensity);

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

  class InteractiveNebulaShader {
    /**
     * @param {Object} options
     * @param {HTMLElement} options.container - Target DOM container
     * @param {boolean} [options.hasActiveReminders=false]
     * @param {boolean} [options.hasUpcomingReminders=false]
     * @param {boolean} [options.disableCenterDimming=false]
     * @param {number}  [options.intensity=1.0]
     * @param {string}  [options.className=""]
     */
    constructor(options = {}) {
      this.container = options.container;
      if (!this.container) return;

      // Prevent duplicate shader instances inside the same container
      if (this.container.__makNebulaInstance) {
        this.container.__makNebulaInstance.destroy();
      }
      this.container.__makNebulaInstance = this;

      this.hasActiveReminders = Boolean(options.hasActiveReminders);
      this.hasUpcomingReminders = Boolean(options.hasUpcomingReminders);
      this.disableCenterDimming = Boolean(options.disableCenterDimming);
      this.intensity = typeof options.intensity === "number" ? options.intensity : 0.88;
      this.className = options.className || "";

      this.isRunning = false;
      this.isVisible = true;
      this.rafId = null;
      this.startTime = performance.now();
      this.pointer = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 };
      this.prefersReducedMotion =
        window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      this._initCanvas();
      this._initWebGL();
      this._bindEvents();
      this.start();
    }

    _initCanvas() {
      this.canvas = document.createElement("canvas");
      this.canvas.setAttribute("aria-hidden", "true");
      this.canvas.setAttribute("role", "presentation");
      this.canvas.className = `mak-nebula-canvas ${this.className}`.trim();
      this.canvas.style.cssText =
        "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;display:block;z-index:0;";
      this.container.prepend(this.canvas);
    }

    _compileShader(gl, type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    _initWebGL() {
      const gl =
        this.canvas.getContext("webgl", {
          alpha: false,
          antialias: false,
          depth: false,
          stencil: false,
          powerPreference: "low-power",
          preserveDrawingBuffer: false
        }) || this.canvas.getContext("experimental-webgl");

      if (!gl) {
        this.gl = null;
        return;
      }
      this.gl = gl;

      const vs = this._compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
      const fs = this._compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);
      if (!vs || !fs) {
        this.gl = null;
        return;
      }

      const program = gl.createProgram();
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        gl.deleteProgram(program);
        this.gl = null;
        return;
      }

      this.program = program;
      this.vs = vs;
      this.fs = fs;
      gl.useProgram(program);

      // Fullscreen quad geometry
      const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
      this.buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

      const posLoc = gl.getAttribLocation(program, "a_position");
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

      // Cache uniform locations
      this.uniforms = {
        resolution: gl.getUniformLocation(program, "u_resolution"),
        time: gl.getUniformLocation(program, "u_time"),
        pointer: gl.getUniformLocation(program, "u_pointer"),
        disableCenterDimming: gl.getUniformLocation(program, "u_disableCenterDimming"),
        hasActiveReminders: gl.getUniformLocation(program, "u_hasActiveReminders"),
        hasUpcomingReminders: gl.getUniformLocation(program, "u_hasUpcomingReminders"),
        intensity: gl.getUniformLocation(program, "u_intensity")
      };

      this._resize();
    }

    _resize() {
      if (!this.canvas || !this.gl) return;
      const rect = this.container.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width || window.innerWidth));
      const height = Math.max(1, Math.floor(rect.height || window.innerHeight));

      // Cap pixel ratio for smooth mobile & desktop performance
      const isMobile = window.innerWidth < 768;
      const maxDpr = isMobile ? 0.85 : 1.35;
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);

      const displayWidth = Math.max(1, Math.floor(width * dpr));
      const displayHeight = Math.max(1, Math.floor(height * dpr));

      if (this.canvas.width !== displayWidth || this.canvas.height !== displayHeight) {
        this.canvas.width = displayWidth;
        this.canvas.height = displayHeight;
        this.gl.viewport(0, 0, displayWidth, displayHeight);
      }
    }

    _bindEvents() {
      this._onResize = () => this._resize();
      this._onPointerMove = (e) => {
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const w = Math.max(window.innerWidth, 1);
        const h = Math.max(window.innerHeight, 1);
        this.pointer.targetX = clientX / w;
        this.pointer.targetY = 1.0 - clientY / h;
      };

      window.addEventListener("resize", this._onResize, { passive: true });
      window.addEventListener("mousemove", this._onPointerMove, { passive: true });
      window.addEventListener("touchmove", this._onPointerMove, { passive: true });

      // Pause rendering when scrolled out of viewport
      if ("IntersectionObserver" in window) {
        this._observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              this.isVisible = entry.isIntersecting;
              if (this.isVisible && !this.isRunning) {
                this.start();
              }
            });
          },
          { threshold: 0.01 }
        );
        this._observer.observe(this.container);
      }

      // Clean up resources on page unload
      this._onPageHide = () => this.destroy();
      window.addEventListener("pagehide", this._onPageHide, { passive: true });
    }

    _renderFrame(now) {
      if (!this.isRunning) return;
      if (!this.isVisible) {
        this.isRunning = false;
        return;
      }

      const gl = this.gl;
      if (gl && this.program) {
        const elapsed = (now - this.startTime) * 0.001;

        // Smooth pointer interpolation
        this.pointer.x += (this.pointer.targetX - this.pointer.x) * 0.04;
        this.pointer.y += (this.pointer.targetY - this.pointer.y) * 0.04;

        gl.useProgram(this.program);
        gl.uniform2f(this.uniforms.resolution, this.canvas.width, this.canvas.height);
        gl.uniform1f(this.uniforms.time, this.prefersReducedMotion ? 1.5 : elapsed);
        gl.uniform2f(this.uniforms.pointer, this.pointer.x, this.pointer.y);
        gl.uniform1f(this.uniforms.disableCenterDimming, this.disableCenterDimming ? 1.0 : 0.0);
        gl.uniform1f(this.uniforms.hasActiveReminders, this.hasActiveReminders ? 1.0 : 0.0);
        gl.uniform1f(this.uniforms.hasUpcomingReminders, this.hasUpcomingReminders ? 1.0 : 0.0);
        gl.uniform1f(this.uniforms.intensity, this.intensity);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }

      if (!this.prefersReducedMotion) {
        this.rafId = requestAnimationFrame((t) => this._renderFrame(t));
      } else {
        this.isRunning = false;
      }
    }

    start() {
      if (this.isRunning || !this.gl) return;
      this.isRunning = true;
      this._resize();
      this.rafId = requestAnimationFrame((t) => this._renderFrame(t));
    }

    stop() {
      this.isRunning = false;
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
    }

    destroy() {
      this.stop();
      if (this._observer) {
        this._observer.disconnect();
        this._observer = null;
      }
      window.removeEventListener("resize", this._onResize);
      window.removeEventListener("mousemove", this._onPointerMove);
      window.removeEventListener("touchmove", this._onPointerMove);
      window.removeEventListener("pagehide", this._onPageHide);

      if (this.gl) {
        if (this.buffer) this.gl.deleteBuffer(this.buffer);
        if (this.vs) this.gl.deleteShader(this.vs);
        if (this.fs) this.gl.deleteShader(this.fs);
        if (this.program) this.gl.deleteProgram(this.program);
        this.gl = null;
      }
      if (this.canvas && this.canvas.parentNode) {
        this.canvas.parentNode.removeChild(this.canvas);
      }
      if (this.container) {
        delete this.container.__makNebulaInstance;
      }
    }
  }

  // Initialize strategic shader placements across MAK BUILD
  function initMakBuildNebulaShaders() {
    // 1. Global Architectural Background Shader (Main Landing Page, Services, Portfolio, About)
    let globalBg = document.getElementById("mak-global-nebula-bg");
    if (!globalBg) {
      globalBg = document.createElement("div");
      globalBg.id = "mak-global-nebula-bg";
      globalBg.setAttribute("aria-hidden", "true");
      globalBg.style.cssText =
        "position:fixed;inset:0;width:100%;height:100%;z-index:-1;pointer-events:none;overflow:hidden;background:#FAF8F3;";
      document.body.prepend(globalBg);
    }

    new InteractiveNebulaShader({
      container: globalBg,
      disableCenterDimming: false,
      hasActiveReminders: true,
      hasUpcomingReminders: false,
      intensity: 0.85,
      className: "mak-global-shader-canvas"
    });

    // 2. Hero Section Dedicated Shader Layer (disableCenterDimming = true for calm center focus)
    const heroSection = document.querySelector(".hero-slider-container");
    if (heroSection) {
      let heroShaderWrap = document.getElementById("mak-hero-nebula-layer");
      if (!heroShaderWrap) {
        heroShaderWrap = document.createElement("div");
        heroShaderWrap.id = "mak-hero-nebula-layer";
        heroShaderWrap.setAttribute("aria-hidden", "true");
        heroShaderWrap.style.cssText =
          "position:absolute;inset:0;width:100%;height:100%;z-index:3;pointer-events:none;mix-blend-mode:screen;opacity:0.32;overflow:hidden;";
        heroSection.prepend(heroShaderWrap);
      }

      new InteractiveNebulaShader({
        container: heroShaderWrap,
        disableCenterDimming: true,
        hasActiveReminders: true,
        hasUpcomingReminders: true,
        intensity: 0.92,
        className: "mak-hero-shader-canvas"
      });
    }
  }

  global.InteractiveNebulaShader = InteractiveNebulaShader;
  global.initMakBuildNebulaShaders = initMakBuildNebulaShaders;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMakBuildNebulaShaders);
  } else {
    initMakBuildNebulaShaders();
  }
})(window);
