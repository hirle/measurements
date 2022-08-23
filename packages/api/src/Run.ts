import Config, { SensorConfig, MeasurementSupplierConfig, RecorderConfig, LogsConfig } from './Config';
import DefaultConfig from './default.config.json';
import * as fs from 'fs';
import * as Log4js from 'log4js';
import * as path from 'path';
import Web from "./Web";
import GetVersion from './GetVersion';
import SupplierHandler from './handlers/SupplierHandler';
import { ApiVersionInterface } from '@measurements/restapiinterface';
import {  SensorCollection } from './sensors/Sensor';
import { SensorFactory } from './sensors/SensorFactory';
import { Measurement, MeasurementSupplier, MeasurementSupplierCollection } from './Measurement';
import MeasurementsDatabase from './MeasurementsDatabase';
import RecorderFactory from './recorders/RecorderFactory';
import { RecorderCollection } from './recorders/Recorder';
import PromiseSupplierHandler from './handlers/PromiseSupplierHandler';
import RecorderLatestMeasurementsHandler from './handlers/RecorderLatestMeasurementsHandler';
import ManualRecorder from './recorders/ManualRecorder';
import PeriodicRecorder from './recorders/PeriodicRecorder';
import RunnableHandler from './handlers/RunnableHandler';

export function run(argv: string[]): number {
    
    const config = processArgv(argv);

    setupLogger(config.logs);

    const database : MeasurementsDatabase = new MeasurementsDatabase(config.database);

    const sensors: SensorCollection = setSensorsUp(config.sensors);

    const measurementSuppliers = setMeasurementSuppliersUp(config.measurements, sensors);

    const recorders = setRecordersUp( config.recorders, measurementSuppliers, database );

    const web = new Web(config['http-port']);
    
    web.startOn()
    
    setApiRoutesUp(web, measurementSuppliers, recorders);

    return 0;
}

function setupLogger(logConfig?:LogsConfig) {

  const daysRetention = logConfig ? logConfig.retention: 7;
  const dirLogs = logConfig ? logConfig.dir : '.';

  const createDateRollingFile = ( filename: string) => ({
    type: 'dateFile',
    filename: path.join(dirLogs, filename),
    numBackups: daysRetention,
    keepFileExt: true,
    pattern: '.yyyy-MM-dd'
  });

  Log4js.configure({
    appenders: {
      stdout: { type: "stdout" },
      webDateRollingFile: createDateRollingFile('web.log'),
      appDateRollingFile: createDateRollingFile('app.log')
    },
    categories: {
      default: { appenders: ["stdout"], level: 'WARN' },
      web:  { appenders: ["webDateRollingFile"], level: 'INFO' },
      app:  { appenders: ["appDateRollingFile"], level: 'INFO' }
    }
  });
  
}

function setSensorsUp(sensors: SensorConfig[]): SensorCollection {
  const returned = new SensorCollection( sensors.map( sensorConfig => SensorFactory.create(sensorConfig)) );
  Log4js.getLogger().info( `${returned.size()} sensors set up` );
  return returned;
}

function setMeasurementSuppliersUp( measurementConfigs: MeasurementSupplierConfig[], sensors: SensorCollection ): MeasurementSupplierCollection {
  const returned =  new MeasurementSupplierCollection(measurementConfigs.map( measurementConfig => {
    const sensor = sensors.findById( measurementConfig['sensor-id']);
    if( ! sensor.getValuesKeys().has(measurementConfig['sensor-key']) ) {
      throw new Error(`Measurement ${measurementConfig.id} wants unknown sensor-key ${measurementConfig['sensor-key']}`);
    }
    return new MeasurementSupplier(measurementConfig.id, sensor, measurementConfig['sensor-key']);
  }));
  Log4js.getLogger().info( `${returned.size()} measurement supplier set up` );
  return returned;
}

function setRecordersUp( recorderConfigs: RecorderConfig[], measurementSuppliers: MeasurementSupplierCollection, measurementDb: MeasurementsDatabase ): RecorderCollection {
  const returned = new RecorderCollection( recorderConfigs.map( recorderConfig => {
    const measurementSupplier = measurementSuppliers.findById(recorderConfig['measurement-id'])
    return RecorderFactory.create(recorderConfig, measurementSupplier, measurementDb);
  }));
  Log4js.getLogger().info( `${returned.size()} recorders set up` );
  return returned;
}

function setApiRoutesUp(
  web: Web,
  measurementSuppliers: MeasurementSupplierCollection,
  recorders: RecorderCollection ) {

  // TODO set to process.env.npm_package_version
  const getVersion = new GetVersion('0.0.1');
  web.recordGetRoute('/api/version',SupplierHandler.create<ApiVersionInterface>(getVersion));

  measurementSuppliers.forEach(  ( measurementSupplier: MeasurementSupplier ) => {
    web.recordGetRoute(`/api/measurement/${measurementSupplier.id}/current`,
    PromiseSupplierHandler.create<Measurement>(measurementSupplier));
  });

  recorders.forEach( recorder => {
    web.recordGetRoute(
      `/api/recorder/${recorder.id}/measurements/latest(?:/:count([0-9]+))?`,
      RecorderLatestMeasurementsHandler.create(recorder)
    );

    if( recorder instanceof ManualRecorder ) {
      web.recordPostRoute(`/api/recorder/${recorder.id}/recordOneMeasurement`,
        PromiseSupplierHandler.create<Measurement>(recorder)
      );
    }


    if( recorder instanceof PeriodicRecorder ) {
        web.recordPostRoute(
          `/api/recorder/${recorder.id}/startRecording`,
          RunnableHandler.create(() => recorder.start())
        );
        web.recordPostRoute(
          `/api/recorder/${recorder.id}/stopRecording`,
          RunnableHandler.create(() => recorder.stop())
        );
    }
  });

  Log4js.getLogger().info( `Web paths set up` );
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
