import * as restify from 'restify';
import {EventEmitter} from 'events';
import {NotFoundError} from 'restify-errors';

export abstract class  Router extends EventEmitter {
    abstract applyRoutes(application: restify.Server);

    render(response:restify.Response, next: restify.Next, emit:boolean){
        return (document) =>{
            if(document){               
                if(emit){                   
                    this.emit('beforeRender', document);
                }else{
                    console.log('não emitiu');
                }
                response.json(document)
            }else{
                throw new NotFoundError('Documento não encontrado');
                //response.send(404);
            }
            return next();
        }
    }

}