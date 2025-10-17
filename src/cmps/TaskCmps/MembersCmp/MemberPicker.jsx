
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
import { MultiMembersPreview } from "./MultiMembersPreview"
import { onSetPopUp } from "../../../store/actions/system.actions"
import { InviteByMail } from "../../BoardActionsNav/InviteByMail"

export function MemberPicker({ info, onUpdate }) {
    const { selectedMemberIds } = info
    const [memberEl, setMemberEl] = useState(null)
    const [membersSelectEl, setMembersSelectEl] = useState(null)
    const [isAnimation, setIsAnimation] = useState(false)
    const [hoveredUser, setHoveredUser] = useState(null)
    // const [showPopUP, setShowPopUP] = useState(false)
    const board = useSelector(state => state.boardModule.board)
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


    function _onShowPopUp(value) {
        const content = <InviteByMail />
        onSetPopUp(content)
        if (!value === false) {
            closeMemberSelect()
        }
    }

    const membersToShow = selectedMemberIds.map(memberId => {
        return board.members?.find(member => member._id === memberId)
    }).filter(Boolean)

    return (
        <article className={`member-picker ${membersSelectEl ? "focus" : ""}`} onClick={(ev) => setMembersSelectEl(ev.currentTarget)}>
            {!!membersToShow.length ?
                <MultiMembersPreview members={membersToShow} onSetHoveredUser={onSetHoveredUser} onClearHover={onClearHover} isAnimation={isAnimation} />
                :
                <div className="user-img">
                    <SvgIcon iconName="plus" size={14} className='plus-blue' colorName='whiteText' />
                    <SvgIcon iconName="person" className="person" colorName='grayPerson' size={30} />
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
                        members={board.members}
                        onClose={updateTaskMembers}
                        onInvite={_onShowPopUp}
                    />
                </FloatingContainerCmp>
            }

        </article >
    )
}