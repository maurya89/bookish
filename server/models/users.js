import mongoose from 'mongoose';


/**
 * User Schema
 */
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  favourite_books:{
    type:Array,
    default:[]
  },
  profile_photo:{
    type:String,
    default:''
  },
  forgotPwdToken:{
    type:String,
    required:false
  },
  forgotPwdToken:{
    type:String,
    required:false
  },
  forgotPwdExpire:{
    type:String,
    required:false
  }
}, {timestamps: true});

/**
 * Methods
 */
UserSchema.method({

});

/**
 * Statics
 */
UserSchema.statics = {

};

/**
 * @typedef User
 */
export default mongoose.model('users', UserSchema);