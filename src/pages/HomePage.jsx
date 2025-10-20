
import { Link, NavLink } from 'react-router-dom'
import logoImg from '/img/logo.png'
import { SvgIcon } from '../cmps/SvgIcon'
export function HomePage() {

    return (
        <section className="home-page">
            <header className="home-page-header">

                <Link to='/' className="home-page-logo flex ">
                    <img src={logoImg} alt="site-logo" className='home-page-logo-icon' />
                    <div>
                        <span className="big-text">oneday</span>
                        <span className="small-text">.com</span>
                    </div>
                </Link>


                <nav className='home-page-header-nav'>
                    {['Products', 'Solutions', 'Resources', 'Enterprise'].map(navbtn => {
                        return <NavLink to='/' key={navbtn} className='btn nav-heaer-btn'>
                            <span>{navbtn}</span>

                        </NavLink>
                    })}
                </nav>

                <div>
                    <Link to="/auth/login" className='btn nav-heaer-btn login'>
                        Login
                    </Link>
                </div>

                <Link to="/board" className='btn get-started-btn'>
                    <span>
                        Get Started
                    </span>
                    <SvgIcon iconName="arrowRight" size={12} colorName="currentColor" />
                </Link>

            </header>

            <main className="home-page-main-content">
                <h1>main content</h1>
            </main>

            <footer className="home-page-footer">
                <h3>footer</h3>
            </footer>
        </section >
    )
}

