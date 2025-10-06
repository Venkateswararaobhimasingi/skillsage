// src/components/three/ParticlesBackground.tsx

import { useCallback } from "react";
import Particles from "@tsparticles/react"; // ✅ This is the right package

import type { Engine, Container } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim";

export function ParticlesBackground() {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine); // ✅ Fixed: inside async function
  }, []);

  const particlesLoaded = useCallback(async (container: Container | undefined) => {
    console.log("Particles loaded:", container);
  }, []);

  const particlesOptions = {
    // ✅ Fixed: removed extra `{`
    autoPlay: true,
    background: {
      color: { value: "#000000" },
    },
    fullScreen: {
      enable: true,
      zIndex: 0,
    },
    particles: {
      number: {
        value: 100,
      },
      color: {
        value: "#ffffff",
      },
      shape: {
        type: "circle",
      },
      opacity: {
        value: 0.5,
      },
      size: {
        value: 3,
      },
      move: {
        enable: true,
        speed: 2,
        direction: "none",
        outModes: {
          default: "bounce",
        },
      },
    },
    emitters: {
      autoPlay: true,
      rate: {
        quantity: 1,
        delay: 7,
      },
      shape: {
        type: "square",
      },
      position: {
        x: -5,
        y: 55,
      },
      particles: {
        shape: {
          type: "image",
          options: {
            image: {
              src: "https://particles.js.org/images/cyan_amongus.png",
              width: 500,
              height: 634,
            },
          },
        },
        size: {
          value: 40,
        },
        move: {
          speed: 10,
          outModes: {
            default: "none",
            right: "destroy",
          },
          straight: true,
        },
        rotate: {
          value: {
            min: 0,
            max: 360,
          },
          animation: {
            enable: true,
            speed: 10,
            sync: true,
          },
        },
      },
    },
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      options={particlesOptions}
    />
  );
}
