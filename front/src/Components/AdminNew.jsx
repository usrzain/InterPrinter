import React, {useState , useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Admin_All_Files from './Admin_All_Files';
import NEW from './NEW';


const AdminNew = () => {
    const location = useLocation(); 
    const USER_ID  =  location.state.USR_ID;
    const [all_Users, setAllUsers ] = useState(null)
    const [each_User_Data, setEUsrData ] = useState(null)

    // -------------- MONGO DB REALAM 



   


   
   

       
                 
        
        
       
        

    
  return (
    <>

         {
        //    all_Users === null ?  <h1> loading.......</h1> : <div>  {all_Users.map((user, index) => (
        //                 <div key={index}>

        //                       <p>{user.profileName}-------- {user.profileEmail}  </p>
                              
        //                       {/* <Admin_All_Files  usrID={user._id} /> */}
        //                       {/* <NEW  usrID={user._id} /> */}
        //                       {/* <p> { all_Users_All_Files(user._id)}</p> */}
                          
        //                 </div>
        //           ))
        //       } </div>
              
            } 
    

       
    
    </>
  )
}

export default AdminNew