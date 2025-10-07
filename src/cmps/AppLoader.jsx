import appLoderimg from '../../public/img/loader.gif'

export function AppLoader(props) {
    return (
        <section className="app-loader">
            <img src={appLoderimg} alt="loader" />
        </section>
    )
}