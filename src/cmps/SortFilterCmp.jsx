import chevronDown from '../../public/img/icons/chevron-down.svg'

export function SortFilterCmp() {

    return (
        <div className="sort-filter-cmp">
            <div className="add-btns">
                <button className="add-new-task">
                    New Task
                </button>
                <button className="button-arrow-down"> <img src={chevronDown} alt="arrow down icon" /></button>
            </div>
        </div>
    )
}