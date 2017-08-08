import 'babel-polyfill'
import Router from 'koa-router'
import { baseApi, publicApi } from '../config'
import jwt from '../middlewares/jwt'
import CategoriesControllers from '../controllers/categories'

const api = 'categories';

const router = new Router();



router.prefix(`/${baseApi}/${api}`)



router.get('/getAllCategories', CategoriesControllers.getAllCategories)




export default router