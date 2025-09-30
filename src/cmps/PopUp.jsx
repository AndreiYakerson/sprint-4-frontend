import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

// services
import { onSetPopUpIsOpen } from "../store/actions/system.actions.js"

export function PopUp({ children = false, onClose = () => { } }) {

    const isPopUpOpen = useSelector(state => state.systemModule.isPopUpOpen)

    useEffect(() => {
        const EscapePress = window.addEventListener("keydown", onKey)

        return () => window.removeEventListener("keydown", onKey)

    }, [])

    function onKey(ev) {
        console.log('variable')

        if (ev.key == 'Escape') onSetPopUpIsOpen(false)
    }
    if (!isPopUpOpen) return null
    return (
        <div onClick={() => onSetPopUpIsOpen(false)} className="popup-backdrop">
            <div onClick={ev => ev.stopPropagation()} className="popup-container">
                <div className="popup-main">
                    {children}
                </div>
            </div>
        </div>
    )
}