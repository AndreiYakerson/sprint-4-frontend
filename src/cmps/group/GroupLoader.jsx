export function GroupLoader(props) {
    return (
        <section className="group-list groups-loader">
            <GroupLoading />
            <GroupLoading />
        </section>
    )
}


function GroupLoading(params) {
    return (
        <div className="group-container">
            <header className="group-header">

                <div className="group-title-row" >
                    <div className="group-menu-wrapper">
                    </div>
                    <div className="collapse-group-toggle" ></div>
                    <div className="group-title-wrapper flex">

                    </div>
                    <div className="task-count" >

                    </div>
                    <div className="temporary-white-block" ></div>
                </div>
                <div className="temporary-white-block"></div>


                <div className="table-row table-header">
                    <div className="sticky-cell-wrapper">
                        <div className="task-menu-wrapper"></div>
                        <div className="table-border"></div>
                        <div className="task-select"></div>
                        <div className="task-title">

                        </div>
                    </div>

                    <div className="task-columns flex">
                        <div className={`column-cell`}></div>
                        <div className={`column-cell`}></div>
                        <div className={`column-cell`}></div>

                        <div className="column-cell full last-column">

                        </div>
                    </div>

                </div>
            </header >

            <div className="table-row ">
                <div className="sticky-cell-wrapper">
                    <div className="task-menu-wrapper"></div>
                    <div className="table-border"></div>
                    <div className="task-select"></div>
                    <div className="task-title">

                    </div>
                </div>

                <div className="task-columns flex">
                    <div className={`column-cell`}></div>
                    <div className={`column-cell`}></div>
                    <div className={`column-cell`}></div>

                    <div className="column-cell full last-column">

                    </div>
                </div>

            </div>
            <div className="table-row ">
                <div className="sticky-cell-wrapper">
                    <div className="task-menu-wrapper"></div>
                    <div className="table-border"></div>
                    <div className="task-select"></div>
                    <div className="task-title">

                    </div>
                </div>

                <div className="task-columns flex">
                    <div className={`column-cell`}></div>
                    <div className={`column-cell`}></div>
                    <div className={`column-cell`}></div>

                    <div className="column-cell full last-column">

                    </div>
                </div>

            </div>

            <div className="table-row ">
                <div className="sticky-cell-wrapper">
                    <div className="task-menu-wrapper"></div>
                    <div className="table-border"></div>
                    <div className="task-select"></div>
                    <div className="task-title">

                    </div>
                </div>

                <div className="task-columns flex">
                    <div className={`column-cell`}></div>
                    <div className={`column-cell`}></div>
                    <div className={`column-cell`}></div>

                    <div className="column-cell full last-column">
                    </div>
                </div>

            </div>


            <div className="table-row">
                <div className="sticky-cell-wrapper">
                    <div className="task-menu-wrapper"></div>
                    <div className="table-border"></div>
                    <div className="task-select"></div>
                    <div className="add-task-cell">

                    </div>
                </div>

                <div className="task-columns flex">
                    <div className="column-cell full"></div>
                </div>
            </div>

            <div className="table-row sum-row">
                <div className="sticky-cell-wrapper">
                    <div className="task-menu-wrapper"></div>
                    <div className="border-radius-block">
                        <span></span>
                    </div>
                </div>

                <div className="task-columns flex">
                    <div className={`column-cell`}></div>
                    <div className={`column-cell`}></div>
                    <div className={`column-cell`}></div>
                    <div className="column-cell full"></div>
                </div>
            </div>
        </div>
    )
}