const { DEV, VITE_LOCAL } = import.meta.env

import { getRandomIntInclusive, makeId } from '../util.service'
// import { getRandomIntInclusive, makeId } from '../util.service'

import { boardService as local } from './board.service.local'
import { boardService as remote } from './board.service.remote'

function getEmptyBoard() {
    return {
        _id: '',
        title: '',
    }
}

function getDefaultFilter() {
    return {
        txt: '',
        sortField: '',
        sortDir: '',
    }
}

function getDefaultFilterBoardDetails() {
    return {
        byGroups: [],
        byNames: [],
        byStatuses: [],
        byPriorities: [],
        byMembers: [],
        byDueDateOp: [],
        byPerson: ''
    }
}

function getGroupColors() {
    return ["#17804d", "#27c977", "#9dd435", "#c8b649", "#fccb29", "#794acf", "#9d4edb", "#1e7eb3",
        "#5f9bf9", "#6fccfd", "#b83055", "#db2a4d", "#fa0080", "#fb57c3", "#fa6237", "#f9aa47", "#7d5348", "#c4c4c4", "#757575"
    ]
}

function getEmptyPriorityLabel() {
    return {
        id: makeId(),
        txt: ''
        , cssVar: `--group-title-clr${getRandomIntInclusive(0, 10)}`
    }
}

function getBoardComposeData() {
    return {
        emptyBoard: {
            title: 'New Board',
            privacy: 'main',
            managingType: 'item',
        },
        privacyTypes: ['main', 'private', 'shareable'],
        managingTypes: {
            items: "item",
            budgets: "budget",
            employees: "employee",
            campaigns: "campaign",
            leads: "lead",
            projects: "project",
            creatives: "creative",
            clients: "client",
            tasks: "task"
        }
    }
}



const service = (VITE_LOCAL === 'true') ? local : remote
export const boardService = {
    getEmptyPriorityLabel, getEmptyBoard, getDefaultFilter, getGroupColors,
    getBoardComposeData, getDefaultFilterBoardDetails, ...service
}

// Easy access to this service from the dev tools console
// when using script - dev / dev:local

if (DEV) window.boardService = boardService
