// ICONS
import searchGalss from '/icons/search-galss.svg'
import xMark from '/icons/x-mark.svg'
import inviteMember from '/icons/invite-member.svg'
import { SvgIcon } from '../../SvgIcon'
import { ExistingMembers } from './ExistingMembers'
import { useSelector } from 'react-redux'
import { FloatingContainerCmp } from '../../FloatingContainerCmp'
import { useEffect, useState } from 'react'
import { updateBoard } from '../../../store/actions/board.actions'
import { loadFromStorage, saveToStorage } from '../../../services/util.service'

// COMPONENTS

export function MemberTaskSelect({ selectedMemberIds, onClose, members, onRemove }) {
    const [inputValue, setInputValue] = useState('')
    const board = useSelector(state => state.boardModule.board)
    const users = loadFromStorage('users')
    const [anchorEl, setAnchorEl] = useState(false)
    const [notBoardMembers, setNotBoardMembers] = useState(false)

    //Demo
    useEffect(() => {
        if (!loadFromStorage('users')) {
            console.log(' Setting demo user to LocalStorage ')
            const users = userService.createDemoUsersForLoggedUsers(10)
            saveToStorage('users', users)
        }
    }, [])


    function handelChange(ev) {
        const userToFind = ev.target.value
        if (userToFind.length === 0) {
            onClearInput()
            return
        }

        setInputValue(userToFind)
        const regex = new RegExp('^' + userToFind, 'i')
        const notMembers = users.filter(user => regex.test(user.fullname)).filter(u => !members.some(m => m._id === u._id))

        if (!!notMembers.length) setNotBoardMembers(notMembers)
        setAnchorEl(ev.currentTarget)
    }

    function onClearInput() {
        setNotBoardMembers(false)
        setAnchorEl(false)
        setInputValue('')

    }

    function onSelectMember(member) {
        const taskMembersIds = [...selectedMemberIds, member._id]
        onClose(taskMembersIds)
    }

    async function onAddMemberToBoard(member) {
        const taskMembersIds = [...selectedMemberIds, member._id]
        try {
            const newBoard = { ...board, members: [...board.members, member] }
            await updateBoard(newBoard)
            onClose(taskMembersIds)
        } catch (error) {
            console.log('problem adding member to board and task')
        }
    }

    const usersToShow = members.filter(member => !selectedMemberIds.includes(member._id));
    const existingUsers = members.filter(member => selectedMemberIds.includes(member._id));
    const emptyInput = inputValue ? true : false
    return (
        <div className='member-task-select-wrapper'>
            <ExistingMembers onRemove={onRemove} members={existingUsers} />
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
                <section className="user-list " >
                    {usersToShow.map((member, idx) => {
                        return <button
                            onClick={() => onSelectMember(member, idx)}
                            key={member._id}
                            className="user flex text-overflow"
                        >
                            <span className="img-container"><img className=" user-img" src={member.imgUrl} alt="User Image" /></span>
                            <span className="user-name ">{member.fullname}</span>
                            <span className="profession ">
                                ({member.profession})
                            </span>

                        </button>
                    })}

                    {/* <button className="user invite flex">
                        <span className="img-container">
                            <SvgIcon iconName='addMember' size={26} colorName="currentColor" />
                        </span>
                        {' Invite a new member by email'}
                    </button> */}
                </section>
                {anchorEl && notBoardMembers &&
                    <FloatingContainerCmp
                        anchorEl={anchorEl}
                        onClose={onClose}>
                        <div className='found-users-container'>
                            {notBoardMembers.map((user, idx) => {
                                return <button
                                    onClick={() => onAddMemberToBoard(user, idx)}
                                    key={user._id}
                                    className="user flex text-overflow"
                                >
                                    <span className="img-container"><img className=" user-img" src={user.imgUrl} alt="User Image" /></span>
                                    {user.fullname}
                                    <span className="profession">
                                        ({user.profession})
                                    </span>

                                </button>
                            })}
                        </div>
                    </FloatingContainerCmp>

                }

            </div>

        </div>

    )
}