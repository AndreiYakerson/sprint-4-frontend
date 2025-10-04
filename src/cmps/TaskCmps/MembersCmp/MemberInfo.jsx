import person from '/icons/person.svg'
import { useSelector } from 'react-redux'


export function MemberInfo({ user }) {
    const isFloatingOpen = useSelector(state => state.systemModule.isFloatingOpen)
    const isPopUpOpen = useSelector(state => state.systemModule.isPopUpOpen)
    const timeNow = new Date().toLocaleTimeString()
    const curLocation = ' pardes-hana'

    return (
        <div className="member-Info">
            <article >
                <span className="user-img"><img src={user.imgUrl} alt="Logo Icon" /></span>
                <div className="info-list">

                    <section className="user-name-pro">
                        <span className="user-name">{user.fullname}</span>
                        <br />
                        {user.profession && <span className="user-profession">{user.profession}</span>}
                    </section>

                    <section className="date-time-container">
                        <img src={person} alt="world Icon" />
                        {timeNow},
                        {curLocation}
                    </section>

                    <section className="user-member-tags-container">
                        {user.tags?.map(tag => {
                            return <span key={tag} className="tag-label">{tag}</span>
                        })}
                    </section>

                </div>


            </article>
        </div>
    )


}