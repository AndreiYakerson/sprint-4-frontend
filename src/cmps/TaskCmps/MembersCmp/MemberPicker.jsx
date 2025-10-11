
// SERVICES
import { useState } from "react"

// COMPONENTS
import { FloatingContainerCmp } from "../../FloatingContainerCmp"
import { MemberInfo } from "./MemberInfo"
import { MemberTaskSelect } from "./MemberTaskSelect"
// ICONS
import { useSelector } from "react-redux"
import { SvgIcon } from "../../SvgIcon"
import { showErrorMsg } from "../../../services/event-bus.service"

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
        setMemberEl(null)
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
        if (!memberIds) return showErrorMsg(' Did not update task members')
        setIsAnimation(true)
        setTimeout(() => setIsAnimation(false), 400)
        onUpdate(memberIds)
        setMembersSelectEl(null)
        onClearHover()
    }

    const membersToShow = selectedMemberIds.map(memberId => {
        return members.find(member => member._id === memberId)
    }).filter(Boolean)

    return (
        <article className={`member-picker ${membersSelectEl ? "focus" : ""}`} onClick={(ev) => setMembersSelectEl(ev.currentTarget)}>
            {!!membersToShow.length ?
                <div className="cmp-img">
                    {membersToShow.map((member, idx) => {
                        if (membersToShow.length <= 2 || idx === 0) {
                            return (
                                <div
                                    key={member._id}
                                    className={`img-wrapper ${isAnimation ? 'heartbeat ' : ''}`}
                                    onMouseLeave={onClearHover}
                                    onMouseOver={(ev) => onSetHoveredUser(member, ev.currentTarget)}
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
                <div className="user-img">
                    <SvgIcon iconName="plus" size={14} className='plus-blue' colorName='whiteText' />
                    <SvgIcon iconName="person" className="person" colorName='grayPerson' size={30}/>
                </div>
            }

            {
                memberEl && < FloatingContainerCmp
                    anchorEl={memberEl}
                    onClose={onClearHover}
                    centeredX={true}
                    enforceLimit={true}
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
                    centeredX={true}
                    showTriangle={true}
                    enforceLimit={true}
                    
                >
                    <MemberTaskSelect
                        onRemove={onRemoveMember}
                        selectedMemberIds={selectedMemberIds}
                        members={members}
                        onClose={updateTaskMembers}
                    />
                </FloatingContainerCmp>
            }


        </article >
    )
}