/**
 * MAK BUILD — Lightweight Full-Viewport Liquid WebGL Shader Background
 * Single requestAnimationFrame loop, plain WebGL, zero Three.js dependencies.
 * Canvas: #mak-bg-shader (fixed, inset-0, z-index -1, pointer-events none)
 */
(function () {
  "use strict";

  function initShader() {
    var canvas = document.getElementById("mak-bg-shader");
    if (!canvas || canvas.tagName !== "CANVAS") return;

    var reducedMotion = false;
    try {
      var mql = window.matchMedia("(prefers-reduced-motion: reduce)");
      reducedMotion = mql.matches;
      if (mql.addEventListener) {
        mql.addEventListener("change", function (e) {
          reducedMotion = e.matches;
          if (reducedMotion) {
            if (rafId) {
              window.cancelAnimationFrame(rafId);
              rafId = 0;
            }
            running = false;
            draw(performance.now());
          } else {
            syncLoop();
          }
        });
      }
    } catch (e) {}

    var coarse = false;
    try {
      coarse = window.matchMedia("(pointer: coarse)").matches;
    } catch (e) {}

    var isLowPower =
      coarse ||
      window.innerWidth < 768 ||
      (typeof navigator !== "undefined" && navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);

    function setFallback() {
      canvas.classList.add("mak-bg-shader--fallback");
      canvas.width = 0;
      canvas.height = 0;
    }

    var gl = null;
    try {
      gl = canvas.getContext("webgl", {
        alpha: false,
        antialias: false,
        depth: false,
        stencil: false,
        premultipliedAlpha: false,
        preserveDrawingBuffer: false,
        powerPreference: "low-power"
      });
    } catch (e) {
      gl = null;
    }
    if (!gl) {
      setFallback();
      return;
    }

    var VS =
      "attribute vec2 aPos;" +
      "void main(){gl_Position=vec4(aPos,0.0,1.0);}";

    var FS =
      "precision mediump float;" +
      "uniform vec2 uRes;" +
      "uniform float uTime;" +
      "uniform float uIters;" +
      "mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}" +
      "float map(vec3 p){" +
      "  float t=uTime;" +
      "  p.xz*=rot(t*0.28);" +
      "  p.xy*=rot(t*0.20);" +
      "  vec3 q=p*2.0+t;" +
      "  return length(p+vec3(sin(t*0.5)))*log(length(p)+1.0)+sin(q.x+sin(q.z+sin(q.y)))*0.5-1.0;" +
      "}" +
      "void main(){" +
      "  vec2 frag=gl_FragCoord.xy;" +
      "  vec2 uv=frag/min(uRes.x,uRes.y)-vec2(0.9,0.5);" +
      "  uv.x+=0.4;" +
      "  vec3 col=vec3(0.031,0.043,0.067);" +
      "  float d=2.5;" +
      "  float maxI=uIters;" +
      "  for(int i=0;i<5;i++){" +
      "    if(float(i)>maxI) break;" +
      "    vec3 p=vec3(0.0,0.0,5.0)+normalize(vec3(uv,-1.0))*d;" +
      "    float rz=map(p);" +
      "    float f=clamp((rz-map(p+0.1))*0.5,-0.1,1.0);" +
      "    vec3 base=vec3(0.05,0.07,0.11)+vec3(3.1,2.35,0.65)*f;" +
      "    col=col*base+smoothstep(2.5,0.0,rz)*0.48*base;" +
      "    d+=min(rz,1.0);" +
      "  }" +
      "  float dist=distance(frag,uRes*0.5);" +
      "  float radius=min(uRes.x,uRes.y)*0.5;" +
      "  float dim=smoothstep(radius*0.2,radius*0.78,dist);" +
      "  col=mix(col*0.2,col,dim);" +
      "  col=mix(vec3(0.031,0.043,0.067),col,0.86);" +
      "  gl_FragColor=vec4(col,1.0);" +
      "}";

    function compile(type, src) {
      var sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        gl.deleteShader(sh);
        return null;
      }
      return sh;
    }

    var vs = compile(gl.VERTEX_SHADER, VS);
    var fs = compile(gl.FRAGMENT_SHADER, FS);
    if (!vs || !fs) {
      setFallback();
      return;
    }

    var program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      setFallback();
      return;
    }

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

    var aPos = gl.getAttribLocation(program, "aPos");
    var uRes = gl.getUniformLocation(program, "uRes");
    var uTime = gl.getUniformLocation(program, "uTime");
    var uIters = gl.getUniformLocation(program, "uIters");

    var start = performance.now();
    var rafId = 0;
    var lastDraw = 0;
    var running = false;
    var contextLost = false;
    var resizeTimer = 0;
    var targetFps = isLowPower ? 30 : 45;
    var frameMs = 1000 / targetFps;
    var iters = isLowPower ? 2.0 : 4.0;

    function pixelScale() {
      var dpr = window.devicePixelRatio || 1;
      if (isLowPower || window.innerWidth < 768) return Math.min(1.0, dpr) * 0.5;
      return Math.min(1.5, dpr) * 0.72;
    }

    function resize() {
      if (contextLost) return;
      var cssW = window.innerWidth;
      var cssH = window.innerHeight;
      var scale = pixelScale();
      var w = Math.max(1, (cssW * scale) | 0);
      var h = Math.max(1, (cssH * scale) | 0);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      isLowPower =
        coarse ||
        window.innerWidth < 768 ||
        (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);
      targetFps = isLowPower ? 30 : 45;
      frameMs = 1000 / targetFps;
      iters = isLowPower ? 2.0 : 4.0;
    }

    function draw(now) {
      if (contextLost) return;
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, reducedMotion ? 0.0 : (now - start) * 0.001);
      gl.uniform1f(uIters, iters);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    function loop(now) {
      if (!running) return;
      rafId = window.requestAnimationFrame(loop);
      if (now - lastDraw < frameMs) return;
      lastDraw = now;
      draw(now);
    }

    function shouldRun() {
      if (reducedMotion || contextLost) return false;
      if (document.hidden) return false;
      return true;
    }

    function syncLoop() {
      var prev = running;
      running = shouldRun();
      if (running && !rafId) {
        lastDraw = 0;
        rafId = window.requestAnimationFrame(loop);
      }
      if (!running && rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      }
    }

    function onResize() {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(function () {
        resize();
        draw(performance.now());
      }, 120);
    }

    function onVisibility() {
      syncLoop();
      if (!document.hidden && reducedMotion) {
        resize();
        draw(performance.now());
      }
    }

    function onLost(ev) {
      ev.preventDefault();
      contextLost = true;
      running = false;
      if (rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      }
    }

    function onRestored() {
      contextLost = false;
      canvas.classList.remove("mak-bg-shader--fallback");
      resize();
      draw(performance.now());
      syncLoop();
    }

    canvas.addEventListener("webglcontextlost", onLost, false);
    canvas.addEventListener("webglcontextrestored", onRestored, false);
    window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    window.addEventListener("pagehide", function () {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      }
      running = false;
    });

    resize();
    draw(performance.now());
    syncLoop();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initShader);
  } else {
    initShader();
  }
})();
