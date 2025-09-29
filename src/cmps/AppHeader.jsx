import { Link, NavLink } from 'react-router-dom'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { logout } from '../store/actions/user.actions'
// images

import notification from '/icons/notification.svg'
import updateFeed from '/icons/update-feed.svg'
import { IconCmp } from './IconCmp'
import { PopUp } from './PopUp'
import { useState } from 'react'

export function AppHeader() {
	const user = useSelector(storeState => storeState.userModule.user)
	const [isPopUpOpen, setIsPopUpOpen] = useState(false)
	console.log("🚀 ~ AppHeader ~ isPopUpOpen:", isPopUpOpen)
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
			<Link to="/" className='app-logo'>
				<img className='logo-img' src="/img/logo.png" alt="logo-img" />
				<div className='app-name'>NodeDay</div>
			</Link>

			<section className='main-nav'>
				<div className='icon-container flex'>
					<IconCmp  src={notification} label={'Notifications'} position={'down'} />
					<span onClick={()=>setIsPopUpOpen(true)} className="update-feed-icon">
						<IconCmp src={updateFeed} label={'Update Feed'} position={'down'} />
					</span>
				</div>
				{/* //FIXME לעצב את הקו המפריד בין הקונטיינרים */}
				<span className='middle-line'>!</span>
				<section className="main-mini-user">
					{user?.isAdmin && <NavLink to="/admin">Admin</NavLink>}
					{!user && <NavLink to="auth/login" className="login-link">Login</NavLink>}
					{user && (
						<div className="user-info">
							<img className='' src="/img/logo.png" alt="logo" />
							<Link to={`user/${user._id}`}>
								{user.imgUrl && <img src={user.imgUrl} />}
							</Link>
							<button onClick={onLogout}>logout</button>
						</div>
					)}
					<PopUp
						isOpen={isPopUpOpen}
						onClose={setIsPopUpOpen}
					>
					</PopUp>
				</section>
			</section>
		</header>
	)
}
