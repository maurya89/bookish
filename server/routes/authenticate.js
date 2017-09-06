import 'babel-polyfill'
import Router from 'koa-router'
import { baseApi, publicApi } from '../config'
import jwt from '../middlewares/jwt'
import UsersControllers from '../controllers/users'
import koaBody from 'koa-body'
//const koaBoody = koaBody()



const api = 'users'

const router = new Router();

router.prefix(`/${publicApi}/${api}`)


// POST /api/users
// This route is protected, call POST /api/authenticate to get the token
router.post('/login', UsersControllers.login)

// PUT /api/users/id
// This route is protected, call POST /api/authenticate to get the token
router.put('/signup',koaBody({ multipart: true,
    formidable: {
     /*  uploadDir: __dirname + '/uploads',
      keepExtensions:true,
    onFileBegin:(name, file)=> {
      //  console.log(ctx);
       // console.log(file);
        console.log(ctx);
    } */
}
}), UsersControllers.signup)


router.post('/forgotPassword', UsersControllers.forgotPassword)



export default router
