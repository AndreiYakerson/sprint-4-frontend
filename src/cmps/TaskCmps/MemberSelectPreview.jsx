import plus from "/icons/plus.svg"
import person from "/icons/person.svg"
import { FloatingContainerCmp } from "../FloatingContainerCmp"
import { MemberCmp } from "./MemberCmp"
import { useState } from "react"
import { useSelector } from "react-redux"

export function MemberSelectPreview({ task }) {
    const [memberEl, setMemberEl] = useState(null)
    const [hoveredUser, setHoveredUser] = useState(null)
    const isFloatingOpen = useSelector(state => state.systemModule.isFloatingOpen)

    function onSetHoveredUser(user, target) {
        if (!isFloatingOpen || memberEl) {
            setHoveredUser(user);
            setMemberEl(target)
        }
        else return
    }

    function onClearHover() {
        setMemberEl(null)
        setHoveredUser(null);
    }

    return (
        <article className="member-select-preview">
            {!task.addedMembers?.length && <img src={plus} className="icon big plus" alt="plus icon" />}

            <div className="cmp-img"
            >
                {!!task.addedMembers.length ?
                    task.addedMembers.map(user => {
                        return <div
                            className="img-wrapper"
                            key={user.fullname}
                            onMouseLeave={(ev) => onClearHover()}
                            onMouseOver={(ev) => onSetHoveredUser(user, ev.currentTarget)}
                        >
                            <img
                                id={user.fullname}
                                src={user.imgUrl}
                                className="user-img"
                                alt="person icon"
                            />
                        </div>
                    })
                    :
                    <span className="user-img">
                        <img
                            src={person}
                            className="user-img "
                            alt="person icon"
                        />
                    </span>
                }

                {memberEl && < FloatingContainerCmp
                    anchorEl={memberEl}
                    onClose={() => onClearHover(null)}
                >
                    <MemberCmp
                        user={hoveredUser}
                    />
                </FloatingContainerCmp>}

            </div>

        </article>
    )
}