// SERVICES
import { useEffect, useState } from "react";
import { updateBoard } from "../../store/actions/board.actions.js";
import { useSelector } from "react-redux";

// COMPONENTS
import { LabelsListEdit } from "./PriorityCmp/LabelsListEdit.jsx";
import { LabelsList } from "./PriorityCmp/LabelsList.jsx";
import { FloatingContainerCmp } from "../FloatingContainerCmp.jsx";

export function LabelSelect({ info, onUpdate }) {
  // Detect label type automatically
  const isPriority = info.label === 'Priority:'
  const labelsFromBoard = isPriority ? info.boardPriorities || info.priorities : info.statuses
  const selectedLabel = isPriority ? info.taskPriority : info.selectedStatus

  const [labels, setLabels] = useState(labelsFromBoard || [])
  const [selectedLabelId, setSelectedLabelId] = useState(selectedLabel?.id)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const board = useSelector(state => state.boardModule.board)
  const label = labels.find(l => l.id === selectedLabelId)
  const labelType = isPriority ? 'priorities' : 'statuses'

  // Sync when board updates
  useEffect(() => {
    setLabels(labelsFromBoard || [])
  }, [labelsFromBoard])

  function onSaveLabel(label) {
    setSelectedLabelId(label.id)
    onUpdate(label)
    onClose()
  }

  function onUpdateLabels(updatedLabels) {
    const newBoard = { ...board, [labelType]: updatedLabels }
    updateBoard(newBoard)
    setLabels(updatedLabels)
  }

  function onClose() {
    setIsEditOpen(false)
    setAnchorEl(null)
  }

  const labelToShow = label || labels.find(l => l.id === 'default')

  return (
    <div
      className="label-picker "
      style={{ background: `var(${labelToShow?.cssVar})` }}
      onClick={ev => setAnchorEl(ev.currentTarget)}
    >
      {labelToShow?.txt}

      {anchorEl && (
        <FloatingContainerCmp
          anchorEl={anchorEl}
          onClose={onClose}
        >
          <div className={`labels-container ${isEditOpen}`}>
            <div className={`label-select ${isEditOpen}`}>
              {!isEditOpen ? (
                <LabelsList
                  labels={labels}
                  onSaveLabel={onSaveLabel}
                  switchEditMode={() => setIsEditOpen(prev => !prev)}
                />
              ) : (
                <LabelsListEdit
                  labels={labels}
                  onUpdateLabels={onUpdateLabels}
                  onClose={onClose}
                />
              )}
            </div>
          </div>
        </FloatingContainerCmp>
      )
      }
    </div >
  )
}
