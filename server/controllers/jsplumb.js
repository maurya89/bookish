import JsPlumb from '../models/jsplumb';

class CategoriesControllers {


    /**
     * Get all categories
     * @param {ctx} Koa Context
     */
    async saveCampaign(ctx) {
        console.log("hello");
        let jsonObj = ctx.request.body;
        console.log("json",jsonObj);
        //let obj = JSON.parse(jsonObj);
        try {
            let campSave = new JsPlumb(jsonObj);
            let campSaved = await campSave.saveAsync()
            ctx.body = { data: {}, message:"Json saved successfully", success: true };
        } catch (err) {
            ctx.throw(err);
        }
    }


    async getCampaignById(ctx) {
        let id = ctx.param._id;
        try {
            const campaign = await JsPlumb.findOne({id:_id}).lean(true).execAsync();
            if (!campaign) {
                ctx.status = 400;
                ctx.body = { success: false, message: "No Campaign Found." };
                return;
            }
            ctx.body = { success: true, campaign: campaign};
        } catch (err) {
            ctx.throw(err);
        }
    }

    async getAllCampaigns(ctx) {
        try {
            const campaigns = await JsPlumb.find({}).lean(true).execAsync();
            if (!campaigns) {
                ctx.status = 400;
                ctx.body = { success: false, message: "No Campaign Found." };
                return;
            }
            ctx.body = { success: true, campaigns: campaigns};
        } catch (err) {
            ctx.throw(err);
        }
    }
}

export default new CategoriesControllers()
