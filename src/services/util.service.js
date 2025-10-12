export function makeId(length = 6) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
}

export function makeLorem(size = 100) {
    var words = ['The sky', 'above', 'the port', 'was', 'the color of television', 'tuned', 'to', 'a dead channel', '.', 'All', 'this happened', 'more or less', '.', 'I', 'had', 'the story', 'bit by bit', 'from various people', 'and', 'as generally', 'happens', 'in such cases', 'each time', 'it', 'was', 'a different story', '.', 'It', 'was', 'a pleasure', 'to', 'burn']
    var txt = ''
    while (size > 0) {
        size--
        txt += words[Math.floor(Math.random() * words.length)] + ' '
    }
    return txt
}

export function getRandomIntInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min //The maximum is inclusive and the minimum is inclusive 
}


export function randomPastTime() {
    const HOUR = 1000 * 60 * 60
    const DAY = 1000 * 60 * 60 * 24
    const WEEK = 1000 * 60 * 60 * 24 * 7

    const pastTime = getRandomIntInclusive(HOUR, WEEK)
    return Date.now() - pastTime
}

export function debounce(func, timeout = 300) {
    let timer
    return (...args) => {
        clearTimeout(timer)
        timer = setTimeout(() => { func.apply(this, args) }, timeout)
    }
}

export function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

export function loadFromStorage(key) {
    const data = localStorage.getItem(key)
    return (data) ? JSON.parse(data) : undefined
}

export function getRandomGroupColor() {
    const colors = ["#17804d", "#27c977", "#9dd435", "#c8b649", "#fccb29", "#794acf", "#9d4edb", "#1e7eb3",
        "#5f9bf9", "#6fccfd", "#b83055", "#db2a4d", "#fa0080", "#fb57c3", "#fa6237", "#f9aa47", "#7d5348", "#c4c4c4", "#757575"
    ]
    const idx = getRandomIntInclusive(0, colors.length - 1)
    return colors[idx]
}
export function getVarColors() {
    const colors = []
    for (let i = 0; i < 19; i++) {
        colors.push(`--group-title-clr${i + 1}`)
    }
    return colors
}


export function getColumnType(colName) {
    switch (colName) {
        case 'status':
            return 'status'
        case 'priority':
            return 'priority'
        case 'members':
            return 'members'
        case 'due date':
            return 'due-date'
        default:
            return ""
    }
}
