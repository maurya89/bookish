import 'babel-polyfill';
import * as config from '../config';
import rp from 'request-promise';
import Promise from 'bluebird';
import googleBooksSearch from 'google-books-search';
import _ from 'lodash';
import Category from '../models/categories';
import User from '../models/users';
import Bookshelf from '../models/bookshelfs';
const googleBooks = Promise.promisifyAll(googleBooksSearch);




class BooksControllers {
  /**
   * Get all goolge books
   * @param {*} ctx 
   */
  async getAllBooks(ctx) {

    let searchParameter = ctx.request.body.category;
    if (!searchParameter) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: "Please select category."
      };
      return;
    }

    let options = {
      key: config.GOOGLE_BOOK_KEY,
      offset: 0,
      limit: 10,
      field: 'title',
      type: 'books',
      order: 'relevance',
      lang: 'en'
    };
    try {

      if (searchParameter === 'All') {
        //let categories = ['History', 'Science','Travel','Music','Romance','Drama','Fantasy'];
        let categories = await Category.findAsync({});
        let booksArray = [];
        await Promise.all(categories.map(async(category) => {
          let books = await googleBooks.searchAsync(category.categoryName, options);
          let json = {};
          json.CategoryName = category.categoryName;
          json.Book = books;
          booksArray.push(json);
        }));
        ctx.body = {
          success: true,
          data: {},
          arrayData: booksArray
        };
      } else {
        let categories = searchParameter instanceof Array ? searchParameter : [];

        let booksArray = [];
        await Promise.all(categories.map(async(category) => {
          let books = await googleBooks.searchAsync(category, options);
          let json = {};
          json.CategoryName = category;
          json.Book = books;
          booksArray.push(json);
        }));
        ctx.body = {
          success: true,
          data: {},
          arrayData: booksArray
        };
      }
    } catch (err) {
      console.log(err)
      ctx.throw(500, 'Some error occured during book fetch');
    }
  }



  async getAllBooksByCategory(ctx) {

    let obj = ctx.request.body;
    if (!obj.category || typeof obj.offset == 'undefined') {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: "Please select required fields."
      }
      return;
    }

    let options = {
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
      ctx.body = {
        success: true,
        data: {},
        arrayData: books
      };

    } catch (err) {
      console.log(err)
      ctx.throw(500, 'Some error occured during book fetch');
    }
  }

  /**
   * Get Books By Id
   * @param {*} ctx 
   */

  async getBookById(ctx) {
    let id = ctx.params.bookId;

    if (!id) {
      ctx.throw(400, 'Please send book id.');
    }
    let options = {
      key: config.GOOGLE_BOOK_KEY
    }
    try {
      let book = await googleBooks.lookupAsync(id, options);
      if (!book) {
        ctx.status = 400;
        cyx.body = {
          success: false,
          message: 'Book not found.'
        };
        return;
      };
      let findQuery = {};
      findQuery.user_id = ctx.state.user._id;
      findQuery.id = id;

      let bookStatus =  await Bookshelf.findOneAsync(findQuery);
      if(bookStatus){
        book.isReading = bookStatus.isReading;
      }
      
      ctx.body = {
        success: true,
        data: book,
        arrayData: []
      };
    } catch (err) {
      ctx.throw(err);
    }
  }

  async getRecommendedBooksByCategory(ctx) {

    if (typeof ctx.params.offset === 'undefined') {
      ctx.throw(400, 'Please send required fields');
    }
    let offset = ctx.params.offset;
    let userObj = ctx.state.user;

    let categories = [];
    let findQuery = {};
    findQuery._id = userObj._id;
    const user = await User.findOne(findQuery).lean(true).execAsync();
    let favBooks = user.favourite_books;
    favBooks.forEach(function (element) {
      categories.push(element.category)
    }, this);
    let category = _.sample(categories);

    let options = {
      key: config.GOOGLE_BOOK_KEY,
      offset: offset,
      limit: 10,
      field: 'title',
      type: 'books',
      order: 'relevance',
      lang: 'en'
    };
    try {
      let books = await googleBooks.searchAsync(category, options);
      ctx.body = {
        success: true,
        data: {},
        arrayData: books
      };
    } catch (err) {
      ctx.throw(err);
    }
  }


  async getRecommendedBooksByAuthor(ctx) {

    if (typeof ctx.params.offset === 'undefined') {
      ctx.throw(400, 'Please send required fields');
    }
    let offset = ctx.params.offset;
    let userObj = ctx.state.user;

    let authors = [];

    let findQuery = {};
    findQuery._id = userObj._id;
    const user = await User.findOne(findQuery).lean(true).execAsync();
    let favBooks = user.favourite_books;
    favBooks.forEach(function (element) {
      authors.push(element.author)
    }, this);

    let author = _.sample(authors);

    console.log(author);
    let options = {
      key: config.GOOGLE_BOOK_KEY,
      offset: offset,
      limit: 10,
      field: 'author',
      type: 'books',
      order: 'relevance',
      lang: 'en'
    };
    try {
      let books = await googleBooks.searchAsync(author, options);
      ctx.body = {
        success: true,
        data: {},
        arrayData: books
      };
    } catch (err) {
      ctx.throw(err);
    }
  }

  async getRecommendedBooksByNewRelease(ctx) {

    if (typeof ctx.params.offset === 'undefined') {
      ctx.throw(400, 'Please send required fields');
    }
    let offset = ctx.params.offset;
    let userObj = ctx.state.user;

    let categories = [];
    let findQuery = {};
    findQuery._id = userObj._id;
    const user = await User.findOne(findQuery).lean(true).execAsync();
    let favBooks = user.favourite_books;
    favBooks.forEach(function (element) {
      categories.push(element.category)
    }, this);
    let category = _.sample(categories);

    let options = {
      key: config.GOOGLE_BOOK_KEY,
      offset: offset,
      limit: 10,
      field: 'title',
      type: 'books',
      order: 'newest',
      lang: 'en'
    };
    try {
      let books = await googleBooks.searchAsync(category, options);
      ctx.body = {
        success: true,
        data: {},
        arrayData: books
      };
    } catch (err) {
      ctx.throw(err);
    }
  }


  async getSimilarBooks(ctx) {

    if (!ctx.request.body) {
      ctx.throw(400, 'Please send required fields.');
      return;
    }
    let bodyObj = ctx.request.body;
    let offset = ctx.params.offset;
    let arr = [];

    Object.keys(bodyObj).forEach(function (key) {
      let searchJson = {};
      searchJson.filter = bodyObj[key];
      searchJson.type = key;
      arr.push(searchJson);
    });

    let option = _.sample(arr);
    let options = {
      key: config.GOOGLE_BOOK_KEY,
      offset: offset,
      limit: 10,
      field: option.type,
      type: 'books',
      order: 'relevance',
      lang: 'en'
    };
    try {
      let books = await googleBooks.searchAsync(option.filter, options);
      ctx.body = {
        success: true,
        data: {},
        arrayData: books
      };
    } catch (err) {
      ctx.throw(err);
    }
  }


  async createBookshelf(ctx) {
    let id = ctx.request.body.bookId;

    if (!id) {
      ctx.throw(400, 'Please send book id.');
      return;
    }

    if (!ctx.state.user) {
      ctx.throw(400, 'Please loginto create bookshelf');
      return;
    }
    let options = {
      key: config.GOOGLE_BOOK_KEY
    }


    try {

      let findQuery = {};
      findQuery.user_id = ctx.state.user._id;
      findQuery.id = id;
      let checkBook = await Bookshelf.findOneAsync(findQuery);
      console.log(checkBook)
      if (checkBook) {
        ctx.throw(400, 'Books already added to your bookshelf.');
        return;
      }
      let book = await googleBooks.lookupAsync(id, options);
      if (!book) {
        ctx.status = 400;
        cyx.body = {
          success: false,
          message: 'Book not found.'
        };
        return;
      };

      book.user_id = ctx.state.user._id;

      let bookshelf = new Bookshelf(book);
      let booksSaved = await bookshelf.saveAsync();
      ctx.body = {
        success: true,
        message: 'Book has been saved successfully'
      };
    } catch (err) {
      ctx.throw(err);
    }
  }

  async getBookShelfByUserId(ctx) {

      if (!ctx.state.user) {
          ctx.throw(400, 'Please login  to create bookshelf');
          return;
      }

      if (!ctx.params.status){
        ctx.throw(400, 'Please send required parameter');
        return;
      }
      let user_id = ctx.state.user._id;
      let findQuery = {};
      findQuery.user_id = user_id;
      findQuery.isReading = ctx.params.status;
      let books = await Bookshelf.findAsync(findQuery);
      if (!books) {
          ctx.throw(400, 'Book not found');
      }
      ctx.body = { success: true, arrayData: books, data: {} }
  }
}

export default new BooksControllers()
