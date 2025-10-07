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
    SET_GROUP_ID_TO_EDIT,
    //Task
    SET_TASKS,
    ADD_TASK,
    UPDATE_TASK,
    REMOVE_TASK,
    SET_GROUPS,
    SET_TASK_ID_TO_EDIT,
    SET_IS_BOARD_EDITOR_OPEN,
    SET_BOARD_REMOVED_MSG,
} from '../reducers/board.reducer'
import { SET_SIDE_BAR_OPEN } from '../reducers/system.reducer'



// BOARDS ACTIONS  ///////////////////////////////////////////////////////////////

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
    console.log("🚀 ~ updateBoard ~ board:", board)
    try {
        const savedBoard = await boardService.save(board)
        console.log("🚀 ~ updateBoard ~ savedBoard:", savedBoard)
        store.dispatch({ type: UPDATE_BOARD, board: savedBoard })
        store.dispatch({ type: SET_BOARD, board: savedBoard })
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

// Groups Actions ///////////////////////////////////////////////////////////////

export async function updateGroupsOrder(groups, boardId) {
    try {
        await boardService.updateGroupsOrder(groups, boardId)
        store.dispatch({ type: SET_GROUPS, groups })
    } catch (err) {
        console.log('Cannot add task', err)
        throw err
    }
}

export async function addGroup(boardId) {
    try {
        const group = await boardService.addGroup(boardId)
        store.dispatch({ type: ADD_GROUP, group })
        setNewGroupIdToEdit(group?.id)
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

export function setNewGroupIdToEdit(groupId) {
    store.dispatch({ type: SET_GROUP_ID_TO_EDIT, groupId })
}

// Tasks  ///////////////////////////////////////////////////////////////

export async function updateTasksOrder(tasks, boardId, groupId) {
    try {
        await boardService.updateTasksOrder(tasks, boardId, groupId)
        store.dispatch({ type: SET_TASKS, groupId, tasks })
    } catch (err) {
        console.log('Cannot add task', err)
        throw err
    }
}

export async function addTask(boardId, groupId, title, method = '') {
    try {
        const task = await boardService.addTask(boardId, groupId, title, method)
        store.dispatch({ type: ADD_TASK, groupId, task, method })
        if (method === 'unshift') setNewTaskIdToEdit(task?.id)
    } catch (err) {
        console.log('Cannot add task', err)
        throw err
    }
}


export async function updateTask(boardId, groupId, taskToUpdate) {
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

export function setNewTaskIdToEdit(taskId) {
    store.dispatch({ type: SET_TASK_ID_TO_EDIT, taskId })
}

export function setIsBoardEditorOpen(isOpen) {
    store.dispatch({ type: SET_IS_BOARD_EDITOR_OPEN, isOpen })
}

export function setBoard(board) {
    store.dispatch({ type: SET_BOARD, board })
}

export function setBoardRemovedMsg(msg) {
    store.dispatch({ type: SET_BOARD_REMOVED_MSG, msg })
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
