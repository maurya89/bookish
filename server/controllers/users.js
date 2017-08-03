import 'babel-polyfill';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/users';
import * as config from '../config';

class UsersControllers {

    /**
     * Authenticate user
     * @param {*} ctx 
     */
    async login(ctx) {
        let userObj = ctx.request.body;
        if(!userObj.email || !userObj.password){
            ctx.status = 400;
            ctx.body = {success: false, message:"Please enter required fields."};
            return;
        }        
        let findQuery = {};
        findQuery.email = userObj.email;
        try {
            const user = await User.findOne(findQuery).lean(true).execAsync();
            if (!user) {
                ctx.status = 400;
                ctx.body = {success: false, message:"Authentication failed! User not found."};                
                return ;
            }

            let bcrypt_password_matched = bcrypt.compareSync(userObj.password, user.password);
            if (!bcrypt_password_matched) {
                ctx.status = 400;
                ctx.body = {success: false, message:"Authentication failed! Wrong password."};
                return;
            }

            const token = jwt.sign(user, config.JWTSECRET);
            let json = {};
            json.token = token;
            ctx.body = {data:json, arrayData:[],success: true, message:"User has been login successfully."};

        } catch (err) {
            if (err.name === 'CastError' || err.name === 'NotFoundError') {
                ctx.throw(404);
            }
            ctx.throw(500);
        }
    }

    /**
     * Register a user
     * @param {*} ctx 
     */
    async signup(ctx) {

        let userObj = ctx.request.body;
        if(!userObj.email || !userObj.password || !userObj.name){
            ctx.status = 400;
            ctx.body = {success: false, message:"Please enter required fields."};            
            return;
        }
        let findQuery = {};
        findQuery.email = userObj.email;
        if(userObj.password){
            let password = userObj.password;
            let bcrypt_password = bcrypt.hashSync(password, 10);
            userObj.password = bcrypt_password;
        }
        try {
            const user = await User.findOneAsync(findQuery);
            if (user) {
                ctx.status = 400;
                ctx.body = {success: false, message:"Email already in use."};
                return;
            }
            let userSave = new User(userObj);
            let userSaved = await userSave.saveAsync()
            let userJson = {};
            userJson.email = userSaved.email;
            userJson.name = userSaved.name;
            userJson._id = userSaved._id;
            userJson.favourite_books = userSaved.favourite_books;
            const token = jwt.sign(userJson, config.JWTSECRET);
            let json = {};
            json.token = token;
            ctx.body = {data:json, arrayData:[],success: true, message:"User has been registered successfully."};            

        } catch (err) {
            console.log(err);
            if (err.name === 'CastError' || err.name === 'NotFoundError') {
                ctx.throw(404);
            }
            ctx.throw(500);
        }
    }


    /**
     * Get all users
     * @param {ctx} Koa Context
     */
    async find(ctx) {
        ctx.body = await User.find();
    }


    /**
     * Get user by id
     * @param {ctx} Koa Context
     */
    async findById(ctx) {
        try {
            const user = await User.findById(ctx.params.id);
            if (!user) {
                ctx.throw(404);
            }
            ctx.body = user;
        } catch (err) {
            if (err.name === 'CastError' || err.name === 'NotFoundError') {
                ctx.throw(404);
            }
            ctx.throw(500);
        }
    }


    async updateFavBooks(ctx) {
        let userObj = ctx.request.body;
        if(!userObj.userId || !userObj.author || !userObj.bookId){
            ctx.status = 400;
            ctx.body = 'Please enter required fields.';
            return;
        }
        try {
            let findQuery = {};
            findQuery._id = userObj.userId;
            let updateObj = {};
            updateObj.author = userObj.author;
            updateObj.bookId = userObj.bookId;
            const user = await User.updateAsync(findQuery, { $addToSet: {favourite_books: updateObj } });
            ctx.body = {success: true, message:"Book has been added successfully"}; 
        } catch (err) {
            if (err.name === 'CastError' || err.name === 'NotFoundError') {
                ctx.throw(404);
            }
            ctx.throw(500);
        }
    }

    

}

export default new UsersControllers()
