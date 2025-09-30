import { boardService } from '../../services/board'
import { store } from '../store'
import {
    // Baords
    SET_BOARDS,
    ADD_BOARD,
    REMOVE_BOARD,
    UPDATE_BOARD,
    //Board
    SET_BOARD,
    //Group
    ADD_GROUP,
    UPDATE_GROUP,
    REMOVE_GROUP,
    //Task
    SET_TASKS,
    ADD_TASK,
    UPDATE_TASK,
    REMOVE_TASK,
} from '../reducers/board.reducer'



// BOARDS ACTIONS

// LIST

export async function loadBoards(filterBy) {
    try {
        const boards = await boardService.query(filterBy)
        store.dispatch({ type: SET_BOARDS, boards })
    } catch (err) {
        console.log('Cannot load boards', err)
        throw err
    }
}

// CREATE

export async function addBoard(board) {
    try {
        const savedBoard = await boardService.save(board)
        store.dispatch({ type: ADD_BOARD, board: savedBoard })
        return savedBoard
    } catch (err) {
        console.log('Cannot add board', err)
        throw err
    }
}

// UPDATE

export async function updateBoard(board) {
    try {
        const savedBoard = await boardService.save(board)
        store.dispatch({ type: UPDATE_BOARD, board: savedBoard })
        return savedBoard
    } catch (err) {
        console.log('Cannot save board', err)
        throw err
    }
}

// DELETE

export async function removeBoard(boardId) {
    try {
        await boardService.remove(boardId)
        store.dispatch({ type: REMOVE_BOARD, boardId })
    } catch (err) {
        console.log('Cannot remove board', err)
        throw err
    }
}


// BOARD ACTIONS


export async function loadBoard(boardId) {
    try {
        const board = await boardService.getById(boardId)
        store.dispatch({ type: SET_BOARD, board })
    } catch (err) {
        console.log('Cannot load board', err)
        throw err
    }
}

// Groups Actions


export async function addGroup(boardId) {
    try {
        const group = await boardService.addGroup(boardId)
        store.dispatch({ type: ADD_GROUP, group })
    } catch (err) {
        console.log('Cannot add group', err)
        throw err
    }
}

export async function updateGroup(boardId, groupToUpdate) {
    try {
        const savedGroup = await boardService.updateGroup(boardId, groupToUpdate)
        store.dispatch({ type: UPDATE_GROUP, group: savedGroup })
    } catch (err) {
        console.log('Cannot update group', err)
        throw err
    }
}

export async function removeGroup(boardId, groupId) {
    try {
        await boardService.removeGroup(boardId, groupId)
        store.dispatch({ type: REMOVE_GROUP, groupId })
    } catch (err) {
        console.log('Cannot remove group', err)
        throw err
    }
}

// Tasks

export async function updateTasksOrder(tasks, boardId, groupId) {
    try {
        await boardService.updateTasksOrder(tasks, boardId, groupId)
        store.dispatch({ type: SET_TASKS, groupId, tasks })
    } catch (err) {
        console.log('Cannot add task', err)
        throw err
    }
}

export async function addTask(boardId, groupId) {
    try {
        const task = await boardService.addTask(boardId, groupId)
        store.dispatch({ type: ADD_TASK, groupId, task })
    } catch (err) {
        console.log('Cannot add task', err)
        throw err
    }
}

export async function updateTask(boardId, groupId, taskToUpdate) {
    console.log('data:', boardId, groupId, taskToUpdate)
    try {
        const savedTask = await boardService.updateTask(boardId, groupId, taskToUpdate)
        store.dispatch({ type: UPDATE_TASK, groupId, task: savedTask })
    } catch (err) {
        console.log('Cannot update task', err)
        throw err
    }
}

export async function removeTask(boardId, groupId, taskId) {
    try {
        await boardService.removeTask(boardId, groupId, taskId)
        store.dispatch({ type: REMOVE_TASK, groupId, taskId })
    } catch (err) {
        console.log('Cannot remove task', err)
        throw err
    }
}



// // Command Creators:
// function setIsSideBarOpen(value) {
//     return {
//         type: SET_SIDE_BAR_OPEN,
//         value
//     }
// }
// function setPopUpIsOpen(value) {
//     return {
//         type: IS_POPUP_ON,
//         value
//     }
// }
// function getCmdSetBoards(boards) {
//     return {
//         type: SET_BOARDS,
//         boards
//     }
// }

// function getCmdSetBoard(board) {
//     return {
//         type: SET_BOARD,
//         board
//     }
// }

// function getCmdRemoveBoard(boardId) {
//     return {
//         type: REMOVE_BOARD,
//         boardId
//     }
// }

// function getCmdAddBoard(board) {
//     return {
//         type: ADD_BOARD,
//         board
//     }
// }

// function getCmdUpdateBoard(board) {
//     return {
//         type: UPDATE_BOARD,
//         board
//     }
// }


// // unitTestActions()
// async function unitTestActions() {
//     await loadBoards()
//     await addBoard(boardService.getEmptyBoard())
//     await updateBoard({
//         _id: 'm1oC7',
//         vendor: 'Board-Good',
//     })
//     await removeBoard('m1oC7')
//     // TODO unit test addBoardMsg
// }
