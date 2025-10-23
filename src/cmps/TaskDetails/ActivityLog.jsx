import { useSelector } from "react-redux"
import { formatTimeAgo } from "../../services/util.service"

export function ActivityLog(props) {

    const task = useSelector(storeState => storeState.boardModule.taskDetails)

    if (!task) return
    const { activities } = task
    return (
        <section className="task-details-activity-log ">
            {activities?.length > 0 &&
                <ul className="activities-list">
                    {activities.map(a => {
                        return <li key={a?.id} className="activity-item">
                            <div>{formatTimeAgo(a?.createdAt)}</div>
                            <div><img src={a?.byMember?.imgUrl} alt={a?.byMember?.fullname} /></div>
                            <div>{a?.task?.title}</div>
                            <div>{a?.title}</div>
                        </li>
                    })}
                </ul>
            }
        </section>
    )
}
