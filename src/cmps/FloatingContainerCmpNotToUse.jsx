// import { cloneElement, useEffect, useLayoutEffect, useRef, useState } from 'react'
// import { createPortal } from 'react-dom'
// import { onCloseFloating } from '../store/actions/system.actions'
// import { useSelector } from 'react-redux'

// export function FloatingContainerCmpNewNotToUse() {

//     const popUp = useSelector(state => state.systemModule.popUp)
//     const floating = useSelector(state => state.systemModule.floating)
//     const [style, setStyle] = useState({})
//     const [isVisible, setIsVisible] = useState(false)
//     const [trianglePos, setTrianglePos] = useState('UP')
//     const popupRef = useRef(null)

//     let contentWithProps = null
//     let dynamicProps = { offsetX: 0, offsetY: 0, centeredX: false, showTriangle: false, enforceLimit: false }
//     if (floating.content) {
//         const content = typeof floating.content === 'function'
//             ? floating.content()
//             : floating.content
//         const floatKeys = ['offsetX', 'offsetY', 'centeredX', 'showTriangle', 'enforceLimit']
//         floatKeys.forEach(key => {
//             if (content.props?.[key] !== undefined) dynamicProps[key] = content.props[key]
//         })
//         contentWithProps = cloneElement(content, { ...content.props })
//     }
    
//     const { offsetX, offsetY, centeredX, showTriangle, enforceLimit } = dynamicProps

//     useEffect(() => {
//         if (!floating.anchor || !enforceLimit) return

//         const HEADER_HEIGHT = 160

//         const checkAnchorVisibility = () => {
//             const rect = floating.anchor.getBoundingClientRect()
//             const isBelowHeader = rect.top < HEADER_HEIGHT
//             const isOffScreen = rect.bottom < 0 || rect.top > window.innerHeight

//             if (isBelowHeader || isOffScreen) {
//                 onCloseFloating()
//             }
//         }

//         checkAnchorVisibility()
//         window.addEventListener('scroll', checkAnchorVisibility, true)
//         window.addEventListener('resize', checkAnchorVisibility)

//         return () => {
//             window.removeEventListener('scroll', checkAnchorVisibility, true)
//             window.removeEventListener('resize', checkAnchorVisibility)
//         }
//     }, [floating.anchor, onCloseFloating, enforceLimit])




//     useEffect(() => {

//         function handleClickOutside(e) {
//             if (
//                 !popupRef.current ||
//                 !floating.anchor ||
//                 !(floating.anchor instanceof Node)
//             ) return

//             const clickedInside = e.target.closest('.fcc-container')
//             const clickedAnchor = floating.anchor.contains(e.target)
//             if (!clickedInside && !clickedAnchor)
//                 onCloseFloating()
//         }

//         document.addEventListener('click', handleClickOutside)
//         return () => document.removeEventListener('click', handleClickOutside)
//     }, [floating.anchor, onCloseFloating])



//     // --- Positioning logic ---
//     useLayoutEffect(() => {
//         //FIXME להודיע על שינוי!!
//         if (
//             !popupRef.current ||
//             !floating.anchor ||
//             !(floating.anchor instanceof Node)
//         ) return

//         const updatePosition = (ev) => {
//             // Ignore scroll events that originate inside anchorEl
//             if (ev) {
//                 if (popupRef.current.contains(ev.target) || floating.anchor.contains(ev.target)) return
//             }

//             const anchorRect = floating.anchor.getBoundingClientRect()
//             const popupEl = popupRef.current
//             const popupHeight = popupEl.offsetHeight
//             const popupWidth = popupEl.offsetWidth

//             const windowHeight = window.innerHeight
//             const windowWidth = window.innerWidth
//             const SPACING = 5

//             let top
//             const spaceBelow = windowHeight - anchorRect.bottom
//             const spaceAbove = anchorRect.top


//             if (popupHeight + SPACING <= spaceBelow) {
//                 top = anchorRect.bottom + window.scrollY + SPACING - offsetY
//                 if (showTriangle) setTrianglePos('up')
//             } else if (popupHeight + SPACING <= spaceAbove) {
//                 top = anchorRect.top + window.scrollY - popupHeight - SPACING + offsetY
//                 if (showTriangle) setTrianglePos('down')
//             } else {
//                 if (spaceBelow >= spaceAbove) {
//                     top = Math.min(
//                         anchorRect.bottom + window.scrollY + SPACING - offsetY,
//                         window.scrollY + windowHeight - popupHeight - SPACING
//                     )
//                     if (showTriangle) setTrianglePos('up')
//                 } else {
//                     top = Math.max(
//                         anchorRect.top + window.scrollY - popupHeight - SPACING + offsetY,
//                         window.scrollY + SPACING
//                     )
//                     if (showTriangle) setTrianglePos('down')
//                 }
//             }

//             let left = anchorRect.left + window.scrollX

//             if (centeredX) {
//                 left = anchorRect.left + window.scrollX + anchorRect.width / 2 - popupWidth / 2
//             }

//             if (left + popupWidth > windowWidth - SPACING) left = windowWidth - popupWidth - SPACING

//             if (left < SPACING) left = SPACING

//             left += offsetX

//             setStyle({
//                 position: 'absolute',
//                 top,
//                 left,
//                 zIndex: 1000,
//                 transformOrigin: 'top center',
//                 transform: 'scale(1)',
//                 opacity: 1,
//                 transition: 'transform 0.2s ease, opacity 0.2s ease',
//             })
//             setIsVisible(true)
//         }
//         // Run immediately
//         updatePosition()

//         // Update on scroll/resize
//         window.addEventListener('scroll', updatePosition, true)
//         window.addEventListener('resize', updatePosition)
//         return () => {
//             window.removeEventListener('scroll', updatePosition, true)
//             window.removeEventListener('resize', updatePosition)
//         }
//     }, [floating.anchor])


//     useLayoutEffect(() => {
//         setStyle(prev => ({
//             ...prev,
//             transform: isVisible ? 'scale(1)' : 'scale(0)',
//             opacity: isVisible ? 1 : 0,
//         }))
//     }, [isVisible])



//     return createPortal(
//         floating.anchor ? (
//             <div
//                 className={`fcc-container ${showTriangle ? "triangle" : ""} ${showTriangle ? trianglePos : ""}`}
//                 ref={popupRef}
//                 style={style}
//                 onClick={e => e.stopPropagation()}
//             >
//                 {contentWithProps}
//             </div>
//         ) : null,
//         document.getElementById('portal-root')
//     )
// }

