import { useState } from 'react'
import SignUp from './Components/SignUp'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './Components/Login';
import User from './Components/User';

import AdminAU from './Components/AdminAU';

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
       
          <Route path="/"element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/accounts/:ID" element={<User />} />
          <Route path="/accounts/admin" element={<AdminAU />} />
          
     
      </Routes>
    </BrowserRouter>
    
          
     
   
   
  )
}

export default App
