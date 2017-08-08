import 'babel-polyfill';
import * as config from '../config';
import rp from 'request-promise';
import Promise from 'bluebird';
import googleBooksSearch from 'google-books-search';
const googleBooks = Promise.promisifyAll(googleBooksSearch);


class BooksControllers {
    /**
     * Get all goolge books
     * @param {*} ctx 
     */
    async getAllBooks(ctx) {

        let searchParameter = ctx.request.body.category;
        if(!searchParameter){
            ctx.status = 400;
            ctx.body = {success:false, message:"Please select category."};
            return;
        }

        var options = {
            key:config.GOOGLE_BOOK_KEY,
            offset: 0,
            limit: 10,
            field:'title',
            type: 'books',
            order: 'relevance',
            lang: 'en'
        };
        try { 
            
            if(searchParameter === 'All'){
                let categories = ['History', 'Science','Travel','Music','Romance','Drama','Fantasy'];
                let booksArray = [];
               await Promise.all(categories.map(async (category) => {
                    let books = await googleBooks.searchAsync(category , options);
                    let json = {};                    
                    json.CategoryName = category;
                    json.Book = books;
                    booksArray.push(json);
                }));
                ctx.body = {success: true, data:{}, arrayData:booksArray};
            }else{
                let categories = searchParameter instanceof Array ? searchParameter : [] ;

                let booksArray = [];
               await Promise.all(categories.map(async (category) => {
                    let books = await googleBooks.searchAsync(category , options);
                    let json = {};                    
                    json.CategoryName = category;
                    json.Book = books;
                    booksArray.push(json);
                }));
                ctx.body = {success: true, data:{}, arrayData:booksArray};
            } 
        } catch (err) {
            console.log(err)
            throw(500,'Some error occured during book fetch');
        }  
    }



    async getAllBooksByCategory(ctx) {

        let obj = ctx.request.body;
        if (!obj.category || typeof obj.offset== 'undefined') {
            ctx.status = 400;
            ctx.body = { success: false, message: "Please select required fields."}
            return;
        }

        var options = {
            key: config.GOOGLE_BOOK_KEY,
            offset: obj.offset,
            limit: 10,
            field: 'title',
            type: 'books',
            order: 'relevance',
            lang: 'en'
        };
        try {
            let books = await googleBooks.searchAsync(obj.category, options);
            ctx.body = { success: true, data: {}, arrayData: books };
            
        } catch (err) {
            console.log(err)
            throw (500, 'Some error occured during book fetch');
        }
    }

    /**
     * Get Books By Id
     * @param {*} ctx 
     */

    async getBookById(ctx) {
        let id = ctx.params.bookId;
        let options={
            key:config.GOOGLE_BOOK_KEY
        }
        try {
            let book = await googleBooks.lookupAsync(id, options);
            if(!book){ 
                ctx.status = 400;
                cyx.body = {success:false, message:'Book not found.'};
                return;
            };
            ctx.body = book;            
        } catch (err) {
            throw(err);
        }
    }
}

export default new BooksControllers()
