
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
                    <div>
                        {['Products', 'Solutions', 'Resources', 'Enterprise'].map(navbtn => {
                            return <NavLink to='/' key={navbtn} className='btn nav-heaer-btn'>
                                <span>{navbtn}</span>

                            </NavLink>
                        })}
                    </div>

                    <div className='flex align-center'>
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
                    </div>
                </nav>

            </header>

            <main className="home-page-main-content">

                <div className='welcome-box'>
                    <h1>
                        One AI work platform <br></br>
                        for any kind of work
                    </h1>
                    <h2>Plan and execute work across projects, sales, marketing, IT,<br></br>
                        and engineering with a unified, AI-first product suite.</h2>
                    <Link to="/board" className='btn get-started-btn'>
                        <span>
                            Get Started
                        </span>
                        <SvgIcon iconName="arrowRight" size={12} colorName="currentColor" />
                    </Link>
                </div>

            </main>

            <footer className="home-page-footer">
                <div>All Rights Reserved © oneday.com</div>
            </footer>
        </section >
    )
}

