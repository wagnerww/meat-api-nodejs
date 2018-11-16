import {Router} from './router';
import * as mongoose from 'mongoose';
import {NotFoundError} from 'restify-errors';
import * as restify from 'restify';

export abstract class  ModelRouter<D extends mongoose.Document> extends Router{
    constructor(protected model:mongoose.Model<D>) {
        super();
    }

    validateId = (req, resp, next) => {
       if(!mongoose.Types.ObjectId.isValid(req.params.id)){
           next(new NotFoundError('Document not found'))
       }else {
           next();
       }
    }

    findAll = (req, resp, next) => {
        this.model.find().then(this.renderAll(resp, next)).catch(next);
    }

    findById = (req, resp, next) => {
        this.model.findById(req.params.id).then(this.render(resp, next, true)).catch(next);
    }

    save = (req, res, next)=>{
        let document = new this.model(req.body);
        document.save().then(this.render(res, next, false)).catch(next);
    }

    update = (req, res, next)=>{
        const options = {runValidator:true, overwrite:true };
        const id = {_id:req.params.id};
        this.model.update(id, req.body, options).exec().then<any>(result => {
            if(result.n){
                return this.model.findById(req.params.id);
            }else{
                next(new NotFoundError('Documento não encontrado'));
               // res.send(404);
            }
        }).then<any>(this.render(res, next, true)).catch(next);        
    }

    findByIdAndUpdate = (req, res, next) => {
        const options = {runValidator:true, new : true};
        this.model.findByIdAndUpdate(req.params.id, req.body, options).then(this.render(res, next, true)).catch(next);
    }

    remove = (req, res, next) =>{
        this.model.remove({_id : req.params.id}).exec().then<any>(result => {
            if(result.n){
                res.send(204);
            }else{
                throw new NotFoundError('Documento não encontrado');
                //res.send(404);
            }
            return next();
        }).catch(next);
    }

   
}



