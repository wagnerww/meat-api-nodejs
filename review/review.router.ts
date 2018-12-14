import { Router } from '../common/router'
import * as restify from 'restify';
import { Review } from './review.model';
import { NotFoundError } from 'restify-errors';
import { ModelRouter } from '../common/model-router';


class ReviewRouter extends ModelRouter<Review> {
    constructor() {
        super(Review)
    }

    envelope(document){
        let resource = super.envelope(document);
        const restId = document.restaurant._id ? document.restaurant._id : document.restaurant
        resource._links.restaurant = `/restaurants/${restId}`;
        return resource;
    }

    findById = (req, resp, next) => {
        this.model.findById(req.params.id)
            .populate('user', 'name')
            .populate('restaurant', 'name')
            .then(this.render(resp, next, true))
            .catch(next)
    }

    applyRoutes(application: restify.Server) {
        application.get(`${this.basePath}`, this.findAll);
        application.get(`${this.basePath}/:id`, [this.validateId, this.findById]);
        application.post(`${this.basePath}`, this.save);
    }
}


export const reviewRouter = new ReviewRouter();
