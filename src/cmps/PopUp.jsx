import { useEffect, useRef } from "react"
import { useSelector } from "react-redux"
import { onSetPopUpIsOpen } from "../store/actions/system.actions.js"
import { createPortal } from "react-dom"

export function PopUp({ children = false, showCloseBtn = false }) {
  const isPopUpOpen = useSelector(state => state.systemModule.isPopUpOpen)
  const popupRef = useRef(null)

  function handleClickOutside(e) {
    const popupEl = popupRef.current
    if (!popupEl) return
    const clickedInside = e.target.closest('.popup-container')
    if (!clickedInside) onSetPopUpIsOpen(false)
  }

  useEffect(() => {
    if (!isPopUpOpen) return
    const id = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside)
    }, 0)
    return () => {
      clearTimeout(id)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isPopUpOpen])

  useEffect(() => {
    const onKey = ev => {
      if (ev.key === "Escape") onSetPopUpIsOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  if (!isPopUpOpen) return null

  return createPortal(
    <div className="popup-backdrop">
      <div
        ref={popupRef}
        onClick={e => e.stopPropagation()}
        className="popup-container"
      >
          {children}
      </div>
    </div>,
    document.getElementById("modal-root")
  )
}
