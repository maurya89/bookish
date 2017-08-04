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




// promisify mongoose
Promise.promisifyAll(mongoose);

Promise.config({
  // Enable cancellation
  cancellation: true,
});


mongoose.connect(connexionString);
mongoose.connection.on('error', console.error);
mongoose.set('debug',true);

// Create Koa Application
const app = new Koa();

app
  .use(serve('./public'))
  .use(logger())
  .use(bodyParser())
  .use(helmet())
  

app.use(jwt({ secret: 'dfshsjki@#$%^&*()@!$%%#$@' }).unless({ path: [/^\/public/] }));
  

routing(app);

// Start the application
app.listen(port, () => console.log(`✅  The server is running at http://localhost:${port}/`));

export default app
