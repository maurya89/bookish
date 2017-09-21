import mongoose from 'mongoose';


/**
 * User Schema
 */
const CampaignSchema = new mongoose.Schema({
  nodes: {
    type: Array,
    required: false
  },
  connections: {
    type: Array,
    required: false
  }
}, {timestamps: true});

/**
 * Methods
 */
CampaignSchema.method({

});

/**
 * Statics
 */
CampaignSchema.statics = {

};

/**
 * @typedef User
 */
export default mongoose.model('campaigns', CampaignSchema);