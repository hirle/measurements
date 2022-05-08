import Config, { SensorConfig } from './Config';
import DefaultConfig from './default.config.json';
import fs from 'fs';
import Logger from "./Logger";
import Web from "./Web";
import GetVersion from './GetVersion';
import SupplierHandler from './SupplierHandler';
import { ApiVersionInterface } from '@measures/apiinterface';
import { SensorInterface } from './sensors/SensorInterface';
import { SensorFactory } from './sensors/SensorFactory';

export function run(argv: string[]): number {
    
    const config = processArgv(argv);

    const logger: Logger = Logger.create(config.logs);

    const _sensors: SensorInterface[] = setUpSensors(config.sensors);

    // TO DO give sensors to schedulers

    const web = new Web(config['http-port']);
    
    web.startOn()
    
    setupApiRoutes(web);

    logger.info('Ready!');

    return 0;
}

function setUpSensors(sensors: SensorConfig[]): SensorInterface[] {
  return sensors.map( sensorConfig => SensorFactory.create(sensorConfig));
}

function setupApiRoutes( web: Web ) {

  // TODO set to process.env.npm_package_version
  const getVersion = new GetVersion('0.0.1');
  web.recordGetRoute('/api/version', SupplierHandler.create<ApiVersionInterface>(getVersion));
}

function processArgv(argv: string[]): Config {
  switch( argv.length ) 
  {
    case 2: return DefaultConfig; 
    case 3: throw new Error('Missing argument: ./path/to/config.json');
    case 4: if( argv[2] === '--config' ) {
        return JSON.parse(fs.readFileSync(argv[3], 'utf8'))
      }  else {
        throw new Error('Bad argument');
      } 
    default:  
      throw new Error('Bad argument');
  }
}
