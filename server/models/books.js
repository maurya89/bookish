import mongoose from 'mongoose';


/**
 * BookshelfSchema Schema
 */
const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: false
  },
  authors: {
    type: Array,
    required: false
  },
  publisher: {
    type: String,
    default: []
  },
  publishedDate: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    required: false
  },
  categories: {
    type: Array,
    required: false
  },
  language: {
    type: String,
    required: false
  },
  id: {
    type: String,
    required: false
  },
  link: {
    type: String,
    required: false
  },
  thumbnail: {
    type: String,
    required: false
  },
  images: {
    type: Object,
    required: false
  },
  isReading:{
    type:String,
    default:'reading'
  },
  view:{
      type:Number,
      default:0
  },
  like:{
    type:Number,
    default:0
}
}, {
  timestamps: true
});

/**
 * Methods
 */
BookSchema.method({

});

/**
 * Statics
 */
BookSchema.statics = {

};

/**
 * @typedef User
 */
export default mongoose.model('books', BookSchema);

