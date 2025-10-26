import { useEffect } from "react"
import { useSelector } from "react-redux"
import { loadDashboard } from "../store/actions/board.actions"
import { showErrorMsg } from "../services/event-bus.service"

export function Dashboard(props) {

    const dashboardData = useSelector(storeState => storeState.boardModule.dashboardData)
    const boards = useSelector(storeState => storeState.boardModule.boards)

    useEffect(() => {
        onLoadDashboard()
    }, [])

    useEffect(() => {
        onLoadDashboard()
    }, [boards])

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
                    <div>Dashboard Nav</div>
                </nav>
            </header>


            < section className="dashboard-content">
                <ul className="data-list">


                    <li className="data-item">
                        <header className="data-header">
                            All Tasks
                        </header>
                        <div className="data-content">
                            <div className="item-count">
                                {dashboardData?.tasksCount}
                            </div>
                        </div>
                    </li>


                    {dashboardData?.byStatus?.length > 0 &&
                        dashboardData?.byStatus.slice(0, 3).map(status => {
                            return < li className="data-item" key={status.id}>
                                <header className="data-header">
                                    {status?.txt}
                                </header>
                                <div className="data-content">
                                    <div className="item-count">
                                        {status?.tasksCount}
                                    </div>
                                </div>
                            </li>
                        })
                    }

                    <li className="data-item big">
                        <header className="data-header"></header>
                        <div className="data-content"></div>
                    </li>
                    <li className="data-item big">
                        <header className="data-header"></header>
                        <div className="data-content"></div>
                    </li>
                </ul>
            </section>

        </section >
    )

}