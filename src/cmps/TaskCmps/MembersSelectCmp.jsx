import star from '/icons/star.svg'
import searchGalss from '/icons/search-galss.svg'
import xMark from '/icons/x-mark.svg'
import inviteMember from '/icons/invite-member.svg'
import danPic from '/img/danPic.jpg'
import { useEffect, useState } from 'react'
import { makeId } from '../../services/util.service'
import { useEffectUpdate } from '../../customHooks/useEffectUpdate'
import { updateTask } from '../../store/actions/board.actions'

export function MembersSelectCmp({ task, onClose }) {
    //Demo Data
    const user1 = {
        id: makeId(),
        fullname: 'dan dan',
        img: danPic,
        profession: 'super chef',
        tags: ['admin', 'member'],
    }
    const user2 = {
        id: makeId(),
        fullname: 'adi my love',
        img: star,
        profession: 'super wife',
        tags: ['member'],
    }
    const user3 = {
        id: makeId(),
        fullname: ' anat nadav',
        img: star,
        profession: 'computer',
        tags: ['member'],
    }
    const emptyUser = {
        fullname: '',
        img: star,
        profession: '',
        tags: ['member'],
    }
    var demoBoardMembers = [user1, user2, user3]

    if (!task?.AddedMembers?.length) {
        task = {
            AddedMembers: [user1],
            createdAt: 1759346036021,
            id: "U0gfhz",
            title: "taskascasc",
        }
    }

    //
    const [taskMembers, setTaskMembers] = useState(task.AddedMembers)

    function onSelectMember(member, idx) {
        setTaskMembers(prevMembers => [...prevMembers, member])
        update(member)
    }

    function update(member) {
        console.log(`update task member with ${member.fullname} here now`)
        onClose()
    }


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
                {demoBoardMembers.map((member, idx) => {
                    return <button
                        // Pass the actual numeric 'idx' here
                        onClick={() => onSelectMember(member, idx)}
                        key={member.id}
                        className="user flex"
                    >
                        <span className="img-container"><img className=" user-img" src={member.img} alt="User Image" /></span>
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