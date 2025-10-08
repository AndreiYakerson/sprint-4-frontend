
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
    const [isAnimation, setIsAnimation] = useState(false)
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

    function onRemoveMember(memberId) {
        const memberIds = [...selectedMemberIds.filter(id => id !== memberId)]
        updateTaskMembers(memberIds)
    }

    function updateTaskMembers(memberIds) {
        setIsAnimation(true)
        setTimeout(() => setIsAnimation(false), 400)
        onUpdate(memberIds)
        setMembersSelectEl(null)
        onClearHover()
    }

    const membersToShow = selectedMemberIds.map(memberId => {
        return members.find(user => user.id === memberId)
    }).filter(Boolean)

    return (
        <article className="member-picker" onClick={(ev) => setMembersSelectEl(ev.currentTarget)}>

            {!!membersToShow.length ?
                <div className="cmp-img">
                    {membersToShow.map((user, idx) => {
                        // show normally if total ≤ 2
                        // or if this is the first image
                        if (membersToShow.length <= 2 || idx === 0) {
                            return (
                                <div key={user.id} className={`img-wrapper ${isAnimation ? 'heartbeat ' : ''}`}>
                                    <img src={user.imgUrl} alt={user.fullname} className="user-img" />
                                </div>
                            )
                        }

                        // if more than 2, replace the 2nd image with +N
                        if (idx === 1 && membersToShow.length > 2) {
                            return (
                                <div key="more-users" className={`img-wrapper more ${isAnimation ? 'heartbeat ' : ''}`}>
                                    <span className="more-count">+{membersToShow.length - 1}</span>
                                </div>
                            )
                        }

                        // skip showing any other images
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


            {/* membersToShow.map(member => {

                        return <div
                        className={`img-wrapper ${MoreThen2Img}`}
                        data-type={membersToShow.length}
                        key={member.id}
                        onMouseLeave={onClearHover}
                        onMouseOver={(ev) => onSetHoveredUser(member, ev.currentTarget)}
                        onClick={() => onRemoveMember(member.id)
                        }
                    >
                        <img
                            id={member.fullname}
                            src={member.imgUrl}
                            className="user-img"
                            alt="person icon"
                        />
                    </div>
                    })
                  
                } */}

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