import { SensorInterface } from './SensorInterface';
import { SensorConfig } from '../Config';
import { TCW122Sensor } from './TCW122Sensor';

export class SensorFactory  {

  public static create( config: SensorConfig ) : SensorInterface {
    switch( config.type ) {
      case 'tcw122': return TCW122Sensor.create(config.config);
      case '1wire': throw new Error('Not implemented yet');
      default: throw new Error('Unknown sensor type');
    } 
  }
}