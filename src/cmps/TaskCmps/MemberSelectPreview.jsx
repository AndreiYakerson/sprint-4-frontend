import plus from "/icons/plus.svg"
import person from "/icons/person.svg"
import danPic from "/img/danPic.jpg"
import logo from "/img/logo.png"
import defaultAvatar from "/img/default-avatar.png"
import { FloatingContainerCmp } from "../FloatingContainerCmp"
import { MemberCmp } from "./MemberCmp"
import { useState } from "react"

export function MemberSelectPreview({ task }) {
    const [memberEl, setMemberEl] = useState(null)
    const [hoveredUser, setHoveredUser] = useState(null)

    function onSetHoveredUser(user, target) {
        setHoveredUser(user);
        setMemberEl(target)
    }

    function onClearHover(target) {
        setMemberEl(null)
        setHoveredUser(null);
    }

    //Demo Data Inserted To Task Hard Code
    task.AddedMembers = [
        {
            name: 'dan',
            profession: 'super chef',
            img: danPic,
            tags: ['admin', 'member'],
        },
        // {
        //     name: 'adi',
        //     profession: 'super love',
        //     img: logo,
        //     tags: ['member'],
        // },
        // {
        //     profession: 'super mom',
        //     name: 'anat',
        //     img: defaultAvatar,
        //     tags: ['member'],
        // }
    ]

    return (
        <article className="member-select-preview">
            {!task.AddedMembers?.length && <img src={plus} className="icon big plus" alt="plus icon" />}

            <div className="cmp-img"
            >
                {!!task.AddedMembers.length ?
                    task.AddedMembers.map(user => {
                        return <div
                        className="img-wrapper"
                            key={user.name}
                            onMouseLeave={(ev) => onClearHover(ev.currentTarget)}
                            onMouseOver={(ev) => onSetHoveredUser(user, ev.currentTarget)}
                        >
                            <img
                                id={user.name}
                                src={user.img}
                                className="user-img"
                                alt="person icon"
                            />
                        </div>
                    })
                    :
                    <span className="user-img">
                        <img
                            src={person}
                            className="user-img "
                            alt="person icon"
                        />
                    </span>
                }

                < FloatingContainerCmp
                    anchorEl={memberEl}
                    onClose={() => setMemberEl(null)}
                >
                    <MemberCmp
                        user={hoveredUser}
                    />
                </FloatingContainerCmp>

            </div>

        </article>
    )
}