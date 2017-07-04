import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const postSchema = Schema({
  info:{
    type:String,
    required:true
  },
	image_path:{
    type:String,
    required:true
  },
  time:{
    type:String,
    required:true
  }
});

module.exports=mongoose.model('post',postSchema);
