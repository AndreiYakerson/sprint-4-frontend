import { useEffect, useRef } from "react"
import { useSelector } from "react-redux"
import { onSetPopUpIsOpen } from "../store/actions/system.actions.js"
import { createPortal } from "react-dom"
import { setIsBoardEditorOpen } from "../store/actions/board.actions.js"

export function PopUp({ children = false, onClose = false }) {
  const isPopUpOpen = useSelector(state => state.systemModule.isPopUpOpen)
  // Specific to the case of adding a board
  const isBoardEditorOpen = useSelector(state => state.boardModule.isBoardEditorOpen)

  const popupRef = useRef(null)

  function handleClickOutside(e) {
    const popupEl = popupRef.current
    if (!popupEl) return
    const clickedInside = e.target.closest('.popup-container')
    if (!clickedInside) {
      if (onClose) onClose()
      onSetPopUpIsOpen(false)
    }
    if (isBoardEditorOpen && !clickedInside) setIsBoardEditorOpen(false)

  }

  useEffect(() => {
    if (!isPopUpOpen && !isBoardEditorOpen) return
    const id = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside)
    }, 0)
    return () => {
      clearTimeout(id)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isPopUpOpen, isBoardEditorOpen])


  useEffect(() => {
    if (!isPopUpOpen && !isBoardEditorOpen) return
    const onKey = ev => {
      if (ev.key === "Escape")
        if (isBoardEditorOpen) setIsBoardEditorOpen(false)
        else onSetPopUpIsOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [isPopUpOpen, isBoardEditorOpen])

  if (!isPopUpOpen && !isBoardEditorOpen) return null

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
