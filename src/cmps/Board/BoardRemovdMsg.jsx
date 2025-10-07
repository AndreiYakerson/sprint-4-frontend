import { Link } from "react-router-dom";

// images

import boardRemovedIcon from '../../../public/img/board-removed-icon.svg'

export function BoardRemovdMsg({ removedMsg }) {
    return (
        <section className="board-removed-msg">
            <img src={boardRemovedIcon} alt="board removed trash" />
            <div className="removed-msg">{removedMsg}</div>
            <Link to='/board' className="btn blue">Back to workspace</Link>
        </section>
    )
}