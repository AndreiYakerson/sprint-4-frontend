import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
// import { loadBoard } from '../store/actions/board.actions'
import { boardService } from '../services/board/index.js'
import { GroupList } from '../cmps/GroupList'
import { SortFilterCmp } from '../cmps/SortFilterCmp.jsx'


export function BoardDetails() {

  const { boardId } = useParams()
  // const board = useSelector(storeState => storeState.boardModule.board)
  const [board, setBoard] = useState(null)

  useEffect(() => {
    loadBoard(boardId)
  }, [boardId])

  console.log('board:', board)

  async function loadBoard(boardId) {
    try {
      const board = await boardService.getById(boardId)
      setBoard(board)
    } catch (err) {
      console.log(err)
      showErrorMsg('faild to laod board')
    }
  }

  async function onAddGroup() {
    try {
      const savedBoard = await boardService.addGroup(board?._id)
      setBoard(savedBoard)
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
      const savedBoard = await boardService.updateGroup(board?._id, group)
      setBoard(savedBoard)
      showSuccessMsg('group updated successfully')
    } catch (err) {
      console.log(err)
      showErrorMsg('cannot update group')
    }
  }

  async function onRemoveGroup(groupId) {
    try {
      const savedBoard = await boardService.removeGroup(board?._id, groupId)
      setBoard(savedBoard)
      showSuccessMsg('group removed successfully')
    } catch (err) {
      console.log(err)
      showErrorMsg('cannot remove group')
    }
  }


  // task functions
  async function onAddTsak(groupId) {
    try {
      const savedBoard = await boardService.addTask(board?._id, groupId)
      setBoard(savedBoard)
      showSuccessMsg('task added to the board')
    } catch (err) {
      console.log(err)
      showErrorMsg('cannot add task')
    }
  }

  async function onRemoveTask(groupId, taskId) {
    try {
      const savedBoard = await boardService.removeTask(board?._id, groupId, taskId)
      setBoard(savedBoard)
      showSuccessMsg('task removed successfully')
    } catch (err) {
      console.log(err)
      showErrorMsg('cannot remove task')
    }
  }

  // for now its just for task title
  async function onUpdateTask(groupId, task) {
    const title = prompt('New title?', task.title) || ''
    if (title === '' || title === board.title) return

    task.title = title

    try {
      const savedBoard = await boardService.updateTask(board?._id, groupId, task)
      setBoard(savedBoard)
      showSuccessMsg('task updated successfully')
    } catch (err) {
      console.log(err)
      showErrorMsg('cannot update task')
    }
  }


  return (
    <section className="board-details">

      <header className='board-details-header'>

        <h2>{board?.title}</h2>
        
        <SortFilterCmp/>
        <button onClick={() => onAddGroup(board?._id)} className='blue'>+ Add group</button>
      </header>

      {board?.groups?.length > 0 &&
        < GroupList
          groups={board.groups}
          onRemoveGroup={onRemoveGroup}
          onUpdateGroup={onUpdateGroup}
          onAddTsak={onAddTsak}
          onRemoveTask={onRemoveTask}
          onUpdateTask={onUpdateTask}
        />}


    </section>
  )
}