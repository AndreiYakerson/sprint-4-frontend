import { useSelector } from "react-redux"
import { SvgIcon } from "../SvgIcon"
import { MemberTaskSelect } from "../TaskCmps/MembersCmp/MemberTaskSelect"

export function InviteByMail() {
    const user = useSelector(state => state.userModule.user)
    const board = useSelector(state => state.boardModule.board)



    return (

        <div className="invite-by-mail">
            <header>
                Invite to this board
            </header>
            <span className="build-txt flex"> <SvgIcon iconName='Building' size={20} colorName="secondaryText" />
                {`Anyone at ${user.fullname}'s Team can access this board`}</span>
            <section>
                {board.members.map((member, idx) => {
                    return <button
                        onClick={() => onSelectMember(member, idx)}
                        key={member._id}
                        className="user flex text-overflow"
                    >
                        <span className="img-container"><img className=" user-img" src={member.imgUrl} alt="User Image" /></span>
                        <span className="user-name ">{member.fullname}</span>

                    </button>
                })}

            </section>
        </div>
    )
}