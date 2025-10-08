import { SvgIcon } from "../../SvgIcon"

export function ExistingMembers({members,onRemove}) {

    return (
        <div className='existing-members'>
       { members.map(member => {
            return <section >
                <span className='user-label'>
                    <img src={member.imgUrl} alt="Member Image" />
                    {member.fullname}
                    <button className="remove-btn"
                    onClick={(ev)=>{
                        ev.stopPropagation()
                        onRemove(member.id)}}>
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