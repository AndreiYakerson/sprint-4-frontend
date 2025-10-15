export function SumSelectMenu({ isLabelsFilterd, type, onSetIsLabelsFilterd }) {

    return (
        <section className="sum-slelect-menu">

            <label htmlFor="filter" className="flex align-center ">
                <input
                    type="radio"
                    name="filterLabels"
                    id="filter"
                    checked={isLabelsFilterd === false}
                    onChange={() => onSetIsLabelsFilterd(false)}
                />
                <span>All Labels</span>
            </label>

            <label htmlFor="nofilter" className="flex align-center ">
                <input
                    type="radio"
                    name="filterLabels"
                    id="nofilter"
                    checked={isLabelsFilterd === true}
                    onChange={() => onSetIsLabelsFilterd(true)}

                />
                <span>What's {type === 'status' ? 'Done' : 'Critical'}</span>
            </label>

        </section>
    )
}