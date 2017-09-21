import bodyParser from 'koa-bodyparser';
import Koa from 'koa';
import logger from 'koa-logger';
import mongoose from 'mongoose';
import helmet from 'koa-helmet';
import routing from './routes/';
import { port, connexionString } from './config';
import serve from 'koa-static';
import Promise from 'bluebird';
import jwt from 'koa-jwt';
import Pug from 'koa-pug';
import cors from 'koa-cors';




// promisify mongoose
Promise.promisifyAll(mongoose);

Promise.config({
  // Enable cancellation
  cancellation: true,
});

mongoose
  .connect(connexionString)
  .then((response) => {
    console.log('mongo connection created')
  })
  .catch((err) => {
    console.log("Error connecting to Mongo")
    console.log(err);
  })
mongoose.set('debug', true);

// Create Koa Application
const app = new Koa();

app.use(cors());

app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = {success:false, message: err.message };
    ctx.app.emit('error', err, ctx);
  }
})
/* app.use(views(__dirname + '../views', {
  map: {
    html: 'pug'
  }
})); */

const pug = new Pug({
  viewPath: './views',
  debug: true,
  pretty: true,
  compileDebug: true,
  app: app // equals to pug.use(app) and app.use(pug.middleware) 
})



app
  .use(serve('./public'))
  .use(logger())
  .use(bodyParser())
  .use(helmet())

 


app.use(jwt({ secret: 'AIzaSyACKSH6x58dHWw5wkVtgVZn0DrdxO8M08I' }).unless({ path: [/^\/public/] }));


routing(app);

// Start the application
app.listen(port, () => console.log(`✅  The server is running at http://localhost:${port}/`));

export default app
