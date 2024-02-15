import React, { useRef, useState } from 'react'
import "./login.css"
import {Room,Cancel} from "@material-ui/icons"
import axios from 'axios';
const Login = ({setShowLogin,myStorage,setCurrentUser}) => {

  const[failure,setFailure]=useState(false);
  const nameRef=useRef();
  const passwordRef=useRef();
  const handleSubmit=async(e)=>{
    e.preventDefault();
    const user={
      username:nameRef.current.value,
      password:passwordRef.current.value
    }
    try{
      const res=await axios.post("http://localhost:8080/api/users/login",user);
      console.log(res)
      try{

        myStorage.setItem("user",res.data.username)
      }catch(err){
        console.log(err);
      }
      setCurrentUser(res.data.username)
      setShowLogin(false)
      setFailure(false)
      }
    catch(err){
      setFailure(true)
    }
  }
  return (
    <div className='login'>
      <div className="loginContainer">
      <div className='logo'>
        <div className='logoinside'>
        <Room/><div> MapPin</div>
         
          </div>
        </div>
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Username" ref={nameRef}/>
            <input type="password" placeholder='Password' ref={passwordRef}/>
            <button className='loginBtn' type='submit'>Login</button>
            {failure && <span className='failure'>Wrong username or password!</span>}
        </form>
        <Cancel className='cancelBtn' onClick={()=>{setShowLogin(false)}}/>
      </div>
    </div>
  )
}

export default Login;