
// SERVICES
import { useState } from "react"

// COMPONENTS
import { FloatingContainerCmp } from "../../FloatingContainerCmp"
import { MemberInfo } from "./MemberInfo"
import { MemberTaskSelect } from "./MemberTaskSelect"
// ICONS
import person from "/icons/person.svg"
import plus from "/icons/plus.svg"
export function MemberPicker({ info, onUpdate }) {
    const { label, members, propName, selectedMemberIds } = info

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
        return members.find(user => user.id === memberId)
    }).filter(Boolean)
    
    console.log("🚀 ~ MemberPicker ~ usersToShow:", usersToShow)


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
                        members={members}
                        // groupId={ }
                        onClose={updateTaskMembers}
                    />
                </FloatingContainerCmp>
                }

            </div>

        </article>
    )
}