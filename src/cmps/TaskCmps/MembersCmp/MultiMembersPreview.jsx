export function MultiMembersPreview({ members, onSetHoveredUser, isAnimation, onClearHover }) {

    return (
        <div className="multi-member-cmp">
            {members.map((member, idx) => {
                if (members.length <= 2 || idx === 0) {
                    return (
                        <div
                            key={member._id}
                            className={`img-wrapper ${isAnimation ? 'heartbeat ' : ''}`}
                            onMouseLeave={onClearHover}
                            onMouseOver={(ev) => onSetHoveredUser(member, ev.currentTarget)}
                        >
                            <img src={member.imgUrl} alt={member.fullname} className="user-img img" />
                        </div>
                    )
                }

                if (idx === 1 && members.length > 2) {
                    return (
                        <div key="more-users" className={`img-wrapper more ${isAnimation ? 'heartbeat ' : ''}`}>
                            <span className="more-count">+{members.length - 1}</span>
                        </div>
                    )
                }

                return null
            })}
        </div>

    )
}