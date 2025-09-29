import { useEffect, useRef } from 'react'

export function FloatingContainerCmp({ anchorEl, children, onClose }) {
// in order to use, one must remember to create In the current contain 	
// a local state = const [anchorEl, setAnchorEl] = useState(null) In parent container 
// Then item wish to be selected Add onClick={(el) => setAnchorEl(el)} 
// and pass to the Cmp         
//  <FloatingContainerCmp 
//     anchorEl={anchorEl}
//     onClose={() => setAnchorEl(null)}
//    >
// </FloatingContainerCmp> 

    const popupRef = useRef(null)

    useEffect(() => {
        function handleClickOutside(e) {
            if (popupRef.current && !popupRef.current.contains(e.target) && anchorEl && !anchorEl.contains(e.target)) {
                onClose()
            }
        }

        document.addEventListener('mousedown', handleClickOutside)

        return () => document.removeEventListener('mousedown', handleClickOutside)

    }, [onClose, anchorEl])

    if (!anchorEl) return null

    const rect = anchorEl.getBoundingClientRect()

    const style = {
        position: 'absolute',
        top: rect.bottom + window.scrollY + 20,
        left: rect.left + window.scrollX + 20,
        zIndex: 1000,
    }

    return (
        <div className="fcc-container" style={style} ref={popupRef}>
            {children}
        </div>
    )
}
