import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export interface InteractiveNebulaShaderProps {
  hasActiveReminders?: boolean;
  hasUpcomingReminders?: boolean;
  disableCenterDimming?: boolean;
  className?: string;
}

export function InteractiveNebulaShader({
  hasActiveReminders = false,
  hasUpcomingReminders = false,
  disableCenterDimming = false,
  className = "",
}: InteractiveNebulaShaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  useEffect(() => {
    const mat = materialRef.current;

    if (mat) {
      mat.uniforms.hasActiveReminders.value = hasActiveReminders;
      mat.uniforms.hasUpcomingReminders.value = hasUpcomingReminders;
      mat.uniforms.disableCenterDimming.value = disableCenterDimming;
    }
  }, [
    hasActiveReminders,
    hasUpcomingReminders,
    disableCenterDimming,
  ]);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });

    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);

    renderer.setPixelRatio(pixelRatio);
    renderer.setClearColor(0x000000, 0);

    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const camera = new THREE.OrthographicCamera(
      -1,
      1,
      1,
      -1,
      0,
      1
    );

    const clock = new THREE.Clock();

    const vertexShader = `
      varying vec2 vUv;

      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
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

        p.xz *= m(t * 0.28);
        p.xy *= m(t * 0.20);

        vec3 q = p * 2.0 + t * 0.25;

        return
          length(p + vec3(sin(t * 0.35)))
          * log(length(p) + 1.0)
          + sin(
              q.x +
              sin(q.z + sin(q.y))
            ) * 0.5
          - 1.0;
      }

      void mainImage(out vec4 O, in vec2 fragCoord) {

        vec2 uv =
          fragCoord /
          min(iResolution.x, iResolution.y)
          - vec2(0.5);

        vec3 col = vec3(0.0);

        float d = 2.5;

        for (int i = 0; i <= 5; i++) {

          vec3 p =
            vec3(0.0, 0.0, 5.0)
            + normalize(vec3(uv, -1.0)) * d;

          float rz = map(p);

          float f =
            clamp(
              (rz - map(p + vec3(0.1))) * 0.5,
              -0.1,
              1.0
            );

          /*
           * MAK BUILD PREMIUM PALETTE
           *
           * Predominantly warm white/ivory atmosphere over charcoal.
           * Champagne gold flowing waves.
           * Small charcoal contrast.
           */

          vec3 base =
            vec3(0.16, 0.13, 0.08)
            + vec3(4.5, 3.5, 1.9) * f;

          if (hasActiveReminders) {
            base += vec3(0.18, 0.14, 0.05);
          }

          if (hasUpcomingReminders) {
            base += vec3(0.10, 0.08, 0.03);
          }

          col =
            col * base
            + smoothstep(2.5, 0.0, rz)
            * 0.68
            * base;

          d += min(rz, 1.0);
        }

        /*
         * Keep the center calm so website content
         * remains readable.
         */

        float dist =
          distance(
            fragCoord,
            iResolution * 0.5
          );

        float radius =
          min(iResolution.x, iResolution.y) * 0.5;

        float dim =
          disableCenterDimming
            ? 1.0
            : smoothstep(
                radius * 0.20,
                radius * 0.65,
                dist
              );

        O = vec4(col, 1.0);

        if (!disableCenterDimming) {
          O.rgb =
            mix(
              O.rgb * 0.62,
              O.rgb,
              dim
            );
        }

        O.rgb *= 0.88;
        O.a = 0.88;
      }

      void main() {
        mainImage(
          gl_FragColor,
          vUv * iResolution
        );
      }
    `;

    const uniforms = {
      iTime: {
        value: 0,
      },

      iResolution: {
        value: new THREE.Vector2(),
      },

      iMouse: {
        value: new THREE.Vector2(),
      },

      hasActiveReminders: {
        value: hasActiveReminders,
      },

      hasUpcomingReminders: {
        value: hasUpcomingReminders,
      },

      disableCenterDimming: {
        value: disableCenterDimming,
      },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
      depthTest: false,
    });

    materialRef.current = material;

    const geometry =
      new THREE.PlaneGeometry(2, 2);

    const mesh =
      new THREE.Mesh(
        geometry,
        material
      );

    scene.add(mesh);

    const onResize = () => {

      const width =
        container.clientWidth ||
        window.innerWidth;

      const height =
        container.clientHeight ||
        window.innerHeight;

      renderer.setSize(
        width,
        height,
        false
      );

      uniforms.iResolution.value.set(
        width,
        height
      );
    };

    const onMouseMove = (event: MouseEvent) => {

      uniforms.iMouse.value.set(
        event.clientX,
        window.innerHeight -
        event.clientY
      );
    };

    window.addEventListener(
      "resize",
      onResize
    );

    window.addEventListener(
      "mousemove",
      onMouseMove,
      { passive: true }
    );

    onResize();

    renderer.setAnimationLoop(() => {

      uniforms.iTime.value =
        clock.getElapsedTime();

      renderer.render(
        scene,
        camera
      );
    });

    return () => {

      window.removeEventListener(
        "resize",
        onResize
      );

      window.removeEventListener(
        "mousemove",
        onMouseMove
      );

      renderer.setAnimationLoop(null);

      if (
        renderer.domElement.parentNode ===
        container
      ) {
        container.removeChild(
          renderer.domElement
        );
      }

      material.dispose();
      geometry.dispose();
      renderer.dispose();

      materialRef.current = null;
    };

  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      aria-hidden="true"
    />
  );
}

export default InteractiveNebulaShader;
