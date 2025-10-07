import plus from "/icons/plus.svg"
import person from "/icons/person.svg"
import { FloatingContainerCmp } from "../../FloatingContainerCmp"
import { MemberInfo } from "./MemberInfo"
import { useState } from "react"
import { useSelector } from "react-redux"
import { MemberTaskSelect } from "./MemberTaskSelect"

export function MemberPicker({ task, info, onUpdate }) {
    const { label, members, propName, selectedMemberIds } = info

    const users = useSelector(state => state.userModule.users)
    const isFloatingOpen = useSelector(state => state.systemModule.isFloatingOpen)

    const [memberEl, setMemberEl] = useState(null)
    const [membersSelectEl, setMembersSelectEl] = useState(null)
    const [hoveredUser, setHoveredUser] = useState(null)

    function onSetHoveredUser(user, target) {
        if (membersSelectEl) return
        setHoveredUser(user);
        setMemberEl(target)
    }

    function closeMemberSelect() {
        setMembersSelectEl(null)
        onClearHover()
    }

    function onClearHover() {
        if (membersSelectEl) return
        setMemberEl(null)
        setHoveredUser(null);
    }

    function updateTaskMembers(memberIds) {
        onUpdate(memberIds)
        setMembersSelectEl(null)
        onClearHover()
    }

    const usersToShow = selectedMemberIds.map(memberId => {
        return users.find(user => user.id === memberId)
    }).filter(Boolean)


    return (
        <article className="member-picker" onClick={(ev) => setMembersSelectEl(ev.currentTarget)}>

            <div className="cmp-img"
            >
                {!!usersToShow.length ?
                    usersToShow.map(user => {

                        return <div
                            className="img-wrapper"
                            key={user.id}
                            onMouseLeave={onClearHover}
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
                        <img src={plus} className="icon big plus" alt="plus icon" />
                        <img
                            src={person}
                            className="user-img "
                            alt="person icon"
                        />
                    </span>
                }

                {memberEl && < FloatingContainerCmp
                    anchorEl={memberEl}
                    onClose={onClearHover}
                >
                    <MemberInfo
                        user={hoveredUser}
                    />
                </FloatingContainerCmp>
                }

                {membersSelectEl && < FloatingContainerCmp
                    anchorEl={membersSelectEl}
                    onClose={closeMemberSelect}
                >
                    <MemberTaskSelect
                        selectedMemberIds={selectedMemberIds}
                        // onUpdate={addUser}
                        // groupId={ }
                        onClose={updateTaskMembers}
                    />
                </FloatingContainerCmp>
                }

            </div>

        </article>
    )
}