import DefaultConfig from './default.config.json';
import * as fs from 'fs';

export interface LogsConfig {
    dir: string
    retention: number
    level?: string
  }

export interface DatabaseConfig {
  type: string,
  config: unknown
} 

export interface RecorderConfig {
  id: string,
  mode: string,
  config?: unknown
} 

export interface SensorConfig {
  id: string,
  type: string,
  config: unknown
}

export interface MeasurementSupplierConfig {
  id: string,
  "sensor-id": string,
  "sensor-key": string
}

export default interface Config {
  "http-port": number,
  database: DatabaseConfig,
  sensors: SensorConfig[],
  measurements: MeasurementSupplierConfig[],
  recorders: RecorderConfig[],
  logs?: LogsConfig
}

export function processArgv( argv: string []): Config {
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