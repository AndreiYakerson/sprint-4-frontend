import { Link, NavLink } from 'react-router-dom'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { logout } from '../store/actions/user.actions'

// services
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'

// cmps
import { HoveredTextCmp } from './HoveredTextCmp.jsx'
import { SvgIcon } from './SvgIcon.jsx'

// images
import headerLogo from '/img/logo.png'

// icons
import notification from '/icons/notification.svg'
import { useDispatch } from 'react-redux'
import { userService } from '../services/user/user.service.local.js'
import { SET_USERS } from '../store/reducers/user.reducer.js'



export function AppHeader() {
	const user = useSelector(storeState => storeState.userModule.user)
	const users = useSelector(storeState => storeState.userModule.users)
	const [anchorEl, setAnchorEl] = useState(null)
	const dispatch = useDispatch()
	const navigate = useNavigate()

	// Demo User creation 
	if (!users.length) {
		console.log('loading new DemoUsers!')
		let users = userService.createDemoUsers(5)
		dispatch({ type: SET_USERS, users })
	}

	async function onLogout() {
		try {
			await logout()
			navigate('/')
			showSuccessMsg(`Bye now`)
		} catch (err) {
			showErrorMsg('Cannot logout')
		}
	}

	return (
		<header className="app-header full">
			<Link to="/board" className='app-logo'>
				<img className='logo-img' src={headerLogo} alt="logo-img" />
				<div className='app-name'>NodeDay</div>
			</Link>

			<section className='main-nav'>
				<div className='icon-container flex'>

					<HoveredTextCmp
						label="Notifications"
						position="down"
						onClick={(ev) => setAnchorEl(ev.currentTarget)}
					>
						<SvgIcon
							iconName="bell"
							size={20}
							colorName={'primaryText'}
						/>
					</HoveredTextCmp>

				</div>
				{/* //FIXME לעצב את הקו המפריד בין הקונטיינרים */}
				<span className='middle-line'>!</span>
				<section className="main-mini-user">
					{/* {user?.isAdmin && <NavLink to="/admin">Admin</NavLink>} */}
					{!user && <NavLink to="auth/login" className="login-link">Login</NavLink>}
					{user && (
						<div className="member-Info">
							<img className='' src="/img/logo.png" alt="logo" />
							<Link to={`user/${user._id}`}>
								{user.imgUrl && <img src={user.imgUrl} />}
							</Link>
							<button onClick={onLogout}>logout</button>
						</div>
					)}

				</section>
			</section>
		</header>
	)
}
