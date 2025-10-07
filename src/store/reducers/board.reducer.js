import { makeId } from "../../services/util.service"

// boards actions
export const SET_BOARDS = 'SET_BOARDS'
export const REMOVE_BOARD = 'REMOVE_BOARD'
export const UPDATE_BOARD = 'UPDATE_BOARD'
export const ADD_BOARD = 'ADD_BOARD'

// board actions
export const SET_BOARD = 'SET_BOARD'

export const SET_GROUPS = 'SET_GROUPS'
export const ADD_GROUP = 'ADD_GROUP'
export const UPDATE_GROUP = 'UPDATE_GROUP'
export const REMOVE_GROUP = 'REMOVE_GROUP'
export const SET_GROUP_ID_TO_EDIT = 'SET_GROUP_ID_TO_EDIT'

export const SET_TASKS = 'SET_TASKS'
export const ADD_TASK = 'ADD_TASK'
export const UPDATE_TASK = 'UPDATE_TASK'
export const REMOVE_TASK = 'REMOVE_TASK'
export const SET_TASK_ID_TO_EDIT = 'SET_TASK_ID_TO_EDIT'

export const ADD_BOARD_MSG = 'ADD_BOARD_MSG'

export const SET_IS_BOARD_EDITOR_OPEN = 'SET_IS_BOARD_EDITOR_OPEN'
export const SET_BOARD_REMOVED_MSG = 'SET_BOARD_REMOVED_MSG'



const initialState = {
    boards: [],
    board: null,
    newGroupIdToEdit: null,
    newTaskIdToEdit: null,
    isBoardEditorOpen: false,
    boardRemovedMsg: '',
}

export function boardReducer(state = initialState, action = {}) {
    var newState = state
    var boards
    switch (action.type) {
        // boards actions
        case SET_BOARDS:
            newState = { ...state, boards: action.boards }
            break
        case REMOVE_BOARD:
            const lastRemovedBoard = state.boards.find(board => board._id === action.boardId)
            boards = state.boards.filter(board => board._id !== action.boardId)
            newState = { ...state, boards, lastRemovedBoard }
            break
        case ADD_BOARD:
            newState = { ...state, boards: [...state.boards, action.board] }
            break
        case UPDATE_BOARD:
            // state.board = action.board 
            boards = state.boards.map(board => (board._id === action.board._id) ? action.board : board)
            newState = { ...state, boards }
            break

        // board actions
        case SET_BOARD:
            newState = { ...state, board: action.board }
            break
        // group actions
        case ADD_GROUP:
            newState = { ...state, board: { ...state.board, groups: [...state.board.groups, action.group] } }
            break
        case UPDATE_GROUP:
            newState = {
                ...state, board: {
                    ...state.board,
                    groups: state.board.groups.map(g => g.id === action.group.id ? { ...g, ...action.group } : g)
                }
            }
            break
        case REMOVE_GROUP:
            newState = {
                ...state, board: {
                    ...state.board,
                    groups: state.board.groups.filter(g => g.id !== action.groupId)
                }
            }
            break
        case SET_GROUPS:
            var board = { ...state.board }
            board.groups = action.groups
            newState = { ...state, board }
            break

        case SET_GROUP_ID_TO_EDIT:
            newState = { ...state, newGroupIdToEdit: action.groupId }
            break

        // task actions
        case SET_TASKS:
            var board = { ...state.board }
            board.groups = state.board.groups.map(g => {
                if (g.id !== action.groupId) return g
                const group = { ...g }
                group.tasks = action.tasks
                return group
            })
            // board.activities = [...board.activities, action.activity]
            newState = { ...state, board }
            break

        case ADD_TASK:
            var board = { ...state.board }
            board.groups = action.groups


            board.groups = state.board.groups.map(g => {
                if (g.id !== action.groupId) return g
                const group = { ...g }
                if (action.method === 'unshift') {
                    group.tasks = [action.task, ...group.tasks]
                } else {
                    group.tasks = [...group.tasks, action.task]
                }
                return group
            })
            // board.activities = [...board.activities, action.activity]
            newState = { ...state, board }
            break

        case UPDATE_TASK:
            var board = { ...state.board }
            board.groups = state.board.groups.map(g => {
                if (g.id !== action.groupId) return g
                const group = { ...g }
                group.tasks = group.tasks.map(t => (t.id !== action.task.id) ? t : action.task)
                return group
            })
            // board.activities = [...board.activities, action.activity]
            newState = { ...state, board }
            break

        case REMOVE_TASK:
            var board = { ...state.board }
            board.groups = state.board.groups.map(g => {
                if (g.id !== action.groupId) return g
                const group = { ...g }
                group.tasks = group.tasks.filter(t => t.id !== action.taskId)
                return group
            })
            // board.activities = [...board.activities, action.activity]
            newState = { ...state, board }
            break

        case SET_TASK_ID_TO_EDIT:
            newState = { ...state, newTaskIdToEdit: action.taskId }
            break

        case SET_IS_BOARD_EDITOR_OPEN:
            newState = { ...state, isBoardEditorOpen: action.isOpen }
            break

        case SET_BOARD_REMOVED_MSG:
            newState = { ...state, boardRemovedMsg: action.msg }
            break

        default:
    }
    return newState
}

// unitTestReducer()

function unitTestReducer() {
    var state = initialState
    const board1 = { _id: 'b101', vendor: 'Board ' + parseInt('' + Math.random() * 10), speed: 12, owner: null, msgs: [] }
    const board2 = { _id: 'b102', vendor: 'Board ' + parseInt('' + Math.random() * 10), speed: 13, owner: null, msgs: [] }

    state = boardReducer(state, { type: SET_BOARDS, boards: [board1] })
    console.log('After SET_BOARDS:', state)

    state = boardReducer(state, { type: ADD_BOARD, board: board2 })
    console.log('After ADD_BOARD:', state)

    state = boardReducer(state, { type: UPDATE_BOARD, board: { ...board2, vendor: 'Good' } })
    console.log('After UPDATE_BOARD:', state)

    state = boardReducer(state, { type: REMOVE_BOARD, boardId: board2._id })
    console.log('After REMOVE_BOARD:', state)

    state = boardReducer(state, { type: SET_BOARD, board: board1 })
    console.log('After SET_BOARD:', state)

    const msg = { id: 'm' + parseInt('' + Math.random() * 100), txt: 'Some msg', by: { _id: 'u123', fullname: 'test' } }
    state = boardReducer(state, { type: ADD_BOARD_MSG, boardId: board1._id, msg })
    console.log('After ADD_BOARD_MSG:', state)
}
// PriorityLabelsTest()

