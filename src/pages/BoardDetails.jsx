import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { loadBoard } from '../store/actions/board.actions'


export function BoardDetails() {

  const { boardId } = useParams()
  const board = useSelector(storeState => storeState.boardModule.board)

  useEffect(() => {
    loadBoard(boardId)
  }, [boardId])


  return (
    <section className="board-details">
      <h1>Board</h1>
      {board &&
        <div>
          <h3>{board.title}</h3>
          <pre> {JSON.stringify(board, null, 2)} </pre>
        </div>
      }
    </section>
  )
}