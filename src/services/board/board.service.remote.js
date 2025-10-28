
import { getLoggedinUser, userService } from '../user'
import { getRandomGroupColor, makeId } from '../util.service'

import { httpService } from '../http.service'
import { filter } from 'lodash'

// import { userService } from '../user'

const BOARD_URL = 'board/'

export const boardService = {
    query,
    getById,
    save,
    remove,
    /// dashboard
    getDashboardData,
    // group
    addGroup,
    updateGroup,
    removeGroup,
    updateGroupsOrder,
    //task 
    getTaskById,
    addTask,
    removeTask,
    updateTask,
    duplicateTask,
    updateTasksOrder,
    ///
    addUpdate
}
window.cs = boardService


// board functions

async function query(filterBy = { txt: '' }) {
    var boards = await httpService.get(BOARD_URL, filterBy)
    return boards
}

async function getById(boardId, filterBy) {
    const filterByToSend = JSON.stringify(filterBy)

    var { board, filterOptions } = await httpService.get(`${BOARD_URL}${boardId}/${filterByToSend}`)

    return { board, filterOptions }
}




async function remove(boardId) {
    // throw new Error('Nope')
    await httpService.delete(BOARD_URL + boardId)
}

async function save(board) {
    var savedBoard
    if (board._id) {

        try {
            savedBoard = await httpService.put(BOARD_URL, board)
        } catch (error) {
            console.log(' Problem updating board. ', error)
        }
    } else {
        try {
            const boardToSave = _setBoardToSave(board)
            savedBoard = await httpService.post(BOARD_URL, boardToSave)
        } catch (error) {
            console.log(' Problem saving board. ')
        }
    }
    return savedBoard
}


//// Dashboard

async function getDashboardData(filterBy = {}) {
    return await httpService.get(BOARD_URL + 'dashboard')
}

// group functions 

async function updateGroupsOrder(orderedGroups, boardId) {

    try {
        return await httpService.put(`${BOARD_URL}group/order/${boardId}`, orderedGroups)

    } catch (err) {
        throw err
    }
}

async function addGroup(boardId) {
    try {
        return await httpService.post(`${BOARD_URL}group/${boardId}`)
    } catch (err) {
        console.log(' Problem adding group.', err)
        throw err
    }
}

async function updateGroup(boardId, groupToUpdate) {
    const groupId = groupToUpdate.id

    try {
        return await httpService.put(`${BOARD_URL}group/${boardId}/${groupId}`, groupToUpdate)
    } catch (err) {
        console.log(' Problem updating group.', err)
        throw err
    }
}


async function removeGroup(boardId, groupId) {

    return await httpService.delete(`${BOARD_URL}${boardId}/${groupId}`)
}



//  task functions

async function getTaskById(boardId, taskId) {

    try {

        const { board } = await getById(boardId)
        // if (!board) throw new Error(`Board ${boardId} not found`)

        // var foundTask = null

        // for (const group of board?.groups) {
        //     const task = group.tasks.find(task => task.id === taskId)
        //     if (task) {
        //         task.groupId = group.id
        //         foundTask = task
        //         break
        //     }
        // }
        const foundTask = await httpService.get(`${BOARD_URL}taskDetails/${boardId}/${taskId}`)

        if (!foundTask) throw new Error(`Task ${taskId} not found`)

        //אם אפשר להעביר לבק זה יחסוך לבקש גם את הבורד עצמו
        const activities = board.activities.filter(a => {
            return a.task.id === taskId
        }).sort((a1, a2) => (a1?.createdAt - a2?.createdAt) * -1)

        foundTask.activities = activities

        return foundTask

    } catch (err) {
        throw err
    }
}

async function updateTasksOrder(orderedTasks, boardId, groupId) {
    try {
        return await httpService.put(`${BOARD_URL}${boardId}/${groupId}/orderedTasks`, { orderedTasks })
    } catch (err) {
        throw err
    }
}

async function addTask(boardId, groupId, title, method) {
    try {
        return await httpService.post(`${BOARD_URL}task/${boardId}/${groupId}`, { title, method })
    } catch (err) {
        throw err
    }
}


async function updateTask(boardId, groupId, taskToUpdate, activityTitle) {

    try {

        const updatedTask = await httpService.put(`${BOARD_URL}${boardId}/${groupId}/${taskToUpdate.id}`, { taskToUpdate, activityTitle })
        return updatedTask
    } catch (err) {
        throw err
    }
}

async function duplicateTask(boardId, groupId, taskCopy) {

    try {
        return await httpService.post(`${BOARD_URL}task/duplicate/${boardId}/${groupId}`, { taskCopy })
    } catch (err) {
        throw err
    }
}

async function removeTask(boardId, groupId, taskId) {
    try {
        return await httpService.delete(`${BOARD_URL}task/${boardId}/${groupId}/${taskId}`)
    } catch (err) {
        throw err
    }
}

/// updates

async function addUpdate(boardId, groupId, taskId, updateTitle) {

    try {
        const res = await httpService.put(`${BOARD_URL}${boardId}/${groupId}/${taskId}/addUpdate`, { updateTitle })
        return res

    } catch (err) {
        throw err
    }
}


function _createUpdate(updateTitle, miniUser) {
    return {
        id: makeId(),
        title: updateTitle,
        createdAt: Date.now(),
        byMember: miniUser,
    }
}

//////// 

const DefaultPriorities = [
    {
        id: 'critical',
        txt: 'Critical'
        , cssVar: '--primary-text-color'
    },
    {
        id: 'high',
        txt: 'High'
        , cssVar: '--group-title-clr7'
    },
    {
        id: 'medium',
        txt: 'Medium'
        , cssVar: '--group-title-clr8'
    },
    {
        id: 'low',
        txt: 'Low'
        , cssVar: '--group-title-clr9'
    },
    {
        id: 'default',
        txt: ''
        , cssVar: '--group-title-clr18'
    },
]

const DefaultStatuses = [
    {
        id: 'done',
        txt: 'Done'
        , cssVar: '--group-title-clr2'
    },
    {
        id: 'working',
        txt: 'Working on it'
        , cssVar: ' --group-title-clr16'
    },
    {
        id: 'stuck',
        txt: 'Stuck'
        , cssVar: '--group-title-clr12'
    },
    {
        id: 'Not Started',
        txt: 'Not Started'
        , cssVar: '--group-title-clr18'
    },
]



function _setBoardToSave({ title = 'New board', managingType = 'items', privacy = 'main' }) {
    return {
        title,
        privacy,
        managingType,
        isStarred: false,
        createdAt: Date.now(),
        priorities: DefaultPriorities,
        statuses: DefaultStatuses,
        cmpOrder: ['members', 'status', 'date'],
        // Demo Members
        members: userService.createDemoUsersForBoard(5),
        groups: [
            {
                id: makeId(),
                title: 'Group 1',
                createdAt: Date.now(),
                isCollapsed: false,
                tasks: [

                    {
                        id: makeId(),
                        title: 'Item 1',
                        createdAt: Date.now(),
                        memberIds: [],
                        priority: { txt: 'Default Label', cssVar: '--group-title-clr18', id: 'default' },
                        status: { txt: 'Not Started', cssVar: '--group-title-clr18', id: 'Not Started' },
                        updates: []
                    },
                    {
                        id: makeId(),
                        title: 'Item 2',
                        createdAt: Date.now(),
                        memberIds: [],
                        priority: { txt: 'Default Label', cssVar: '--group-title-clr18', id: 'default' },
                        status: { txt: 'Not Started', cssVar: '--group-title-clr18', id: 'Not Started' },
                        updates: []
                    },
                ],
                style: {
                    '--group-color': getRandomGroupColor(),
                },
            },
        ],
        activities: [],
    }
}



