import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

// services
import { boardService } from '../services/board/index.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { addGroup, addTask, loadBoard, removeGroup, removeTask, updateGroup, updateTasksOrder } from '../store/actions/board.actions.js'

// cmps
import { GroupList } from '../cmps/GroupList'
import { SortFilterCmp } from '../cmps/SortFilterCmp.jsx'
import { TaskDetails } from '../cmps/Task/TaskDetails.jsx'


export function BoardDetails() {
  const navigate = useNavigate()

  const { boardId, taskId } = useParams()

  const board = useSelector(storeState => storeState.boardModule.board)

  // const [board, setBoard] = useState(null)
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

  // for now its just for group title
  async function onUpdateGroup(group) {
    const title = prompt('New title?', group.title) || ''
    if (title === '' || title === board.title) return

    group.title = title

    try {
      await updateGroup(board?._id, group)
      showSuccessMsg('group updated successfully')
    } catch (err) {
      console.log(err)
      showErrorMsg('cannot update group')
    }
  }

  async function onRemoveGroup(groupId) {
    try {
      await removeGroup(board?._id, groupId)
      showSuccessMsg('group removed successfully')
    } catch (err) {
      console.log(err)
      showErrorMsg('cannot remove group')
    }
  }


  // task functions
  async function onAddTask(groupId) {
    try {
      await addTask(board?._id, groupId)
      showSuccessMsg('task added to the board')
    } catch (err) {
      console.log(err)
      showErrorMsg('cannot add task')
    }
  }

  async function onRemoveTask(groupId, taskId) {
    try {
      await removeTask(board?._id, groupId, taskId)
      if (task?.id === taskId) onCloseTaskDetails()
      showSuccessMsg('task removed successfully')
    } catch (err) {
      console.log(err)
      showErrorMsg('cannot remove task')
    }
  }

  // for now its just for task title --  need to remove this
  async function onUpdateTask(groupId, task) {
    const title = prompt('New title?', task.title) || ''
    if (title === '' || title === board.title) return

    task.title = title

    try {
      const savedBoard = await boardService.updateTask(board?._id, groupId, task)
      setBoard(savedBoard)
      if (task.id === taskId) setTask(task)
      showSuccessMsg('task updated successfully')
    } catch (err) {
      console.log(err)
      showErrorMsg('cannot update task')
    }
  }

  async function onUpdateTasksOrder(tasks, groupId) {
    try {
      await updateTasksOrder(tasks, board?._id, groupId)
      showSuccessMsg('tasks order updated successfully')
    } catch (err) {
      console.log(err)
      showErrorMsg('cannot update tasks order')
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
          < GroupList
            groups={board.groups}
            onRemoveGroup={onRemoveGroup}
            onUpdateGroup={onUpdateGroup}
            onAddTask={onAddTask}
            onRemoveTask={onRemoveTask}
            onUpdateTask={onUpdateTask}
            onUpdateTasksOrder={onUpdateTasksOrder}
          />}

      </div>


      <div className={`task-details-wrapper ${task ? "open" : ""}`}>
        {task && <TaskDetails task={task} onCloseTaskDetails={onCloseTaskDetails} />}
      </div>

    </section>
  )
}