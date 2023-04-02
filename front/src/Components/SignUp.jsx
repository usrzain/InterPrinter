import React from 'react'
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom"
import Login from './Login';


const SignUp = () => {

    let navigate =  useNavigate()

    const [signUp, setSignUp ] = useState({
        name:'',
        email:'',
        password:''
    })

    const handleChange = (event)=>{
        const { name, value } = event.target;
        setSignUp({ ...signUp, [name]: value });
    }

    const handleSubmit =  (event)=>{
        event.preventDefault()
        axios.post('http://localhost:3001/sign-up', signUp)
         .then((res)=>{
           if(res.status === 201 ){
          const data =  {name: signUp.name, email: signUp.email }
           navigate('/login')
           }
         })
    }

    





  return (
    <div className='text-xl border-blue-900 border-2 py-4 text-center flex justify-center h-screen items-center'>
       <form className='text-sm flex flex-col w-1/2 ' onSubmit={handleSubmit}>
           <input type="text" name="name" id="" className='border-2 my-4 ' placeholder='Enter Name ' value={signUp.name} onChange={handleChange} />
            
           <input type="email" name="email" id="" className='border-2 my-4 '
            placeholder='Enter Email' value={signUp.email} onChange={handleChange}/>

            <input type="text" name="password" id="myInput" className='border-2 my-4' placeholder='Type Password ' value={signUp.password} onChange={handleChange}/>

            <button type='submit'  className='p-2 bg-blue-800 '>SignUp</button>

       </form>

       <button> <a href='/login'> Login </a>  </button>
    </div>
  )
}

export default SignUp