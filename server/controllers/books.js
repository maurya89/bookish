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
        let searchParameter = ctx.params.text;

        let offset = ctx.params.offset;

        if(!searchParameter || !offset){
            ctx.status = 400;
            ctx.body = {success: false, message:"Please enter required fields."};
            return;
        }

        var options = {
            key:config.GOOGLE_BOOK_KEY,
            offset: offset,
            limit: 10,
            type: 'books',
            order: 'relevance',
            lang: 'en'
        };
        try { 
            let books = await googleBooks.searchAsync(searchParameter , options);
            ctx.body = {success: true, data:{}, arrayData:books};                        
            
        } catch (err) {
            console.log(err)
            throw(500,'Some error occured during book fetch');
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
