import React,{useState} from 'react';
import "./Login.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLaptop, faShoppingBasket, faBriefcase, faKey } from '@fortawesome/free-solid-svg-icons'
import {  faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { Link,useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../../actions/user_action';






function Login() {
    const dispatch = useDispatch();
    const history = useHistory()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

     
    
    const fetchData = (event) => {
        if(!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            return;
        }
       
       
        fetch("/signin",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email, password
                
            })
        })
        .then(res=>res.json())
        .then(data=>{
            if(!data.loginSuccess){
                console.log("sdasd")
            }
            else{
                console.log(data.user)
                dispatch(loginUser(data.user));
                localStorage.setItem("jwt",data.token);
                localStorage.setItem("userInfo",JSON.stringify(data.user));

                history.push('/');
            }
        })
        .catch(err=>{
            console.log(err)
        })
    }
    return (
        <div className="container-login">
            <video autoPlay muted loop className="container-video">
                <source src="https://dm0qx8t0i9gc9.cloudfront.net/watermarks/video/EyvF0jkPg/videoblocks-view-inside-the-window-on-beautiful-woman-using-the-laptop-in-evening-female-closing-the-computer-and-leaving-the-cafe_h8ud_lngpb__5718036f1020f41908be84d8eb3291ba__P360.mp4"></source>
            </video>
            <div className="container-content">
                <div className="container-info">
                    <h2>Join the club</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus.</p>
                    <ul>
                        <li>
                            <div className="icon-wrapper"><FontAwesomeIcon icon={faLaptop} /></div>
                            <div className="iconbox-info">
                                <h3>Community</h3>
                                <p>At vero eos et accusamus et.</p>
                            </div>
                        </li>
                        <li>
                            <div className="icon-wrapper"><FontAwesomeIcon icon={faShoppingBasket} /></div>      
                            <div className="iconbox-info">        
                                <h3>Online shop</h3>
                                <p>At vero eos et accusamus et.</p>
                            </div>
                        </li>
                        <li>
                            <div className="icon-wrapper"><FontAwesomeIcon icon={faBriefcase} /></div>       
                            <div className="iconbox-info">
                                <h3>Job search</h3>
                                <p>At vero eos et accusamus et.</p>
                            </div>
                        </li>
                    </ul>
                </div>         
                    <div className="container-form">
                        <img alt="Logo form" src="https://mythemestore.com/beehive-preview/wp-content/uploads/2020/07/logo-icon.svg"></img>
                        <h2>Welcome</h2>
                        <p>Join gazillions of people online</p>
                        <div className="input-container">
                            <span><FontAwesomeIcon icon={faEnvelope}/></span>
                            <input id="email" type="email" placeholder="Enter Email" name="email" onChange={(e)=>setEmail(e.target.value)} required />
                        </div>
                        <div className="input-container">
                            <span><FontAwesomeIcon icon={faKey}/></span>
                            <input id="password" type="password" placeholder="Enter Password" name="password" onChange={(e)=>setPassword(e.target.value)} required />
                        </div>
                        <a href="/forgot">Forgot password</a>
                        <button className="form-btn" onClick={()=>fetchData()} type="button">Login</button>
                        <div className="form-signup">Don't have an account? <Link to="/signup" >Sign up</Link></div>  
                    </div>      
            </div>
            <div className="container-bgoverlap"></div>
            
        </div>
    )
}

export default Login
