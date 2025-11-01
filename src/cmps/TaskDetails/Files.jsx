import { useState } from "react"
import { useSelector } from "react-redux"
import { FullScreenContainer } from "../TaskCmps/FileUpload/FullScreenContainer"
import { onSetPopUp } from "../../store/actions/system.actions"

import noFile from "/img/no-file.svg"
import { SvgIcon } from "../SvgIcon"

export function Files(props) {

    const task = useSelector(storeState => storeState.boardModule.taskDetails)
    const [isPreviewOpen, setIsPreviewOpen] = useState(false)

    function _onShowPopUp(ev, img) {
        if (!task?.file?.length) return
        ev.stopPropagation()
        setIsPreviewOpen(false)
        const content = <FullScreenContainer
            imgSrc={img?.dataUrl}
            imgTitle={img?.name}
        />
        onSetPopUp(content)
    }

    return (
        <section className="task-details-file">

            <div className="task-details-file-nav">
                <button className="add-file-btn">Add file</button>
                {task?.file?.length > 0 && <div>Showing {task?.file?.length} out of {task?.file?.length} file</div>}
            </div>

            {task?.file?.length > 0
                ? <ul className="file-list">
                    {task?.file.map((fileData, idx) => {
                        return <li key={idx} className="file-itme" onClick={(ev) => _onShowPopUp(ev, fileData?.file)}>
                            <img src={fileData?.file?.dataUrl} alt={fileData?.file?.name} className="file-itme-img" />
                            <div className="file-itme-title">{fileData?.title}</div>
                        </li>
                    })}
                </ul>
                : <div className="no-file-msg">
                    <img src={noFile} alt="no-file" className="no-file-img" />
                    <div className="first-line-no-file"><b>Drag & drop</b> or <b>add files here</b></div>
                    <div>Upload, comment and review all files in this item to easily collaborate in context</div>
                    <button className="add-file-btn blue flex">
                        <SvgIcon iconName="plus" size={20} colorName='whiteText' />
                        <span>Add file</span>
                    </button>
                </div>
            }

        </section>
    )
}