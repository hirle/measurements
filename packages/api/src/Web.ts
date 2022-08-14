import express, { RequestHandler } from 'express';
import { json as BodyParserJson }  from 'body-parser';
import { Server as HttpServer } from 'http';
import { Server as socketIOServer} from 'socket.io';
import { getLogger as Log4jsGetLogger, connectLogger as Log4jsConnectLogger } from 'log4js';

export default class Web {

    private httpPort: number;
    private app: express.Application;
    private httpServer: HttpServer;
    private io: socketIOServer;
    private static webLogger = Log4jsGetLogger('web');

    constructor(httpPort: number) {
        this.app = express()
        this.httpPort = httpPort;
        this.httpServer = new HttpServer(this.app)
        this.io = new socketIOServer(this.httpServer);
    }

    startOn( ) {

        this.app.use(Log4jsConnectLogger(Web.webLogger, { level: "info" }));

        this.app.use(BodyParserJson());  

        // TODO serve static files

        this.httpServer.listen(this.httpPort, () => {
            Web.webLogger.info(`Listening on ${this.httpPort}`);
        });
    }

    recordGetRoute(path: string, requestHandler: RequestHandler ): void {
        this.app.get(path, requestHandler);
        Web.webLogger.trace(`Record get on ${path}`);
    }

    recordPostRoute(path: string, requestHandler: RequestHandler ): void {
        this.app.post(path, requestHandler);
        Web.webLogger.trace(`Record get on ${path}`);
    }
}