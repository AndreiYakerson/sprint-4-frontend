import { Link } from "react-router-dom";

// images
//QUESTION האם אפשר להחליף פה ל svgicon

import boardRemovedIcon from '/img/board-removed-icon.svg'

export function BoardRemovedMsg({ removedMsg }) {
    return (
        <section className="board-removed-msg">
            <img src={boardRemovedIcon} alt="board removed trash" />
            <div className="removed-msg">{removedMsg}</div>
            <Link to='/board' className="btn blue">Back to workspace</Link>
        </section>
    )
}