// ICONS
import searchGalss from '/icons/search-galss.svg'
import xMark from '/icons/x-mark.svg'
import inviteMember from '/icons/invite-member.svg'
import { SvgIcon } from '../../SvgIcon'
import { ExistingMembers } from './ExistingMembers'
import { useSelector } from 'react-redux'
import { FloatingContainerCmp } from '../../FloatingContainerCmp'
import { useState } from 'react'
import { updateBoard } from '../../../store/actions/board.actions'

// COMPONENTS


export function MemberTaskSelect({ selectedMemberIds, onClose, members, onRemove }) {

    const users = useSelector(state => state.userModule.users)
    const board = useSelector(state => state.boardModule.board)

    const [anchorEl, setAnchorEl] = useState(false)
    const [notBoardMembers, setNotBoardMembers] = useState(false)

    function handelChange(ev) {
        const userToFind = ev.target.value
        if (userToFind.length === 0) {
            setNotBoardMembers(false)
            setAnchorEl(false)
            return
        }
        const regex = new RegExp('^' + userToFind, 'i')
        const notMembers = users.filter(user => regex.test(user.fullname)).filter(u => !members.includes(u))

        if (!!notMembers.length)  setNotBoardMembers(notMembers) 
        setAnchorEl(ev.currentTarget)
    }

    function onSelectMember(member) {
        const taskMembersIds = [...selectedMemberIds, member.id]
        onClose(taskMembersIds)
    }

    async function onAddMemberToBoard(member) {
        const taskMembersIds = [...selectedMemberIds, member.id]
        try {
            const newBoard = { ...board, members: [...board.members, member] }
            await updateBoard(newBoard)
            onClose(taskMembersIds)
        } catch (error) {
            console.log('problem adding member to board and task')
        }
    }

    const usersToShow = members.filter(member => !selectedMemberIds.includes(member.id));
    const existingUsers = members.filter(member => selectedMemberIds.includes(member.id));

    return (
        <div className='member-task-select-wrapper'>
            <ExistingMembers onRemove={onRemove} members={existingUsers} />
            <div className="member-task-select">
                <div className="search-bar"
                >
                    <span className='search'>
                        <img src={searchGalss}
                            className='icon big search'
                            alt="Search Icon"
                        />
                    </span>
                    <input type="text"
                        placeholder=' Search names '
                        onChange={(ev) => handelChange(ev)}
                    />
                    <span className='search'>
                        <img
                            src={xMark}
                            className='icon big info'
                            alt="Info Icon"
                        />
                    </span>
                </div>
                <span className='suggested'>Suggested People</span>
                <section className="user-list">
                    {usersToShow.map((member, idx) => {
                        return <button
                            onClick={() => onSelectMember(member, idx)}
                            key={member.id}
                            className="user flex"
                        >
                            <span className="img-container"><img className=" user-img" src={member.imgUrl} alt="User Image" /></span>
                            <span className="user-name">{member.fullname}</span>
                            <span className="profession">
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
                        {notBoardMembers.map((user, idx) => {
                            return <button
                                onClick={() => onAddMemberToBoard(user, idx)}
                                key={user.id}
                                className="user flex"
                            >
                                <span className="img-container"><img className=" user-img" src={user.imgUrl} alt="User Image" /></span>
                                {user.fullname}
                                <span className="profession">
                                    ({user.profession})
                                </span>

                            </button>

                        })}
                    </FloatingContainerCmp>
                }
            </div>

        </div>

    )
}