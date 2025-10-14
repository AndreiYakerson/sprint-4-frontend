
import { useLocation } from 'react-router'
import { useState, useRef, useEffect } from 'react'

// service
import { showErrorMsg, showSuccessMsg } from '../../services/event-bus.service.js'
import { removeBoard, setBoard, setBoardRemovedMsg, updateBoard } from '../../store/actions/board.actions.js'

// cmps
import { FloatingContainerCmp } from '../FloatingContainerCmp.jsx'
import { HoveredTextCmp } from '../HoveredTextCmp.jsx'
import { TitleEditor } from '../Task/TitleEditor.jsx'
import { ActionsMenu } from '../ActionsMenu.jsx'
import { SvgIcon } from '../SvgIcon.jsx'

// images
import boardItemLogo from '/img/board-item-img.svg'



export function BoardPreview({ board, isSideBarDisplay }) {
    const location = useLocation()

    const [isStarred, setIsStarred] = useState(board?.isStarred)
    const [toRenameBoard, setToRenameBoard] = useState(false)
    const [boardTitleToEdit, setoardTitleToEdit] = useState(board?.title)
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const btnRef = useRef(null)
    const menuRef = useRef(null)

    function toggleIsMenuOpen(ev) {
        ev.stopPropagation()
        setIsMenuOpen(!isMenuOpen)
    }

    function onCloseMenu() {
        setIsMenuOpen(false)
    }

    function onSetRenameBoard(toRenameBoard) {
        setToRenameBoard(toRenameBoard)
    }

    /// crudl fnc

    function onOpenInNewTab() {
        const url = window.location.origin + `/board/${board?._id}`
        window.open(url, '_blank')
    }


    useEffect(() => {
        if (board?.isStarred !== isStarred) {
            setIsStarred(board?.isStarred)
        }
    }, [board])


    async function toggleIsStarred(isStarred) {

        setIsStarred(isStarred)
        try {
            await onUpdateBoard(board, { isStarred: isStarred })
        } catch (err) {
            setIsStarred(board?.isStarred)
        }
    }

    async function onSetBoardTitleToRename(newTitle) {
        setoardTitleToEdit(newTitle)
        setToRenameBoard(false)
        try {
            await onUpdateBoard(board, { title: newTitle })
        } catch (err) {
            setoardTitleToEdit(board?.title)
        }
    }


    async function onRemoveBoard(board) {
        try {
            await removeBoard(board?._id)
            showSuccessMsg('Board removed')
            if (location.pathname.includes(board?._id)) {
                setBoard(null)
                setBoardRemovedMsg(`“${board?.title}” board has been deleted`)
            }
        } catch (err) {
            showErrorMsg('Cannot remove board')
        }
    }


    async function onUpdateBoard(board, valsToUpdate) {

        const boardToSave = { ...structuredClone(board), ...valsToUpdate }

        try {
            const savedBoard = await updateBoard(boardToSave)
            showSuccessMsg(`Board ${savedBoard.title} updated`)
        } catch (err) {
            showErrorMsg('Cannot update board')
            throw err;
        }
    }


    return (
        <article className="board-preview">

            <div className='board-img-wrapper'>
                <img
                    src={boardItemLogo}
                    alt="Board Image" className='board-img' />
            </div>

            <div className='board-info-items'>
                <SvgIcon
                    iconName="board"
                    size={isSideBarDisplay ? 16 : 22}
                    colorName={isSideBarDisplay ? "currentColor" : ''}
                />

                {isSideBarDisplay
                    ? <div className='board-title'>
                        {toRenameBoard ? <TitleEditor
                            info={{ currTitle: boardTitleToEdit, toRenameBoard: toRenameBoard }}
                            onUpdate={onSetBoardTitleToRename}
                            onSetRenameBoard={onSetRenameBoard}
                        />
                            : <span>{boardTitleToEdit}</span>
                        }
                    </div>
                    : <div className='board-title'>{board.title}</div>
                }


                {isSideBarDisplay
                    ? <>
                        <button
                            className={`transparent board-menu-btn ${isMenuOpen ? "menu-open" : ""}`}
                            onClick={toggleIsMenuOpen}
                            ref={btnRef}
                        >
                            <SvgIcon iconName="dots" size={16} colorName="currentColor" />
                        </button>

                        {isMenuOpen && <FloatingContainerCmp
                            anchorEl={btnRef.current}
                            onClose={onCloseMenu}
                            offsetX={40}
                            offsetY={30}
                        >
                            <ActionsMenu
                                menuRef={menuRef}
                                onCloseMenu={onCloseMenu}
                                onOpenInNewTab={onOpenInNewTab}
                                toggleIsStarred={() => toggleIsStarred(!isStarred)}
                                onRemoveItem={() => onRemoveBoard(board)}
                                isStarred={isStarred}
                                onRenameBoard={onSetRenameBoard}
                            />
                        </FloatingContainerCmp>}
                    </>

                    : <button className='white square' onClick={(ev) => { ev.stopPropagation(), toggleIsStarred(!isStarred) }}>
                        <SvgIcon iconName={isStarred ? 'starFull' : 'star'}
                            size={22}
                            colorName={isStarred ? "starColor" : 'secondaryText'}
                        />
                    </button>
                }


            </div>

        </article >)
}

