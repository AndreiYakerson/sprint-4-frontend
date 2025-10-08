import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { onSetFloatingIsOpen } from '../store/actions/system.actions'
import { useSelector } from 'react-redux'

export function FloatingContainerCmp({ anchorEl, children, onClose }) {
    const isPopUpOpen = useSelector(state => state.systemModule.isPopUpOpen)

    const [style, setStyle] = useState({})
    const [isVisible, setIsVisible] = useState(false)
    const popupRef = useRef(null)

    useEffect(() => {
        if (isPopUpOpen) return
        onSetFloatingIsOpen(true)
        return () => onSetFloatingIsOpen(false)
    }, [])


    useEffect(() => {
        if (!anchorEl) return

        const HEADER_HEIGHT = 200

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
    }, [anchorEl, onClose])


    // --- Close when clicking outside ---
    useEffect(() => {
        function handleClickOutside(e) {
            if (!popupRef.current || !anchorEl) return
            const clickedInside = e.target.closest('.fcc-container')
            const clickedAnchor = anchorEl.contains(e.target)
            if (!clickedInside && !clickedAnchor)
                setTimeout(() => {
                    onClose()
                }, 0);
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [anchorEl, onClose])

    // --- Positioning logic ---
    useLayoutEffect(() => {
        if (!anchorEl || !popupRef.current) return

        const updatePosition = () => {
            const anchorRect = anchorEl.getBoundingClientRect()
            const popupEl = popupRef.current
            const popupHeight = popupEl.offsetHeight
            const popupWidth = popupEl.offsetWidth
            const windowHeight = window.innerHeight
            const windowWidth = window.innerWidth
            const SPACING = 10

            let top
            const spaceBelow = windowHeight - anchorRect.bottom
            if (popupHeight + SPACING < spaceBelow) {
                top = anchorRect.bottom + window.scrollY + SPACING
            } else if (anchorRect.top > popupHeight + SPACING) {
                top = anchorRect.top + window.scrollY - popupHeight - SPACING
            } else {
                top = anchorRect.bottom + window.scrollY + SPACING
            }

            let left = anchorRect.left + window.scrollX
            if (left + popupWidth > windowWidth - SPACING) {
                left = anchorRect.right + window.scrollX - popupWidth
                if (left < SPACING) left = SPACING
            }

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

    if (!anchorEl) return null

    useLayoutEffect(() => {
        setStyle(prev => ({
            ...prev,
            transform: isVisible ? 'scale(1)' : 'scale(0)',
            opacity: isVisible ? 1 : 0,
        }))
    }, [isVisible])

    return createPortal(
        <div
            className="fcc-container"
            ref={popupRef}
            style={style}
            onClick={e => e.stopPropagation()}
        >
            {children}
        </div>,
        document.getElementById('portal-root')
    )
}

