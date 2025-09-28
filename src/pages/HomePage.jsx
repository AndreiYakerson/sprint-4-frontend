import { useSelector } from "react-redux"
import { BoardIndex } from "./BoardIndex"

export function HomePage() {

    const user = useSelector(state => state.userModule.user)
    return (
        <section className="home-page">
            <header className="home-page-header">
                <h1> Good morning {user?.fullname} </h1>
                <p>Quickly access your recent boards, Inbox and workspaces</p>
            </header>
            <BoardIndex />

        </section >
    )
}

