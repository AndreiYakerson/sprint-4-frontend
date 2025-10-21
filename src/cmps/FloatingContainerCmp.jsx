import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { onSetFloatingIsOpen } from '../store/actions/system.actions'
import { useSelector } from 'react-redux'

export function FloatingContainerCmp({
    anchorEl, children, onClose,
    offsetX = 0, offsetY = 0, centeredX = false,
    showTriangle = false, enforceLimit = false
}) {

    const [style, setStyle] = useState({})
    const [isVisible, setIsVisible] = useState(false)
    const [trianglePos, setTrianglePos] = useState('UP')
    const popupRef = useRef(null)

    useEffect(() => {
        onSetFloatingIsOpen(true)
        return () => {
            onSetFloatingIsOpen(false)
        }
    }, [])

    useEffect(() => {
        if (!anchorEl || !enforceLimit) return

        const HEADER_HEIGHT = 160

        const checkAnchorVisibility = () => {
            const rect = anchorEl.getBoundingClientRect()
            const isBelowHeader = rect.top < HEADER_HEIGHT
            const isOffScreen = rect.bottom < 0 || rect.top > window.innerHeight

            if (isBelowHeader || isOffScreen) {
                onClose()
            }
        }

        checkAnchorVisibility()
        window.addEventListener('scroll', checkAnchorVisibility, true)
        window.addEventListener('resize', checkAnchorVisibility)

        return () => {
            window.removeEventListener('scroll', checkAnchorVisibility, true)
            window.removeEventListener('resize', checkAnchorVisibility)
        }
    }, [anchorEl, onClose, enforceLimit])




    useEffect(() => {
        function handleClickOutside(e) {
            if (!popupRef.current || !anchorEl) return
            const clickedInside = e.target.closest('.fcc-container')
            const clickedAnchor = anchorEl.contains(e.target)
            if (!clickedInside && !clickedAnchor)
                setTimeout(() => {
                    onClose()
                }, 0)
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [anchorEl, onClose])


    // --- Positioning logic ---
    useLayoutEffect(() => {
        if (!anchorEl || !popupRef.current) return

        const updatePosition = (ev) => {
            // Ignore scroll events that originate inside anchorEl
            if (ev) {
                if (popupRef.current.contains(ev.target) || anchorEl.contains(ev.target)) return
            }

            const anchorRect = anchorEl.getBoundingClientRect()
            const popupEl = popupRef.current
            const popupHeight = popupEl.offsetHeight
            const popupWidth = popupEl.offsetWidth

            const windowHeight = window.innerHeight
            const windowWidth = window.innerWidth
            const SPACING = 5

            let top
            const spaceBelow = windowHeight - anchorRect.bottom
            const spaceAbove = anchorRect.top


            if (popupHeight + SPACING <= spaceBelow) {
                top = anchorRect.bottom + window.scrollY + SPACING - offsetY
                if (showTriangle) setTrianglePos('up')
            } else if (popupHeight + SPACING <= spaceAbove) {
                top = anchorRect.top + window.scrollY - popupHeight - SPACING + offsetY
                if (showTriangle) setTrianglePos('down')
            } else {
                if (spaceBelow >= spaceAbove) {
                    top = Math.min(
                        anchorRect.bottom + window.scrollY + SPACING - offsetY,
                        window.scrollY + windowHeight - popupHeight - SPACING
                    )
                    if (showTriangle) setTrianglePos('up')
                } else {
                    top = Math.max(
                        anchorRect.top + window.scrollY - popupHeight - SPACING + offsetY,
                        window.scrollY + SPACING
                    )
                    if (showTriangle) setTrianglePos('down')
                }
            }

            let left = anchorRect.left + window.scrollX

            if (centeredX) {
                left = anchorRect.left + window.scrollX + anchorRect.width / 2 - popupWidth / 2
            }

            if (left + popupWidth > windowWidth - SPACING) left = windowWidth - popupWidth - SPACING

            if (left < SPACING) left = SPACING

            left += offsetX

            setStyle({
                position: 'absolute',
                top,
                left,
                zIndex: 1000,
                transformOrigin: 'top center',
                transform: 'scale(1)',
                opacity: 1,
                transition: 'transform 0.2s ease, opacity 0.2s ease',
            })
            setIsVisible(true)
        }
        // Run immediately
        updatePosition()

        // Update on scroll/resize
        window.addEventListener('scroll', updatePosition, true)
        window.addEventListener('resize', updatePosition)
        return () => {
            window.removeEventListener('scroll', updatePosition, true)
            window.removeEventListener('resize', updatePosition)
        }
    }, [anchorEl])

    // if (!anchorEl) return null

    useLayoutEffect(() => {
        setStyle(prev => ({
            ...prev,
            transform: isVisible ? 'scale(1)' : 'scale(0)',
            opacity: isVisible ? 1 : 0,
        }))
    }, [isVisible])



    return createPortal(
        anchorEl ? (
            <div
                className={`fcc-container ${showTriangle ? "triangle" : ""} ${showTriangle ? trianglePos : ""}`}
                ref={popupRef}
                style={style}
                onClick={e => e.stopPropagation()}
            >
                {children}
            </div>
        ) : null,
        document.getElementById('portal-root')
    )
}

