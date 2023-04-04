import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import FileShow from './FileShow';
import * as Realm from 'realm-web'

const User = (props) => {

  const location = useLocation(); 
  const USER_ID  =  location.state.USR_ID;
  const [usr_Email, setUsrEmail ] = useState(null)
  const [ usr_Name_For_Email, setNameEmail ] = useState(null)
  const [ usr_Data_For_Email, setUsrDEmail ] = useState(null);

  const [ isLoading, setIsLoading ] = useState(true);
  const REALM_APP_ID ='fileuploadapp-feuma';
  const app = new Realm.App({ id: REALM_APP_ID  });
  const credentials =  Realm.Credentials.anonymous();

  let data = [];




            useEffect(()=>{
              axios.get(`http://localhost:3001/accounts/${USER_ID}`)
              .then((res)=>{
                  const name =  res.data.profileName;
                  const files = res.data.Files;
                  const email_for_id = res.data.profileEmail
                
          
                    
                  setNameEmail(name)
                  setUsrDEmail(files)
                  setUsrEmail(email_for_id)

          
              })
          },[usr_Data_For_Email]);

         

  return (
    <>
      
       
         
        <div>
          
          {usr_Data_For_Email != null ?  <FileShow fileList={usr_Data_For_Email} userEmailAddres ={usr_Email} userName ={usr_Name_For_Email} /> : <h1> Loading...... </h1>}
        </div>
        
      
   </>
  )
}

export default User