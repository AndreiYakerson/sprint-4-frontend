import { useState } from 'react'

export function ImgCmp({ imgSrc ,imgTitle }) {
    const [isImgLoading, setImgLoading] = useState(true)

    function handleImageLoaded() {
        setImgLoading(false)
    }
//TODO להשתמש בקלאודינארי בכדי להנחיל שימוש נכון בתמונות 
    return (
        <div  className="image-cmp">
            {isImgLoading && <div className="skeleton-loader"></div>}
            <img
                src={imgSrc}
                alt={imgTitle}
                title={imgTitle}
                onLoad={handleImageLoaded}
                className={isImgLoading ? '' : 'loaded'}
            />
        </div>
    )
}
