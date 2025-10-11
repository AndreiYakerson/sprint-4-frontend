import { SvgIcon } from '../../SvgIcon'

export function MemberInfo({ user }) {
    const timeNow = new Date().toLocaleTimeString()
    const curLocation = ' pardes-hana'

    return (
        <div className="member-card-wrapper">
            <article className='member-card-content'>
                <div className="card-info">
                    <img src={user.imgUrl} alt="User Image" className="user-img" />
                    <section className="card-user-info">
                            <div className="user-name text-overflow">{user.fullname}</div>
                            {user.profession && <div className="user-profession text-overflow">{user.profession}</div>}
                        <div className="date-time-container text-overflow">
                            <SvgIcon iconName='world' size={16} colorName='secondaryText' />
                            {timeNow},
                            {curLocation}
                        </div>
                        <div className="user-member-tags-container">
                            {user.tags?.map(tag => {
                                return <span key={tag} className="tag-label">{tag}</span>
                            })}
                        </div>
                    </section>

                </div>
            </article>
            <hr></hr>
        </div>
    )


}