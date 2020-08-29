import React,{useEffect,useState} from 'react'
import './Profile.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { faShareSquare,faHeart,faComment } from '@fortawesome/free-regular-svg-icons';
import { faEllipsisH,faTrashAlt} from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
const info = JSON.parse(localStorage.getItem("userInfo"))



function Profile() {
    const [userProfile,setProfile] = useState([])
    const [rows,setRows] = useState(1);
    const [value,setValue] = useState('');


    useEffect(() => {
        axios.get('/mypost',{
            headers: {
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res=>{
            console.log(res.data.mypost);
            setProfile(res.data.mypost);

        })
    },[])
    
    const handleLikePost = (id) => {
        userProfile.forEach(item=>{
            if(item._id===id){
                let infoIdUser = info._id;
                let match = item.like.indexOf(infoIdUser)
                if(match===-1){
                    axios.put('/like',{postId:id},{
                        headers: {
                            "Content-Type":"application/json",
                            "Authorization":"Bearer "+localStorage.getItem("jwt")
                        }
                    })
                    .then(res=>{  
                        const newData = userProfile.map(item=>{
                            if(item._id===res.data._id){
                                return res.data;
                            }
                            else{
                                return item;
                            }
                            
                        })
                        setProfile(newData);        
                    })
                    .catch(err=>{
                        console.error(err);
                    })  
                }
                else {
                    axios.put('/unlike',{postId:id},{
                        headers: {
                            "Content-Type":"application/json",
                            "Authorization":"Bearer "+localStorage.getItem("jwt")
                        }
                    })
                    .then(res=>{                       
                        const newData = userProfile.map(item=>{
                            if(item._id===res.data._id){
                                return res.data;
                            }
                            else{
                                return item;
                            }                        
                        })
                        setProfile(newData);  
                    })
                    .catch(err=>{
                        console.error(err);
                    })                     
                }       
            }
        })
       
            
        
    }

    const handleSubmit = (postId,text) => {

        axios.put('/comment',{postId:postId,text:text},{
            headers: {
                "Content-Type":"application/json",  
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res=>{
            const newData = userProfile.map(item=>{
                if(item._id===res.data._id){
                    return res.data;
                }
                else{
                    return item;
                }
                
            })
            setProfile(newData);
        })
        .catch(err=>{
            console.error(err);
        })
    };

    const handleChangeRow = (e) => {
        const textareaLineHeight = 24;
        const previousRows = e.target.rows;
        e.target.rows = 1; //reset number rows
        const currentRows = ~~(e.target.scrollHeight / textareaLineHeight);
        if (currentRows === previousRows) {
            e.target.rows = currentRows;
        }
        if (currentRows >= 18) {
			e.target.rows = 18;
			e.target.scrollTop = e.target.scrollHeight;
		}
        setRows(currentRows<18?currentRows:18)
    }

    const deletePost = (postId) =>{
        axios.delete(`/deletepost/${postId}`,{
            headers: {
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res=>{
            const newData = userProfile.filter(item=>{
                return item._id!==res.data._id
            })
            setProfile(newData);
        })
    }
    return (
        <div className="profile">
            <div className="profile-header">
                <div className="header-thumb">
                    <img alt="cover" src="https://www.pixel4k.com/wp-content/uploads/2018/10/small-memory-4k_1540749683.jpg"></img>
                </div>
                <div className="header-author">
                    <a className="author-thumb">
                        <img alt="avt" src="https://www.takadada.com/wp-content/uploads/2019/07/avatar-anime-name-cho-facebook-1.jpg"></img>
                    </a>
                    <div className="author-content">
                        <a className="author-name">{info.name}</a>
                        <div className="author-info">San Francisco, CA</div>
                    </div>
                </div>
                <div className="header-section">
                    <ul className="section-left">
                        <li><a >Timeline</a></li>
                        <li><a >About</a></li>
                        <li><a >Friends</a></li>
                    </ul>
                    <ul className="section-right">
                        <li><a >Photo</a></li>
                        <li><a >Article</a></li>
                        <li className="dropdown">
                            <button className="dropdown-btn"><FontAwesomeIcon icon={faEllipsisH}></FontAwesomeIcon></button>
                            <div className="dropdown-content">
                                <a >Report profile</a>
                                <a >Block profile</a>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            { userProfile.map((item,index)=>{
                return (
                    <div className="home-card" key={index}>
                        <div className="card-author">
                            <img alt="avt" src="https://www.takadada.com/wp-content/uploads/2019/07/avatar-anime-name-cho-facebook-1.jpg"></img>
                            <div className="card-author_info">
                                <a href="/profile">{item.postBy.name}</a>
                                <time >{ moment(item.date).fromNow()}</time>
                            </div>
                            {
                                item.postBy._id ===localStorage.getItem('user') && 
                                    <div className="post-btn_dropdown">
                                        <a href="/#"><FontAwesomeIcon icon={faEllipsisH} /></a>
                                        <div className="post-dropdown_content">
                                            <a href="/#" onClick={()=>deletePost(item._id)}>
                                                <FontAwesomeIcon icon={faTrashAlt} />
                                                <span>Delete post</span>
                                            </a>                                    
                                        </div>
                                    </div>
                            }
                         
                        </div>
                        <p>{item.body}</p>
                        <div className="card-media">
                            <img alt="" src={item.photo}></img>
                        </div>
                        <div className="card-option">
                            <a href="/#" className="card-action likes" onClick={()=>handleLikePost(item._id)}>
                                <FontAwesomeIcon icon={faHeart}></FontAwesomeIcon>
                                <span>{item.like.length} Likes</span>
                            </a>
                            <a href="/#" className="card-action comments" >
                                <FontAwesomeIcon icon={faComment}></FontAwesomeIcon>
                                <span>0 Comments</span>
                            </a>
                            <a href="/#" className="card-action shares">
                                <FontAwesomeIcon icon={faShareSquare}></FontAwesomeIcon>
                                <span>0 Shares</span>
                            </a> 
                        </div>
                        <div className="comment">
                            {item.comment.map(record=>{
                                return (
                                    <div className="comment-list">
                                        <div className="commnet-author">
                                            <img alt="avt" src="https://www.takadada.com/wp-content/uploads/2019/07/avatar-anime-name-cho-facebook-1.jpg"></img>
                                        </div>
                                        <div className="comment-list_text">
                                            <a href="/#">{item.postBy.name}</a>
                                            <p>{record.text}</p>
                                        </div>
                                    </div>
                                )
                            })}
                            <div className="comment-post">
                                <div className="commnet-author">
                                    <img alt="avt" src="https://www.takadada.com/wp-content/uploads/2019/07/avatar-anime-name-cho-facebook-1.jpg"></img>
                                </div>
                                <form className="comment-form"
                                    onKeyPress={(e)=>{
                                        if(e.key==="Enter"){
                                            setValue('');
                                            e.preventDefault()
                                            handleSubmit(item._id,value)
                                        }
                                    }}
                                    onChange={(e)=>{setValue(e.target.value)}}
                                >
                                    <textarea 
                                        value={value}
                                        rows={rows} 
                                        className="comment-text" 
                                        spellCheck="false" 
                                        placeholder="Write a comment..."
                                        onChange={handleChangeRow}
                                    />
                                </form>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
        
    )
}

export default Profile
