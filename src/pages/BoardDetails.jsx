import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { loadBoard } from '../store/actions/board.actions'
import { GroupList } from '../cmps/GroupList'


export function BoardDetails() {

  const { boardId } = useParams()
  const board = useSelector(storeState => storeState.boardModule.board)

  useEffect(() => {
    loadBoard(boardId)
  }, [boardId])

  console.log('board:', board)

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
      {board?.groups?.length > 0 && < GroupList groups={board.groups} />}
    </section>
  )
}