import express, { RequestHandler } from 'express';
import { json as BodyParserJson }  from 'body-parser';
import { Server as HttpServer } from 'http';
import { Server as socketIOServer} from 'socket.io';


export default class Web {

    private httpPort: number;
    private app: express.Application;
    private httpServer: HttpServer;
    private io: socketIOServer;

    constructor(httpPort: number) {
        this.app = express()
        this.httpPort = httpPort;
        this.httpServer = new HttpServer(this.app)
        this.io = new socketIOServer(this.httpServer);
    }

    startOn( ) {

        this.app.use(BodyParserJson());  

        this.app.all('*', (req, _res, next) => {
            console.log(req.method + ' ' + req.url)
            next()
          })
      
        // TODO serve static files

        this.httpServer.listen(this.httpPort, () => {
            console.log(`Listening on ${this.httpPort}`);
        });
    }

    recordGetRoute(path: string, requestHandler: RequestHandler ): void {
        this.app.get(path, requestHandler);
    }
}