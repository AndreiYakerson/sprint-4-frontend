import { Outlet, useLocation, useNavigate } from 'react-router'
import { NavLink } from 'react-router-dom'

import { useState, useEffect } from 'react'

import { userService } from '../services/user'
import { login, signup } from '../store/actions/user.actions'
import { ImgUploader } from '../cmps/ImgUploader'

export function LoginSignup() {
    const location = useLocation()

    const [isSignup, setIsSignup] = useState(false)

    function toggleIsSignup() {
        setIsSignup(!isSignup)
    }

    useEffect(() => {
        if (location.pathname.includes('signup') && !isSignup) {
            setIsSignup(true)
        } else if (isSignup) {
            setIsSignup(false)
        }
    }, [])


    return (
        <div className="login-page">

            <div className='login-signup-container'>
                <div className='form-container'>
                    <h1>{isSignup ? "Welcome to oneday.com" : "Log in to your account"}</h1>
                    <h2>{isSignup ? "Get started - it's free. No credit card needed." : "Enter your work email address"}</h2>
                    <Outlet />
                </div>

                <nav className='login-nav'>
                    <span>
                        {isSignup ? "Already have an account? " : "Don't have an account yet? "}
                    </span>
                    <NavLink to={isSignup ? "login" : "signup"} onClick={toggleIsSignup}>
                        {isSignup ? "Log in" : "  Sign up"}
                    </NavLink>
                </nav>

            </div>

            <div className='login-welcome-msg'>
                <img src="../../public/img/welcome-to-monday.avif" alt="welcome" />
            </div>

        </div>
    )
}

export function Login() {
    const [users, setUsers] = useState([])
    const [credentials, setCredentials] = useState({ username: '', password: '', fullname: '' })

    const navigate = useNavigate()

    useEffect(() => {
        loadUsers()
    }, [])

    async function loadUsers() {
        const users = await userService.getUsers()
        setUsers(users)
    }

    async function onLogin(ev = null) {
        if (ev) ev.preventDefault()

        if (!credentials.username) return
        await login(credentials)
        navigate('/board')
    }

    function handleChange(ev) {
        const field = ev.target.name
        const value = ev.target.value
        setCredentials({ ...credentials, [field]: value })
    }

    return (
        <form className="login-form" onSubmit={onLogin}>

            <input
                type="text"
                name="username"
                value={credentials.username}
                placeholder="Username"
                onChange={handleChange}
                required
            />
            <input
                type="password"
                name="password"
                value={credentials.password}
                placeholder="Password"
                onChange={handleChange}
            // required -for now
            />


            <div className='or-selection'>
                <div className='or-hr'></div>
                <span>Or</span>
                <div className='or-hr'></div>
            </div>

            <select
                name="username"
                value={credentials.username}
                onChange={handleChange}>
                <option value="">Select User</option>
                {users.map(user => <option key={user._id} value={user.username}>{user.fullname}</option>)}
            </select>

            <button className='blue'>Login</button>
        </form>
    )
}

export function Signup() {
    const [credentials, setCredentials] = useState(userService.getEmptyUser())
    const navigate = useNavigate()

    function clearState() {
        setCredentials({ username: '', password: '', fullname: '', imgUrl: '' })
    }

    function handleChange(ev) {
        const type = ev.target.type

        const field = ev.target.name
        const value = ev.target.value
        setCredentials({ ...credentials, [field]: value })
    }

    async function onSignup(ev = null) {
        if (ev) ev.preventDefault()

        if (!credentials.username || !credentials.password || !credentials.fullname) return
        await signup(credentials)
        clearState()
        navigate('/board')
    }

    function onUploaded(imgUrl) {
        setCredentials({ ...credentials, imgUrl })
    }

    return (
        <form className="signup-form" onSubmit={onSignup}>
            <input
                type="text"
                name="fullname"
                value={credentials.fullname}
                placeholder="Fullname"
                onChange={handleChange}
                required
            />
            <input
                type="text"
                name="username"
                value={credentials.username}
                placeholder="Username"
                onChange={handleChange}
                required
            />
            <input
                type="password"
                name="password"
                value={credentials.password}
                placeholder="Password"
                onChange={handleChange}
                required
            />
            <ImgUploader onUploaded={onUploaded} />
            <button className='blue'>Signup</button>
        </form>
    )
}