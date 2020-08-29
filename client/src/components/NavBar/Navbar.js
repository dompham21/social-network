import React from 'react';
import './Navbar.css';
import { Link, useHistory } from "react-router-dom";
import { faSignOutAlt,faSortDown,faCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../actions/user_action';



function Navbar() {
    const dispatch = useDispatch();
    const history = useHistory();

    const handleLogOut = () => {
        dispatch(logoutUser()); 
        localStorage.clear();
        history.push('/login');
        
    }

    const renderList = ()=> {
        const info = JSON.parse(localStorage.getItem("userInfo"))

        if(localStorage.getItem('jwt')){
            return [
                <li key="1" style={{marginTop:"3px"}}><Link to={`/profile/${info._id}`} >Profile</Link></li>,
                <li key="2" className="nav-dropdown" >
                    <a  href="/#" className="nav-dropdown_btn"><FontAwesomeIcon icon={faSortDown} /></a>
                    <div className="nav-dropdown_content">
                        <Link className="nav-author" to={`/profile/${info._id}`}>
                            <img alt="avt" src="https://www.takadada.com/wp-content/uploads/2019/07/avatar-anime-name-cho-facebook-1.jpg"></img>
                            <div className="nav-author_info">
                            <div className="nav-author_name">{info.name}</div>
                                <span>See your profile</span>
                            </div>
                        </Link>
                        <a href="/#"><FontAwesomeIcon icon={faCog}/><span>Setting & Privacy</span></a>
                        <a href="/#" onClick={()=>handleLogOut()}>
                            <FontAwesomeIcon icon={faSignOutAlt}/>
                            <span>Log Out</span>
                        </a>
                    </div>
                </li>
            ]
        }
        else {
            return [
                <li key="3"><Link to="/login">Login</Link></li>,
                <li key="4"><Link to="/signup" >Signup</Link></li> 
            ]
        }
    }

    return (
            <div className="nav-wrapper">
                <Link to="/"  className="nav-logo">Home</Link>
                <ul className="nav-item">
                    {renderList()}     
                </ul>
            </div>
    )
}

export default Navbar;
