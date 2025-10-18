
// services
import { addTask } from '../../store/actions/board.actions.js'
import { onSetPopUp } from '../../store/actions/system.actions.js'
import { showErrorMsg, showSuccessMsg } from '../../services/event-bus.service.js'

// cmps
import { SvgIcon } from '../SvgIcon.jsx'
import { HoveredTextCmp } from '../HoveredTextCmp.jsx'
import { MultiMemberImage } from '../MultiMemberImage.jsx'
import { InviteByMail } from '../BoardActionsNav/InviteByMail.jsx'
import { PersonFilter } from './filterCmps/PersonFilter.jsx'
import { FilterBy } from './filterCmps/FilterBy.jsx'
import { SortBy } from './filterCmps/SortBy.jsx'
import { FloatingContainerCmp } from '../FloatingContainerCmp.jsx'
import { useRef, useState } from 'react'

export function BoardDetailsHeader({
    board,
    onOpenSearchBar,
    handelChange,
    inputValue,
    isSearchOpen,
    onClearInput,
    inputRef,
    isSearching,
    filterBy,
    filterOptions,
    onSetFilterBy,
}) {

    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [isSortOpen, setIsSortOpen] = useState(false)
    const [isPersonFilterOpen, setIsPersonFilterOpen] = useState(false)

    const filterBtnRef = useRef(null)
    const personBtnRef = useRef(null)
    const sortByRef = useRef(null)


    function toggleIsFilterOpen() {
        setIsFilterOpen(!isFilterOpen)
    }

    function onCloseFilter() {
        setIsFilterOpen(false)
    }

    const filterByNum = Object.values(filterBy).filter(arr => Array.isArray(arr) && arr.length > 0)?.length

    /// person filter

    function toggleIsPersonFilterOpen() {
        setIsPersonFilterOpen(!isPersonFilterOpen)
    }

    function onClosePersonFilter() {
        setIsPersonFilterOpen(false)
    }

    /// sort by

    function toggleIsSortOpen() {
        setIsSortOpen(!isSortOpen)
    }

    function onCloseSortBy() {
        setIsSortOpen(false)
    }


    // popup

    function _onShowPopUp() {
        const content = <InviteByMail />
        onSetPopUp(content)
    }

    /// task fncs

    async function onAddTask(groupId, title, method) {
        try {
            await addTask(board?._id, groupId, title, method)
            showSuccessMsg('task added to the board')
        } catch (err) {
            console.log(err)
            showErrorMsg('cannot add task')
        }
    }

    const { byGroups, byNames, byStatuses, byPriorities, byMembers, byDueDateOp, byPerson, sortBy, dir } = filterBy

    return (
        <header className='board-details-header'>

            <div className='action-nav'>

                <div className='activity-log'>
                    <button className='activity-log btn'>
                        <HoveredTextCmp
                            label="Board Members"
                            position="down"
                        >
                            <MultiMemberImage members={board?.members} className='multi-members-img' />
                        </HoveredTextCmp>
                    </button>
                </div>

                <div className='invite-users'>
                    <button className='btn-shrink-wrapper' onClick={_onShowPopUp}>
                        <div className='btn invite shrink'>
                            {` Invite / ${board?.members.length}`}
                        </div>
                    </button>

                    <span className='copy-link'>
                        <HoveredTextCmp
                            label="Copy Link"
                            position="down"
                        >
                            <SvgIcon iconName='sink' className='icon' size={20} />
                        </HoveredTextCmp>
                    </span>
                </div>

                <button className='more-btn'>
                    <HoveredTextCmp
                        label="Options"
                        position="down"
                    >
                        <SvgIcon iconName='dots' size={24} />
                    </HoveredTextCmp>
                </button>
            </div>

            <div className='board-title'>{board?.title}</div>

            <div className='board-nav'>
                <div>Main Table</div>
            </div>

            <div className='board-actions'>

                <button
                    onClick={() => onAddTask(board?.groups[0]?.id, `New ${board?.managingType}`, 'unshift')}
                    disabled={!board?.groups?.length}
                    className='btn-shrink-wrapper'>
                    <div className='btn blue add-btn shrink'>
                        New {board?.managingType}
                    </div>
                </button>

                <section className='board-action-btn'>

                    {/*  Search Button */}
                    <div className={`search-btn btn ${isSearchOpen} ${!!inputValue.length ? 'hasValue' : ''}`} onClick={onOpenSearchBar}>
                        <span className="icon">
                            <SvgIcon iconName='searchGlass' size={20} colorName='secondaryText' />
                        </span>

                        {!isSearchOpen ? (
                            <span className='txt'>Search</span>
                        ) : (
                            <div className='open-search'>
                                <input type="text"
                                    className='search-txt'
                                    placeholder='Search This Board'
                                    onChange={(ev) => handelChange(ev)}
                                    onBlur={isSearching}
                                    ref={inputRef}
                                    value={inputValue}
                                />
                                <section className="actions">
                                    <button
                                        className={`delete-btn hover-show up ${inputValue ? true : false}`}
                                        data-type={' Clear Search'}
                                        onClick={onClearInput}>
                                        <SvgIcon iconName='xMark' size={16} colorName='secondaryText' />
                                    </button>

                                    <button className='search-option-btn hover-show up' data-type={'Search Options'} >
                                        <SvgIcon iconName='searchOptions' size={16} colorName='secondaryText' />
                                    </button>
                                </section>
                            </div>
                        )}
                    </div>

                    {/*  Person Filter */}

                    <button className={`person-btn hover-show up ${isPersonFilterOpen || byPerson ? "active" : ""}`}
                        data-type='Filter board by Person'
                        ref={personBtnRef}
                        onClick={toggleIsPersonFilterOpen}
                    >
                        {byPerson
                            ? <img src={board?.members?.find(m => m._id === byPerson)?.imgUrl || ''}
                                alt="selected person" className='selected-person' />
                            : <span className="icon">
                                <SvgIcon iconName='person' size={20} colorName={`secondaryText`} />
                            </span>
                        }
                        <span className='txt'>Person</span>
                        {byPerson &&
                            <div onClick={(ev) => {
                                ev.stopPropagation()
                                onSetFilterBy({ byPerson: '' })
                                onClosePersonFilter()
                            }}>
                                <SvgIcon
                                    iconName='xMark' size={12}
                                    colorName={`currentColor`}
                                    className='mini-x' />
                            </div>
                        }
                    </button>

                    {/* Filter */}

                    <button className={`filter-btn hover-show up ${isFilterOpen || filterByNum > 0 ? "active" : ""}`}
                        data-type={'filter board by Anything'}
                        ref={filterBtnRef}
                        onClick={toggleIsFilterOpen}
                    >
                        <span className="icon">
                            <SvgIcon iconName='filter' size={20} colorName='secondaryText' />
                        </span>
                        <span className='txt'>Filter {filterByNum ? `/ ${filterByNum}` : ""}</span>
                    </button>

                    {/* ↕ Sort */}

                    <button
                        className={`sort-btn hover-show up ${isSortOpen || sortBy ? "active" : ""}`}
                        data-type={'Sort board by Any Column'}
                        ref={sortByRef}
                        onClick={toggleIsSortOpen}
                    >
                        <span className="icon">
                            <SvgIcon iconName='sortArrows' size={20} colorName='secondaryText' />
                        </span>
                        <span className='txt'>Sort {sortBy ? ' / 1' : ""}</span>
                    </button>

                </section>
            </div>


            {board && isPersonFilterOpen && <FloatingContainerCmp
                anchorEl={personBtnRef.current}
                onClose={onClosePersonFilter}
            >
                <PersonFilter
                    members={board?.members}
                    filterBy={{ byPerson }}
                    onSetFilterBy={onSetFilterBy}
                />

            </FloatingContainerCmp>}

            {board && isFilterOpen && <FloatingContainerCmp
                anchorEl={filterBtnRef.current}
                onClose={onCloseFilter}
            >
                <FilterBy
                    board={board}
                    filterOptions={filterOptions}
                    filterBy={{ byGroups, byNames, byStatuses, byPriorities, byMembers, byDueDateOp }}
                    onSetFilterBy={onSetFilterBy}
                />

            </FloatingContainerCmp>
            }


            {board?.cmpOrder && isSortOpen && <FloatingContainerCmp
                anchorEl={sortByRef.current}
                onClose={onCloseSortBy}
            >
                <SortBy
                    sortOptions={board?.cmpOrder}
                    sortByData={{ sortBy, dir }}
                    onSetFilterBy={onSetFilterBy}
                />

            </FloatingContainerCmp>}

        </header>
    )
}