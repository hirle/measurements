import express, { RequestHandler } from 'express';
import { json as BodyParserJson }  from 'body-parser';
import { Server as HttpServer } from 'http';
import { Server as socketIOServer} from 'socket.io';
import Config from './Config';


export default class Web {

    private config: Config;
    private app: express.Application;
    private httpServer: HttpServer;
    private io: socketIOServer;

    constructor(config: Config) {
        this.app = express()
        this.config = config;
        this.httpServer = new HttpServer(this.app)
        this.io = new socketIOServer(this.httpServer);
    }

    startOn( ) {
        this.app.use(BodyParserJson);  
    }

    recordGetRoute(path: string, requestHandler: RequestHandler ): void {
        this.app.get(path, requestHandler);
    }
}