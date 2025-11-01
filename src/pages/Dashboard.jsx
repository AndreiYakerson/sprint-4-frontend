import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { loadDashboard } from "../store/actions/board.actions"
import { showErrorMsg } from "../services/event-bus.service"
import { boardService } from "../services/board"
import { SvgIcon } from "../cmps/SvgIcon"
import { PieChart } from "../cmps/Charts/PieChart"
import { BarChart } from "../cmps/Charts/BarChart"
import { CustomPieChart } from "../cmps/Charts/CustomPieChart"

export function Dashboard(props) {

    const dashboardData = useSelector(storeState => storeState.boardModule.dashboardData)
    const boards = useSelector(storeState => storeState.boardModule.boards)
    console.log('boards', boards)


    const [board, setBoard] = useState()
    const [boardGroups, setBoardGroups] = useState()
    const [boardsData, setBoardsData] = useState()

    const [boardTasks, setBoardGroupsTasks] = useState()
    const [boardStatuses, setBoardStatuses] = useState()
    const [boardPriorities, setBoardPriorities] = useState()


    useEffect(() => {
        getData()
    }, [boards])


    async function getData() {
        try {
            const res = await boardService.getDashboardData()
            setBoardsData(res)
        } catch (error) {
            console.log('error', error)
        }
    }

    //QUESTION האם אפשר למחוק את זה או שצריך את זה במידה ואנחנו מושכים מהבק?!

    // useEffect(() => {
    //     onLoadDashboard()
    // }, [boards])

    // async function onLoadDashboard() {
    //     try {
    //         await loadDashboard()
    //     } catch (err) {
    //         showErrorMsg('faild to load dashboard')
    //     }
    // }
    if (!boardsData) return null
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
                <ul className="data-list small">


                    <li className="data-item">
                        <header className="data-header">
                            All Tasks
                        </header>
                        <div className="data-content">
                            <div className="item-count">
                                {boardsData.tasksCount}
                            </div>
                        </div>
                    </li>

                    {boardsData &&
                        boardsData.byStatus.map(status => {
                            if (status.id === 'default') return
                            return < li className="data-item" key={status.id}>
                                <header className="data-header text-overflow">
                                    {status?.txt}
                                </header>
                                <div className="data-content">
                                    <div className="item-count">
                                        {status.tasksCount}
                                    </div>
                                </div>
                            </li>
                        })
                    }
                </ul>
                <ul className="data-list big">

                    <li className="data-item big">
                        <header className="data-header flex  text-overflow">
                            {/* <SvgIcon iconName='dragBox' size={23} /> */}
                            <span className="data-title">Tasks by status</span>
                        </header>
                        <div className="data-content pei">
                            {boardsData ? (
                                <CustomPieChart
                                    data={boardsData}
                                />
                            ) : (
                                <p>Loading chart...</p>
                            )}

                        </div>
                    </li>

                    <li className="data-item big">
                        <header className="data-header flex  text-overflow">
                            {/* <SvgIcon iconName='dragBox' size={23} /> */}
                            <span className="data-title">Tasks by Owner</span>
                        </header>
                        <div className="data-content chart">
                            {boardsData ? (
                                <BarChart
                                    data={boardsData}
                                />
                            ) : (
                                <p>Loading chart...</p>
                            )}
                        </div>
                    </li>
                </ul>
            </section>

        </section >
    )

}