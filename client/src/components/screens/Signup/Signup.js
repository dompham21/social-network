import React,{useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey } from '@fortawesome/free-solid-svg-icons'
import { faUser, faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { Link ,useHistory} from 'react-router-dom';
import './Signup.css';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'
import titleCase from '../../../util';


function Signup() {
    const history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const slideImages =[
        "https://mythemestore.com/beehive-preview/wp-content/uploads/2020/01/slide-1.jpg",
        "https://mythemestore.com/beehive-preview/wp-content/uploads/2020/01/slide-2.jpg",
        "https://mythemestore.com/beehive-preview/wp-content/uploads/2020/01/slide-3.jpg",
        "https://mythemestore.com/beehive-preview/wp-content/uploads/2020/01/slide-4.jpg"
    ];
   
    const fetchData = (event) => {

        if(!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){

            return;
        }
        const upperName = titleCase(name);
        console.log(upperName)

        fetch("/signup",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name:upperName,email, password
                
            })
        })
        .then(res=>res.json())
        .then(data=>{
            console.log(data);
            if(data.error){
                console.log(data.error)
            }
            else{
                history.push('/login')
            }
        })
        .catch(err=>{
            console.log(err)
        })
    }

    


    return (
        <div className="container-signup">
            <div className="signup-left">
                        <div className="signup-form">
                                <img alt="Logo form" src="https://mythemestore.com/beehive-preview/wp-content/uploads/2020/07/logo-icon.svg"></img>
                                <h2>Welcome</h2>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                                <div className="input-container">
                                    <span><FontAwesomeIcon icon={faUser}/></span>
                                    <input id="name" type="text" placeholder="Enter Name" name="name"  onChange={(e)=>setName(e.target.value)} required />
                                </div>
                                <div className="input-container">
                                    <span><FontAwesomeIcon icon={faEnvelope}/></span>
                                    <input id="email" type="email" placeholder="Enter Email" name="email" onChange={(e)=>setEmail(e.target.value)} required />
                                </div>
                                <div className="input-container">
                                    <span><FontAwesomeIcon icon={faKey}/></span>
                                    <input id="password" type="password" placeholder="Enter Password" name="password"  onChange={(e)=>setPassword(e.target.value)} required />
                                </div>
                                <button className="form-btn"  type="button" onClick={()=>fetchData()} >Sign up</button>
                                <div className="form-login">Have an account? <Link to="/login" >Log in</Link></div>
                        </div>
 
            </div>
            <div className="signup-right"> 
                <Slide arrows={false} autoplay={true} transitionDuration={900} duration={3000} pauseOnHover={false}>
                    <div className="signup-swiper" style={{'backgroundImage': `url(${slideImages[0]})`}}>
                        <div className="signup-content">
                            <h3>Join the club</h3>
                            <h2>Join gazillions of people</h2>
                            <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti.</p>
                            <a href="/#">Register</a>
                        </div>
                    </div>
                    <div className="signup-swiper" style={{'backgroundImage': `url(${slideImages[1]})`}}>
                        <div className="signup-content">
                            <h3>Shop online</h3>
                            <h2>Shopping made easy</h2>
                            <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti.</p>
                            <a href="/#">Buy products</a>
                        </div>
                    </div>
                    <div className="signup-swiper" style={{'backgroundImage': `url(${slideImages[2]})`}}>
                        <div className="signup-content">
                            <h3>Search jobs</h3>
                            <h2>From top companies</h2>
                            <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti.</p>
                            <a href="/#">Search jobs</a>
                        </div>
                    </div>
                    <div className="signup-swiper" style={{'backgroundImage': `url(${slideImages[3]})`}}>
                        <div className="signup-content">
                            <h3>Buy and sell</h3>
                            <h2>Buy and sell confidently</h2>
                            <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti.</p>
                            <a href="/#">Classifieds</a>
                        </div> 
                    </div>
                </Slide>
            </div>
           
        </div>
    )
}

export default Signup

