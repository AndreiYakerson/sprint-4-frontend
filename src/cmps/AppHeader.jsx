
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
					<span className='app-name'>oneDay</span>
					<span className='work-management'>work management</span>
				</div>

			</Link>

			<button className='see-plans-container'>
				<SvgIcon
					iconName="seePlans"
					size={20}
					colorName={'currentColor'}
				/>
				See plans
			</button>

			<section className='main-nav'>

				<button className='main-nav-btn'>

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
				</button>


				<button className='main-nav-btn'>

					<HoveredTextCmp
						label="Update feed"
						position="down"
						onClick={(ev) => setAnchorEl(ev.currentTarget)}
					>
						<SvgIcon
							iconName="updateFeed"
							size={20}
							colorName={'primaryText'}
						/>
					</HoveredTextCmp>
				</button>

				<button className='main-nav-btn'>

					<HoveredTextCmp
						label="Invite members"
						position="down"
						onClick={(ev) => setAnchorEl(ev.currentTarget)}
					>
						<SvgIcon
							iconName="addMember"
							size={20}
							colorName={'primaryText'}
						/>
					</HoveredTextCmp>
				</button>
{/* 
				<button className='main-nav-btn'>

					<HoveredTextCmp
						label="Monday marketplace"
						position="down"
						onClick={(ev) => setAnchorEl(ev.currentTarget)}
					>
						<SvgIcon
							iconName="mondayMarketplace"
							size={20}
							colorName={'primaryText'}
						/>
					</HoveredTextCmp>
				</button>

				<button className='main-nav-btn'>

					<HoveredTextCmp
						label="Autopilot hub"
						position="down"
						onClick={(ev) => setAnchorEl(ev.currentTarget)}
					>
						<SvgIcon
							iconName="autopilotHub"
							size={20}
							colorName={'primaryText'}
						/>
					</HoveredTextCmp>
				</button>

				<button className='main-nav-btn'>

					<HoveredTextCmp
						label="Search everything"
						position="down"
						onClick={(ev) => setAnchorEl(ev.currentTarget)}
					>
						<SvgIcon
							iconName="searchGlass"
							size={20}
							colorName={'primaryText'}
						/>
					</HoveredTextCmp>
				</button>

				<button className='main-nav-btn'>

					<HoveredTextCmp
						label="Help"
						position="down"
						onClick={(ev) => setAnchorEl(ev.currentTarget)}
					>
						<SvgIcon
							iconName="help"
							size={20}
							colorName={'primaryText'}
						/>
					</HoveredTextCmp>
				</button> */}


				<div className='middle-line'></div>

				<button className='main-nav-btn'>

					<HoveredTextCmp
						label="oneDay vibe"
						position="down"
						onClick={(ev) => setAnchorEl(ev.currentTarget)}
					>
						<SvgIcon
							iconName="mondayVibe"
							size={20}
							colorName={'primaryText'}
						/>
					</HoveredTextCmp>
				</button>

				<button className='main-nav-btn'>

					<HoveredTextCmp
						label="Products Switcher"
						position="down"
						onClick={(ev) => setAnchorEl(ev.currentTarget)}
					>
						<SvgIcon
							iconName="productSwitcher"
							size={20}
							colorName={'primaryText'}
						/>
					</HoveredTextCmp>
				</button>

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
