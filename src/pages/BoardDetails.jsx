import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
// import { loadBoard } from '../store/actions/board.actions'
import { boardService } from '../services/board/index.js'
import { GroupList } from '../cmps/GroupList'


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
      showSuccessMsg('group updated successful')
    } catch (err) {
      console.log(err)
      showErrorMsg('cannot update group')
    }
  }

  async function onRemoveGroup(groupId) {
    try {
      const savedBoard = await boardService.removeGroup(board?._id, groupId)
      setBoard(savedBoard)
      showSuccessMsg('group removed successful')
    } catch (err) {
      console.log(err)
      showErrorMsg('cannot remove group')
    }
  }


  //FIXME  CRUD זה רק עד שנוכל להפיק בורד עם כל הפרמטרים הרלוונטים דרך 
  const demoBoard = {
    _id: 'g101',
    title: 'board',
    createdAt: 1589983468418,
    groups: [
      {
        id: 'g101',
        title: 'Design',
        createdAt: 1589983468418,
        tasks: [
          {
            id: 'c101',
            title: 'task 1',
            createdAt: 1589983468418,
          },
          {
            id: 'c102',
            title: 'task 2',
            createdAt: 1589983468418,
          },
          {
            id: 'c103',
            title: 'task 3',
            createdAt: 1589983468418,
          },
        ],
      },
      {
        id: 'g102',
        title: 'toDo',
        createdAt: 1589983468418,
        tasks: [
          {
            id: 'c101',
            title: 'task 1',
            createdAt: 1589983468418,
          },
          {
            id: 'c102',
            title: 'task 2',
            createdAt: 1589983468418,
          },
          {
            id: 'c103',
            title: 'task 3',
            createdAt: 1589983468418,
          },
        ],
      },
    ],
  }

  return (
    <section className="board-details">
      <button onClick={() => onAddGroup(board?._id)}>+ Add group</button>

      {board?.groups?.length > 0 &&
        < GroupList
          groups={board.groups}
          onRemoveGroup={onRemoveGroup}
          onUpdateGroup={onUpdateGroup}
        />}


    </section>
  )
}