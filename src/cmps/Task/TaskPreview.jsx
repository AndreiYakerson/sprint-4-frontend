import { DynamicCmp } from "../DynamicCmp"

export function TaskPreview({ task }) {
    // const cmpsOrder = ['StatusPicker', 'MemberPicker', 'DatePicker', 'PriorityPicker']
    const cmpsOrder = ['StatusPicker']
    return (
        <section>
            {cmpsOrder.map((cmp, idx) => {
                return (
                    <h5 key={idx}>{task.title}</h5>


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
            })}
        </section>
    )
}