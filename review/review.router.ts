import { Router } from '../common/router'
import * as restify from 'restify';
import { Review } from './review.model';
import { NotFoundError } from 'restify-errors';
import { ModelRouter } from '../common/model-router';


class ReviewRouter extends ModelRouter<Review> {
    constructor() {
        super(Review)
    }

    findById = (req, resp, next) => {
        this.model.findById(req.params.id)
            .populate('user', 'name')
            .populate('restaurant', 'name')
            .then(this.render(resp, next, true))
            .catch(next)
    }

    applyRoutes(application: restify.Server) {
        application.get('/review', this.findAll);
        application.get('/review/:id', [this.validateId, this.findById]);
        application.post('/review', this.save);
    }
}


export const reviewRouter = new ReviewRouter();
