import { useEffect } from "react";
import { LabelsList } from "./LabelsList";
import { LabelsListEdit } from "./LabelsListEdit";

export function LabelSelect({ isEditOpen, labels, onSaveLabel, onUpdateLabels, switchEditMode, onClose }) {

    useEffect(() => {
        return () =>  onClose()
    }, [])

    return (
        <div className={`labels-container ${isEditOpen}`}>
            <div className={`label-select ${isEditOpen}`}>
                {!isEditOpen ?
                    <LabelsList labels={labels} onSaveLabel={onSaveLabel} onSwitchEditMode={switchEditMode} />
                    :
                    <LabelsListEdit labels={labels} onUpdateLabels={onUpdateLabels} onSwitchEditMode={switchEditMode} />
                }

            </div>
        </div>
    )
}