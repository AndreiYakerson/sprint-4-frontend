import React from 'react'
import { Routes, Route } from 'react-router'

import { HomePage } from './pages/HomePage'
import { AboutUs } from './pages/AboutUs.jsx'
import { BoardIndex } from './pages/BoardIndex.jsx'
import { ChatApp } from './pages/Chat.jsx'


import { BoardDetails } from './pages/BoardDetails.jsx'
import { UserDetails } from './pages/UserDetails'

import { AppHeader } from './cmps/AppHeader.jsx'
import { UserMsg } from './cmps/UserMsg.jsx'
import { LoginSignup, Login, Signup } from './pages/LoginSignup.jsx'
import { SideBar } from './cmps/SideBar/SideBar.jsx'


export function RootCmp() {

    return (
        <div className="main-container">
            <AppHeader />
            <UserMsg />
            <aside className='app-aside'>
                <SideBar />
            </aside>
            <main className='app-main-content'>
                <Routes>
                    <Route path="" element={<HomePage />} />
                    <Route path="about" element={<AboutUs />} />
                    <Route path="board" element={<BoardIndex />} />
                    <Route path="board/:boardId" element={<BoardDetails />} />
                    <Route path="board/:boardId/task/:taskId" element={<BoardDetails />} />
                    <Route path="user/:id" element={<UserDetails />} />
                    <Route path="chat" element={<ChatApp />} />
                    <Route path="auth" element={<LoginSignup />}>
                        <Route path="login" element={<Login />} />
                        <Route path="signup" element={<Signup />} />
                    </Route>
                </Routes>
            </main>
        </div>
    )
}


