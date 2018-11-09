import {Router} from '../common/router'
import * as restify from 'restify';
import {User} from './users.model'; 
import {NotFoundError} from 'restify-errors';

class UsersRouter extends Router{

    constructor(){
        super();
        this.on('beforeRender', document=>{
            document.password = undefined;
        })
    }

    applyRoutes(application: restify.Server){
        application.get('/users', (req, res, next)=>{
            User.find().then(users => {
                res.json(users)
                next();
            })
        });

        application.get('/users/:id', (req, res, next) => {
            User.findById(req.params.id).then(this.render(res, next, true)).catch(next);
        });

        application.post('/users', (req, res, next)=>{
            let user = new User(req.body);
            user.save().then(this.render(res, next, false)).catch(next);
        });

        application.put('/users/:id', (req, res, next)=>{
            const options = { overwrite:true };
            const id = {_id:req.params.id};
            User.update(id, req.body, options).exec().then<any>(result => {
                if(result.n){
                    return User.findById(req.params.id);
                }else{
                    next(new NotFoundError('Documento não encontrado'));
                   // res.send(404);
                }
            }).then<any>(this.render(res, next, true)).catch(next);
            
        });

        application.patch('/users/:id', (req, res, next) => {
            const options = {new : true};
            User.findByIdAndUpdate(req.params.id, req.body, options).then(this.render(res, next, true)).catch(next);
        });

        application.del('/users/:id', (req, res, next) =>{
            User.remove({_id : req.params.id}).exec().then<any>(result => {
                if(result.n){
                    res.send(204);
                }else{
                    throw new NotFoundError('Documento não encontrado');
                    //res.send(404);
                }
                return next();
            }).catch(next);
        })
    }
}

export const usersRouter = new UsersRouter();
