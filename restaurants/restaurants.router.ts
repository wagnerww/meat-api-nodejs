import {Router} from '../common/router'
import * as restify from 'restify';
import {Restaurant} from './restaurants.model'; 
import {NotFoundError} from 'restify-errors';
import {ModelRouter} from '../common/model-router';

class RestaurantsRouter extends ModelRouter<Restaurant>{

    constructor(){
        super(Restaurant);       
    }

    envelope(documents){
        let resource = super.envelope(documents);
        resource._links.menu = `${this.basePath}/${resource._id}/menu`;
        return resource;
    }

    findMenu = (req, resp, next) => {
        Restaurant.findById(req.params.id, "+menu").then(rest => {
            if(!rest){
                throw new NotFoundError('Restaurant not found');
            } else {
                resp.json(rest.menu)
                return next()
            }
        }).catch(next);
    }

    replaceMenu = (req, resp, next) => {
       Restaurant.findById(req.params.id).then(rest => {
            if(!rest){
                throw new NotFoundError('Restaurant not found');
            } else {
               rest.menu = req.body;
               return rest.save();             
            }
        }).then(rest => {

        }).catch(next);
    }

    applyRoutes(application: restify.Server){
        application.get(`${this.basePath}`, this.findAll);
        application.get(`${this.basePath}/:id`, [this.validateId, this.findById]);
        application.post(`${this.basePath}`, this.save);
        application.put(`${this.basePath}/:id`, [this.validateId, this.update]);
        application.patch(`${this.basePath}/:id`, [this.validateId, this.update]);
        application.del(`${this.basePath}/:id`, [this.validateId, this.remove]);

        application.get(`${this.basePath}/:id/menu`, [this.validateId, this.findMenu]);
        application.put(`${this.basePath}/:id/menu`, [this.validateId, this.replaceMenu]);
    }
}

export const restaurantsRouter = new RestaurantsRouter();
