
// SERVICES
import { useEffect, useState } from "react"

// COMPONENTS
import { FloatingContainerCmp } from "../../FloatingContainerCmp"
import { MemberInfo } from "./MemberInfo"
import { MemberTaskSelect } from "./MemberTaskSelect"
// ICONS
import { useSelector } from "react-redux"
import { SvgIcon } from "../../SvgIcon"
import { showErrorMsg } from "../../../services/event-bus.service"
import { MultiMembersPreview } from "./MultiMembersPreview"
import { onCloseFloating, onSetFloating, onSetFloatingIsOpen, onSetPopUp } from "../../../store/actions/system.actions"
import { InviteByMail } from "../../BoardActionsNav/InviteByMail"

export function MemberPicker({ info, onUpdate }) {
    const { selectedMemberIds } = info
    const [membersSelectEl, setMembersSelectEl] = useState(null)
    const [isAnimation, setIsAnimation] = useState(false)
    const board = useSelector(state => state.boardModule.board)
    const floating = useSelector(state => state.systemModule.floating)

    useEffect(() => {
        if (membersSelectEl) {
            onCloseFloating()
            const content = <MemberTaskSelect
                selectedMemberIds={selectedMemberIds}
                members={board.members}
                onClose={closeMemberSelect}
                onUpdate={updateTaskMembers}
                onInvite={_onShowPopUp}
            />
            onSetFloating(content, membersSelectEl)
        }
    }, [selectedMemberIds])

    function onSetHoveredUser(user, ev) {
        const content = <MemberInfo
            user={user} />
        onSetFloating(content, ev)
    }

    function openMemberSelect(ev) {
        if (floating.isOpen) onCloseFloating()
        const content = <MemberTaskSelect
            selectedMemberIds={selectedMemberIds}
            members={board.members}
            onClose={closeMemberSelect}
            onUpdate={updateTaskMembers}
            onInvite={_onShowPopUp}
        />
        onSetFloating(content, ev.currentTarget)
        setMembersSelectEl(ev.currentTarget)
    }

    function closeMemberSelect() {
        setMembersSelectEl(null)
        onCloseFloating()
        onClearHover()
    }

    function onClearHover() {
        if (membersSelectEl) return
        onCloseFloating()
    }

    function updateTaskMembers(memberIds) {
        if (!memberIds) return showErrorMsg(' Did not update task members')
        setIsAnimation(true)
        setTimeout(() => setIsAnimation(false), 400)
        onUpdate(memberIds)
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
        <article className={`member-picker ${membersSelectEl ? "focus" : ""}`} onClick={ev => openMemberSelect(ev)}>
            {!!membersToShow.length ?
                <MultiMembersPreview members={membersToShow} onSetHoveredUser={onSetHoveredUser} onClearHover={onClearHover} isAnimation={isAnimation} />
                :
                <div className="user-img">
                    <SvgIcon iconName="plus" size={14} className='plus-blue' colorName='whiteText' />
                    <SvgIcon iconName="person" className="person" colorName='grayPerson' size={30} />
                </div>
            }
        </article >
    )
}