import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera,faPoll } from '@fortawesome/free-solid-svg-icons';
import { faFileAlt,faImage } from '@fortawesome/free-regular-svg-icons';
import "./CreatePost.css";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import axios from 'axios';






function CreatePost() {
    const [body,setBody] = useState('');
    const [style, setStyle] = useState(null);
    const [images,setImages] = useState(null);
    const [url,setUrl] = useState(null);
    const formData = new FormData();
    let info = JSON.parse(localStorage.getItem("userInfo")); //get data my info from localstorage


    useEffect(()=>{
        
        if(url){
            axios.post("/createpost",{body:body,pic:url},{
                headers: {
                    "Content-Type":"application/json",
                     "Authorization":"Bearer "+localStorage.getItem("jwt")
                }
            })
            .then(res=>{
                
            })
            .catch(err=>{
                console.error(err);
            })
            setBody('');
            setImages(null);
        }
    },[url])
    const postDetails = () => {
        formData.append("file",images);
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
    const onChangeUpload = (e) => {
        setImages(e.target.files[0]);
     
    }
    const handleFocus = () =>{
            setStyle({top:"7px",fontSize:"11px"})
    }
    const handleBlur = () => {
            setStyle(null)
    }
  
    return (
            <div className="post">
                <div className="post-nav">
                    <Tabs defaultIndex={0} onSelect={index=>console.log(index)}>
                        <TabList>
                            <Tab>
                                <div className="post-nav-item" > 
                                    <FontAwesomeIcon className="post-icon" icon={faFileAlt}></FontAwesomeIcon><span>Status</span>
                                </div>
                            </Tab>
                            <Tab>
                                <div className="post-nav-item" >
                                    <FontAwesomeIcon className="post-icon" icon={faImage}></FontAwesomeIcon><span>Multimedia</span>
                                </div>
                            </Tab>
                            <Tab>
                                <div className="post-nav-item" >
                                    <FontAwesomeIcon className="post-icon" icon={faPoll}></FontAwesomeIcon><span>Poll</span>
                                </div> 
                            </Tab>
                        </TabList>
                        <TabPanel>
                        </TabPanel>
                        <TabPanel>
                        </TabPanel>
                        <TabPanel>
                        </TabPanel>
                    </Tabs>
                </div>
                <div className="post-form">
                    <div className="form-avt">
                        <img alt="avt" src={info.avatar}></img>
                    </div>
                    <label style={style}>Share what you are thing here...</label>
                    <textarea onFocus={handleFocus} onBlur={handleBlur} value={body} onChange={(e)=>setBody(e.target.value)} spellCheck="false"></textarea>
                    {images && <img alt="preview" className="form-preview" src={URL.createObjectURL(images)}></img>}
                    
                </div>
                <div className="post-option">
                    <span><FontAwesomeIcon icon={faCamera}></FontAwesomeIcon></span>
                    <input className="custom-file-input" type="file" id="myFile" name="filename" onChange={(e)=>{onChangeUpload(e)}} multiple/>
                    <button className="post-btn" type="submit" onClick={()=>postDetails()}>Post status</button>
                </div>
        </div>
    )
}

export default CreatePost
