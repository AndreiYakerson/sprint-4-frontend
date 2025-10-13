export function MultiMemberImage({ members, className = '' }) {

    if (!members) return null
    return (
        <div className={`multi-member-cmp ${className}`}>
            {members.map((member, idx) => {
                if (idx < 2) {
                    return (
                        <div
                            key={member._id}
                            className={`img-wrapper `}
                        >
                            <img src={member.imgUrl} alt={member.fullname} className="user-img" />
                        </div>
                    )
                }

                if (idx === 2) {
                    return (
                        <div key="more-users" className={`img-wrapper more white`}>
                            <span className="more-count">+{members.length - 2}</span>
                        </div>
                    )
                }

                return null
            })}
        </div>

    )
}