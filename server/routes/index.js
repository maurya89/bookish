import authenticateRoutes from './authenticate';
import cityRoutes from './cities';
import usreRoutes from './users';
import bookRoutes from './books';


export default function (app) {

  app.use(authenticateRoutes.routes()).use(authenticateRoutes.allowedMethods({ throw: true }));

  app.use(cityRoutes.routes()).use(cityRoutes.allowedMethods({ throw: true }));

  app.use(usreRoutes.routes()).use(usreRoutes.allowedMethods({ throw: true }));

  app.use(bookRoutes.routes()).use(bookRoutes.allowedMethods({ throw: true }));
  
}
