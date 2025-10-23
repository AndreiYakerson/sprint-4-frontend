import { ImgCmp } from "../../ImgCmp";
import { SvgIcon } from "../../SvgIcon";

export function FilePreview({ imgSrc, imgTitle }) {

    return (
        <div className="file-preview">
            <section className="image-container">
                <img src={imgSrc} alt={imgTitle} />
                {/* <ImgCmp imgSrc= imgTitle={imgTitle} /> */}
            </section>
                <div className="file-info flex">
                    <span className='file-name  text-overflow'>{imgTitle}</span>
                    <SvgIcon iconName='creationClock' size={16} />
                </div>
        </div>
    )
}