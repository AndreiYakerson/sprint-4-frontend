import { getRandomIntInclusive, makeId } from '../util.service'

import userImg1 from '/img/demoUsers/user1.png'
import userImg2 from '/img/demoUsers/user2.png'
import userImg3 from '/img/demoUsers/user3.png'
import userImg4 from '/img/demoUsers/user4.png'
import userImg5 from '/img/demoUsers/user5.png'
import userImg6 from '/img/demoUsers/user6.png'
import userImg7 from '/img/demoUsers/user7.png'
import userImg8 from '/img/demoUsers/user8.png'
import userImg9 from '/img/demoUsers/user9.png'
import userImg10 from '/img/demoUsers/user10.png'
import { httpService } from '../http.service'

const usersImgs = [userImg1, userImg2, userImg3, userImg4, userImg5, userImg6, userImg7, userImg8, userImg9, userImg10,]
const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

export const userService = {
    login,
    logout,
    signup,
    getUsers,
    getById,
    remove,
    update,
    getLoggedinUser,
    saveLoggedinUser,
    createDemoUsersForBoard,
    createDemoUsersForLoggedUsers
}

async function getUsers() {
    const users = await httpService.get('user')
    return users.map(user => {
        delete user.password
        return user
    })
}

async function getById(userId) {
    return await httpService.get('user', userId)
}

function remove(userId) {
    return httpService.remove('user', userId)
}

async function update({ _id, score }) {
    const user = await httpService.get('user', _id)
    user.score = score
    await httpService.put('user', user)

    // When admin updates other user's details, do not update loggedinUser
    const loggedinUser = getLoggedinUser()
    if (loggedinUser._id === user._id) saveLoggedinUser(user)

    return user
}

async function login(userCred) {
    const users = await httpService.query('user')
    const user = users.find(user => user.username === userCred.username)

    if (user) return saveLoggedinUser(user)
}

async function signup(userCred) {
    if (!userCred.imgUrl) userCred.imgUrl = 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'
    userCred.score = 10000

    const user = await httpService.post('user', userCred)
    return saveLoggedinUser(user)
}


function createDemoUsersForLoggedUsers(num) {
    var professions = [
        'Head Chef',
        'Junior Developer',
        'Data Scientist',
        'UX Designer',
        'Registered Nurse (RN)',
        'Financial Analyst',
        'Solar Panel Installer',
        'Technical Writer',
        'Elementary School Teacher',
        'Urban Planner']

    var names = [
        'Liam OConnell',
        'Sofia Fernandez',
        'Kai Nakamura',
        'Chloe Davies',
        'Elijah Vance',
        'Aisha Khan',
        'Asked jo',
        'Benjamin Chen',
        'Grace Dubois',
        'Samuel Rivera',
        'Olivia Mason'
    ]

    var users = []
    for (let i = 5; i < num; i++) {

        const user = {
            _id: makeId(),
            fullname: names[i],
            password: `user ${i + 1}`,
            profession: professions.splice(getRandomIntInclusive(0, professions.length), 1)[0],
            tags: ['member'],
            imgUrl: usersImgs[i]
        }
        users.push(user)
    }

    return users
}


function createDemoUsersForBoard(num) {
    var professions = [
        'Head Chef',
        'Junior Developer',
        'Data Scientist',
        'UX Designer',
        'Registered Nurse (RN)',
        'Financial Analyst',
        'Solar Panel Installer',
        'Technical Writer',
        'Elementary School Teacher',
        'Urban Planner']

    var names = [
        'Liam OConnell',
        'Sofia Fernandez',
        'Kai Nakamura',
        'Chloe Davies',
        'Elijah Vance',
        'Aisha Khan',
        'Benjamin Chen',
        'Grace Dubois',
        'Samuel Rivera',
        'Olivia Mason'
    ]

    var users = []
    for (let i = 0; i < num; i++) {
        const user = {
            _id: makeId(),
            fullname: names[i],
            password: `user ${i + 1}`,
            profession: professions.splice(getRandomIntInclusive(0, professions.length), 1)[0],
            tags: ['member'],
            imgUrl: usersImgs[i]

        }
        users.push(user)
    }
    return users
}

async function logout() {
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

function saveLoggedinUser(user) {
    user = {
        _id: user._id,
        fullname: user.fullname,
        imgUrl: user.imgUrl,
        score: user.score,
        isAdmin: user.isAdmin
    }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
    return user
}

// To quickly create an admin user, uncomment the next line
// _createAdmin()
async function _createAdmin() {
    const user = {
        username: 'admin',
        password: 'admin',
        fullname: 'Mustafa Adminsky',
        imgUrl: user1,
        score: 10000,
    }

    const newUser = await httpService.post('user', userCred)
    console.log('newUser: ', newUser)
}