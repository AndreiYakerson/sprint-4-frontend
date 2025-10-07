
import { storageService } from '../async-storage.service'
import { userService } from '../user'
import { getRandomGroupColor, makeId } from '../util.service'
// import { userService } from '../user'

const STORAGE_KEY = 'board'

export const boardService = {
    query,
    getById,
    save,
    remove,
    // group
    addGroup,
    updateGroup,
    removeGroup,
    updateGroupsOrder,
    //task 
    addTask,
    removeTask,
    updateTask,
    updateTasksOrder
}
window.cs = boardService


// board functions

async function query(filterBy = { txt: '' }) {
    var boards = await storageService.query(STORAGE_KEY)
    const { txt, sortField, sortDir } = filterBy

    if (txt) {
        const regex = new RegExp(filterBy.txt, 'i')
        boards = boards.filter(board => regex.test(board.title))
    }

    if (sortField === 'title') {
        boards.sort((board1, board2) =>
            board1[sortField].localeCompare(board2[sortField]) * +sortDir)
    }


    boards = boards.map(({ _id, title, isStarred }) => ({ _id, title, isStarred }))
    return boards
}

async function updateTasksOrder(orderedTasks, boardId, groupId) {
    try {
        const board = await getById(boardId)
        if (!board) throw new Error(`Board ${boardId} not found`);

        const idx = board.groups.findIndex(group => group.id === groupId)
        if (idx === -1) throw new Error(`Board ${groupId} not found`);

        board.groups[idx].tasks = orderedTasks

        return await save(board)

    } catch (err) {
        throw err
    }
}

async function updateGroupsOrder(orderedGroups, boardId) {
    try {
        const board = await getById(boardId)
        if (!board) throw new Error(`Board ${boardId} not found`);

        board.groups = orderedGroups

        return await save(board)

    } catch (err) {
        throw err
    }
}

function getById(boardId) {
    return storageService.get(STORAGE_KEY, boardId)
}

async function remove(boardId) {
    // throw new Error('Nope')
    await storageService.remove(STORAGE_KEY, boardId)
}

async function save(board) {

    if (board._id) {
        return storageService.put(STORAGE_KEY, board)
    } else {
        const boardToSave = _setBaordToSave(board)
        return storageService.post(STORAGE_KEY, boardToSave)
    }
}

// group functions 

async function addGroup(boardId) {

    try {
        const board = await getById(boardId)
        if (!board) throw new Error(`Board ${boardId} not found`);

        const newGroupToAdd = _getEmptyGroup()

        board.groups.push(newGroupToAdd)

        await save(board)

        return newGroupToAdd

    } catch (err) {
        throw err
    }
}

async function updateGroup(boardId, groupToUpdate) {

    try {
        const board = await getById(boardId)
        if (!board) throw new Error(`Board ${boardId} not found`);

        const idx = board.groups.findIndex(group => group.id === groupToUpdate.id)
        if (idx === -1) throw new Error(`Board ${groupToUpdate.id} not found`);

        board.groups[idx] = { ...board.groups[idx], ...groupToUpdate }

        await save(board)

        return board.groups[idx]

    } catch (err) {
        throw err
    }
}


async function removeGroup(boardId, groupId) {

    try {
        const board = await getById(boardId)
        if (!board) throw new Error(`Board ${boardId} not found`);

        board.groups = board.groups.filter(group => group.id !== groupId)

        return await save(board)

    } catch (err) {
        throw err
    }
}

//  task functions

async function addTask(boardId, groupId, title, method) {

    try {
        const board = await getById(boardId)
        if (!board) throw new Error(`Board ${boardId} not found`);

        const idx = board.groups.findIndex(group => group.id === groupId)
        if (idx === -1) throw new Error(`group ${groupId} not found`);

        const newTaskToAdd = _getEmptyTask(title)

        if (method === 'unshift') {
            board.groups[idx].tasks.unshift(newTaskToAdd)
        } else {
            board.groups[idx].tasks.push(newTaskToAdd)
        }

        await save(board)

        return newTaskToAdd

    } catch (err) {
        throw err
    }
}


async function updateTask(boardId, groupId, taskToUpdate) {

    try {
        const board = await getById(boardId)
        if (!board) throw new Error(`Board ${boardId} not found`)

        const group = board.groups.find(g => g.id === groupId)
        if (!group) throw new Error(`Group ${groupId} not found`)

        const taskIdx = group.tasks.findIndex(t => t.id === taskToUpdate.id)
        if (taskIdx === -1) throw new Error(`Task ${taskToUpdate.id} not found`)

        group.tasks[taskIdx] = { ...group.tasks[taskIdx], ...taskToUpdate }

        await save(board)

        return group.tasks[taskIdx]

    } catch (err) {
        throw err
    }
}



async function removeTask(boardId, groupId, taskId) {

    try {
        const board = await getById(boardId)
        if (!board) throw new Error(`Board ${boardId} not found`);

        const idx = board.groups.findIndex(group => group.id === groupId)
        if (idx === -1) throw new Error(`Board ${groupId} not found`);

        board.groups[idx].tasks = board.groups[idx].tasks.filter(task => task.id !== taskId)

        return await save(board)

    } catch (err) {
        throw err
    }
}
const DefaultPriorities = [
    {
        id: makeId(),
        txt: 'Critical'
        , cssVar: '--group-title-clr3'
    },
    {
        id: makeId(),
        txt: 'High'
        , cssVar: '--group-title-clr1'
    },
    {
        id: makeId(),
        txt: 'medium'
        , cssVar: '--group-title-clr4'
    },
    {
        id: makeId(),
        txt: 'Low'
        , cssVar: '--group-title-clr2'
    },
]

const DefaultStatuses = [
    {
        id: makeId(),
        txt: 'Done'
        , cssVar: '--group-title-clr4'
    },
    {
        id: makeId(),
        txt: 'Working on it'
        , cssVar: '--group-title-clr1'
    },
    {
        id: makeId(),
        txt: 'Stuck'
        , cssVar: '--group-title-clr3'
    },
    {
        id: 'default',
        txt: 'Not Started'
        , cssVar: '--group-title-clr2'
    },
]



function _setBaordToSave({ title = 'New board', managingType = 'items', privacy = 'main' }) {
    return {
        _id: makeId(),
        title,
        privacy,
        managingType,
        isStarred: false,
        createdAt: Date.now(),
        priorities: DefaultPriorities,
        statuses: DefaultStatuses,
        // Demo Members
        members: userService.createDemoUsers(5),
        groups: [
            {
                id: makeId(),
                title: 'Group 1',
                createdAt: Date.now(),
                tasks: [

                    {
                        id: makeId(),
                        title: 'Item 1',
                        createdAt: Date.now(),
                        memberIds: [],
                        priority: { txt: 'Default Label', cssVar: '--group-title-clr18', id: makeId() },
                        
                    },
                    {
                        id: makeId(),
                        title: 'Item 2',
                        createdAt: Date.now(),
                        memberIds: [],
                        priority: { txt: 'Default Label', cssVar: '--group-title-clr18', id: makeId() }
                    },
                ],
                style: {
                    '--group-color': getRandomGroupColor(),
                },
            },
        ],
    }
}

function _getEmptyGroup() {
    return {
        id: makeId(),
        title: 'New group',
        createdAt: Date.now(),
        tasks: [],
        style: {
            '--group-color': getRandomGroupColor(),
        },
    }
}

function _getEmptyTask(title = 'New Task') {
    return {
        id: makeId(),
        title: title,
        createdAt: Date.now(),
        memberIds: [],
        priority: { txt: 'Default Label', cssVar: '--group-title-clr18', id: makeId() }
    }
}