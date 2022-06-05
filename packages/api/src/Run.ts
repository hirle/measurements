import Config, { SensorConfig, MeasurementSupplierConfig } from './Config';
import DefaultConfig from './default.config.json';
import fs from 'fs';
import Logger from "./Logger";
import Web from "./Web";
import GetVersion from './GetVersion';
import SupplierHandler from './SupplierHandler';
import { ApiVersionInterface } from '@measures/restapiinterface';
import { Sensor } from './Sensor';
import { SensorFactory } from './sensors/SensorFactory';
import { MeasurementSupplier } from './Measurement';
import MeasurementDatabase from './MeasurementDatabase';

export function run(argv: string[]): number {
    
    const config = processArgv(argv);

    const logger: Logger = Logger.create(config.logs);

    const database : MeasurementDatabase = new MeasurementDatabase(config.database);

    const sensors: Sensor[] = setUpSensors(config.sensors);

    const _measurementSuppliers = setupMeasurementSuppliers(config.measurements, sensors);

    // TO DO give sensors to schedulers

    const web = new Web(config['http-port']);
    
    web.startOn()
    
    setupApiRoutes(web);

    logger.info('Ready!');

    return 0;
}

function setUpSensors(sensors: SensorConfig[]): Sensor[] {
  return sensors.map( sensorConfig => SensorFactory.create(sensorConfig));
}

function setupMeasurementSuppliers( measurementConfigs: MeasurementSupplierConfig[], sensors: Sensor[] ): MeasurementSupplier[] {
  return measurementConfigs.map( measurementConfig => {
    const sensor = sensors.find( currentSensor => currentSensor.id === measurementConfig['sensor-id']);
    if( ! sensor ) {
      throw new Error(`Measurement ${measurementConfig.id} wants unknown sensor-id ${measurementConfig['sensor-id']}`);
    }
    if( ! sensor.getValuesKeys().has(measurementConfig['sensor-key']) ) {
      throw new Error(`Measurement ${measurementConfig.id} wants unknown sensor-key ${measurementConfig['sensor-key']}`);
    }

    return new MeasurementSupplier(measurementConfig.id, sensor, measurementConfig['sensor-key']);
  });
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
