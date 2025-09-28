import { Link, NavLink } from 'react-router-dom'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { logout } from '../store/actions/user.actions'
// images

import notifiction from '../../public/img/icons/notifiction.svg'
import updateFeed from '../../public/img/icons/update-feed.svg'

export function AppHeader() {
	const user = useSelector(storeState => storeState.userModule.user)
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
			<label className='logo'>
				<img className='' src="../../public/img/logo.png" alt="logo" />
				NodeDay
			</label>
			<section className='main-nav'>
				<div className='icon-container flex'>
					<img className='icon' src={notifiction} alt="icon notifications" data-tooltip="Notifications" />
					<img className='icon' src={updateFeed} alt="icon updateFeed" data-tooltip="Update Feed" />
				</div>
				{/* //FIXME לעצב את הקו המפריד בין הקונטיינרים */}
				<span className='middle-line'>!</span>
				<section className="main-mini-user">
					{user?.isAdmin && <NavLink to="/admin">Admin</NavLink>}
					{!user && <NavLink to="auth/login" className="login-link">Login</NavLink>}
					{user && (
						<div className="user-info">
							<img className='' src="../../public/img/logo.png" alt="logo" />
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
