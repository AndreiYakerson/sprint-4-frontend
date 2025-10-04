import searchGalss from '/icons/search-galss.svg'
import xMark from '/icons/x-mark.svg'
import inviteMember from '/icons/invite-member.svg'
import { updateTask } from '../../../store/actions/board.actions'
import { useSelector } from 'react-redux'
import { showSuccessMsg } from '../../../services/event-bus.service'

export function SelectMemberToTask({ task, boardId, groupId, onClose }) {

    const users = useSelector(state => state.userModule.users)

    function onSelectMember(member) {
        const updatedTask = structuredClone(task)
        updatedTask.addedMembers.push(member)
        updateTask(boardId, groupId, updatedTask)
        showSuccessMsg(`Task updated`)
        onClose()
    }
    // 1. Create a Set of IDs from the "fitted" list (the members)
    const fittedIds = new Set(task?.addedMembers.map(member => member.id));
    // 2. Filter the "to-be-shown" list (the users) to exclude those already fitted
    const usersToShow = users.filter(user => !fittedIds.has(user.id));

    return (
        <div className="members-select-cmp">
            <div className="search-bar">
                <span className='search'>
                    <img src={searchGalss}
                        className='icon big search'
                        alt="Search Icon"
                    />
                </span>
                <input type="text" />
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
                        // Pass the actual numeric 'idx' here
                        onClick={() => onSelectMember(member, idx)}
                        key={member.id}
                        className="user flex"
                    >
                        <span className="img-container"><img className=" user-img" src={member.imgUrl} alt="User Image" /></span>
                        {member.fullname}
                        <span className="user-profession">
                            ({member.profession})
                        </span>

                    </button>
                })}

                <button className="user flex">
                    <span className="img-container"> <img className="icon invite-member" src={inviteMember} alt="User Image" /></span>
                    {' Invite a new member by email'}
                </button>
            </section>

        </div>

    )
}