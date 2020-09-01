import React,{useEffect} from 'react';
import "./App.css"
import {BrowserRouter,Route,Switch,useHistory} from 'react-router-dom'
import Home from './components/screens/Home/Home';
import Login from './components/screens/Login/Login';
import Signup from './components/screens/Signup/Signup';
import Profile from './components/screens/Profile/Profile';
import NavBar from './components/NavBar/Navbar';
import UserProfile from './components/screens/UserProfile/UserProfile';
const jwt = localStorage.getItem('jwt')



const Routing = ()=>{
  const history = useHistory()
  useEffect(()=>{
    if(jwt){
    }else{
           history.push('/login')
    }
  },[])
  return(
    <Switch>
      <Route exact path="/" >
        <NavBar/>
        <Home/>
      </Route>
      <Route path="/login">
        <Login/>
      </Route>
      <Route path="/signup">
        <Signup/>
      </Route>
      <Route exact path="/profile">
        <NavBar/>
        <Profile/>
      </Route> 
      <Route exact path="/profile/:userid">
        <NavBar/>
        <UserProfile/>
      </Route>
    </Switch>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routing />
    </BrowserRouter>
  );
}

export default App;