import { useSelector } from "react-redux";
import { boardService } from "../services/board/board.service.remote";
import { onIsSideBarOpen } from "../store/actions/board.actions";

export function SideBar() {

    const isSideBarOpen = useSelector(state => state.boardModule.isSideBarOpen)

    return (
        <div className={`side-bar ${isSideBarOpen}`}>
            <button onClick={() => onIsSideBarOpen(!isSideBarOpen)} className="close-btn">X</button>
            <div className="side-bar-content">
                <h4>Side Bar</h4>
            </div>
        </div>
    )
}