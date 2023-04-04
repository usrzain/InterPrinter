import  express, { query, json }  from "express";
import dotenv from 'dotenv' ;
import mongoose from 'mongoose';
import cors from 'cors';
import multer, {memoryStorage} from "multer";
// import { jwtAuth } from './jwt.js';
import jwt from "jsonwebtoken";
import mime from 'mime-types';
import { File } from "./Models/file.mjs";





// ----------------
const App = express();
const PORT = process.env.PORT || 3001 ;
dotenv.config();

	
App.use(express.json()); 
App.use(cors());
App.use(json());
App.use(express.urlencoded({extended: true}))
mongoose.connect(process.env.MDB_URL , {})

    .then(() => {
        console.log('connected to DataBase ')

        App.listen(3001, () => {
            console.log('server is Running ')
        })
    })


    // =============  Sign up schema ===========
     
const signUpSchema  =  new mongoose.Schema({
     profileName: String,
     profileEmail: String,
     profilePass: String
}) ;    

const signUpUser =  mongoose.model('signUpUser', signUpSchema)
    // ============== Sign Up schema ============





//  =============================

const userSchema = new mongoose.Schema({
  email_It_Belongs: String,
  file: Buffer,
  fileName: String
});


const USER = mongoose.model('Users', userSchema);

//  ==============================


// =============  File Schema   ========
// const fileSchema = new mongoose.Schema({
//   email_It_Belongs: String,
//   file: Buffer,
//   fileName: String,
//   mimeType: String,
//   uploadDate:String

// });


// const File = mongoose.model('fileAllDATA', fileSchema);
// =====================================


const upload = multer();





//    =================================

//  file upload 

App.post('/login/:email/upload', upload.array('fileCollection', 10) , async (req,res)=>{

    
  var fileCollection = req.files;

  var email_Typed = req.body.userEmailAddres;
  let newDate = new Date()
  let date = newDate.getDate();
  let month = newDate.getMonth() + 1;
  let year = newDate.getFullYear();

  let DATE = `${date}-${month}-${year}`
 
  
   try{
    fileCollection.map(async(eachFile)=>{ 


          
        
          const newFile = new File({

              email_It_Belongs: email_Typed,
              file: eachFile.buffer,
              fileName: eachFile.originalname,
              mimeType: mime.lookup(eachFile.originalname),
              uploadDate:DATE
            
          });

                await newFile.save();
                      
                


               
        
        })

                                //   // send a response indicating success
                                res.setHeader('Content-Type', 'text/plain');
                                res.status(200).send('File and text data saved successfully');
                
                               
   }catch (error) {
   
      console.error(error);
    
    }


  


    
} )



App.get('/login/:email', async (req,res)=>{
   
    const email_To_Search = req.params.email
    
    let count = [
      
    ];

    try {
    // Query the collection using the provided parameters
     await File.find({ email_It_Belongs: email_To_Search})
      .then( (File)=>{
         File.forEach( File=>{
            let fileArray = {};
            fileArray.FILE_NAME = File.fileName
            fileArray.FILE_ID = File._id
            count.push(fileArray)

           
            

          })
      }).catch(err => console.log(err))

      res.set('Content-Type', 'application/json');
      res.send(count);

  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
  
})

App.get('/accounts/:usrId',  async (req,res)=>{
    const user_Id_To_Search = req.params.usrId;
    let uploadedFiles = [];
   
    try{

      await signUpUser.findById(user_Id_To_Search)
        .then(async (result)=>{
                      if(!result){
                        res.sendStatus(404)
                      }else{
                                  const USERNAME = result.profileName;
                                  const USEREMAIL = result.profileEmail;

                                  const email_For_Data_To_Search = result.profileEmail;
                                  // Query the collection using the provided parameters
                                  await File.find({ email_It_Belongs: email_For_Data_To_Search})
                                        .then( (File)=>{
                                                  File.forEach( File=>{
                                                    let fileArray = {};
                                                    fileArray.FILE_NAME = File.fileName
                                                    fileArray.FILE_ID = File._id
                                                    fileArray.FILE_UPLOAD_DATE = File.uploadDate
                                                    uploadedFiles.push(fileArray)

                                                    
                                                    

                                                  })
                                        }).catch(err => console.log(err))

                               
                                  
                                  res.setHeader('Content-Type', 'application/json');
                                  res.json({profileName: USERNAME, profileEmail: USEREMAIL ,Files:uploadedFiles })
                                  
              
                      }
          
        })

    }catch(error){
       console.log(error)
    }
})

// Download FIle According to the file id 
App.get('/login/fileDownload/:id', async(req,res)=>{
          const id_To_Download = req.params.id

          try{

            const FILE = await File.findById(id_To_Download)

            if(!FILE){
              res.status(404).send(' File Not Found ')
            }

            const ArrayBuffer = FILE.file;
            // const bufferData = Buffer.from(ArrayBuffer);
            // const base64Data = bufferData.toString('base64');
            const binaryData = new Uint8Array(ArrayBuffer);
            console.log(ArrayBuffer.buffer.byteLength)
            console.log(binaryData)

            res.send({DATA: binaryData, FILE_NAME:FILE.fileName , FILE_TYPE:FILE.mimeType })
            // Set the Content-Type header to the appropriate MIME type for the file
            
            // res.setHeader('Content-Type', `${FILE.mimeType}`);

            // // Set the Content-Disposition header to force download
          
            // res.setHeader('Content-disposition', 'attachment; filename=' + FILE.fileName);



  
            // res.send({'DATA':ArrayBuffer, 'DATA_FILE_NAME': FILE.fileName, 'DATA_MIME': FILE.mimeType, })

            // console.log(ArrayBuffer)

            
          
          }catch (error) {
            res.statusCode = 500;
            res.end(error);
          }
    
})

//  Delete File 

App.delete('/login/fileDelete/:id', async(req,res)=>{
  const id_To_Delete = req.params.id
  console.log(id_To_Delete)
  try{

   await  File.deleteOne({ _id: id_To_Delete })
     .then(result=>{
      console.log(`${result.deletedCount} document(s) deleted`);
      res.sendStatus(204)
     })
     .catch(err => {
      console.error(err);
    });
   
    
   
    

   
   
   
  }catch (error) {
   
    console.log(error)
  }
})

//    /// route for creating the user and further more user authentication 

App.post('/sign-up', async (req,res)=>{
  try{
    const newSignUpUser = new signUpUser({
      profileName: req.body.name,
      profileEmail: req.body.email,
      profilePass: req.body.password
     })

    await newSignUpUser.save();
    

    res.sendStatus(201)
  }catch(error){
     console.log(error)
  }
   
 
})

App.post('/login', async(req,res)=>{


  const { email, password } = req.body;

   try{

   

     await signUpUser.findOne({ profileEmail: email 
         }).then( (result)=>{
                if(!result){
                  res.sendStatus(404)
                }else{
                    if(password === result.profilePass){
                     
                     
                      res.setHeader('Content-Type', 'application/json');
                      if( email === 'zz980330@gmail.com'){
                        res.json({ID: result._id, ADMIN_EMAIL: email });
                      }else{
                        res.json({ID: result._id, ADMIN_EMAIL: null});
                      }

                      

                    }else{
                      
                      res.sendStatus(403)
                    }
                }
            })

    

        
   }catch(error){
     console.log(error)
   }


})


//    //   creting the route for admin 

App.get('/admin/all-users', async(req,res)=>{
  const all_Users = signUpUser.find({});
  all_Users.then((docs) => {

    res.setHeader('Content-Type', 'text/plain');
    res.json(docs)
  }).catch((err) => {
    console.error(err);
  });

    
})


//  ---- creatinf route for getting all files which each user has uploded 
App.get('/admin/all-users/:usr/all-files', async(req,res)=>{

  
  // all_Users.then((docs) => {

  //   res.setHeader('Content-Type', 'text/plain');
  //   res.json(docs)
  // }).catch((err) => {
  //   console.error(err);
  // });

    
})
