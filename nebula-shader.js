/**
 * ============================================================================
 * InteractiveNebulaShader (liquid-shader.tsx) — Background Integration
 * ============================================================================
 * Renders the exact Three.js / WebGL ray-marched nebula shader from
 * src/components/ui/liquid-shader.tsx strictly in the fixed background
 * (black unused space) without overlapping or altering existing website UI.
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

  // Exact ray-marched nebula fragment shader from liquid-shader.tsx
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
    mat2 m(float a){ float c=cos(a), s=sin(a); return mat2(c,-s,s,c); }
    float map(vec3 p){
      p.xz *= m(t*0.4);
      p.xy *= m(t*0.3);
      vec3 q = p*2. + t;
      return length(p + vec3(sin(t*0.7))) * log(length(p)+1.0)
           + sin(q.x + sin(q.z + sin(q.y))) * 0.5 - 1.0;
    }

    void mainImage(out vec4 O, in vec2 fragCoord) {
      vec2 uv = fragCoord / min(iResolution.x, iResolution.y) - vec2(.9, .5);
      uv.x += .4;
      vec3 col = vec3(0.0);
      float d = 2.5;

      // Ray-march
      for (int i = 0; i <= 5; i++) {
        vec3 p = vec3(0,0,5.) + normalize(vec3(uv, -1.)) * d;
        float rz = map(p);
        float f  = clamp((rz - map(p + 0.1)) * 0.5, -0.1, 1.0);

        vec3 base = hasActiveReminders
          ? vec3(0.05,0.2,0.5) + vec3(4.0,2.0,5.0)*f
          : hasUpcomingReminders
          ? vec3(0.05,0.3,0.1) + vec3(2.0,5.0,1.0)*f
          : vec3(0.1,0.3,0.4) + vec3(5.0,2.5,3.0)*f;

        col = col * base + smoothstep(2.5, 0.0, rz) * 0.7 * base;
        d += min(rz, 1.0);
      }

      // Center dimming
      float dist   = distance(fragCoord, iResolution*0.5);
      float radius = min(iResolution.x, iResolution.y) * 0.5;
      float dim    = disableCenterDimming
                   ? 1.0
                   : smoothstep(radius*0.3, radius*0.5, dist);

      O = vec4(col, 1.0);
      if (!disableCenterDimming) {
        O.rgb = mix(O.rgb * 0.3, O.rgb, dim);
      }
    }

    void main() {
      mainImage(gl_FragColor, vUv * iResolution);
    }
  `;

  function mountInteractiveNebulaShader(options = {}) {
    const hasActiveReminders = Boolean(options.hasActiveReminders);
    const hasUpcomingReminders = Boolean(options.hasUpcomingReminders);
    const disableCenterDimming = Boolean(options.disableCenterDimming);

    // Ensure no hero overlay exists (never overplace on top of website content)
    const oldHeroOverlay = document.getElementById("mak-hero-nebula-layer");
    if (oldHeroOverlay && oldHeroOverlay.parentNode) {
      oldHeroOverlay.parentNode.removeChild(oldHeroOverlay);
    }

    let container = document.getElementById("mak-global-nebula-bg");
    if (!container) {
      container = document.createElement("div");
      container.id = "mak-global-nebula-bg";
      container.className = "fixed inset-0 bg-background";
      container.setAttribute("aria-label", "Interactive nebula background");
      container.setAttribute("aria-hidden", "true");
      container.style.cssText =
        "position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;overflow:hidden;background:#05070c;";
      document.body.prepend(container);
    } else {
      container.innerHTML = "";
    }

    // Use THREE.js if loaded, otherwise fallback to direct WebGL running the exact same GLSL shader
    if (typeof global.THREE !== "undefined") {
      const THREE = global.THREE;
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.domElement.style.cssText = "width:100%;height:100%;display:block;pointer-events:none;";
      container.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      const clock = new THREE.Clock();

      const uniforms = {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector2() },
        iMouse: { value: new THREE.Vector2() },
        hasActiveReminders: { value: hasActiveReminders },
        hasUpcomingReminders: { value: hasUpcomingReminders },
        disableCenterDimming: { value: disableCenterDimming }
      };

      const material = new THREE.ShaderMaterial({
        vertexShader: VERTEX_SHADER_THREE,
        fragmentShader: FRAGMENT_SHADER,
        uniforms: uniforms
      });

      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
      scene.add(mesh);

      const onResize = () => {
        const w = container.clientWidth || window.innerWidth;
        const h = container.clientHeight || window.innerHeight;
        renderer.setSize(w, h);
        uniforms.iResolution.value.set(w, h);
      };

      const onMouseMove = (e) => {
        uniforms.iMouse.value.set(e.clientX, window.innerHeight - e.clientY);
      };

      window.addEventListener("resize", onResize, { passive: true });
      window.addEventListener("mousemove", onMouseMove, { passive: true });
      onResize();

      renderer.setAnimationLoop(() => {
        uniforms.iTime.value = clock.getElapsedTime();
        renderer.render(scene, camera);
      });

      return () => {
        window.removeEventListener("resize", onResize);
        window.removeEventListener("mousemove", onMouseMove);
        renderer.setAnimationLoop(null);
        if (renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
        material.dispose();
        mesh.geometry.dispose();
        renderer.dispose();
      };
    } else {
      // Raw WebGL runner with identical GLSL shader
      const canvas = document.createElement("canvas");
      canvas.style.cssText = "width:100%;height:100%;display:block;pointer-events:none;";
      container.appendChild(canvas);

      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) return;

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
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
      const pos = gl.getAttribLocation(prog, "a_position");
      gl.enableVertexAttribArray(pos);
      gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

      const uRes = gl.getUniformLocation(prog, "iResolution");
      const uTime = gl.getUniformLocation(prog, "iTime");
      const uMouse = gl.getUniformLocation(prog, "iMouse");
      const uActive = gl.getUniformLocation(prog, "hasActiveReminders");
      const uUpcoming = gl.getUniformLocation(prog, "hasUpcomingReminders");
      const uDim = gl.getUniformLocation(prog, "disableCenterDimming");

      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        canvas.width = Math.floor((container.clientWidth || window.innerWidth) * dpr);
        canvas.height = Math.floor((container.clientHeight || window.innerHeight) * dpr);
        gl.viewport(0, 0, canvas.width, canvas.height);
      };
      window.addEventListener("resize", resize, { passive: true });
      resize();

      const start = performance.now();
      const render = (now) => {
        gl.useProgram(prog);
        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform1f(uTime, (now - start) * 0.001);
        gl.uniform2f(uMouse, 0, 0);
        gl.uniform1i(uActive, hasActiveReminders ? 1 : 0);
        gl.uniform1i(uUpcoming, hasUpcomingReminders ? 1 : 0);
        gl.uniform1i(uDim, disableCenterDimming ? 1 : 0);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        requestAnimationFrame(render);
      };
      requestAnimationFrame(render);
    }
  }

  global.InteractiveNebulaShader = mountInteractiveNebulaShader;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => mountInteractiveNebulaShader());
  } else {
    mountInteractiveNebulaShader();
  }
})(window);
