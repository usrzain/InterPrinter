import React, { useState, useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom"
import fileDownload from 'js-file-download';
import { saveAs } from 'file-saver';
import * as Realm from 'realm-web'



export default function  FileShow(props){

  const [ file_Chossen, setFileChoosen ] = useState(null);
  const [ uploadStatus, setUploadStatus ] = useState(0)
  const { userEmailAddres, userName } =props;
  const [printType, setPrintType] = React.useState('');
  let navigate =  useNavigate()


  const REALM_APP_ID ='fileuploadapp-feuma';
  const app = new Realm.App({ id: REALM_APP_ID  });
  const credentials =  Realm.Credentials.anonymous();

  useEffect(()=>{}, [props.fileList])


  const File_Upload_Handler = (e)=>{
     
     setFileChoosen(e.target.files)
     
  }

  const handle_File_Submit = (e)=>{
          e.preventDefault();
        
        let formData = new FormData()

        if( file_Chossen === null ){
          console.log(file_Chossen)
          alert(' No File has been Choosen ')
        }else{
                      for (const key of Object.keys(file_Chossen)) {
                        console.log(typeof(file_Chossen[key]))
                        formData.append('fileCollection', file_Chossen[key])
                    }

                      formData.append('userEmailAddres', userEmailAddres);
                      formData.append('printType', printType )

                      
                      
                      axios.post(`http://localhost:3001/login/${userEmailAddres}/upload`,formData)
                      .then((res)=>{
                          if(res.status === 200 ){
                            alert('Uploaded ...........')
                            setFileChoosen(null)

                          }
                      })


        }

    

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
  

    const handleSelect= (event) => {
      setPrintType(event.target.value);
    };

    const Logout = (event) => {
       navigate('/')
    }

  return (
    <div className='bg-blue-500 max-h-full min-h-screen flex flex-col text-white'>
  <div className='text-right m-4'> <button className='p-2 bg-red-300 rounded' onClick={Logout}> Log Out </button></div>
      <div className='p-16 pt-10'>

    
    
        <h1 className='w-full flex justify-center text-5xl py-2'>  Welcome  {userName}  </h1>

        <h1 className='text-center'>  You can Submit Files here </h1>
        <form onSubmit={handle_File_Submit} className='my-5 flex justify-center'>
                <input type="file" name="file_Uploader" id="" placeholder='Choose Files' onChange={File_Upload_Handler}  multiple/>
                <button type='submit' className='cursor-pointer bg-success p-2 rounded rounded-2'>submit</button>
               
        </form>

        <div className='bg-blue-500 flex flex-row justify-center my-4  '>
            <label className='border-2 border-blue-700 p-3'>
                Select Print Type :       
                <select value={printType} onChange={handleSelect} className='bg-blue-500 border-2 border-black mx-4' autoFocus={true}>
                  <option value="Sin-B/W" >Single Sided Black & White </option>
                  <option value="Dou-B/W" >Double Sided Black & White </option>
                  <option value="Sin-Color" >Single Sided Color </option>
                  <option value="Dou-Color">Double Sided Color</option>
                </select>
             </label>
        </div>

        <table className='w-full p-0 border-2 border-blue-700'>
                    <tr className='w-full p-0 text-center'>
                      <th className='text-center'>File Name </th>
                      <th className='text-center'>Upload Date</th>
                      <th className='text-center'>Action</th>
                      <th className='text-center'></th>
                      <th className='text-center'>Print Type</th>
                    </tr>


             
        {props.fileList.map((file, index) => (

          <>

          <tr key={index} className='w-full p-0' >
            <td  className='text-center'>{file.FILE_NAME}</td>
            <td className='text-center'>{file.FILE_UPLOAD_DATE}</td>
            <td className='text-center'>
                             <button onClick={download} id={file.FILE_ID} className='bg-blue-700 border-2 border-sky-500 cursor-pointer p-2'> Download </button>
            </td>
            <td className='text-center'>
                            <button onClick={deleteFile} id={file.FILE_ID}  className='bg-red-700 border-2 border-red-500 cursor-pointer p-2' > Delete </button>
            </td>
            <td className='text-center'>{file.PRINTTYPE}</td>
          </tr>
  
           </>
            ))
        }

</table>   


</div>
    
    </div>
  )
}

