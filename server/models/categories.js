import mongoose from 'mongoose';


/**
 * User Schema
 */
const CategorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true
  }
}, {timestamps: true});

/**
 * Methods
 */
CategorySchema.method({

});

/**
 * Statics
 */
CategorySchema.statics = {

};

/**
 * @typedef User
 */
export default mongoose.model('categories', CategorySchema);