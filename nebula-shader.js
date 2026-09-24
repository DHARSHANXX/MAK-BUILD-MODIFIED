/**
 * ============================================================================
 * MAK BUILD — InteractiveNebulaShader (src/components/ui/liquid-shader.tsx)
 * ============================================================================
 * Real-time Three.js / WebGL ray-marched architectural liquid nebula background.
 * Palette:
 *   - Charcoal / Deep Navy Foundation (#07090E)
 *   - Warm White / Alabaster Ivory Atmosphere
 *   - Flowing Champagne Gold Liquid Light Waves (vec3(4.2, 3.3, 1.8) * f)
 *   - Continuous 60fps animation (8–12s visual wave cycle)
 * ============================================================================
 */

(function (global) {
  "use strict";

  const VERTEX_SHADER_THREE = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `;

  const VERTEX_SHADER_RAW = `
    attribute vec2 a_position;
    varying vec2 vUv;
    void main() {
      vUv = a_position * 0.5 + 0.5;
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  const FRAGMENT_SHADER = `
    precision mediump float;

    uniform vec2 iResolution;
    uniform float iTime;
    uniform vec2 iMouse;

    uniform bool hasActiveReminders;
    uniform bool hasUpcomingReminders;
    uniform bool disableCenterDimming;

    varying vec2 vUv;

    #define t iTime

    mat2 m(float a) {
      float c = cos(a);
      float s = sin(a);
      return mat2(c, -s, s, c);
    }

    float map(vec3 p) {
      p.xz *= m(t * 0.32);
      p.xy *= m(t * 0.24);

      vec3 q = p * 2.0 + t * 0.38;

      return
        length(p + vec3(sin(t * 0.45)))
        * log(length(p) + 1.0)
        + sin(
            q.x +
            sin(q.z + sin(q.y))
          ) * 0.55
        - 1.0;
    }

    void mainImage(out vec4 O, in vec2 fragCoord) {
      vec2 uv =
        fragCoord /
        min(iResolution.x, iResolution.y)
        - vec2(0.9, 0.5);
      uv.x += 0.4;

      vec3 col = vec3(0.0);
      float d = 2.5;

      for (int i = 0; i <= 5; i++) {
        vec3 p =
          vec3(0.0, 0.0, 5.0)
          + normalize(vec3(uv, -1.0)) * d;

        float rz = map(p);

        float f =
          clamp(
            (rz - map(p + 0.1)) * 0.5,
            -0.1,
            1.0
          );

        /*
         * MAK BUILD ARCHITECTURAL LUXURY PALETTE
         * Ray-marching requires >1.0 wave amplification on crests (f)
         * to generate luminous flowing Champagne Gold & Warm Ivory waves
         * over a dark charcoal foundation.
         */
        vec3 base = hasActiveReminders
          ? vec3(0.16, 0.13, 0.08) + vec3(4.5, 3.5, 1.9) * f
          : hasUpcomingReminders
          ? vec3(0.14, 0.12, 0.08) + vec3(3.8, 3.1, 1.8) * f
          : vec3(0.15, 0.13, 0.09) + vec3(4.2, 3.3, 1.85) * f;

        col = col * base + smoothstep(2.5, 0.0, rz) * 0.68 * base;
        d += min(rz, 1.0);
      }

      /*
       * Keep the center calm so headings & CTAs remain ultra-readable
       * while edges showcase rich flowing champagne gold & ivory movement.
       */
      float dist = distance(fragCoord, iResolution * 0.5);
      float radius = min(iResolution.x, iResolution.y) * 0.5;

      float dim =
        disableCenterDimming
          ? 1.0
          : smoothstep(radius * 0.22, radius * 0.58, dist);

      O = vec4(col, 1.0);

      if (!disableCenterDimming) {
        O.rgb = mix(O.rgb * 0.35, O.rgb, dim);
      }
    }

    void main() {
      mainImage(gl_FragColor, vUv * iResolution);
    }
  `;

  function createShaderCanvasInstance(container, options = {}) {
    const hasActiveReminders =
      options.hasActiveReminders !== undefined ? Boolean(options.hasActiveReminders) : true;
    const hasUpcomingReminders =
      options.hasUpcomingReminders !== undefined ? Boolean(options.hasUpcomingReminders) : false;
    const disableCenterDimming =
      options.disableCenterDimming !== undefined ? Boolean(options.disableCenterDimming) : false;

    const isMobile = window.innerWidth < 768;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, isMobile ? 1.0 : 1.5);

    if (typeof global.THREE !== "undefined") {
      const THREE = global.THREE;
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
      });

      renderer.setPixelRatio(pixelRatio);
      renderer.setClearColor(0x05070c, 1);
      renderer.domElement.style.cssText =
        "width:100%;height:100%;display:block;pointer-events:none;";
      renderer.domElement.setAttribute("aria-hidden", "true");
      container.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      const clock = new THREE.Clock();

      const uniforms = {
        iTime: { value: 1.8 },
        iResolution: { value: new THREE.Vector2() },
        iMouse: { value: new THREE.Vector2(window.innerWidth * 0.5, window.innerHeight * 0.5) },
        hasActiveReminders: { value: hasActiveReminders },
        hasUpcomingReminders: { value: hasUpcomingReminders },
        disableCenterDimming: { value: disableCenterDimming }
      };

      const material = new THREE.ShaderMaterial({
        vertexShader: VERTEX_SHADER_THREE,
        fragmentShader: FRAGMENT_SHADER,
        uniforms: uniforms,
        transparent: true,
        depthWrite: false,
        depthTest: false
      });

      const geometry = new THREE.PlaneGeometry(2, 2);
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      const onResize = () => {
        const width = container.clientWidth || window.innerWidth;
        const height = container.clientHeight || window.innerHeight;
        renderer.setSize(width, height, false);
        uniforms.iResolution.value.set(width, height);
      };

      const onMouseMove = (event) => {
        uniforms.iMouse.value.set(event.clientX, window.innerHeight - event.clientY);
      };

      window.addEventListener("resize", onResize, { passive: true });
      window.addEventListener("mousemove", onMouseMove, { passive: true });
      onResize();

      renderer.setAnimationLoop(() => {
        uniforms.iTime.value = 1.8 + clock.getElapsedTime();
        renderer.render(scene, camera);
      });

      return () => {
        window.removeEventListener("resize", onResize);
        window.removeEventListener("mousemove", onMouseMove);
        renderer.setAnimationLoop(null);
        if (renderer.domElement.parentNode === container) {
          container.removeChild(renderer.domElement);
        }
        material.dispose();
        geometry.dispose();
        renderer.dispose();
      };
    } else {
      const canvas = document.createElement("canvas");
      canvas.style.cssText = "width:100%;height:100%;display:block;pointer-events:none;";
      canvas.setAttribute("aria-hidden", "true");
      container.appendChild(canvas);

      const gl =
        canvas.getContext("webgl", { alpha: true, antialias: true }) ||
        canvas.getContext("experimental-webgl");
      if (!gl) return () => {};

      const compile = (type, src) => {
        const s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        return s;
      };

      const prog = gl.createProgram();
      gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERTEX_SHADER_RAW));
      gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER));
      gl.linkProgram(prog);
      gl.useProgram(prog);

      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
        gl.STATIC_DRAW
      );
      const pos = gl.getAttribLocation(prog, "a_position");
      gl.enableVertexAttribArray(pos);
      gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

      const uRes = gl.getUniformLocation(prog, "iResolution");
      const uTime = gl.getUniformLocation(prog, "iTime");
      const uMouse = gl.getUniformLocation(prog, "iMouse");
      const uActive = gl.getUniformLocation(prog, "hasActiveReminders");
      const uUpcoming = gl.getUniformLocation(prog, "hasUpcomingReminders");
      const uDim = gl.getUniformLocation(prog, "disableCenterDimming");

      const onResize = () => {
        const w = Math.floor((container.clientWidth || window.innerWidth) * pixelRatio);
        const h = Math.floor((container.clientHeight || window.innerHeight) * pixelRatio);
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      };
      window.addEventListener("resize", onResize, { passive: true });
      onResize();

      let rafId = null;
      const startTime = performance.now();
      const tick = (now) => {
        gl.useProgram(prog);
        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform1f(uTime, 1.8 + (now - startTime) * 0.001);
        gl.uniform2f(uMouse, 0, 0);
        gl.uniform1i(uActive, hasActiveReminders ? 1 : 0);
        gl.uniform1i(uUpcoming, hasUpcomingReminders ? 1 : 0);
        gl.uniform1i(uDim, disableCenterDimming ? 1 : 0);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);

      return () => {
        if (rafId) cancelAnimationFrame(rafId);
        window.removeEventListener("resize", onResize);
      };
    }
  }

  function mountInteractiveNebulaShader(options = {}) {
    let container = document.getElementById("mak-global-nebula-bg");
    if (!container) {
      container = document.createElement("div");
      container.id = "mak-global-nebula-bg";
      container.className = "fixed inset-0 z-0 pointer-events-none";
      container.setAttribute("aria-hidden", "true");
      container.style.cssText =
        "position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;overflow:hidden;";
      document.body.prepend(container);
    } else {
      container.innerHTML = "";
    }

    if (container.__cleanupNebula) {
      container.__cleanupNebula();
    }

    container.__cleanupNebula = createShaderCanvasInstance(container, options);
    return container.__cleanupNebula;
  }

  global.InteractiveNebulaShader = mountInteractiveNebulaShader;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => mountInteractiveNebulaShader());
  } else {
    mountInteractiveNebulaShader();
  }
})(window);
