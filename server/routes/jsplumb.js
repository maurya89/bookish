import 'babel-polyfill';
import Router from 'koa-router';
import { baseApi, publicApi } from '../config';
import jwt from '../middlewares/jwt';
import JsPlumbControllers from '../controllers/jsplumb';



const api = 'jsplumb'

const router = new Router();

router.prefix(`/${publicApi}/${api}`)


// POST /api/users
// This route is protected, call POST /api/authenticate to get the token
router.post('/save-campaign', JsPlumbControllers.saveCampaign)

router.get('/getCampaigns', JsPlumbControllers.getAllCampaigns)

router.get('/getCampaignById/:id', JsPlumbControllers.getCampaignById)



export default router
