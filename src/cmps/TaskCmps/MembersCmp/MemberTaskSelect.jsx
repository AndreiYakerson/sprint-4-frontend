// ICONS
import searchGalss from '/icons/search-galss.svg'
import xMark from '/icons/x-mark.svg'
import inviteMember from '/icons/invite-member.svg'

// COMPONENTS


export function MemberTaskSelect({ selectedMemberIds, onClose, members }) {


    function onSelectMember(member) {
        const taskMembersIds = [...selectedMemberIds, member.id ] 
        onClose(taskMembersIds)
    }
    const usersToShow = members.filter(user => !selectedMemberIds.includes(user.id));

    return (
        <div className="member-task-select">
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