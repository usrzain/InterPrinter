import React, {useState} from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const Login = () => {

  
  const navigate = useNavigate();
  const [ loginData, setLoginData ] = useState({
    email:'',
    password:''
  });

  const handleChange = (e)=>{
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  }

  const handleSubmit =  (event)=>{
    event.preventDefault()
    axios.post('http://localhost:3001/login', loginData)
     .then((res)=>{
      console.log(res.status)
       if(res.status === 200 ){
       
        const { ID, ADMIN_EMAIL } = res.data
          if(ADMIN_EMAIL === null ){
              navigate(`/accounts/${ID}`, {
                state:{
                  USR_ID : ID
                }
              });
          }else{
            navigate('/accounts/admin', {
              state:{
                USR_ID : ID
              }
            });
          }


       }
     })
}


  return (
    <div className='text-xl border-blue-900 border-2 py-4 text-center flex justify-center h-screen items-center'>
       <form className='text-sm flex flex-col w-1/2 ' onSubmit={handleSubmit}>
            <input type="email" name="email" id="" placeholder='Enter E mail' value={loginData.email} className='border-2 my-4 ' onChange={handleChange} />
            <input type="password" name="password" id="" placeholder='Enter password' value={loginData.password} className='border-2 my-4 ' onChange={handleChange} />


            <button type='submit'  className='p-2 bg-blue-800 '>Login</button>
       </form>
      
    </div>
  )
}

export default Login