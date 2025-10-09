import appLoaderImg from '/img/loader.gif'

export function AppLoader(props) {
    return (
        <section className="app-loader">
            <img src={appLoaderImg} alt="loader" />
        </section>
    )
} 