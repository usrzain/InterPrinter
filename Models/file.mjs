import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    email_It_Belongs: String,
    file: Buffer,
    fileName: String,
    mimeType: String,
    uploadDate:String,
    printType:String
  
  });

  const File = mongoose.model('fileAllDATA', fileSchema);

  export {File}; 