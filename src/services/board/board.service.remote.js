
import { getLoggedinUser, userService } from '../user'
import { getRandomGroupColor, makeId } from '../util.service'

/// for filter date
import { DateTime } from "luxon"

import { httpService } from '../http.service'

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
    // const { txt, sortField, sortDir } = filterBy

    // if (txt) {
    //     const regex = new RegExp(filterBy.txt, 'i')
    //     boards = boards.filter(board => regex.test(board.title))
    // }

    // if (sortField === 'title') {
    //     boards.sort((board1, board2) =>
    //         board1[sortField].localeCompare(board2[sortField]) * +sortDir)
    // }


    // boards = boards.map(({ _id, title, isStarred }) => ({ _id, title, isStarred }))
    return boards
}

async function getById(boardId, filterBy) {
    var board = await httpService.get(BOARD_URL + boardId)

    // if (!board) return null

    // const filterOptions = getFilterOptions(board)

    // if (filterBy?.byGroups?.length > 0) {
    //     board.groups = board.groups.filter(g => filterBy.byGroups.includes(g.id))
    // }

    // if (filterBy?.byNames?.length > 0) {
    //     board.groups = board.groups.filter(g => {
    //         g.tasks = g.tasks.filter(t => filterBy.byNames.includes(t.title))
    //         return g?.tasks?.length > 0
    //     })
    // }


    // if (filterBy?.byStatuses?.length > 0) {
    //     board.groups = board.groups.filter(g => {
    //         g.tasks = g.tasks.filter(t => filterBy.byStatuses.includes(t?.status?.id))
    //         return g?.tasks?.length > 0
    //     })
    // }

    // if (filterBy?.byPriorities?.length > 0) {
    //     board.groups = board.groups.filter(g => {
    //         g.tasks = g.tasks.filter(t => filterBy.byPriorities.includes(t?.priority?.id))
    //         return g?.tasks?.length > 0
    //     })
    // }

    // if (filterBy?.byMembers?.length > 0) {
    //     board.groups = board.groups.filter(g => {
    //         g.tasks = g.tasks.filter(t => {
    //             return filterBy.byMembers.some(m => t?.memberIds.includes(m))
    //         })
    //         return g?.tasks?.length > 0
    //     })
    // }

    // if (filterBy?.byDueDateOp?.length > 0) {
    //     const now = DateTime.local()
    //     const ops = filterBy.byDueDateOp

    //     board.groups = board.groups
    //         .filter(g => {
    //             g.tasks = g.tasks.filter(t => {
    //                 if (!t?.dueDate?.date) return false

    //                 const dueDate = DateTime.fromMillis(t.dueDate.date)
    //                 const isDone = t?.status?.id === "done"
    //                 const updatedAt = t?.status?.updatedAt
    //                     ? DateTime.fromMillis(t.status.updatedAt)
    //                     : null

    //                 return (
    //                     (ops.includes("today") && dueDate.hasSame(now, "day")) ||
    //                     (ops.includes("tomorrow") && dueDate.hasSame(now.plus({ days: 1 }), "day")) ||
    //                     (ops.includes("yesterday") && dueDate.hasSame(now.minus({ days: 1 }), "day")) ||

    //                     (ops.includes("this week") && dueDate.hasSame(now, "week")) ||
    //                     (ops.includes("last week") && dueDate.hasSame(now.minus({ weeks: 1 }), "week")) ||
    //                     (ops.includes("next week") && dueDate.hasSame(now.plus({ weeks: 1 }), "week")) ||

    //                     (ops.includes("this month") && dueDate.hasSame(now, "month")) ||
    //                     (ops.includes("last month") && dueDate.hasSame(now.minus({ months: 1 }), "month")) ||
    //                     (ops.includes("next month") && dueDate.hasSame(now.plus({ months: 1 }), "month")) ||

    //                     (ops.includes("overdue") && !isDone && dueDate.startOf("day") < now.startOf("day")) ||
    //                     (ops.includes("done on time") && isDone && updatedAt && updatedAt <= dueDate) ||
    //                     (ops.includes("done overdue") && isDone && updatedAt && updatedAt > dueDate)
    //                 )
    //             })
    //             return g => g.tasks.length > 0
    //         })
    // }

    // /// Filter by specific user as opposed to a list of users ids from person filter

    // if (filterBy?.byPerson) {
    //     board.groups = board.groups.filter(g => {
    //         g.tasks = g.tasks.filter(t => t?.memberIds.includes(filterBy.byPerson))
    //         return g?.tasks?.length > 0
    //     })
    // }

    // /// sort by 

    // if (filterBy?.sortBy && filterBy?.dir) {
    //     if (filterBy?.sortBy === 'name') {
    //         board.groups = board.groups.map(g => {
    //             g.tasks = g.tasks.sort((t1, t2) => (t1?.title.localeCompare(t2?.title)) * filterBy?.dir)
    //             return g
    //         })
    //     } else if (filterBy?.sortBy === 'date') {
    //         board.groups = board.groups.map(g => {
    //             g.tasks = g.tasks.sort((t1, t2) => (t1?.dueDate?.date - t2?.dueDate?.date) * filterBy?.dir)
    //             return g
    //         })
    //     } else if (filterBy?.sortBy === 'status') {
    //         board.groups = board.groups.map(g => {
    //             g.tasks = g.tasks.sort((t1, t2) => (t1?.status?.txt.localeCompare(t2?.status?.txt)) * filterBy?.dir)
    //             return g
    //         })
    //     } else if (filterBy?.sortBy === 'priority') {
    //         board.groups = board.groups.map(g => {
    //             g.tasks = g.tasks.sort((t1, t2) => (t1?.priority?.txt.localeCompare(t2?.priority?.txt)) * filterBy?.dir)
    //             return g
    //         })
    //     } else if (filterBy?.sortBy === 'members') {
    //         board.groups = board.groups.map(g => {

    //             g.tasks = g.tasks.sort((t1, t2) => {

    //                 const member1 = board.members.find(m => m._id === t1.memberIds[0])?.fullname || ''
    //                 const member2 = board.members.find(m => m._id === t2.memberIds[0])?.fullname || ''

    //                 return (member1.localeCompare(member2)) * filterBy?.dir
    //             })
    //             return g
    //         })
    //     }
    // }
    const filterOptions = filterBy
    return { board, filterOptions }
}


function getFilterOptions(board) {
    const filterOptions = {}

    filterOptions.groups = board.groups.map(g => {
        return { id: g.id, title: g.title, color: g.style['--group-color'], taskSum: g?.tasks?.length }
    })


    const nameCounts = board.groups.reduce((acc, g) => {
        g.tasks.forEach(t => {
            if (acc[t.title]) acc[t.title] += 1
            else acc[t.title] = 1
        })

        return acc
    }, {})

    filterOptions.names = Object.entries(nameCounts).map(([name, count]) => {
        return { name, count }
    })

    return filterOptions
}

async function remove(boardId) {
    // throw new Error('Nope')
    await httpService.delete(BOARD_URL + boardId)
}

async function save(board) {
    var savedBoard
    if (board._id) {
        
        try {
         savedBoard =   await httpService.put(BOARD_URL, board)
        } catch (error) {
            console.log(' Problem updating board. ', error)
        }
    } else {
        try {
            const boardToSave = _setBoardToSave(board)
          savedBoard =   await httpService.post(BOARD_URL, boardToSave)
        } catch (error) {
            console.log(' Problem saving board. ')
        }
    }
    return savedBoard
}


//// Dashboard

async function getDashboardData(filterBy = {}) {
    const boards = await httpService.get(BOARD_URL +'dashboard')
    // var filterdBorad = structuredClone(boards)

    // const tasks = filterdBorad.reduce((acc, b) => {
    //     b.groups.forEach(g => {
    //         if (g?.tasks?.length) acc.push(...g.tasks)
    //     })
    //     return acc
    // }, [])

    // const dashboardData = {
    //     tasksCount: 0,
    //     byStatus: [],
    //     byMember: [],
    // }

    // if (!tasks?.length) {
    //     return dashboardData
    // }

    // const statusTypes = _sumStatusesType(tasks)
    // const members = _sumMembers(filterdBorad)


    // dashboardData.tasksCount = tasks.length
    // dashboardData.byStatus = _getSumDataByStatus(tasks, statusTypes)
    // dashboardData.byMember = members?.length > 0 ? _getSumDataByMembers(tasks, members) : []

    return boards
}

function _sumStatusesType(tasks) {

    const StatusesTypes = tasks.reduce((acc, task) => {
        const isStatusExist = acc.find(s => s.id === task.status.id)
        if (!isStatusExist) acc.push(task.status)
        return acc
    }, [])

    return StatusesTypes
}

function _sumMembers(filterdBorad) {
    const members = filterdBorad.reduce((acc, board) => {
        if (board?.members?.length > 0) {
            acc = [...acc, ...board.members]
        }
        return acc
    }, [])

    const filtedMembers = members.reduce((acc, member) => {
        const isStatusExist = acc.find(m => m._id === member._id)
        if (!isStatusExist) {
            const filteredMeber = { _id: member._id, fullname: member.fullname, imgUrl: member.imgUrl }
            acc.push(filteredMeber)
        }
        return acc
    }, [])

    return filtedMembers
}

function _getSumDataByStatus(tasks, statusTypes) {

    const statusesCountMap = tasks.reduce((acc, task) => {
        if (!acc[task?.status?.id]) acc[task?.status?.id] = 1
        else acc[task?.status?.id] += 1
        return acc
    }, {})

    var statusesSummary = Object.keys(statusesCountMap).map(statusId => {
        var status = statusTypes.find(s => s.id === statusId)
        status.tasksCount = statusesCountMap[statusId]
        status.tasksPercentage = parseFloat(((statusesCountMap[statusId] / tasks.length) * 100).toFixed(1))
        return status
    })

    return statusesSummary
}

function _getSumDataByMembers(tasks, members) {

    const MembersCountMap = tasks.reduce((acc, task) => {
        if (!task?.memberIds?.length) return acc

        task.memberIds.forEach(memberId => {
            if (!acc[memberId]) acc[memberId] = 1
            else acc[memberId] += 1
        })

        return acc
    }, {})


    var membersSummary = Object.keys(MembersCountMap).map(memberId => {
        var member = members.find(m => m._id === memberId)
        if (!member) return
        member.tasksCount = MembersCountMap[memberId]
        member.tasksPercentage = parseFloat(((MembersCountMap[memberId] / tasks.length) * 100).toFixed(1))
        return member
    })

    return membersSummary
}


// group functions 

async function updateGroupsOrder(orderedGroups, boardId) {
    try {
        const { board } = await getById(boardId)
        if (!board) throw new Error(`Board ${boardId} not found`);

        board.groups = orderedGroups

        return await save(board)

    } catch (err) {
        throw err
    }
}

async function addGroup(boardId) {
    try {
        return await httpService.put(`${BOARD_URL}${boardId}`)

    } catch (err) {
        console.log(' Problem adding group.', err)

        throw err
    }
}

async function updateGroup(boardId, groupToUpdate) {

    try {
        const { board } = await getById(boardId)
        if (!board) throw new Error(`Board ${boardId} not found`);

        const idx = board.groups.findIndex(group => group.id === groupToUpdate.id)
        if (idx === -1) throw new Error(`group ${groupToUpdate.id} not found`);

        board.groups[idx] = { ...board.groups[idx], ...groupToUpdate }

        await save(board)

        return board.groups[idx]

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
        if (!board) throw new Error(`Board ${boardId} not found`)

        var foundTask = null

        for (const group of board?.groups) {
            const task = group.tasks.find(task => task.id === taskId)
            if (task) {
                task.groupId = group.id
                foundTask = task
                break
            }
        }

        if (!foundTask) throw new Error(`Task ${taskId} not found`)

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
        const { board } = await getById(boardId)
        if (!board) throw new Error(`Board ${boardId} not found`);

        const idx = board.groups.findIndex(group => group.id === groupId)
        if (idx === -1) throw new Error(`Board ${groupId} not found`);

        board.groups[idx].tasks = orderedTasks

        return await save(board)

    } catch (err) {
        throw err
    }
}

async function addTask(boardId, groupId, title, method) {

    try {
        const { board } = await getById(boardId)
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


async function updateTask(boardId, groupId, taskToUpdate, activityTitle) {

    try {
        const { board } = await getById(boardId)
        if (!board) throw new Error(`Board ${boardId} not found`)

        const group = board.groups.find(g => g.id === groupId)
        if (!group) throw new Error(`Group ${groupId} not found`)

        const taskIdx = group.tasks.findIndex(t => t.id === taskToUpdate.id)
        if (taskIdx === -1) throw new Error(`Task ${taskToUpdate.id} not found`)

        group.tasks[taskIdx] = { ...group.tasks[taskIdx], ...taskToUpdate }


        const activity = _createActivity(activityTitle, _getMiniUser(),
            _toMiniGroup(group), _toMiniTask(group.tasks[taskIdx]),)

        board.activities.push(activity)

        await save(board)

        return { savedTask: group.tasks[taskIdx], activity }

    } catch (err) {
        throw err
    }
}



async function duplicateTask(boardId, groupId, taskCopy, TaskCopyIdx) {

    try {
        const { board } = await getById(boardId)
        if (!board) throw new Error(`Board ${boardId} not found`);

        const idx = board.groups.findIndex(group => group.id === groupId)
        if (idx === -1) throw new Error(`group ${groupId} not found`);

        taskCopy.id = makeId()
        taskCopy.createdAt = Date.now()

        board.groups[idx].tasks.splice(TaskCopyIdx, 0, taskCopy)

        await save(board)

        return taskCopy

    } catch (err) {
        throw err
    }
}




async function removeTask(boardId, groupId, taskId) {

    try {
        return await httpService.delete(`${BOARD_URL}${boardId}/${groupId}/${taskId}`)
    } catch (err) {
        throw err
    }
}

/// updates

async function addUpdate(boardId, groupId, taskId, UpdateTitle) {

    try {
        const { board } = await getById(boardId)
        if (!board) throw new Error(`Board ${boardId} not found`)

        const group = board.groups.find(g => g.id === groupId)
        if (!group) throw new Error(`Group ${groupId} not found`)

        const taskIdx = group.tasks.findIndex(t => t.id === taskId)
        if (taskIdx === -1) throw new Error(`Task ${taskId} not found`)

        const updateToAdd = _createUpdate(UpdateTitle, _getMiniUser())

        group.tasks[taskIdx] = {
            ...group.tasks[taskIdx],
            updates: [updateToAdd, ...(group.tasks[taskIdx]?.updates || [])]
        }

        await save(board)

        return group.tasks[taskIdx]

    } catch (err) {
        throw err
    }
}


function _createUpdate(UpdateTitle, miniUser) {
    return {
        id: makeId(),
        title: UpdateTitle,
        createdAt: Date.now(),
        byMember: miniUser,
    }
}


//////  Activity

function _createActivity(activityTitle, miniUser, miniGroup, miniTask) {
    return {
        id: makeId(),
        title: activityTitle,
        createdAt: Date.now(),
        byMember: miniUser,
        group: miniGroup,
        task: miniTask,
    }
}

function _getMiniUser() {
    const user = getLoggedinUser()
    if (user) {
        return {
            _id: user?._id,
            fullname: user?.fullname,
            imgUrl: user?.imgUrl,
        }
    } else {
        return {
            _id: 'guest',
            fullname: 'guest',
            imgUrl: '/img/gray-avatar.svg',
        }
    }

}

function _toMiniTask({ id, title }) {
    return { id, title }
}

function _toMiniGroup({ id, title }) {
    return { id, title }
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



function _getEmptyTask(title = 'New Task') {
    return {
        id: makeId(),
        title: title,
        createdAt: Date.now(),
        memberIds: [],
        priority: { txt: 'Default Label', cssVar: '--group-title-clr18', id: 'default' },
        status: { id: 'default', txt: 'Not Started', cssVar: '--group-title-clr18' },
        comments: []
    }
}