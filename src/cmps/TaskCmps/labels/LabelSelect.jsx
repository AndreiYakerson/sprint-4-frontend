// COMPONENT: DynamicPicker.jsx
import { useEffect, useState } from "react"
import { FloatingContainerCmp } from "../../FloatingContainerCmp.jsx"
import { StatusAnimation } from "../../StatusAnimation.jsx"

export function LabelSelect({
    info,               
    onUpdate,     
    onUpdateList,  
    CmpList,           
    CmpListEdit,       
    bgVarKey = 'cssVar'
}) {
    const { selectedItem, items } = info
    const [selectedId, setSelectedId] = useState(selectedItem?.id)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [list, setList] = useState(items)
    const [anchorEl, setAnchorEl] = useState(null)

    useEffect(() => setList(items), [items])

    const item = list.find(i => i.id === selectedId) || list.find(i => i.id === 'default')

    function onSaveItem(item) {
        const newItem = { ...item, updatedAt: Date.now() }
        setSelectedId(newItem.id)
        onUpdate(newItem)
        onClose()
    }

    function onEditList(updatedList) {
        setList(updatedList)
        onUpdateList(updatedList)
    }

    function onClose() {
        setIsEditOpen(false)
        setAnchorEl(null)
    }

    function switchEditMode() {
        setIsEditOpen(prev => !prev)
    }

    return (
        <div
            className={`labels-select-container ${anchorEl ? "focus" : ""}`}
            style={{ background: `var(${item?.[bgVarKey]})` }}
            onClick={(ev) => setAnchorEl(ev.currentTarget)}
        >
            {item?.txt}
            <StatusAnimation color={`var(${item?.[bgVarKey]})`} />

            {anchorEl && (
                <FloatingContainerCmp
                    anchorEl={anchorEl}
                    onClose={onClose}
                    centeredX={true}
                    showTriangle={true}
                    enforceLimit={true}
                >
                    <div className={`labels-container ${isEditOpen}`}>
                        <div className={`label-select ${isEditOpen}`}>
                            {!isEditOpen ? (
                                <CmpList
                                    items={list}
                                    onSaveItem={onSaveItem}
                                    onSwitchEditMode={switchEditMode}
                                />
                            ) : (
                                <CmpListEdit
                                    items={list}
                                    onUpdateList={onEditList}
                                    onClose={onClose}
                                    onSwitchEditMode={switchEditMode}
                                />
                            )}
                        </div>
                    </div>
                </FloatingContainerCmp>
            )}
        </div>
    )
}
