import { Link } from "react-router-dom";
import defaultAvatar from '/img/default-avatar.png'

export function MiniUser({ user }) {
    return <div className="mini-user">

        <div className="avatar-logo-container">
            <img className='avatar-logo' src="/img/logo.png" alt="logo" />
        </div>


        <img className="avatar-img" src={defaultAvatar} />

        {/* <Link to={`user/${user._id}`}>
            <img className="avatar-img" src={user?.imgUrl ? user.imgUrl : defaultAvatar} />
        </Link> */}

    </div>
}