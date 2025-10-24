import { useEffect } from "react"
import { useSelector } from "react-redux"
import { loadDashboard } from "../store/actions/board.actions"

export function Dashboard(props) {

    const dashboardData = useSelector(storeState => storeState.boardModule.dashboardData)

    useEffect(() => {
        onLoadDashboard()
    }, [])

    async function onLoadDashboard() {
        try {
            await loadDashboard()
        } catch (err) {
            showErrorMsg('faild to load dashboard')
        }
    }

    return (
        <section className="dashboard">

            <header className="dashboard-header">
                <div className="dashboard-name-container">
                    <h1>Dashboard</h1>
                </div>
                <nav className="dashboard-nav">
                    <div>dashboard nav</div>
                </nav>

            </header>

            <div className="dashboard-content">

            </div>

        </section>
    )

}