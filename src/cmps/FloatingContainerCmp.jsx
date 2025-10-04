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
        if (isPopUpOpen) return null
        onSetFloatingIsOpen(true)
        return () => onSetFloatingIsOpen(false)
    }, [])


    // Close on outside click
    function handleClickOutside(e) {
        setTimeout(() => {
            if (!popupRef.current || !anchorEl) return
            const clickedInside = e.target.closest('.fcc-container')
            const clickedAnchor = anchorEl.contains(e.target)
            if (!clickedInside && !clickedAnchor) onClose()
        }, 0)
    }

    useLayoutEffect(() => {
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [anchorEl])

    useLayoutEffect(() => {
        if (!anchorEl || !popupRef.current) {
            setIsVisible(false)
            setStyle({})
            return
        }

        const id = setTimeout(() => {
            // Get anchor and popup metrics
            const anchorRect = anchorEl.getBoundingClientRect()
            const popupEl = popupRef.current
            const popupHeight = popupEl.offsetHeight
            const popupWidth = popupEl.offsetWidth

            const windowHeight = window.innerHeight
            const windowWidth = window.innerWidth
            const SPACING = 10

            // Calculate vertical position
            let top
            const spaceBelow = windowHeight - anchorRect.bottom
            if (popupHeight + SPACING < spaceBelow) {
                top = anchorRect.bottom + window.scrollY + SPACING
            } else if (anchorRect.top > popupHeight + SPACING) {
                top = anchorRect.top + window.scrollY - popupHeight - SPACING
            } else {
                top = anchorRect.bottom + window.scrollY + SPACING
            }
            // Calculate horizontal position
            let left = anchorRect.left + window.scrollX
            if (left + popupWidth > windowWidth - SPACING) {
                left = anchorRect.right + window.scrollX - popupWidth
                if (left < SPACING) left = SPACING
            }
            // Set initial style with scale(0) and opacity 0
            setStyle({
                top,
                left,
                zIndex: 1000,
                transformOrigin: 'top center',
                transform: 'scale(0)',
                opacity: 0,
                transition: 'transform 0.3s ease, opacity 0.3s ease',
            })

            setIsVisible(false)
            setTimeout(() => setIsVisible(true), 10)// reset animation state
        }, 0)


        // Trigger scale up animation shortly after render
        return () => clearTimeout(id)
    }, [anchorEl])

    // Update style based on isVisible to scale up/down
    useLayoutEffect(() => {
        setStyle(prev => ({
            ...prev,
            transform: isVisible ? 'scale(1)' : 'scale(0)',
            opacity: isVisible ? 1 : 0,
        }))
    }, [isVisible])

    if (!anchorEl) return null


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
