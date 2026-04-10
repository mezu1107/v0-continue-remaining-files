"use client"

import { useCallback, useEffect, useState } from "react"
import Particles from "@tsparticles/react"
import type { Container, Engine } from "@tsparticles/engine"
import { loadSlim } from "@tsparticles/slim"

export function ParticlesBackground() {
  const [init, setInit] = useState(false)

  useEffect(() => {
    const initParticles = async () => {
      const { initParticlesEngine } = await import("@tsparticles/react")
      await initParticlesEngine(async (engine: Engine) => {
        await loadSlim(engine)
      })
      setInit(true)
    }
    initParticles()
  }, [])

  const particlesLoaded = useCallback(async (container: Container | undefined) => {
    // Particles loaded
  }, [])

  if (!init) return null

  return (
    <Particles
      id="tsparticles"
      particlesLoaded={particlesLoaded}
      className="absolute inset-0 -z-10 pointer-events-none"
      options={{
        background: {
          color: {
            value: "transparent",
          },
        },
        fpsLimit: 60,
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "repulse",
            },
            onClick: {
              enable: true,
              mode: "push",
            },
          },
          modes: {
            repulse: {
              distance: 150,
              duration: 0.4,
            },
            push: {
              quantity: 4,
            },
          },
        },
        particles: {
          color: {
            value: ["#3B82F6", "#10B981", "#8B5CF6"],
          },
          links: {
            color: "#3B82F6",
            distance: 150,
            enable: true,
            opacity: 0.3,
            width: 1,
          },
          move: {
            direction: "none",
            enable: true,
            outModes: {
              default: "bounce",
            },
            random: false,
            speed: 1.5,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              width: 1920,
              height: 1080,
            },
            value: 80,
          },
          opacity: {
            value: 0.5,
          },
          shape: {
            type: "circle",
          },
          size: {
            value: { min: 1, max: 4 },
          },
        },
        detectRetina: true,
      }}
    />
  )
}
