import * as express from 'express';
import { json as BodyParserJson } from 'body-parser';
import { Server as HttpServer } from 'http';
import { Server as socketIOServer } from 'socket.io';
import * as Log4js from 'log4js';

export default class Web {
  private httpPort: number;
  private app: express.Application;
  private httpServer: HttpServer;
  private io: socketIOServer;
  private webLogger;

  constructor(httpPort: number) {
    this.app = express.default();
    this.httpPort = httpPort;
    this.httpServer = new HttpServer(this.app);
    this.io = new socketIOServer(this.httpServer);
    this.webLogger = Log4js.getLogger('web');
  }

  startOn() {

    this.app.use(Log4js.connectLogger(this.webLogger, { level: 'info' }));

    this.app.use(BodyParserJson());
    
    // TODO serve static files

    this.httpServer.listen(this.httpPort, () => {
      this.webLogger.info(`Listening on ${this.httpPort}`);
    });
  }

  recordGetRoute(path: string, requestHandler: express.RequestHandler): void {
    this.app.get(path, requestHandler);
    this.webLogger.trace(`Record get on ${path}`);
  }

  recordPostRoute(path: string, requestHandler: express.RequestHandler): void {
    this.app.post(path, requestHandler);
    this.webLogger.trace(`Record post on ${path}`);
  }

  stop(): Promise<void> {
    return new Promise((resolve, ) => {
      this.httpServer.close(() => resolve());
    });
  }
}
