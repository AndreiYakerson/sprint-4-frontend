
import { storageService } from '../async-storage.service'
import { makeId } from '../util.service'
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


    boards = boards.map(({ _id, title }) => ({ _id, title }))
    return boards
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
        const boardToSave = _setBaordToSave(board.title)
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

        return await save(board)

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

        return await save(board)

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



function _setBaordToSave(title = 'New board') {
    return {
        _id: makeId(),
        title: title,
        createdAt: Date.now(),
        groups: [
            {
                id: makeId(),
                title: 'Group 1',
                createdAt: Date.now(),
                tasks: [
                    {
                        id: makeId(),
                        title: 'task 1',
                        createdAt: Date.now(),
                    },
                    {
                        id: makeId(),
                        title: 'task 2',
                        createdAt: Date.now(),
                    },
                ],
            },
        ],
    }
}

function _getEmptyGroup() {
    return {
        id: makeId(),
        title: 'New group',
        createdAt: Date.now(),
        tasks: []
    }
}