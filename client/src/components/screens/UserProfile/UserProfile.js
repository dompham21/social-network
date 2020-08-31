import React,{useEffect,useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { faShareSquare,faHeart,faComment } from '@fortawesome/free-regular-svg-icons';
import { faEllipsisH,faTrashAlt,faCamera} from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { showFollow } from '../../../actions/user_action';
import { Upload } from 'antd';
import 'antd/dist/antd.css';
import ImgCrop from 'antd-img-crop';
import { Drawer, Button} from 'antd';



function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

function UserProfile() {
    const show = useSelector(state => state.user.show)
    const dispatch = useDispatch()
    const [userProfile,setProfile] = useState([])
    const [userInfo,setUserInfo] = useState({following:0,followers:0});
    const [rows,setRows] = useState(1);
    const [value,setValue] = useState('');
    const {userid} = useParams();
    const info = JSON.parse(localStorage.getItem("userInfo"));
    const [imageUrl, setImageUrl] = useState(null);
    const [visible,setVisible] = useState(false);
    const [url,setUrl] = useState('');


    const showDrawer = () => {
        setVisible(true);
      };
    
    const  onClose = () => {
        setVisible(false)
      };
    
    useEffect(() => {
        axios.get(`/user/${userid}`,{
            headers: {
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res=>{
            setProfile(res.data.posts);

            setUserInfo(res.data.user)
        })
    },[])

    const followUser = () => {
        axios.put('/follow',{followId:userid},{
            headers: {
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res=>{
            localStorage.setItem("userFollow",JSON.stringify(res.data));
            setUserInfo((preState)=>{
                return {
                    ...preState,followers:[...preState.followers,res.data._id]                }
            })            
        })
        dispatch(showFollow());
    }
    
    const unfollowUser = () => {
        axios.put('/unfollow',{unfollowId:userid},{
            headers: {
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res=>{
            localStorage.setItem("userFollow",JSON.stringify(res.data));
            setUserInfo((preState)=>{
                const newFollowers = preState.followers.filter(item=>item!==res.data._id)
                return {
                    ...preState,followers:newFollowers                }
            })            
        })
        dispatch(showFollow());
    }
    console.log(userInfo)
    console.log(userProfile)

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

    const conditionFollow = () => {
        
        if(userid === info._id){
            return;
        }
        else if(show){
            return( <a  onClick={()=>followUser()}>Follow us</a>)
        }
        else{
            return   (<a onClick={()=>unfollowUser()}>Unfollow</a>)
        }
    }


    const  handleChange = info => {
        if (info.file.status === 'done') {
          // Get this url from response in real world.
          getBase64(info.file.originFileObj, imageUrl =>
            setImageUrl(imageUrl),
          );
        }
      };
    
    const onPreview = async (file) => {
        let src = file.url;
        if (!src) {
          src = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file.originFileObj);
            reader.onload = () => resolve(reader.result);
          });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow.document.write(image.outerHTML);
    };

    const postAvatar = () => {
        const formData = new FormData();
        formData.append("file",imageUrl);
        formData.append("upload_preset","social");
        formData.append("cloud_name","dmriwkfll");

        axios.post('https://api.cloudinary.com/v1_1/dmriwkfll/image/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
        })
        .then(res => {
            setUrl(res.data.url);
            console.log(res.data);
        }).catch(err => {
            console.error({err});
        });
    
    }

    useEffect(()=>{
        
        if(url){
            axios.put("/avatar",{imageUrl:url},{
                headers: {
                    "Content-Type":"application/json",
                     "Authorization":"Bearer "+localStorage.getItem("jwt")
                }
            })
            .then(res=>{
                console.log(res);
            })
            .catch(err=>{
                console.error(err);
            })
            
            setVisible(false);
        }
       
    },[url])

    const uploadButton = (
        <div>
          <div className="ant-upload-text">Upload</div>
        </div>
      );

    return (
        <div className="profile">
            <Drawer
                title="Update Profile Picture"
                width={720}
                onClose={onClose}
                visible={visible}
                bodyStyle={{ paddingBottom: 80,paddingTop:100,alignSelf: "center" }}
                footer={
                    <div
                    style={{
                        textAlign: 'right',
                    }}
                    >
                    
                        <Button onClick={onClose} style={{ marginRight: 8 }}>
                            Cancel
                        </Button>
                        <Button  onClick={()=>postAvatar()} type="primary">
                            Submit
                        </Button>
                    </div>
                }
            >
                 <ImgCrop grid>
                <Upload
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    listType="picture-card"
                    showUploadList={false}
                    onChange={handleChange}
                    onPreview={onPreview}
                >
                    {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                </Upload>
            </ImgCrop>
            </Drawer>
            <div className="profile-header">
                <div className="header-thumb">
                    <img alt="cover" src="https://www.pixel4k.com/wp-content/uploads/2018/10/small-memory-4k_1540749683.jpg"></img>
                </div>
                <div className="header-author">
                    <a  className="author-thumb">
                        <img alt="avt" src={userInfo.avatar} ></img>
                        {(userid===info._id)&& <span onClick={showDrawer}><FontAwesomeIcon icon={faCamera}></FontAwesomeIcon></span>}
                    </a>
                    <div className="author-content">
                        <a className="author-name">{userInfo.name}</a>
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
                        <li> 
                            {conditionFollow()}
                        </li>
                        <li>{userid!==info._id?<a >Message</a>:<></>}</li>
                        <li className="dropdown">
                            <button className="dropdown-btn"><FontAwesomeIcon icon={faEllipsisH}></FontAwesomeIcon></button>
                            <div className="dropdown-content">
                                <a >Report profile</a>
                            </div>
                        </li>
                    </ul>
                </div>
                
            </div>
            <div className="profile-container">

                <div className="profile-container_left">
                    <div className="profile-info">
                        <h2>Intro</h2>
                        <div>
                            <h3>About me:</h3>
                            <p>Hi, I’m James, I’m 36 and I work as a Digital Designer for the “Daydreams” Agency in Pier 56.</p>
                        </div>
                        <div>
                            <h3>Study:</h3>
                            <p>Công Nghệ Thông Tin (IT) at Học viện Công nghệ Bưu chính Viễn thông cơ sở tại TP.HCM</p>
                        </div>
                        <div>
                            <h3>Live:</h3>
                            <p>Gia Lai, Vietnam</p>
                        </div>
                        <div>
                            <h3>Favourite TV Shows:</h3>
                            <p>Breaking Good, RedDevil, People of Interest, The Running Dead, Found, American Guy.</p>
                        </div>
                       
                        <a className="profile-edit_details">Edit Details</a>
                        
                    </div>
                    <div className="profile-follow">
                        <h2>Following: <span>{userInfo.following.length}</span></h2>
                        <div className="profile-follow_card">
                            <div className="profile-follow_item">
                                <img src="https://www.takadada.com/wp-content/uploads/2019/07/avatar-anime-name-cho-facebook-1.jpg"></img>
                                <p>Dom Pham</p>
                            </div>
                            <div className="profile-follow_item">
                                <img src="https://www.takadada.com/wp-content/uploads/2019/07/avatar-anime-name-cho-facebook-1.jpg"></img>
                                <p>Dom Pham</p>
                            </div>
                            <div className="profile-follow_item">
                                <img src="https://www.takadada.com/wp-content/uploads/2019/07/avatar-anime-name-cho-facebook-1.jpg"></img>
                                <p>Dom Pham</p>
                            </div>
                        </div>
                        
                        <h2>Follower: <span>{userInfo.followers.length}</span></h2>
                        <div className="profile-follow_card">
                            <div className="profile-follow_item">
                                <img src="https://www.takadada.com/wp-content/uploads/2019/07/avatar-anime-name-cho-facebook-1.jpg"></img>
                                <p>Dom Pham</p>
                            </div>
                            <div className="profile-follow_item">
                                <img src="https://www.takadada.com/wp-content/uploads/2019/07/avatar-anime-name-cho-facebook-1.jpg"></img>
                                <p>Dom Pham</p>
                            </div>
                            <div className="profile-follow_item">
                                <img src="https://www.takadada.com/wp-content/uploads/2019/07/avatar-anime-name-cho-facebook-1.jpg"></img>
                                <p>Dom Pham</p>
                            </div>
                        </div>
                    </div>
                </div>
               
                <div className="profile-content">
                    { userProfile.map((item,index)=>{
                        return (
                            <div className="home-card" key={index}>
                                <div className="card-author">
                                    <img alt="avt" src={item.postBy.avatar}></img>
                                    <div className="card-author_info">
                                        <Link to={`/profile/${item.postBy._id}`}>{item.postBy.name}</Link>                                
                                        <time >{ moment(item.date).fromNow()}</time>
                                    </div>
                                    {
                                        item.postBy._id ===localStorage.getItem('user') && 
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
                                    <img alt="" avt="photo" src={item.photo}></img>
                                </div>
                                <div className="card-option">
                                    <a className="card-action likes" onClick={()=>handleLikePost(item._id)}>
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
                                                    <img alt="avt" src={record.postBy.avatar}></img>
                                                </div>
                                                <div className="comment-list_text">
                                                    <a >{item.postBy.name}</a>
                                                    <p>{record.text}</p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                    <div className="comment-post">
                                        <div className="commnet-author">
                                            <img alt="avt" src={userInfo.avatar}></img>
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
            
        </div>
        
    )
}

export default UserProfile
