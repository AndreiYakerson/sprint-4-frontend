import { useParams, Link } from "react-router-dom"
import { DynamicCmp } from "../DynamicCmp"

export function TaskPreview({ task, onRemoveTask }) {
    const { boardId, taskId } = useParams()

    const cmpsOrder = ['StatusPicker', 'PriorityPicker', 'MemberPicker', 'DatePicker']
    // const cmpsOrder = ['StatusPicker']

    return (
        <>
            <div className="sticky-cell-wrapper">
                <div className="task-menu-wrapper">
                    <button onClick={onRemoveTask}>X</button>
                </div>
                <div className="table-border"></div>
                <div className="task-select"></div>
                <div className="task-title">
                    {task.title}
                    <Link to={taskId ? `/board/${boardId}` : `/board/${boardId}/task/${task.id}`}
                        className="btn">details</Link>
                </div>
            </div>

            <div className="task-columns flex">
                {cmpsOrder.map(colName => {
                    return <div key={colName} className="cell">
                        <span>{colName}</span>
                    </div>
                })}
                <div className="cell full"></div>
            </div>

        </>
    )
}




{/* {cmpsOrder.map((cmp, idx) => {
                return (


                    // <DynamicCmp
                    //     cmp={cmp}
                    //     key={idx}
                    //     onUpdate={data => {
                    //         console.log('Updating: ', cmp, 'with data:', data)
                    //         // make a copy, update the task, create an action
                    //         // Call action: updateTask(task, action)
                    //     }}
                    // />
                )
            })} */}