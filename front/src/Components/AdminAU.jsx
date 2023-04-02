import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import * as Realm from 'realm-web'

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
                        
                        fileDownload(file.file.buffer, `${file.fileName}`);

                    }
                    
                   
            })
            


        }catch(error){
            console.error(error);
        }
    
       
    }

    const fileDecide = (emailToCompare, emailToCompareWith, originalFile)=>{
         if( emailToCompare === emailToCompareWith ){
            return(
                <>
                
                 

                 <tbody>
                    <tr className='w-full p-0'>
                        <td className='text-center w-1/3'> {originalFile.fileName} </td>
                        <td className='text-center'> {originalFile.uploadDate} </td>
                        <td className='text-center'>
                            <button id={originalFile._id} onClick={downloadFile} className='bg-blue-700 border-2 border-sky-500 cursor-pointer'> download </button>
                        </td>
                        <td className='text-center'>
                            <button id={originalFile._id} onClick={fileDelete} className='bg-red-700 border-2 border-red-500 cursor-pointer'> Delete </button>
                        </td>
                    </tr>
                 </tbody>
                    
                  
                </>
            )
         }else{
   flag = false;
         }
    }

    const fileDelete = async (event)=>{
        const deleteId = event.target.id;
        try{
            const user = await app.logIn(credentials);
            await user.functions.deleteFile(deleteId);
        }catch(error){
            console.log(error)
        }
    }

   

   
  return (
    <>
    
    <div className='bg-blue-500 h-full flex flex-col text-white'>

<div className='p-16'>
            { allUsers === null ? <p> loading .....</p>:<p></p> } 
      {

              
                
             
                allUsers && ( 

                    allUsers.map(user=>(
                                <>
                                        <p key={user._id}> {user.profileEmail}  </p>

                                        
                                        <table className='w-full p-0 border-2 border-blue-700 '>
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