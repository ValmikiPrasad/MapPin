import React, { useRef, useState } from 'react'
import "./register.css"
import {Room,Cancel} from "@material-ui/icons"
import axios from 'axios';
const Register = ({setShowRegister}) => {

  const[success,setSuccess]=useState(false);
  const[failure,setFailure]=useState(false);
  const nameRef=useRef();
  const emailRef=useRef();
  const passwordRef=useRef();
  const handleSubmit=async(e)=>{
    e.preventDefault();
    const newUser={
      username:nameRef.current.value,
      email:emailRef.current.value,
      password:passwordRef.current.value
    }
    try{
      await axios.post("http://localhost:8080/api/users/register",newUser);
      setFailure(false)
      setSuccess(true)
    }catch(err){
      setFailure(true)
      console.log(err)
    }
  }
  return (
    <div className='register'>
      <div className='registerContainer'>
      <div className='logo'>
        <div className='logoinside'>
        <Room/><div> MapPin</div>
         
          </div>
        </div>
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Username" ref={nameRef}/>
            <input type="text" placeholder='Email' ref={emailRef}/>
            <input type="password" placeholder='password' ref={passwordRef}/>
            <button className='registerBtn'>Register</button>
            {success && <span className='success'>Successfull.You can login Now!</span>}
            {failure && <span className='failure'>Somthing went Wrong!</span>}
            
        </form>
        <Cancel className='registerCancel' onClick={()=>{setShowRegister(false)}}/>
      </div>
        
    </div>
  )
}

export default Register