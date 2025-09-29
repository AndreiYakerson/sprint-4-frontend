import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { onSetPopUpIsOpen } from "../store/actions/board.actions"

export function PopUp({ children = false, onClose = () => { } }) {

    const isPopUpOpen = useSelector(state => state.boardModule.isPopUpOpen)

    useEffect(() => {
        const EscapePress = window.addEventListener("keydown", onKey)

        return () => window.removeEventListener("keydown", onKey)

    }, [])

    function onKey(ev) {
        if (ev.key == 'Escape') onSetPopUpIsOpen()
    }
    // useEffect(() => {
    //     onSetPopUpIsOpen()
    // }, [isOpen])

    // function onClosePopUp() {
    //     onSetPopUpIsOpen(false)
    //     onClose()
    // }

    if (!isPopUpOpen) return null
    return (
        <div onClick={onSetPopUpIsOpen} className="popup-backdrop">
            <div onClick={ev => ev.stopPropagation()} className="popup-container">
                <div className="popup-main">
                    {children}
                </div>
            </div>
        </div>
    )
}