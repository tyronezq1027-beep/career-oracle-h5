"use client"

import { useEffect, useRef } from "react"

export function AstrolabeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number
    let rotation = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resize()
    window.addEventListener("resize", resize)

    // Star particles
    const stars: { x: number; y: number; size: number; opacity: number }[] = []
    for (let i = 0; i < 100; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.3 + 0.1,
      })
    }

    const drawAstrolabe = () => {
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const maxRadius = Math.min(canvas.width, canvas.height) * 0.4

      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate(rotation)

      // Outer ring
      ctx.beginPath()
      ctx.arc(0, 0, maxRadius, 0, Math.PI * 2)
      ctx.strokeStyle = "rgba(212, 175, 55, 0.05)"
      ctx.lineWidth = 1
      ctx.stroke()

      // Inner concentric circles
      for (let i = 1; i <= 5; i++) {
        ctx.beginPath()
        ctx.arc(0, 0, maxRadius * (i / 6), 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(212, 175, 55, ${0.02 + i * 0.005})`
        ctx.stroke()
      }

      // Radial lines (12 divisions like a clock)
      for (let i = 0; i < 12; i++) {
        const angle = (i * Math.PI * 2) / 12
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(Math.cos(angle) * maxRadius, Math.sin(angle) * maxRadius)
        ctx.strokeStyle = "rgba(212, 175, 55, 0.03)"
        ctx.stroke()
      }

      // Zodiac-like symbols positions (decorative arcs)
      for (let i = 0; i < 12; i++) {
        const angle = (i * Math.PI * 2) / 12
        const x = Math.cos(angle) * maxRadius * 0.85
        const y = Math.sin(angle) * maxRadius * 0.85
        ctx.beginPath()
        ctx.arc(x, y, 3, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(212, 175, 55, 0.08)"
        ctx.fill()
      }

      // Inner decorative pattern
      ctx.beginPath()
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI * 2) / 6
        const x = Math.cos(angle) * maxRadius * 0.3
        const y = Math.sin(angle) * maxRadius * 0.3
        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.closePath()
      ctx.strokeStyle = "rgba(212, 175, 55, 0.04)"
      ctx.stroke()

      ctx.restore()
    }

    const drawStars = () => {
      stars.forEach((star) => {
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(212, 175, 55, ${star.opacity * (0.8 + Math.sin(Date.now() * 0.001 + star.x) * 0.2)})`
        ctx.fill()
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      drawStars()
      drawAstrolabe()
      
      rotation += 0.0002 // Very slow rotation
      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  )
}
