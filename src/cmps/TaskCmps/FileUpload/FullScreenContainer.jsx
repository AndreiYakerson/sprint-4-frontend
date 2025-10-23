import { ImgCmp } from "../../ImgCmp";
import { SvgIcon } from "../../SvgIcon";

export function FullScreenContainer({ imgSrc, imgTitle, onClosePopUp }) {
    console.log("🚀 ~ FullScreenContainer ~ imgTitle:", imgTitle)

    return (
        <div className="full-screen-container">
            <header>
                <section className="header-content">
                    <span className="file-info">
                        <img src="/img/image-blue-file.svg" alt="Blue File Image" />
                        <h4>{imgTitle}</h4>
                    </span>
                </section>
                <button onClick={onClosePopUp} className="delete-btn">
                    <SvgIcon iconName='xMark' size={20} colorName='secondaryText' />
                </button>
            </header>
            <main>
                <div className="main-content">

                    <img src={imgSrc} alt={imgTitle} className="file-img" />


                </div>
                <aside>

                </aside>

            </main>
        </div>
    )
}