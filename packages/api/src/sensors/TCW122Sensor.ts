import {URL} from 'url';
import {parseStringPromise} from 'xml2js';
import { SensorInterface, SensorValues } from './SensorInterface';
import axios from 'axios';

export interface TCW122SensorConfigInterface{
  url: string;
  username?:string;
  password?:string;
}

// reference: https://www.teracomsystems.com//wp-content/uploads/tcw122b-cm/tcw122b-cm-remote-io-module-user-manual-r4.6.pdf
interface TCW122SensorPayload{
  Monitor: {
    Device: string;
    ID: string;
    Hostname: string;
    FW: string;
    DigitalInput1: string;
    DigitalInput2: string;
    AnalogInput1:string;
    AnalogInput2:string;
    Temperature1:string;
    Temperature2:string;
  }
}

export interface TCW122SensorValues extends SensorValues {
  timestamp: Date;
  Device: string;
  ID: string;
  Hostname: string;
  FW: string;
  DigitalInput1:boolean;
  DigitalInput2:boolean;
  AnalogInput1:number;
  AnalogInput2:number;
  Temperature1:number;
  Temperature2:number;
}

export class TCW122Sensor implements SensorInterface {

  private queryUrl: URL;

  constructor( config: TCW122SensorConfigInterface ) {
    const baseUrl = new URL(config.url);
    this.queryUrl = new URL('/status.xml', baseUrl);
    if( config.username ) {
      this.queryUrl.searchParams.append('a',`${config.username}:${config.password ? config.password:''}`);
    }
  }

  fetchValue(): Promise<TCW122SensorValues> {
    return axios.get(this.queryUrl.toString())
      .then(rawXmlData => parseStringPromise(rawXmlData.data))
      .then( (mayBeValues: TCW122SensorPayload) => ({
            Device: TCW122Sensor.readValue(mayBeValues, 'Device'),
            ID: TCW122Sensor.readValue(mayBeValues,'ID'),
            Hostname: TCW122Sensor.readValue(mayBeValues,'Hostname'),
            FW: TCW122Sensor.readValue(mayBeValues,'FW'),
            DigitalInput1: TCW122Sensor.decodeDigitalInput(TCW122Sensor.readValue(mayBeValues,'DigitalInput1')),
            DigitalInput2: TCW122Sensor.decodeDigitalInput(TCW122Sensor.readValue(mayBeValues,'DigitalInput2')),
            AnalogInput1: TCW122Sensor.decodeVoltage(TCW122Sensor.readValue(mayBeValues,'AnalogInput1')),
            AnalogInput2: TCW122Sensor.decodeVoltage(TCW122Sensor.readValue(mayBeValues,'AnalogInput2')),
            Temperature1: TCW122Sensor.decodeTemperature(TCW122Sensor.readValue(mayBeValues,'Temperature1')),
            Temperature2: TCW122Sensor.decodeTemperature(TCW122Sensor.readValue(mayBeValues,'Temperature2')),
            timestamp: new Date()
          }));
  }

  static create(mayBeConfig: unknown ): TCW122Sensor {
    if( typeof mayBeConfig === 'object'
    && mayBeConfig !== null
    && 'url' in mayBeConfig
    && typeof (mayBeConfig as {url:unknown}).url ==='string'){
      return new TCW122Sensor(mayBeConfig as TCW122SensorConfigInterface)
    }
    throw new Error ('Unexpected TCW122 config');
  }

  private static readValue( data: TCW122SensorPayload, key:string):string {
    return data?.Monitor[key][0];
  }

  private static decodeDigitalInput(rawValue: string): boolean {
    switch( rawValue ) {
      case 'OPEN': return true;
      case 'CLOSED': return false;
      default: throw new Error(`invalid value ${rawValue}`);
    }
  }

  private static decodeVoltage( rawValue: string): number
  {
    const readVoltsExpr = /(\d+)\.(\d)V/;
    const decodedValues = readVoltsExpr.exec(rawValue)
    if( decodedValues ) {
      return Number( decodedValues[1] + '.' + decodedValues[2] );
    } else {
      throw new Error(`invalid value ${rawValue}`)
    }
  }

  private static decodeTemperature(rawValue: string): number {
    const res = rawValue.match(/(-?)(\d+)\.(\d)°C/);
    if( res ) {
      const sign = Number( res[1] + '1' ) ;
      const temperature = sign * ( Number(res[2]) + Number(res[3])/10 );
      const badChecksumTemp = 85;
      if( temperature >= badChecksumTemp){
        throw new Error(`bad checksum`); 
      }
      return temperature;
    } else {
      throw new Error(`invalid value ${rawValue}`)
    }
  }
}