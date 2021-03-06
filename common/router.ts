import * as restify from 'restify';
import {EventEmitter} from 'events';
import {NotFoundError} from 'restify-errors';

export abstract class  Router extends EventEmitter {
    abstract applyRoutes(application: restify.Server);

    envelope(document:any):any{
        return document;
    }

    envelopeAll(documents:any[], options:any = {}):any{
        return documents;
    }

    render(response:restify.Response, next: restify.Next, emit:boolean){
        return (document) =>{
            if(document){               
                if(emit){
                    this.emit('beforeRender', document);
                    response.json(this.envelope(document));
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

    renderAll(response:restify.Response, next:restify.Next, options:any = {}){
        return (documents:any[]) => {
            if(documents){
                documents.forEach((document, index, array) => {
                    this.emit('beforeRender', document);
                    array[index] = this.envelope(document);
                });
                response.json(documents);
            } else {
                response.json([]);
            }
        }
    }

}