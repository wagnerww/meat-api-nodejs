import * as restify from 'restify';
import {enviroment} from '../common/environment';
import {Router} from '../common/router'
import * as mongoose from 'mongoose';
import {mergePatchBodyParser} from './merge-patch.parser';
import {handleError} from './error.handler';

export class Server {

    application: restify.Server;

    initializeDB(){
        (<any>mongoose).Promise = global.Promise;
        return mongoose.connect(enviroment.db.url, {
          useNewUrlParser: true
        });
    }

    initRoutes(routers:Router[]):Promise<any>{
        return new Promise((resolve, reject) => {
            try{
                this.application = restify.createServer({
                    name:'meat-api',
                    version:'1.0.0'
                });

                this.application.use(restify.plugins.queryParser());
                this.application.use(restify.plugins.bodyParser());
                this.application.use(mergePatchBodyParser);

                //Routes
                for(let router of routers){
                    router.applyRoutes(this.application);
                }               
                
                this.application.listen(enviroment.server.port, ()=> {
                   resolve(this.application);
                });

                this.application.on('restifyError', handleError);
                
            }catch(error){
                reject(error);
            }
        })
    }

    bootsrap(routers: Router[] = []): Promise<Server>{
        return this.initializeDB().then(() => 
            this.initRoutes(routers).then(() => this)
        );
    } 
}