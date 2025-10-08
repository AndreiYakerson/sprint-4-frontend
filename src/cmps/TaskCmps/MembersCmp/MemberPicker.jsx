
// SERVICES
import { useState } from "react"

// COMPONENTS
import { FloatingContainerCmp } from "../../FloatingContainerCmp"
import { MemberInfo } from "./MemberInfo"
import { MemberTaskSelect } from "./MemberTaskSelect"
// ICONS
import person from "/icons/person.svg"
import plus from "/icons/plus.svg"
import { remove } from "lodash"
import { useSelector } from "react-redux"
export function MemberPicker({ info, onUpdate }) {
    const { label, members, propName, selectedMemberIds } = info

    const [memberEl, setMemberEl] = useState(null)
    const [membersSelectEl, setMembersSelectEl] = useState(null)
    const [isAnimation, setIsAnimation] = useState(false)
    const [hoveredUser, setHoveredUser] = useState(null)
    const isFloatingOpen = useSelector(state => state.systemModule.isFloatingOpen)


    function onSetHoveredUser(user, target) {
        if (membersSelectEl || isFloatingOpen) return
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

    function onRemoveMember(memberId) {
        const memberIds = [...selectedMemberIds.filter(id => id !== memberId)]
        onUpdate(memberIds)
    }

    function updateTaskMembers(memberIds) {
        setIsAnimation(true)
        setTimeout(() => setIsAnimation(false), 400)
        onUpdate(memberIds)
        setMembersSelectEl(null)
        onClearHover()
    }

    const membersToShow = selectedMemberIds.map(memberId => {
        return members.find(member => member.id === memberId)
    }).filter(Boolean)

    return (
        <article className="member-picker" onClick={(ev) => setMembersSelectEl(ev.currentTarget)}>
            {!!membersToShow.length ?
                <div className="cmp-img">
                    {membersToShow.map((member, idx) => {
                        if (membersToShow.length <= 2 || idx === 0) {
                            return (
                                <div
                                    key={member.id}
                                    className={`img-wrapper ${isAnimation ? 'heartbeat ' : ''}`}
                                    onMouseLeave={onClearHover}
                                    onMouseOver={(ev) => onSetHoveredUser(member, ev.currentTarget)}
                                    onClick={() => onRemoveMember(member.id)}
                                >
                                    <img src={member.imgUrl} alt={member.fullname} className="user-img" />
                                </div>
                            )
                        }

                        if (idx === 1 && membersToShow.length > 2) {
                            return (
                                <div key="more-users" className={`img-wrapper more ${isAnimation ? 'heartbeat ' : ''}`}>
                                    <span className="more-count">+{membersToShow.length - 1}</span>
                                </div>
                            )
                        }

                        return null
                    })}
                </div>
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

            {
                memberEl && < FloatingContainerCmp
                    anchorEl={memberEl}
                    onClose={onClearHover}
                >
                    <MemberInfo
                        user={hoveredUser}
                    />
                </FloatingContainerCmp>
            }

            {
                membersSelectEl && < FloatingContainerCmp
                    anchorEl={membersSelectEl}
                    onClose={closeMemberSelect}
                >
                    <MemberTaskSelect
                        onRemove={onRemoveMember}
                        selectedMemberIds={selectedMemberIds}
                        members={members}
                        // groupId={ }
                        onClose={updateTaskMembers}
                    />
                </FloatingContainerCmp>
            }

            {/* </div> */}

        </article >
    )
}