import 'babel-polyfill';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/users';
import * as config from '../config';
import _ from 'lodash';
import fs from 'fs-extra';
import path from 'path';
import Promise from 'bluebird';
import cryptoImp from 'crypto';
const crypto = Promise.promisifyAll(cryptoImp);
import moment from 'moment';
import nodemailer from 'nodemailer';
//const _nodemailer = Promise.promisifyAll(nodemailer);

class UsersControllers {

    /**
     * Authenticate user
     * @param {*} ctx 
     */
    async login(ctx) {
        let userObj = ctx.request.body;
        if (!userObj.email || !userObj.password) {
            ctx.status = 400;
            ctx.body = { success: false, message: "Please enter required fields." };
            return;
        }
        let findQuery = {};
        findQuery.email = userObj.email;
        try {
            const user = await User.findOne(findQuery).lean(true).execAsync();
            if (!user) {
                ctx.status = 400;
                ctx.body = { success: false, message: "Authentication failed! User not found." };
                return;
            }

            let bcrypt_password_matched = bcrypt.compareSync(userObj.password, user.password);
            if (!bcrypt_password_matched) {
                ctx.status = 400;
                ctx.body = { success: false, message: "Authentication failed! Wrong password." };
                return;
            }

            const token = jwt.sign(user, config.JWTSECRET);
            let json = {};
            json.token = token;
            ctx.body = { data: json, arrayData: [], success: true, message: "User has been login successfully." };

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

        console.log(ctx.request.body.fields);

        let userObj = ctx.request.body.fields;
        if (!userObj.email ||  !userObj.name) {
            ctx.status = 400;
            ctx.body = { success: false, message: "Please enter required fields." };
            return;
        }

        if(!userObj.password && userObj.socialLogin == 'false'){
            ctx.status = 400;
            ctx.body = { success: false, message: "Please enter required fields." };
            return;
        }
        let findQuery = {};
        findQuery.email = userObj.email;
        if (userObj.password) {
            let password = userObj.password;
            let bcrypt_password = bcrypt.hashSync(password, 10);
            userObj.password = bcrypt_password;
        }

        if(userObj.socialLogin == 'true'){
            userObj.password = null;
        }

        try {
            const user = await User.findOneAsync(findQuery);
            if (user && userObj.socialLogin == 'false') {
                ctx.status = 400;
                ctx.body = { success: false, message: "Email already in use." };
                return;
            }
            if (!_.isEmpty(ctx.request.body.files)) {
                let file = ctx.request.body.files.photo;
                let filePath = file.path;
                let photoName = file.name;
                if (!(/\.(gif|jpg|jpeg|png)$/i).test(photoName)) {
                    console.log("in");
                    ctx.status = 400;
                    ctx.body = { success: false, message: "Please upload accepted files." };
                    return;

                }
                let type = file.type;
                let extension = '.jpg';
                if (type == 'image/png')
                    extension = '.png';
                else if (type == 'image/gif')
                    extension = '.gif';
                else if (type == 'image/jpeg')
                    extension = '.jpeg';
                let fileName = new Date().getTime() + extension;
                let uploadLocation = path.join(__dirname, '../../public/uploads/images/');
                let copyFile = await fs.copy(filePath, uploadLocation + fileName)
                userObj.profile_photo = '/uploads/images/' + fileName;
            }
            let userJson = {};
            if (userObj.socialLogin == 'true' && user) {
                userJson.email = user.email;
                userJson.name = user.name;
                userJson._id = user._id;
                userJson.profile_photo = user.profile_photo;
                userJson.favourite_books = user.favourite_books;
            } else {
                let userSave = new User(userObj);
                let userSaved = await userSave.saveAsync()
                userJson.email = userSaved.email;
                userJson.name = userSaved.name;
                userJson._id = userSaved._id;
                userJson.profile_photo = userSaved.profile_photo;
                userJson.favourite_books = userSaved.favourite_books;
            }            
            
            const token = jwt.sign(userJson, config.JWTSECRET);
            let json = {};
            json.token = token;
            ctx.body = { data: json, arrayData: [], success: true, message: "User has been registered successfully." };

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
        let Obj = ctx.request.body;
        let bookArray = Obj.favouriteBooks;
        console.log(bookArray.length)
        if (!bookArray.length) {
            ctx.status = 400;
            ctx.body = 'Please select books.';
            return;
        }
        try {
            let findQuery = {};
            findQuery._id = ctx.state.user._id;
            const user = await User.updateAsync(findQuery, { $addToSet: { favourite_books:{ $each:bookArray}} });
            ctx.body = { success: true, message: "Book has been added successfully." };
        } catch (err) {
            console.log(err);
            ctx.throw(err);
        }
    }

    /**
     * Forgot Password
     * @param {*} ctx 
     */
    async forgotPassword(ctx) {

        try {
            let buff = await crypto.randomBytesAsync(20);
            let token = buff.toString('hex');
            let findQuery = {};
            findQuery.email = ctx.request.body.email;
            let user = await User.findOneAsync(findQuery);
            if (!user) {
                ctx.status = 400;
                cyx.body = { success: false, message: 'User not found.' };
                return;
            }
            let userObj = {};
            userObj.forgotPwdToken = token;
            userObj.forgotPwdExpire = moment().add(1, 'hours').format();

            let updateObj = {};
            updateObj.$set = userObj;
            let modifiedUser = await User.updateAsync(findQuery, updateObj);
            let transporter = Promise.promisifyAll(nodemailer.createTransport(config.mailConfig));
            let mailOptions = {
                from: '"info@nethues.org.uk" <andy@123789.org>', // sender address
                to: 'andy@123789.org', // list of receivers
                subject: 'Forgot Password', // Subject line
                html: 'click here'
            };

            let mailInfo = await transporter.sendMailAsync(mailOptions);
            ctx.body = { success: true, message: 'Email sent successfully' };
        } catch (err) {
            ctx.throw(500);
        }

    }

    /**
     * Reset Password
     * @param {*} ctx 
     */
    async resetPassword(ctx) {

        if(!ctx.request.body){
            ctx.status = 400;
            ctx.body = {success:false,message:'Please enter required fields.'}
        }

        try {
            let user = await User.findOneAsync({ forgotPwdToken: ctx.request.params.token, forgotPwdExpire: { $gt: moment().toISOString() } });
            if(!user){
                ctx.status = 400;
                ctx.body = {success:false, message:'Your token expired, Please try again'};
            }
            let password = ctx.request.body.password;
            let bcrypt_password = bcrypt.hashSync(password, 10);
            let userObj = {};
            userObj.forgotPwdToken = '';
            userObj.forgotPwdExpire = null;
            userObj.password = bcrypt_password;
            let findQuery = {};
            findQuery._id = user._id;
            
            let updateObj = {};
            updateObj.$set = userObj;
            let modifiedUser =  await User.updateAsync(findQuery, updateObj);
            ctx.body = {success:true, message:'Password has been changed successfully'};

        } catch (err) {
            ctx.throw(500);
        }

    }
}

export default new UsersControllers()
