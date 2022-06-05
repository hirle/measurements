import { Sensor } from '../Sensor';
import { SensorConfig } from '../Config';
import { TCW122Sensor } from './TCW122Sensor';

export class SensorFactory  {

  public static create( config: SensorConfig ) : Sensor {
    switch( config.type ) {
      case 'tcw122': return TCW122Sensor.create(config.id, config.config);
      case '1wire': throw new Error('Not implemented yet');
      default: throw new Error('Unknown sensor type');
    } 
  }
}