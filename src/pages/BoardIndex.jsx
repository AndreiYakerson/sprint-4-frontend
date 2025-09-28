import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { loadBoards, addBoard, updateBoard, removeBoard } from '../store/actions/board.actions'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { boardService } from '../services/board'

import { BoardList } from '../cmps/Board/BoardList'
import { BoardFilter } from '../cmps/Board/BoardFilter'
import { SideBar } from '../cmps/SideBar'


export function BoardIndex({setIsSideBarOpen}) {

    const [filterBy, setFilterBy] = useState(boardService.getDefaultFilter())
    const boards = useSelector(storeState => storeState.boardModule.boards)

    useEffect(() => {
        loadBoards(filterBy)
    }, [filterBy])

    async function onRemoveBoard(boardId) {
        try {
            await removeBoard(boardId)
            showSuccessMsg('Board removed')
        } catch (err) {
            showErrorMsg('Cannot remove board')
        }
    }

    async function onAddBoard() {
        const board = boardService.getEmptyBoard()
        board.title = prompt('Title?', 'Some Title')
        try {
            const savedBoard = await addBoard(board)
            showSuccessMsg(`Board added (id: ${savedBoard._id})`)
        } catch (err) {
            showErrorMsg('Cannot add board')
        }
    }

    async function onUpdateBoard(board) {
        const title = +prompt('New title?', board.title) || ''
        if (title === '' || title === board.title) return

        const boardToSave = { ...board, title }
        try {
            const savedBoard = await updateBoard(boardToSave)
            showSuccessMsg(`Board updated, new speed: ${savedBoard.title}`)
        } catch (err) {
            showErrorMsg('Cannot update board')
        }
    }

    return (
        <section className="board-index">
            <header>
                <h2> Recently viewed</h2>
                <button onClick={onAddBoard}>Add a Board</button>
            </header>
            {/* <BoardFilter filterBy={filterBy} setFilterBy={setFilterBy} /> */}
                <BoardList
                    boards={boards}
                    onRemoveBoard={onRemoveBoard}
                    onUpdateBoard={onUpdateBoard} />
        </section>
    )
}