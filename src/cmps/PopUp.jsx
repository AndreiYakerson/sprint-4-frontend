import { useDispatch, useSelector } from "react-redux"
import { onClosePopUp } from "../store/actions/system.actions"
import { cloneElement } from "react"

export function PopUp() {
  const popUp = useSelector(state => state.systemModule.popUp)

  const contentWithProps = popUp.content
    ? cloneElement(popUp.content, {
      ...popUp.content.props, onClosePopUp: onClosePopUp
    })
    : null

  if (!popUp.isOpen) return null
  return (
    <div className="popup-backdrop" onClick={onClosePopUp}>
      <div className="popup-container" onClick={e => e.stopPropagation()}>
        {contentWithProps}
      </div>
    </div>
  )
}