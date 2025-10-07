// import { useState } from 'react'
// import { PriorityList } from './PriorityList'
// import { PriorityListEdit } from './PriorityListEdit'
// import { useSelector } from 'react-redux'
// import { makeId } from '../../../services/util.service'
// import { updateBoard } from '../../../store/actions/board.actions'
// import { showSuccessMsg } from "../../../services/event-bus.service.js"

// export function PrioritySelect({ onClose }) {
//     const StateBoard = useSelector(state => state.boardModule.board)
//     //Demo Data
//     const DemoPriorityLabels = [
//         {
//             id: makeId(),
//             txt: 'Critical'
//             , cssVar: '--group-title-clr3'
//         },
//         {
//             id: makeId(),
//             txt: 'High'
//             , cssVar: '--group-title-clr1'
//         },
//         {
//             id: makeId(),
//             txt: 'medium'
//             , cssVar: '--group-title-clr4'
//         },
//         {
//             id: makeId(),
//             txt: 'Low'
//             , cssVar: '--group-title-clr2'
//         },
//     ]
//     const board = structuredClone(StateBoard)
//     if (!board.priorityLabels) {
//         board.priorityLabels = DemoPriorityLabels
//     }
//     //

//     const [isEditOpen, setIsEditOpen] = useState(false)

//     function onSave(labels) {
//         board.priorityLabels = labels
//         updateBoard(board)
//         onClose()
//         showSuccessMsg(' Priority label saved')
//     }

//     function onUpdate(labels) {
//         board.priorityLabels = labels
//         updateBoard(board)
//     }


//     const editMode = !isEditOpen ? 'apply' : ''
//     return (
//         <div className={`priority-container ${isEditOpen}`}>
//             <div className={`priority-select ${isEditOpen}`}>
//                 {!isEditOpen ?
//                     <PriorityList labels={board.priorityLabels} switchEditMode={() => setIsEditOpen(prev => prev = !prev)} />
//                     :
//                     <PriorityListEdit labels={board.priorityLabels} onSave={onSave} onUpdate={onUpdate} onClose={onClose} />
//                 }

//             </div>
//         </div>

//     )

// }