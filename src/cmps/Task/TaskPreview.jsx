import { DynamicCmp } from "../DynamicCmp"

export function TaskPreview({ task }) {
    const cmpsOrder = ['StatusPicker', 'MemberPicker', 'DatePicker', 'PriorityPicker']
    return (
        <section>
            <h5>{task.txt}</h5>
            {cmpsOrder.map((cmp, idx) => {
                return (
                    <DynamicCmp
                        cmp={cmp}
                        key={idx}
                        onUpdate={data => {
                            console.log('Updating: ', cmp, 'with data:', data)
                            // make a copy, update the task, create an action
                            // Call action: updateTask(task, action)
                        }}
                    />
                )
            })}
        </section>
    )
}