// ICONS
import { SvgIcon } from '../../SvgIcon'
import { ExistingMembers } from './ExistingMembers'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { loadFromStorage, saveToStorage } from '../../../services/util.service'
import { onSetPopUp } from '../../../store/actions/system.actions'
import { InviteUser } from '../../BoardActionsNav/InviteUser'
import { userService } from '../../../services/user'


// COMPONENTS

export function MemberTaskSelect({ selectedMemberIds, onClose, members, onInvite, onUpdate }) {

    const [inputValue, setInputValue] = useState('')
    // const board = useSelector(state => state.boardModule.board)
    // const users = loadFromStorage('users')
    const [membersToShow, setMembersToShow] = useState([])

    //Demo
    useEffect(() => {
        if (!loadFromStorage('users')) {
            console.log(' Setting demo user to LocalStorage ')
            let users = userService.createDemoUsersForLoggedUsers()
            saveToStorage('users', users)
        }
        return () => onClose()
    }, [])


    function handelChange(ev) {
        const userToFind = ev.target.value
        if (userToFind.length === 0) {
            onClearInput()
            return
        }

        setInputValue(userToFind)

        const regex = new RegExp(userToFind, 'i')
        const filteredMembers = members
            .filter(m => regex.test(m.fullname) || regex.test(m.profession))

        if (!!filteredMembers.length) setMembersToShow(filteredMembers)
    }

    function onClearInput() {
        setMembersToShow(false)
        setInputValue('')

    }

    function onSelectMember(member) {
        const taskMembersIds = [...selectedMemberIds, member._id]
        onUpdate(taskMembersIds)
        onClose()
    }

    function onRemoveMember(memberId) {
        const memberIds = selectedMemberIds.filter(id => id !== memberId)
        onUpdate(memberIds)
    }

    function _onShowPopUp(value) {
        const content = <InviteUser />
        onSetPopUp(content)
        if (!value === false) {
            onClose()
        }
    }

    const usersToShow = !!membersToShow.length ? membersToShow : members.filter(member => !selectedMemberIds.includes(member._id));
    const existingUsers = members.filter(member => selectedMemberIds.includes(member._id));
    const emptyInput = inputValue ? true : false
    return (
        <div className='member-task-select-wrapper'>
            <ExistingMembers onRemove={onRemoveMember} members={existingUsers} />
            <div className="member-task-select">
                <section className='search-bar-container'>
                    <div className="search-bar">
                        <SvgIcon iconName='searchGlass' size={16} className='search' />
                        <input type="text"
                            placeholder=' Search names '
                            onChange={(ev) => handelChange(ev)}
                            value={inputValue}
                        />
                        <button className={`delete-btn ${emptyInput}`} onClick={onClearInput}>
                            <SvgIcon iconName='xMark' size={16} colorName='secondaryText' />
                        </button>
                        <SvgIcon iconName='multipleSelect' size={16} className='hover-show1' data-type={' For multiple selection'} />
                    </div>
                </section>
                <span className='suggested'>Suggested People</span>
                <section className="user-list" >
                    {usersToShow.map((member, idx) => {
                        return <button
                            onClick={() => onSelectMember(member)}
                            key={member._id}
                            className="user flex text-overflow"
                        >
                            <span className="img-container"><img className=" user-img" src={member.imgUrl} alt="User Image" /></span>
                            <span className="user-name ">{member.fullname}</span>
                            <span className="profession ">
                                {member.profession ? `(${member.profession})` : ''}
                            </span>

                        </button>
                    })}

                    <button className="user invite-btn flex"
                        onClick={() => _onShowPopUp(true)}>
                        <span className="icon">
                            <SvgIcon iconName='addMember' size={16} colorName="secondaryText" />
                        </span>
                        <span className="txt">{' Invite a new member by email'}</span>
                    </button>
                </section>
            </div>

        </div>

    )
}