import star from '/icons/star.svg'
import searchGalss from '/icons/search-galss.svg'
import xMark from '/icons/x-mark.svg'
import inviteMember from '/icons/invite-member.svg'
import danPic from '/img/danPic.jpg'
import { useEffect, useState } from 'react'
import { makeId } from '../../services/util.service'
import { onSetPopUpIsOpen } from "../../store/actions/system.actions"
import { useEffectUpdate } from '../../customHooks/useEffectUpdate'

// MembersSelectCmp({boardMembers,task})

export function MembersSelectCmp({ updateTask }) {
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
    const DemoBoardMembers = [user1, user2, user3]
    const task = {
        AddedMembers: [user1, user2],
        createdAt: 1759346036021,
        id: "U0gfhz",
        title: "taskascasc",
    }
    //

    
    const [taskMembers, setTaskMembers] = useState(task.AddedMembers)

    // useEffectUpdate(() => {
    //     console.log('onSetPopUpIsOpen from MemberSerlectCmp')
        
    //   if onSetPopUpIsOpen(false)
    //     // updateTask()
    // }, taskMembers)

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
                {DemoBoardMembers.map(user => {
                    return <button
                        onClick={() => setTaskMembers(prevMembers => [...prevMembers, user])}
                        key={user.id}
                        className="user flex"
                    >
                        <span className="img-container"><img className=" user-img" src={user.img} alt="User Image" /></span>
                        {user.fullname}
                        <span className="user-profession">
                            ({user.profession})
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