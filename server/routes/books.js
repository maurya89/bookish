import 'babel-polyfill';
import Router from 'koa-router';
import { baseApi } from '../config';
import BooksControllers from '../controllers/books';

const api = 'books';

const router = new Router();

router.prefix(`/${baseApi}/${api}`)

// GET /api/books
router.post('/getAllBooks', BooksControllers.getAllBooks)

// GET /api/books
router.post('/getAllBooksByCategory', BooksControllers.getAllBooksByCategory)

// GET /api/books/id
router.get('/getBookById/:bookId', BooksControllers.getBookById)

router.get('/recommended/category/:offset', BooksControllers.getRecommendedBooksByCategory)

router.get('/recommended/author/:offset', BooksControllers.getRecommendedBooksByAuthor)

router.get('/recommended/new-release/:offset', BooksControllers.getRecommendedBooksByNewRelease)

router.post('/getSimilarBooks/:offset', BooksControllers.getSimilarBooks)

router.post('/bookshelf', BooksControllers.createBookshelf)

router.get('/bookshelf/:status', BooksControllers.getBookShelfByUserId)




export default router
