import { useSelector } from "react-redux";
import { boardService } from "../services/board/board.service.remote";
import { onIsSideBarOpen } from "../store/actions/board.actions";
import { NavLink } from "react-router-dom";

export function SideBar() {

    const isSideBarOpen = useSelector(state => state.boardModule.isSideBarOpen)
    const user = useSelector(storeState => storeState.userModule.user)

    return (
        <div className={`side-bar ${isSideBarOpen}`}>
            <button onClick={() => onIsSideBarOpen(!isSideBarOpen)} className={`close-btn ${isSideBarOpen}`}>{isSideBarOpen ? '<' : '>'}</button>
            <div className="side-bar-content">
                <nav className="side-nav-list">
                    <NavLink to="">Home</NavLink>
                    <NavLink to="board">Boards</NavLink>
                    <NavLink to="chat">Chat</NavLink>
                    <NavLink to="about">About</NavLink>
                </nav>
                <div className="favorites">Favorites
                    <span className="arrow">{isSideBarOpen ? '<' : '>'}</span>
                    
                </div>
                
            </div>
        </div>
    )
}