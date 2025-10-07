
// import personGray from "../../../../public/img/gray-avatar.svg"

// import { FloatingContainerCmp } from "../../FloatingContainerCmp"
// import { MemberInfo } from "./MemberInfo"
// import { useState } from "react"
// import { useSelector } from "react-redux"
// import { SvgIcon } from "../../SvgIcon"

// export function MemberSelectedPreview({ task }) {
//     console.log("🚀 ~ MemberSelectedPreview ~ task:", task)
//     const [memberEl, setMemberEl] = useState(null)
//     const [hoveredUser, setHoveredUser] = useState(null)
//     const isFloatingOpen = useSelector(state => state.systemModule.isFloatingOpen)

//     function onSetHoveredUser(user, target) {
//         if (!isFloatingOpen || memberEl) {
//             setHoveredUser(user);
//             setMemberEl(target)
//         }
//         else return
//     }

//     function onClearHover() {
//         setMemberEl(null)
//         setHoveredUser(null);
//     }

//     return (
//         <article className="member-selected-preview">
//             {!task.addedMembers?.length &&

//                 <SvgIcon
//                     iconName="plus"
//                     className='plus-blue'
//                     size={15}
//                     colorName={'whiteText'}
//                 />
//             }

//             <div className="cmp-img"
//             >
//                 {!!task.addedMembers.length ?
//                     task.addedMembers.map(user => {
//                         return <div
//                             className="img-wrapper"
//                             key={user.id}
//                             onMouseLeave={(ev) => onClearHover()}
//                             onMouseOver={(ev) => onSetHoveredUser(user, ev.currentTarget)}
//                         >
//                             <img
//                                 id={user.fullname}
//                                 src={user.imgUrl}
//                                 className="user-img"
//                                 alt="person icon"
//                             />
//                         </div>
//                     })
//                     : <img
//                         src={personGray}
//                         className="user-img"
//                         alt="person icon"
//                     />

//                 }

//                 {memberEl && < FloatingContainerCmp
//                     anchorEl={memberEl}
//                     onClose={() => onClearHover(null)}
//                 >
//                     <MemberInfo
//                         user={hoveredUser}
//                     />
//                 </FloatingContainerCmp>}

//             </div>

//         </article>
//     )
// }