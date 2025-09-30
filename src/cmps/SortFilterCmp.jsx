import { HoveredTextCmp } from './HoveredTextCmp'
import chevronDown from '/icons/chevron-down.svg'

export function SortFilterCmp() {

    return (
        <div className="sort-filter-cmp">
            <div className="add-btns">
                <button className="add-new-task">
                    New Task
                </button>
                {/* <button className="button-arrow-down">
                <HoveredTextCmp
                                        src={chevronDown}
                                        label="Update Feed"
                                        position=""
                                        onClick={}
                                    />
                </button> */}
            </div>
        </div>
    )
}