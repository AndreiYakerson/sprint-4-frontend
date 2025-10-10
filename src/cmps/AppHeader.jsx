
// services
import { Link, NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { logout, signup } from '../store/actions/user.actions'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'

// cmps
import { HoveredTextCmp } from './HoveredTextCmp.jsx'
import { SvgIcon } from './SvgIcon.jsx'

// images
import headerLogo from '/img/logo.png'
import { MiniUser } from './MiniUser.jsx'

// icons


export function AppHeader() {

	const user = useSelector(storeState => storeState.userModule.user)

	const [anchorEl, setAnchorEl] = useState(null)
	const navigate = useNavigate()



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

				<div className='flower-logo-container'>
					<SvgIcon
						iconName="flower"
						size={25}
					/>
				</div>

				<div className='logo-text-container'>
					<span className='app-name'>OneBay</span>
					<span className='work-management'>work management</span>
				</div>

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
					{!user && <NavLink to="auth/login" className="login-link">Login</NavLink>}
					{user && (
						<div className='member-info'>
							{/* <button onClick={onLogout}>logout</button> */}
							<MiniUser
								user={user}
							/>

						</div>
					)}

				</section>
			</section>
		</header>
	)
}
