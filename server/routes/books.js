import 'babel-polyfill';
import Router from 'koa-router';
import { baseApi } from '../config';
import BooksControllers from '../controllers/books';

const api = 'books';

const router = new Router();

router.prefix(`/${baseApi}/${api}`)

// GET /api/books
router.get('/getAllBooks/:text/:offset', BooksControllers.getAllBooks)

// GET /api/books/id
router.get('/getBookById/:bookId', BooksControllers.getBookById)



export default router
