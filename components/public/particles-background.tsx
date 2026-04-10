"use client"

import { useCallback, useEffect, useMemo, useState, useId } from "react"
import Particles from "@tsparticles/react"
import { initParticlesEngine } from "@tsparticles/react"
import type { Container, Engine, ISourceOptions } from "@tsparticles/engine"
import { loadSlim } from "@tsparticles/slim"
import { motion } from "framer-motion"

export function ParticlesBackground() {
  const [init, setInit] = useState(false)
  const uniqueId = useId()

  useEffect(() => {
    let isMounted = true

    initParticlesEngine(async (engine: Engine) => {
      await loadSlim(engine)
    }).then(() => {
      if (isMounted) setInit(true)
    })

    return () => {
      isMounted = false
    }
  }, [])

  const particlesLoaded = useCallback(async (container: Container | undefined) => {
    // console.log("Particles loaded:", container?.canvas?.element)
  }, [])

  const options: ISourceOptions = useMemo(
    () => ({
      background: {
        color: { value: "transparent" },
      },
      fpsLimit: 90,

      // Device optimization
      detectRetina: true,
      pauseOnBlur: true,
      pauseOnOutsideViewport: true,

      interactivity: {
        detectsOn: "window",
        events: {
          onHover: { enable: true, mode: "repulse" },
          onClick: { enable: true, mode: "push" },
          resize: { enable: true },
        },
        modes: {
          repulse: { distance: 100, duration: 0.4, speed: 40 }, // Mobile pe kam distance
          push: { quantity: 3 },
        },
      },

      particles: {
        color: {
          value: ["#6366f1", "#a855f7", "#ec4899"], // Dark vibrant indigo-purple-pink
        },
        links: {
          color: "#6b7280", // Grayish dark links
          distance: 140,
          enable: true,
          opacity: 0.5,
          width: 1.2,
        },
        move: {
          direction: "none",
          enable: true,
          outModes: { default: "out" },
          random: true,
          speed: { min: 0.8, max: 1.8 },
          straight: false,
        },
        number: {
          density: {
            enable: true,
            area: 800, // Responsive density
          },
          value: 70, // Base ~70, mobile pe auto kam ho jayega
        },
        opacity: {
          random: { enable: true, minimumValue: 0.5 },
          value: { min: 0.6, max: 0.9 }, // Dark but visible range
          animation: {
            enable: true,
            speed: 1.2,
            minimumValue: 0.4,
          },
        },
        shape: {
          type: "star", // Custom shape: built-in star (5 points)
          options: {
            star: {
              sides: 5, // 5-pointed star
            },
          },
        },
        size: {
          random: { enable: true, minimumValue: 1.5 },
          value: { min: 1.8, max: 4.5 },
          animation: {
            enable: true,
            speed: 3,
            minimumValue: 1,
          },
        },
        zIndex: {
          value: { min: 0, max: 100 },
          opacityRate: 1.2,
        },
      },
    }),
    []
  )

  if (!init) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className="absolute inset-0 pointer-events-none select-none"
    >
      <Particles
        id={`tsparticles-bg-${uniqueId}`}
        className="w-full h-full"
        particlesLoaded={particlesLoaded}
        options={options}
      />
    </motion.div>
  )
}