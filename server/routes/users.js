import 'babel-polyfill'
import Router from 'koa-router'
import { baseApi, publicApi } from '../config'
import jwt from '../middlewares/jwt'
import UsersControllers from '../controllers/users'

const api = 'users'

const router = new Router();



router.prefix(`/${baseApi}/${api}`)

// GET /api/users
router.get('/', UsersControllers.find)


// GET /api/users/id
router.get('/:id', UsersControllers.findById)


// GET /api/users/id
router.post('/fovourite_books', UsersControllers.updateFavBooks)

router.post('/forgotPassword', UsersControllers.forgotPassword)

router.get('/throwerror/err', async (ctx) => {
    try {
        ctx.throw(400, 'Error occured during send.');
        return;
    } catch (err) {
        ctx.throw(err);
    }
})





export default router
