import mongoose from 'mongoose';


/**
 * User Schema
 */
const PopularSearchSchema = new mongoose.Schema({
  title: {
    type: String,
    required: false
  }
}, {timestamps: true});

/**
 * Methods
 */
PopularSearchSchema.method({

});

/**
 * Statics
 */
PopularSearchSchema.statics = {

};

/**
 * @typedef User
 */
export default mongoose.model('popularsearches', PopularSearchSchema);