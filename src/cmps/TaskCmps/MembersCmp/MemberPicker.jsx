
// SERVICES
import { useEffect, useRef, useState } from "react"

// COMPONENTS
import { MemberInfo } from "./MemberInfo"
import { MemberTaskSelect } from "./MemberTaskSelect"
// ICONS
import { useSelector } from "react-redux"
import { SvgIcon } from "../../SvgIcon"
import { showErrorMsg } from "../../../services/event-bus.service"
import { MultiMembersPreview } from "./MultiMembersPreview"
import { onCloseFloating } from "../../../store/actions/system.actions"
import { FloatingContainerCmp } from "../../FloatingContainerCmp.jsx"
import { SOCKET_EMIT_USER_ASSIGNED, socketService } from "../../../services/socket.service.js"

export function MemberPicker({ info, onUpdate }) {
    const { selectedMemberIds } = info
    const [membersSelectEl, setMembersSelectEl] = useState(null)
    const [isAnimation, setIsAnimation] = useState(false)
    const board = useSelector(state => state.boardModule.board)
    const loggedinUser = useSelector(state => state.userModule.user)
    const floating = useSelector(state => state.systemModule.floating)

    const [selectedUser, setSelectedUser] = useState(null)
    const [hoveredAnchor, setHoveredAnchor] = useState(null)
    const [memberAnchor, setMemberAnchor] = useState(null)
    const [isOpenMemberPicker, setIsOpenMemberPicker] = useState(false)
    const [isOpenHoveredUser, setIsOpenHoveredUser] = useState(false)

    const isPickerOpenRef = useRef(false)

    useEffect(() => {
        isPickerOpenRef.current = isOpenMemberPicker
    }, [isOpenMemberPicker])

    function onSetHoveredUser(user, anchor) {
        if (isPickerOpenRef.current || window.innerWidth <= 750) return
        setSelectedUser(user)
        setHoveredAnchor(anchor)
        setIsOpenHoveredUser(true)
    }

    function openMemberSelect(ev) {
        ev.stopPropagation()
        if (isOpenHoveredUser) {
            setIsOpenHoveredUser(null)
            setHoveredAnchor(null)
        }
        setMemberAnchor(ev.currentTarget)
        setIsOpenMemberPicker(true)
    }

    function closeMemberSelect() {
        setMemberAnchor(null)
        setIsOpenMemberPicker(false)
    }

    function onClearHover() {
        if (isOpenMemberPicker) return
        setIsOpenHoveredUser(null)
        setHoveredAnchor(null)
        onCloseFloating()
    }

    function updateTaskMembers(memberIds) {
        if (!memberIds) return showErrorMsg(' Did not update task members')
        setIsAnimation(true)
        setTimeout(() => setIsAnimation(false), 400)
        onUpdate(memberIds)
    }

    const membersToShow = selectedMemberIds.map(memberId => {
        return board.members?.find(member => member._id === memberId)
    }).filter(Boolean)


    function onEmitAssignedUser(member) {
        if (!member?._id || loggedinUser._id === member?._id) return
        const assignedData = {
            userId: member?._id,
            boardId: board._id
        }
        socketService.emit(SOCKET_EMIT_USER_ASSIGNED, assignedData)
    }

    return (
        <article className={`member-picker ${isOpenMemberPicker ? "focus" : ""}`} onClick={ev => openMemberSelect(ev)}>
            {!!membersToShow.length ?
                <MultiMembersPreview members={membersToShow} onSetHoveredUser={onSetHoveredUser} onClearHover={onClearHover} isAnimation={isAnimation} />
                :
                <div className="user-img">
                    <SvgIcon iconName="plus" size={14} className='plus-blue' colorName='whiteText' />
                    <SvgIcon iconName="person" className="person" colorName='grayPerson' size={30} />
                </div>
            }
            {isOpenMemberPicker && (
                <FloatingContainerCmp
                    anchorEl={memberAnchor}
                    onClose={closeMemberSelect}
                >
                    <MemberTaskSelect
                        selectedMemberIds={selectedMemberIds}
                        members={board.members}
                        onClose={closeMemberSelect}
                        onUpdate={updateTaskMembers}
                        onEmitAssignedUser={onEmitAssignedUser}
                    />
                </FloatingContainerCmp>
            )}

            {isOpenHoveredUser && (
                <FloatingContainerCmp
                    anchorEl={hoveredAnchor}
                    onClose={closeMemberSelect}
                >
                    <MemberInfo user={selectedUser} />
                </FloatingContainerCmp>
            )}
        </article >
    )
}