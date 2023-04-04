import React, { useState} from 'react';
import axios from 'axios';

import fileDownload from 'js-file-download';
import { saveAs } from 'file-saver';
import * as Realm from 'realm-web'



export default function  FileShow(props){

  const [ file_Chossen, setFileChoosen ] = useState(null);
  const [ uploadStatus, setUploadStatus ] = useState(0)
  const { userEmailAddres, userName } =props;
  const REALM_APP_ID ='fileuploadapp-feuma';
  const app = new Realm.App({ id: REALM_APP_ID  });
  const credentials =  Realm.Credentials.anonymous();



  const File_Upload_Handler = (e)=>{
     
     setFileChoosen(e.target.files)
     
  }

  const handle_File_Submit = (e)=>{
          e.preventDefault();
        
        let formData = new FormData()

          for (const key of Object.keys(file_Chossen)) {
            console.log(typeof(file_Chossen[key]))
            formData.append('fileCollection', file_Chossen[key])
        }

          formData.append('userEmailAddres', userEmailAddres);

          
          
          axios.post(`http://localhost:3001/login/${userEmailAddres}/upload`,formData, {
            onUploadProgress : (data)=>{
              const percent = Math.round((data.loaded/data.total)*100);
              setUploadStatus(percent)
              // console.log(data.loaded, data.total)
            }
          })
          .then((res)=>{
               if(res.status === 200 ){
                alert('Uploaded ...........')
                setFileChoosen(null)
               }
          })

          setFileChoosen(null)

  }


    const download = async (event)=>{

        const download_ID = event.target.id
        
        
        const user = await app.logIn(credentials);
        const allusers = await user.functions.getSingleFile(`${download_ID}`);
        console.log(allusers.fileName)
        fileDownload(allusers.file.buffer, `${allusers.fileName}`);


  

     
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
  

  return (
    <div className='bg-blue-500 h-screen flex flex-col text-white'>

      <div className='p-16'>

    

        <h1 className='w-full flex justify-center text-5xl py-2'>  Welcome  {userName}  </h1>

        <h1 className='text-center'>  You can Submit Files here </h1>
        <form onSubmit={handle_File_Submit} className='my-5 flex justify-center'>
                <input type="file" name="file_Uploader" id="" placeholder='Choose Files' onChange={File_Upload_Handler}  multiple/>
                <button type='submit' className='cursor-pointer bg-success p-2 rounded rounded-2'>submit</button>
               
        </form>

        <table className='w-full p-0 border-2 border-blue-700'>
                    <tr className='w-full p-0 text-center'>
                      <th className='text-center'>File Name </th>
                      <th className='text-center'>Upload Date</th>
                      <th className='text-center'>Action</th>
                    </tr>


             
        {props.fileList.map((file, index) => (

          <>

          <tr key={index} className='w-full p-0' >
            <td  className='text-center'>{file.FILE_NAME}</td>
            <td className='text-center'>{file.FILE_UPLOAD_DATE}</td>
            <td className='text-center'>
                             <button onClick={download} id={file.FILE_ID} className='cursor-pointer'> Download </button>
            </td>
            <td className='text-center'>
                            <button onClick={deleteFile} id={file.FILE_ID}  className='bg-red-700 border-2 border-red-500 cursor-pointer'> Delete </button>
            </td>
          </tr>
  
           </>
            ))
        }

</table>   


</div>
    
    </div>
  )
}

