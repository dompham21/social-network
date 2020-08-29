import React,{useState,useEffect} from 'react'
import CreatePost from '../CreatePost/CreatePost';
import "./Home.css";
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShareSquare,faHeart,faComment } from '@fortawesome/free-regular-svg-icons';
import { faEllipsisH,faTrashAlt} from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { colorLikeAction } from '../../../actions/post_action'

  
function Home() {
    const [data,setData] = useState([]);
    const [rows,setRows] = useState(1);
    const [value,setValue] = useState('');
    let info = JSON.parse(localStorage.getItem("userInfo"));



    

    useEffect(()=>{
        axios.get('/allpost',{
            headers: {
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res=>{
            console.log(res.data.posts);
            setData(res.data.posts);
        })
        .catch(err=>{
            console.error(err);
        })

    },[data])
    
    const handleLikePost = (id) => {
        data.forEach(item=>{
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
                        const newData = data.map(item=>{
                            if(item._id===res.data._id){
                                return res.data;
                            }
                            else{
                                return item;
                            }
                            
                        })
                        setData(newData);
        
                    })
                    .catch(err=>{
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
                        const newData = data.map(item=>{
                            if(item._id===res.data._id){
                                return res.data;
                            }
                            else{
                                return item;
                            }
                            
                        })
                        setData(newData);
        
                    })
                    .catch(err=>{
                        console.error(err);
                    })  
                    
                }

                
            }
        })
       
            
        
    }

    const handleSubmit = (postId,text) => {
        console.log(text,postId)

        axios.put('/comment',{postId:postId,text:text},{
            headers: {
                "Content-Type":"application/json",  
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res=>{
            console.log(res.data);
            const newData = data.map(item=>{
                if(item._id===res.data._id){
                    return res.data;
                }
                else{
                    return item;
                }
                
            })
            setData(newData);
            console.log(data);
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
            console.log(res.data._id)
            const newData = data.filter(item=>{
                console.log(item._id)
                return item._id!==res.data._id
            })
            setData(newData);
            console.log(data);
        })
    }


    return (
        <div className="home-container">
            <CreatePost></CreatePost>
            <div className="home-container_post">
                { data.map((item,index)=>{
                    return (
                        <div className="home-card" key={index}>
                            <div className="card-author">
                                <img alt="avt" src="https://www.takadada.com/wp-content/uploads/2019/07/avatar-anime-name-cho-facebook-1.jpg"></img>
                                <div className="card-author_info">
                                    <a href={`/profile/${item.postBy._id}`}>{item.postBy.name}</a>
                                    <time >{ moment(item.date).fromNow()}</time>
                                </div>
                                {
                                    item.postBy._id === info._id && 
                                        <div className="post-btn_dropdown">
                                            <a ><FontAwesomeIcon icon={faEllipsisH} /></a>
                                            <div className="post-dropdown_content">
                                                <a  onClick={()=>deletePost(item._id)}>
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
                                <a  className="card-action likes" onClick={()=>handleLikePost(item._id)}>
                                    <FontAwesomeIcon icon={faHeart}></FontAwesomeIcon>
                                    <span>{item.like.length} Likes</span>
                                </a>
                                <a  className="card-action comments" >
                                    <FontAwesomeIcon icon={faComment}></FontAwesomeIcon>
                                    <span>0 Comments</span>
                                </a>
                                <a  className="card-action shares">
                                    <FontAwesomeIcon icon={faShareSquare}></FontAwesomeIcon>
                                    <span>0 Shares</span>
                                </a> 
                            </div>
                            <div className="comment">
                                {item.comment.map((record,index)=>{
                                    return (
                                        <div className="comment-list" key={index}>
                                            <div className="commnet-author">
                                                <img alt="avt" src="https://www.takadada.com/wp-content/uploads/2019/07/avatar-anime-name-cho-facebook-1.jpg"></img>
                                            </div>
                                            <div className="comment-list_text">
                                                <a>{record.postBy.name}</a>
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
        </div>
    )
}

export default Home
