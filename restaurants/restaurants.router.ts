import {Router} from '../common/router'
import * as restify from 'restify';
import {Restaurant} from './restaurants.model'; 
import {NotFoundError} from 'restify-errors';
import {ModelRouter} from '../common/model-router';

class RestaurantsRouter extends ModelRouter<Restaurant>{

    constructor(){
        super(Restaurant);       
    }

    applyRoutes(application: restify.Server){
        application.get('/restaurants', this.findAll);
        application.get('/restaurants/:id', [this.validateId, this.findById]);
        application.post('/restaurants', this.save);
        application.put('/restaurants/:id', [this.validateId, this.update]);
        application.patch('/restaurants/:id', [this.validateId, this.update]);
        application.del('/restaurants/:id', [this.validateId, this.remove]);
    }
}

export const restaurantsRouter = new RestaurantsRouter();
