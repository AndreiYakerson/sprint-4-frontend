import { useSelector } from "react-redux"
import { SvgIcon } from "../SvgIcon"
import { MemberTaskSelect } from "../TaskCmps/MembersCmp/MemberTaskSelect"
import { useEffect, useRef, useState } from "react"
import { FloatingContainerCmp } from "../FloatingContainerCmp"
import { loadFromStorage } from "../../services/util.service"
import { updateBoard } from "../../store/actions/board.actions"
import { showSuccessMsg } from "../../services/event-bus.service"
import { loginDemoUsers } from "../../store/actions/user.actions"

export function InviteByMail({ onClosePopUp }) {
    const user = useSelector(state => state.userModule.user)
    const users = useSelector(state => state.userModule.users)
    const board = useSelector(state => state.boardModule.board)

    // const [users, setUsers] = useState(users)
    const [anchorEl, setAnchorEl] = useState(false)
    const [searchValues, setSearchValues] = useState([])
    const [inputValue, setInputValue] = useState('')

    //demo logged users
    useEffect(() => {
        if (!users.length) {
            console.log(' Setting demo user to LocalStorage ')
            loginDemoUsers(userService.createDemoUsersForLoggedUsers(10))
        }
    }, [])


   async function onSelectMember(member) {
        const newBoard = {...board, members:[...board.members,member ]}
       try {
         updateBoard(newBoard)
         showSuccessMsg(' Member add board')
         onClosePopUp()
       } catch (error) {
        console.log(" Invite by mail. Problem updating member" , error)
        
       }
    }

    function handelChange(ev) {
        const UserToSearch = ev.target.value
        setInputValue(UserToSearch)
        const regex = new RegExp(UserToSearch, 'i')
        const foundUsers = users.filter(u => regex.test(u.fullname) || regex.test(u.profession))
            .filter(u => !board.members.some(m => m._id === u._id))


        if (!UserToSearch) setSearchValues([])
        else setSearchValues(foundUsers)
        setAnchorEl(ev.currentTarget)
    }

    function onCloseMenu() {
        console.log('variable')
        setAnchorEl(false)
    }

    return (

        <div className="invite-by-mail-wrapper">
            <div className="invite-by-mail">
                <header className="text-wrap text-overflow flex"> Invite to this board
                    <section className="header-btns">
                        <button>
                            <SvgIcon iconName="commentHeart" size={20} />
                        </button>
                        <button onClick={onClosePopUp}>
                            <SvgIcon iconName="xMark" size={20} />
                        </button>
                    </section>
                </header>
                <section className="main-content">
                    <span className="search-input">
                        <input
                            type="text"
                            placeholder="Search by name or profession"
                            value={inputValue}
                            onChange={(ev) => handelChange(ev)} />
                    </span>
                    <span
                        className="build-txt flex">
                        <SvgIcon iconName='Building' size={20} colorName="secondaryText" />
                        {`Anyone at ${user?.fullname}'s Team can access this board`}</span>
                    {searchValues?.map((member, idx) => {
                        return <button
                            onClick={() => onSelectMember(member, idx)}
                            key={member._id}
                            className="user flex text-overflow"
                        >
                            <div className="user-container">
                                <img className=" user-img" src={member.imgUrl} alt="User Image" />
                                <section className="user-name-and-pro ">
                                    <span className="user-fullname">
                                        {member.fullname}
                                    </span>
                                    <span className="user-profession">
                                        {member.profession}
                                    </span>
                                </section>
                            </div>

                            {/* {// This needs arrangement before. Waiting for board owner. People.} */}
                            <section className={`user-actions ${(member._id === board.owner?.id) ? 'owner' : ''}`}>
                                <button>
                                    <SvgIcon iconName="crown" size={20} colorName={(member._id === board.owner?.id) ? '' : 'disabled'} />
                                </button>
                                <button>
                                    <SvgIcon iconName="xMark" size={20} colorName={(member._id === board.owner?.id) ? '' : 'disabled'} />

                                </button>
                            </section>
                        </button>
                    })}
                </section>

                {/* {!!searchValues.length &&
                    <FloatingContainerCmp
                        anchorEl={anchorEl}
                        onClose={onCloseMenu}
                    >
                        <div>hello</div>
                    </FloatingContainerCmp>} */}
            </div>
        </div>
    )
}