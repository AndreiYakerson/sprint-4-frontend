import { Link } from "react-router-dom";
import { SvgIcon } from "../SvgIcon";

export function VideoLama(props) {
    return (
        <section className="video-lama">

            <div className="text-box-container">
                <div className="video-text">The work platform your <br />team will love to use</div>

                <div className="video-btns flex">
                    <Link to="/board" className='btn get-started-btn'>
                        <span>
                            Get Started
                        </span>
                        <SvgIcon iconName="arrowRight" size={12} colorName="currentColor" />
                    </Link>

                    <button className="sales-btn">Contact Sales</button>
                </div>
            </div>

            <video
                className="hp-closer-video"
                width="100%"
                height="100%"
                playsInline
                muted
                loop
                autoPlay
                poster="https://dapulse-res.cloudinary.com/video/upload/v1756978287/Generator_featured%20images/hp-2025/closer/_Closer_w_llama_no_texts.jpg"
            >
                <source
                    src="https://dapulse-res.cloudinary.com/video/upload/v1756978287/Generator_featured%20images/hp-2025/closer/_Closer_w_llama_no_texts.mp4"
                    type="video/mp4"
                />
                <source
                    src="https://dapulse-res.cloudinary.com/video/upload/v1756978287/Generator_featured%20images/hp-2025/closer/_Closer_w_llama_no_texts.webm"
                    type="video/webm"
                />
            </video>
        </section>
    )
}