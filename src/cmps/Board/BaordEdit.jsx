import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { boardService } from "../../services/board/index.js"
import { addBoard, setIsBoardEditorOpen } from "../../store/actions/board.actions.js"
import { SvgIcon } from "../SvgIcon.jsx"
import { showSuccessMsg } from "../../services/event-bus.service.js"


export function BoardEdit({ onClosePopUp }) {

    const navigate = useNavigate()

    const boardComposeData = boardService.getBoardComposeData()

    const [boardToEdit, setBoardToEdit] = useState(boardComposeData?.emptyBoard)
    const [isLoading, setIsLoading] = useState(false)

    function handleChange({ target }) {
        var { value, name } = target

        setBoardToEdit(prev => ({ ...prev, [name]: value }))
    }

    async function onSave(ev) {
        ev.preventDefault()

        setIsLoading(true)

        if (!boardToEdit.name) boardToEdit.name = 'New board'
        if (!boardToEdit.managingType) boardToEdit.managingType = 'items'
        try {
            const board = await addBoard(boardToEdit)
            showSuccessMsg(' Board added with success ')

            onClosePopUp()
            setIsBoardEditorOpen(false)
            navigate(`/board/${board?._id}`)

        } catch (err) {
            console.log('err:', err)
        } finally {
            setIsLoading(false)
        }
    }

    function privacyMsg(type) {
        switch (type) {
            case 'main':
                return 'Visible to everyone in your account'
            case 'private':
                return 'For working privately - alone or with selected team members.'
            case 'shareable':
                return 'For working privately with guests outside your account.'
            default:
                return ''
        }
    }

    const managingTypeSingular = Object.entries(boardComposeData?.managingTypes)
        .map(([plural, singular]) => singular)

    return (
        <section className="board-edit">
            <div className="board-edit-title">Create board</div>

            <form onSubmit={onSave}>

                <label htmlFor="title" className="edit-label">Board name</label>
                <input
                    type="text"
                    name="title"
                    id="title"
                    value={boardToEdit.title}
                    onChange={handleChange}
                    className="board-title-input gray"
                />

                <div className="edit-label">Privacy</div>
                <ul className="privacy-types-list flex">
                    {boardComposeData?.privacyTypes.map(val => {
                        return <li key={val} className="flex align-center">
                            <input
                                type="radio"
                                id={val}
                                name="privacy"
                                value={val} checked={boardToEdit.privacy === val}
                                onChange={handleChange}
                            />
                            <label htmlFor={val} className="privacy-label flex">
                                {(val === 'private' || val === 'shareable') && (
                                    <SvgIcon
                                        iconName={val === 'private' ? 'lock' : 'share'}
                                        size={20}
                                        colorName="currentColor"
                                    />
                                )}
                                {val}
                            </label>
                        </li>
                    })}
                </ul>

                <div>{privacyMsg(boardToEdit.privacy)}</div>

                <div className="sections-divider"></div>

                <div className="edit-label">Select what you're managing in this board</div>

                <ul className="managing-type-list">
                    {Object.entries(boardComposeData?.managingTypes).map(([plural, singular]) => {
                        return <li key={singular} className="managing-item flex align-center">
                            <input
                                type="radio"
                                id={singular}
                                name="managingType"
                                value={singular}
                                checked={boardToEdit.managingType === singular}
                                onChange={handleChange}
                            />
                            <label htmlFor={singular}>{plural}</label>
                        </li>
                    })}
                    <li key="custom" className="custom-wrapper">
                        <label htmlFor="custom" className=" custom-input">
                            <input
                                type="radio"
                                id="custom"
                                name="managingType"
                                value="custom"
                                checked={!managingTypeSingular.includes(boardToEdit.managingType)}
                                onChange={handleChange}
                            />

                            <input
                                type="text"
                                name="inputType"
                                id="inputType"
                                placeholder="Custom"
                                onFocus={(ev) => setBoardToEdit(prev => ({ ...prev, managingType: ev.target.value }))}
                                onChange={(ev) => setBoardToEdit(prev => ({ ...prev, managingType: ev.target.value }))}
                            />
                        </label>
                    </li>
                </ul>

                <div className="actions">
                    <button type="button"
                        className="white"
                        onClick={onClosePopUp}>Cancel</button>
                    <button type="submit" className="blue submit-btn">
                        {isLoading
                            ? <div className="mini-loader"></div>
                            : <>Create Board</>
                        }
                    </button>
                </div>
            </form>
        </section >
    )
}