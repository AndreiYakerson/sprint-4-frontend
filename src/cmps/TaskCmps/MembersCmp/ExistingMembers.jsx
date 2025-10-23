import { SvgIcon } from "../../SvgIcon"

export function ExistingMembers({members,onRemove,type = ''}) {
console.log("🚀 ~ ExistingMembers ~ type:", type)
console.log("🚀 ~ ExistingMembers ~ members:", members)

    return (
        <div className={`existing-members ${type}`}>
       { members.map(member => {
            return <section key={member?._id}>
                <span className='user-label'>
                    <img src={member?.imgUrl} alt="Member Image" />
                    <span className="user-name">{member?.fullname}</span>
                    <button className="remove-btn"
                    onClick={(ev)=>{
                        ev.stopPropagation()
                        onRemove(member?._id)}}>
                        <SvgIcon
                            // className='remove-btn'
                            iconName="xMark"
                            size={20}
                            colorName={'primaryText'}
                        />
                    </button>
                </span>
            </section>
        })}
        </div>
    )
}