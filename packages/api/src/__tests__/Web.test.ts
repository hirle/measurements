import * as express from 'express';
import Web from '../Web';
import axios from 'axios';
import * as Log4js from 'log4js';
import { IncomingMessage, ServerResponse } from 'node:http';
import { NextFunction } from 'express';
jest.mock('log4js');

describe('Web', ()=>{

  const middleWareMock = (_req: IncomingMessage, _res: ServerResponse, next: NextFunction) => {next()};
  const mockLogger = {
    info : jest.fn(),
    trace: jest.fn(),
    error: jest.fn()
  }; 
  (Log4js.connectLogger as jest.MockedFunction<typeof Log4js.connectLogger>).mockImplementation( () =>  middleWareMock);
  (Log4js.getLogger as jest.MockedFunction<any>).mockImplementation(() => mockLogger);

  beforeEach( ()=>{
    jest.clearAllMocks();
  });

  it('should run a server and allow recording of GET path', ()=>{


    const port = 3456;
    const underTest = new Web(port);

    underTest.startOn();
    
    const handler = jest.fn().mockImplementation( (_req: express.Request, res: express.Response, _next: express.NextFunction) => {
      res.send();
    });

    underTest.recordGetRoute('/api', handler);

    return axios.get(`http://localhost:${port}/api`)
      .then(data => {
        expect(data.status).toBe(200);
        expect(handler).toBeCalledTimes(1);

        expect(Log4js.getLogger).toBeCalledTimes(1);
        expect(mockLogger.trace).toBeCalledTimes(1);
        expect(mockLogger.info).toBeCalledTimes(1);

        return underTest.stop();
      });

  });

  it('should run a server and allow recording of POST path', ()=>{

    const port = 3456;
    const underTest = new Web(port);

    underTest.startOn();
    
    const handler = jest.fn().mockImplementation( (_req: express.Request, res: express.Response, _next: express.NextFunction) => {
      res.send();
    });

    underTest.recordPostRoute('/api', handler);

    return axios.post(`http://localhost:${port}/api`)
      .then(data => {
        
        expect(data.status).toBe(200);
        expect(handler).toBeCalledTimes(1);

        expect(Log4js.getLogger).toBeCalledTimes(1);
        expect(mockLogger.trace).toBeCalledTimes(1);
        expect(mockLogger.info).toBeCalledTimes(1);

        return underTest.stop();
      });

  });
});