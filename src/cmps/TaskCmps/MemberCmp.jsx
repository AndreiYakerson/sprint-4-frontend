import person from '/icons/person.svg'
import { FloatingContainerCmp } from "../FloatingContainerCmp"
import logo from '/img/logo.png'
import { userService } from "../../services/user"


export function MemberCmp({user}) {
    console.log("🚀 ~ MemberCmp ~ user:", user)
    //Demo User
    // if (!user) {
    //     console.log('!user')

    //     user = {
    //         name: 'dan dan',
    //         profession: 'super chef',
    //         tags: ['admin', 'member'],
    //     }
    // }
    const timeNow = new Date().toLocaleTimeString()
    const curLocation = ' pardes-hana'


    return (
        <div className="member-cmp">
            <article >
                <span className="user-img"><img src={user.img} alt="Logo Icon" /></span>
                <div className="info-list">

                    <section className="user-name-pro">
                        <span className="user-name">{user.name}</span>
                        <br />
                        {user.profession && <span className="user-profession">{user.profession}</span>}
                    </section>

                    <section className="date-time-container">
                        <img src={person} alt="world Icon" />
                        {timeNow},
                        {curLocation}
                    </section>

                    <section className="user-member-tags-container">
                        {user.tags.map(tag => {
                            return <span key={tag} className="tag-label">{tag}</span>
                        })}
                    </section>

                </div>


            </article>
        </div>
    )


}