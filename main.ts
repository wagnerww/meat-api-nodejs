import {Server} from './server/server';
import {usersRouter} from './users/users.router'
import { restaurantsRouter } from './restaurants/restaurants.router';

const server = new Server();

server.bootsrap([usersRouter, restaurantsRouter]).then(server => {
    console.log('server bombando: ', server.application.address())
}).catch(error => {
    console.log('erro ao iniciar o server ',error);
    process.exit(1);
});
