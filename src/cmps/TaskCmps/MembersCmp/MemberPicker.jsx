
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
import { onCloseFloating, onSetFloating, onSetFloatingIsOpen, onSetPopUp } from "../../../store/actions/system.actions"
import { InviteByMail } from "../../BoardActionsNav/InviteByMail"

export function MemberPicker({ info, onUpdate }) {
    const { selectedMemberIds } = info
    const [memberEl, setMemberEl] = useState(null)
    const [membersSelectEl, setMembersSelectEl] = useState(null)
    const [isAnimation, setIsAnimation] = useState(false)
    const [hoveredUser, setHoveredUser] = useState(null)
    const board = useSelector(state => state.boardModule.board)
    const floating = useSelector(state => state.systemModule.floating)


    // All right, so right now I've got it working using the dispatch. It seems I just need to.
    //  Set on the clear hover. That it will. Set floating. Close. And right now it seems like it's always.
    //  It's just switching from container to container and it doesn't have something that tells it. If it's open.
    //  Not to open another one.

    function onSetHoveredUser(user, ev) {
        const content = <MemberInfo
            user={user} />

        onSetFloating(content, ev)
        // setHoveredUser(user);
        // setMemberEl(target)
    }

    function openMemberSelect(ev) {
        const content = <MemberTaskSelect
            onRemove={onRemoveMember}
            selectedMemberIds={selectedMemberIds}
            members={board.members}
            onClose={updateTaskMembers}
            onInvite={_onShowPopUp}
        />
        onSetFloating(content, ev.currentTarget)
        // setMembersSelectEl(ev.currentTarget)
        // setMemberEl(null)
    }

    function closeMemberSelect() {
        setMemberEl(null)
        setMembersSelectEl(null)
        onClearHover()
    }

    function onClearHover() {
        if (membersSelectEl) return
        // setMemberEl(null)
        // onSetFloatingIsOpen(false)
        // setHoveredUser(null);
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
        onCloseFloating()
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

            {/* {
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
            } */}

            {/* {
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
            } */}

        </article >
    )
}