// ICONS
import searchGalss from '/icons/search-galss.svg'
import xMark from '/icons/x-mark.svg'
import inviteMember from '/icons/invite-member.svg'
import { SvgIcon } from '../../SvgIcon'
import { ExistingMembers } from './ExistingMembers'

// COMPONENTS


export function MemberTaskSelect({ selectedMemberIds, onClose, members, onRemove }) {


    function onSelectMember(member) {
        const taskMembersIds = [...selectedMemberIds, member.id]
        onClose(taskMembersIds)
    }
    const usersToShow = members.filter(member => !selectedMemberIds.includes(member.id));
    const existingUsers = members.filter(member => selectedMemberIds.includes(member.id));

    return (
        <>
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
                            // Pass the actual numeric 'idx' here
                            onClick={() => onSelectMember(member, idx)}
                            key={member.id}
                            className="user flex"
                        >
                            <span className="img-container"><img className=" user-img" src={member.imgUrl} alt="User Image" /></span>
                            {member.fullname}
                            <span className="profession">
                                ({member.profession})
                            </span>

                        </button>
                    })}

                    <button className="user invite flex">
                        <span className="img-container"> 
                      <SvgIcon iconName='addMember' size={26}  colorName="currentColor"/>
                       </span>
                        {' Invite a new member by email'}
                    </button>
                </section>

            </div>

        </>
    )
}