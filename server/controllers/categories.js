import Category from '../models/categories';

class CategoriesControllers {


    /**
     * Get all categories
     * @param {ctx} Koa Context
     */
    async getAllCategories(ctx) {
        try {

            let categories = await Category.findAsync();
            ctx.body = { data: {}, arrayData: categories, success: true };
        } catch (err) {
            ctx.throw(err);
        }
    }
}

export default new CategoriesControllers()
