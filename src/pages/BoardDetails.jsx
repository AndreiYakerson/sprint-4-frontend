import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

// services
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { addGroup, loadBoard } from '../store/actions/board.actions.js'

// cmps
import { GroupList } from '../cmps/group/GroupList.jsx'
import { SortFilterCmp } from '../cmps/SortFilterCmp.jsx'
import { TaskDetails } from '../cmps/Task/TaskDetails.jsx'


export function BoardDetails() {
  const navigate = useNavigate()

  const { boardId, taskId } = useParams()

  const board = useSelector(storeState => storeState.boardModule.board)

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

      await loadBoard(boardId)

      if (taskId) setTaskForDetails(taskId, board)
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


  return (
    <section className="board-details">
      <div className="board-details-container" >

        <header className='board-details-header'>

          <h2 className='board-title'>{board?.title}</h2>
          <div className='board-nav'>
            <div>Main Table</div>
          </div>
          <div className='board-actions'>
            <button onClick={() => onAddGroup(board?._id)} className='blue'>+ Add group</button>
          </div>

          {/* <SortFilterCmp /> */}
        </header>

        {board?.groups?.length > 0 &&
          < GroupList groups={board.groups} />}

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