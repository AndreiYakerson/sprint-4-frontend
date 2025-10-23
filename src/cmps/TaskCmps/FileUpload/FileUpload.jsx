import { useRef, useState } from "react";
import { FloatingContainerCmp } from "../../FloatingContainerCmp";
import { FileUploadActionMenu } from "./FileUploadActionMenu";
import { toBase64 } from "../../../services/util.service";
import { storageService } from "../../../services/async-storage.service";
import { updateTask } from "../../../store/actions/board.actions";
import { ImgCmp } from "../../ImgCmp";
import { FilePreview } from "./filePreview";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { FullScreenContainer } from "./FullScreenContainer";
import { onSetPopUp } from "../../../store/actions/system.actions";

export function FileUpload({ info, onUpdate }) {
    const { taskFiles } = info

    const floating = useSelector(state => state.systemModule.floating)

    const [isFullScreenOpen, setIsFullScreenOpen] = useState(false)
    const [isPreviewOpen, setIsPreviewOpen] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const addFileRef = useRef(null)
    const previewRef = useRef(null)
    const hoverRef = useRef(null)
    const fileInputRef = useRef(null)
    const [isDragging, setIsDragging] = useState(false);
    const dragDataType = 'drag files here'
    const taskFileToShow = taskFiles ? taskFiles : []


    function onToggleMenu() {
        setIsMenuOpen(prev => !prev)
    }

    function addFromFolder() {
        if (fileInputRef.current) {
            fileInputRef.current.click()
        }
    }

    async function handelFileChange(ev) {
        const file = ev.currentTarget.files[0]
        var fileItem = {}
        var filesToSave = []

        try {
            var base64 = await toBase64(file)

            fileItem = {
                title: file.name,
                file: {
                    name: file.name,
                    type: file.type,
                    dataUrl: base64
                }
            }
            await storageService.post('tasksFiles', fileItem)
        } catch (error) {
            console.log(' Problem uploading file to storage', error)
        }
        if (taskFiles) filesToSave = [...taskFiles, fileItem]
        else filesToSave = [fileItem]

        onUpdate(filesToSave)
    }

    function handleDragOver(ev) {
        ev.preventDefault();
        setIsDragging(true);
    }

    function handleDragLeave(ev) {
        setIsDragging(false);
    }

    function handleDrop(ev) {
        ev.preventDefault();
        setIsDragging(false);

        const droppedFiles = ev.dataTransfer.files;

        if (droppedFiles.length > 0) {
            fileInputRef.current.files = droppedFiles;
            fileInputRef.current.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    function closeMenu() {
        setIsMenuOpen(false)
    }

    function onHoverFile() {
        if (isPreviewOpen) return setIsPreviewOpen(false)
        clearTimeout(hoverRef.current)
        setIsPreviewOpen(true)
    }
    function clearHover() {
        clearTimeout(hoverRef.current)
        hoverRef.current = setTimeout(() => {
            setIsPreviewOpen(false)
        }, 300) // <-- 0.5 second buffer
    }

    function _onShowPopUp() {
        console.log("🚀 ~ _onShowPopUp ~ taskFileToShow[0]?.file.name:", taskFileToShow[0]?.file)
        if (!taskFileToShow[0]?.file) return 
        const content = <FullScreenContainer
        imgSrc={taskFileToShow[0]?.file.dataUrl}
         imgTitle={taskFileToShow[0]?.file.name}
         />
        onSetPopUp(content)
    }


    return (
        <div className={`file-upload ${isDragging ? 'dragging' : ''}`}
            onClick={onToggleMenu}
            ref={addFileRef}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <input
                datatype="Drop Files Here"
                type="file"
                ref={fileInputRef}
                onChange={handelFileChange}
                style={{ display: 'none' }}
            />


            {isDragging && dragDataType}

            {!isDragging &&
                <section className={`empty-file-img-container ${!!taskFileToShow.length}`}
                    ref={previewRef}
                    onMouseEnter={onHoverFile}
                    onMouseLeave={clearHover}
                >
                    <span className="round-plus-icon-container">
                        <span className="round-plus-icon"></span>
                    </span>
                    <img 
                    className='empty-file-img' src={taskFileToShow[0]?.file.dataUrl || "/img/emptyFile.svg"}
                    onClick={_onShowPopUp}
                     alt="Empty File Image"
                      />
                </section>}

            {/* {isMenuOpen && (
                <FloatingContainerCmp
                    anchorEl={fileInputRef.current}
                    onClose={closeMenu}
                >
                    <FileUploadActionMenu
                        addFromFolder={addFromFolder}
                        onCloseMenu={closeMenu}
                    />
                </FloatingContainerCmp>
            )} */}

            {isPreviewOpen && !!taskFileToShow.length && (
                <FloatingContainerCmp
                    anchorEl={previewRef.current}
                    onClose={closeMenu}
                    offsetX={50}
                    offsetY={110}

                >
                    <div
                        onMouseEnter={() => clearTimeout(hoverRef.current)}
                        onMouseLeave={clearHover}
                    >
                        <FilePreview 
                        imgSrc={taskFileToShow[0]?.file.dataUrl} 
                        imgTitle={taskFileToShow[0]?.file.name} />
                    </div>
                </FloatingContainerCmp>
            )}

            {/* {isFullScreenOpen && !!taskFileToShow.length && (
                <FloatingContainerCmp
                    anchorEl={previewRef.current}
                    onClose={closeMenu}
                    offsetX={50}
                    offsetY={110}
                >
                    <div
                        onMouseEnter={() => clearTimeout(hoverRef.current)}
                        onMouseLeave={clearHover}
                    >
                        <full imgSrc={taskFileToShow[0]?.file.dataUrl} imgTitle={taskFileToShow[0]?.file.name} />
                    </div>
                </FloatingContainerCmp>
            )} */}
        </div>
    )
}