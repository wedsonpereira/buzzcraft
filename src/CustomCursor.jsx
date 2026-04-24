import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const interactiveSelector = 'a, button, [role="button"], input, textarea, select, summary, .organization-pill'

function CustomCursor() {
  const cursorRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) {
      return undefined
    }

    const cursor = cursorRef.current
    const ring = ringRef.current

    if (!cursor || !ring) {
      return undefined
    }

    const xToCursor = gsap.quickTo(cursor, 'x', { duration: 0.08, ease: 'power2.out' })
    const yToCursor = gsap.quickTo(cursor, 'y', { duration: 0.08, ease: 'power2.out' })
    const xToRing = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power3.out' })
    const yToRing = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power3.out' })

    const setVisible = (visible) => {
      cursor.classList.toggle('is-visible', visible)
      ring.classList.toggle('is-visible', visible)
    }

    const setActive = (active) => {
      cursor.classList.toggle('is-active', active)
      ring.classList.toggle('is-active', active)
    }

    const handleMove = (event) => {
      setVisible(true)
      xToCursor(event.clientX)
      yToCursor(event.clientY)
      xToRing(event.clientX)
      yToRing(event.clientY)
    }

    const handleOver = (event) => {
      setActive(Boolean(event.target.closest(interactiveSelector)))
    }

    const handleLeave = () => {
      setVisible(false)
      setActive(false)
    }

    window.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseover', handleOver)
    document.addEventListener('mouseleave', handleLeave)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseover', handleOver)
      document.removeEventListener('mouseleave', handleLeave)
    }
  }, [])

  return (
    <>
      <div className="site-cursor" ref={cursorRef} aria-hidden="true" />
      <div className="site-cursor-ring" ref={ringRef} aria-hidden="true" />
    </>
  )
}

export default CustomCursor
