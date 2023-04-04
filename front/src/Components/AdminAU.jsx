import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"
import { useLocation } from 'react-router-dom';
import * as Realm from 'realm-web'
import axios from 'axios';
import fileDownload from 'js-file-download';


const AdminAU = () => {
    const location = useLocation(); 
    const USER_ID  =  location.state.USR_ID;
    const [allUsers, setAllUsers ] = useState(null);
    const [allFiles, setAllFiles ] = useState('');
    const REALM_APP_ID ='fileuploadapp-feuma';
    const app = new Realm.App({ id: REALM_APP_ID  });
    const credentials =  Realm.Credentials.anonymous();
    let flag =  true;
    let navigate =  useNavigate()
    
    useEffect( ()=>{
     
             async function DATA(){
                            

                            try{
                                const user = await app.logIn(credentials);
                                const allusers = await user.functions.getAllUsers();
                                const allfiles = await user.functions.getAllFiles();

                                setAllUsers(allusers)
                                setAllFiles(allfiles)  
                            }catch(error){
                                console.error(error);
                            }
           }

           DATA();
    }, [allUsers, allFiles])

    const downloadFile = async (event)=>{

        const download_ID = event.target.id;
       

        try{
            
            allFiles.map((file)=>{
                  
                    const idToCompare = file._id.toString()

                    if(idToCompare === download_ID){

                        const file_name = file.fileName;
                        const file_type = file.mimeType;
                        console.log(file.file.buffer)
                        fileDownload(file.file.buffer, `${file.fileName}`);

                    }
                    
                   
            })
            


        }catch(error){
            console.error(error);
        }
    
       
    }

    const deleteFile = async (event)=>{
        const Delete_id = event.target.id;
        console.log(Delete_id)
        await axios.delete(`http://localhost:3001/login/fileDelete/${Delete_id}`)
         .then((res)=>{
          if(res.status === 204){
            alert('Deleted ')
          }
         })
    }

    const fileDecide = (emailToCompare, emailToCompareWith, originalFile)=>{
         if( emailToCompare === emailToCompareWith ){
            return(
                <>
                
                 

                 <tbody>
                    <tr className='w-full p-0'>
                        <td className='text-center w-1/3'> {originalFile.fileName} </td>
                        <td className='text-center'> {originalFile.uploadDate} </td>
                        <td className='text-center '>
                            <button id={originalFile._id} onClick={downloadFile} className='bg-blue-700 border-2 border-sky-500 cursor-pointer p-2'> download </button>
                        </td>
                        <td className='text-center '>
                            <button id={originalFile._id} onClick={deleteFile} className='bg-red-700 border-2 border-red-500 cursor-pointer p-2'> Delete </button>
                        </td>
                    </tr>
                 </tbody>
                    
                  
                </>
            )
         }else{
            return(
                <tbody>
                
             </tbody>
            )

 
         }
    }

    const Logout = (event) => {
        navigate('/')
     }
    
   

   

   
  return (
    <>
    
    <div className='bg-blue-500 max-h-full min-h-screen  text-white'>
    <div className='text-right '>
        <button className='p-2 bg-red-300 rounded' onClick={Logout}> Log Out </button>
    </div>
         <div className='p-16'>
                            { allUsers === null ? <p> loading .....</p>:<p></p> } 
                    {

                            
                                
                            
                                allUsers && ( 

                                    allUsers.map(user=>(
                                                <>
                                                <div class="grid grid-cols-[20%_80%] gap-2 mt-4">

                                                
                                                        <div><p key={user._id} className='bg-red-400 p-1'> {user.profileEmail}  </p> </div>
                                                        <div> 
                                                            <table className='w-full p-0 border-2 border-blue-700 columns-4'>
                                                                    <thead>
                                                                        <tr className='w-full p-0 text-center'>
                                                                            <th className='text-center w-1/3'> File Name </th>
                                                                            <th className='text-center'>Upload Date </th>
                                                                            <th className='text-center'>Action</th>
                                                                        </tr>
                                                                    </thead>


                                                                    {
                                                                        allFiles && allFiles.map(file=>(
                                                                        
                                                                    <>
                                                                    
                                                                        {fileDecide(file.email_It_Belongs, user.profileEmail, file)} 
                                                                            
                                                                    </> 
                                                                
                                                                
                                                                        ))

                                                                    
                                                                    
                                                                    }
                                                            </table>
                                                        </div>
                                                        
                                                </div>
                                            </>

                                            ))
                                        )
                    }


                        

</div>
    
    </div>
      </>
  )
}

export default AdminAU