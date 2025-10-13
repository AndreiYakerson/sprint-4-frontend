import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

// services
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { addGroup, addTask, loadBoard, setBoardRemovedMsg } from '../store/actions/board.actions.js'

// cmps
import { GroupList } from '../cmps/group/GroupList.jsx'
import { SortFilterCmp } from '../cmps/SortFilterCmp.jsx'
import { TaskDetails } from '../cmps/Task/TaskDetails.jsx'
import { SvgIcon } from '../cmps/SvgIcon.jsx'
import { BoardRemovedMsg } from '../cmps/Board/BoardRemovedMsg.jsx'
import { AppLoader } from '../cmps/AppLoader.jsx'
import { MultiMemberImage } from '../cmps/MultiMemberImage.jsx'
import { HoveredTextCmp } from '../cmps/HoveredTextCmp.jsx'


export function BoardDetails() {
  const [anchorEl, setAnchorEl] = useState(false)
  const navigate = useNavigate()

  const { boardId, taskId } = useParams()
  const isAppLoading = useSelector(state => state.systemModule.isAppLoading)
  const board = useSelector(storeState => storeState.boardModule.board)
  const boardRemovedMsg = useSelector(storeState => storeState.boardModule.boardRemovedMsg)

  const [task, setTask] = useState(null)

  useEffect(() => {
    if (!board || board?._id !== boardId) {
      onLoadBoard(boardId, taskId)
    } else if (taskId && taskId !== task?.id) {
      setTaskForDetails(taskId, board)
    } else if (!taskId && task) {
      setTask(null)
    }

  }, [boardId, taskId])

  async function onLoadBoard(boardId, taskId) {
    try {
      if (boardRemovedMsg) setBoardRemovedMsg('')

      await loadBoard(boardId)

      if (taskId && board) setTaskForDetails(taskId, board)
      else if (task) setTask(null)

    } catch (err) {
      console.log(err)
      showErrorMsg('faild to laod board')
    }
  }

  function setTaskForDetails(taskId, board) {

    var foundTask = null

    for (const group of board.groups) {
      const task = group.tasks.find(task => task.id === taskId)
      if (task) {
        foundTask = task
        break
      }
    }

    if (foundTask) {
      setTask(foundTask)
    }
  }

  function onCloseTaskDetails() {
    navigate(`/board/${boardId}`)
  }

  function onCloseMenu() {
    setSearchAnchor(false)
  }

  function handelChange(ev) {
    const titleToSearch = ev.target.value
    requestAnimationFrame(() => inputRef.current?.focus())
    setInputValue(titleToSearch)
    //  Preparation for Search on board. 
    // const regex = new RegExp('^' + titleToSearch, 'i')
    // const matchingGroups = board.groups
    //   .map(group => ({
    //     ...group,
    //     tasks: group.tasks.filter(task => regex.test(task.title))
    //   }))
    //   .filter(group => group.tasks.length > 0)

    // // if (!!matchingGroups.length) 
    // setSearchValues(matchingGroups)
    setAnchorEl(ev.currentTarget)
  }

  function onClearInput() {
    setInputValue('')
    setIsSearchOpen(false)
  }

  function onOpenSearchBar() {
    requestAnimationFrame(() => inputRef.current?.focus())
    setIsSearchOpen(true)
  }

  function isSearching() {
    if (!inputValue) {
      onClearInput()
    }
  }

  // Groups

  async function onAddGroup() {
    try {
      await addGroup(board?._id)
      showSuccessMsg('group added to the board')
    } catch (err) {
      console.log(err)
      showErrorMsg('cannot add group')
    }
  }

  // task


  async function onAddTask(groupId, title, method) {
    try {
      await addTask(boardId, groupId, title, method)
      showSuccessMsg('task added to the board')
    } catch (err) {
      console.log(err)
      showErrorMsg('cannot add task')
    }
  }


  if (isAppLoading) return <AppLoader />
  if (boardRemovedMsg && !board) return <BoardRemovedMsg removedMsg={boardRemovedMsg} />

  return (
    <section className="board-details">
      <div className="board-details-container" >

        <header className='board-details-header'>

          <div className='action-nav'>



            <div className='activity-log'>

              <button className='activity-log btn'>
                {
                  <HoveredTextCmp
                    label="Board Members"
                    position="down"
                    onClick={(ev) => setAnchorEl(ev.currentTarget)}
                  >
                    <MultiMemberImage members={board?.members} className='multi-members-img' />
                  </HoveredTextCmp>
                }
              </button>
            </div>

            <div className='invite-users'
            >
              <button className='invite'>
                {` Invite / ${board?.members.length}`}
              </button>

              <span className='copy-link'>

                {<HoveredTextCmp
                  label="Copy Link"
                  position="down"
                  onClick={(ev) => setAnchorEl(ev.currentTarget)}>

                  <SvgIcon iconName='sink' className='icon' size={20} />

                </HoveredTextCmp>}
              </span>

            </div>

            <button className='more-btn'>
              {<HoveredTextCmp
                label="Options"
                position="down"
                onClick={(ev) => setAnchorEl(ev.currentTarget)}>
                <SvgIcon iconName='dots' size={24} />
              </HoveredTextCmp>}
            </button>
          </div>

          <div className='board-title'>{board?.title}</div>

          <div className='board-nav'>
            <div>Main Table</div>
          </div>
          <div className='board-actions'>
            <button
              onClick={() => onAddTask(board?.groups[0]?.id, `New ${board?.managingType}`, 'unshift')}
              className='blue'> New {board?.managingType}
            </button>
            <section className='board-action-btn'>
              <button className="search-btn">
                <span className="icon">
                  <SvgIcon iconName='searchGlass' size={20} />
                </span>
                <span className='txt'>Search</span>
              </button>
              <button className="person-btn hover-show up" data-type={'Filter board by Person'}>
                <span className="icon">
                  <SvgIcon iconName='person' size={20} />
                </span>
                <span className='txt'>Person</span>
              </button>
              <button className="sort-btn hover-show up" data-type={'Sort board by Any Column'}>
                <span className="icon">
                  <SvgIcon iconName='sortArrows' size={20} />
                </span>
                <span className='txt'>Sort</span>
              </button>
            </section>
          </div>

          {/* <SortFilterCmp /> */}
        </header>

        {board?.groups?.length > 0 &&
          < GroupList
            groups={board.groups}
            managingType={board?.managingType}
          />}

        <button
          onClick={() => onAddGroup(board?._id)}
          className='add-group flex'> <SvgIcon iconName="plus" size={20} /> <span>Add new group</span>
        </button>

      </div>


      <div className={`task-details-wrapper ${task ? "open" : ""}`}>
        {task && <TaskDetails
          task={task}
          onCloseTaskDetails={onCloseTaskDetails}
        />}
      </div>


    </section>
  )
}