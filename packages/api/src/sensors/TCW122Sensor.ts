import {URL} from 'url';
import {parseStringPromise} from 'xml2js';
import { Sensor, SensorValues } from './Sensor';
import { ValueType } from "../ValueType";
import axios from 'axios';
import { Unit } from '../Unit';

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


type TCW122SensorValueDecoder =  (x:string) => ValueType;

type TCW122SensorValueDecoding = [TCW122SensorValueDecoder, Unit]

export class TCW122Sensor extends Sensor {

  private static readonly keyProcessingMap: Map<string, TCW122SensorValueDecoding> = new Map([
    ['Device', [ TCW122Sensor.decodeString, undefined] ],
    ['ID', [TCW122Sensor.decodeString, undefined ] ],
    ['Hostname', [TCW122Sensor.decodeString, undefined ] ],
    ['FW', [TCW122Sensor.decodeString, undefined] ],
    ['DigitalInput1', [TCW122Sensor.decodeDigitalInput, undefined] ],
    ['DigitalInput2', [TCW122Sensor.decodeDigitalInput, undefined] ],
    ['AnalogInput1', [TCW122Sensor.decodeVoltage, 'V'] ],
    ['AnalogInput2', [TCW122Sensor.decodeVoltage, 'V'] ],
    ['Temperature1', [TCW122Sensor.decodeTemperature, '°C'] ],
    ['Temperature2', [TCW122Sensor.decodeTemperature,  '°C'] ]
  ]);

  private queryUrl: URL;

  private constructor( id: string, config: TCW122SensorConfigInterface ) {
    super(id);

    const baseUrl = new URL(config.url);
    this.queryUrl = new URL('/status.xml', baseUrl);
    if( config.username ) {
      this.queryUrl.searchParams.append('a',`${config.username}:${config.password ? config.password:''}`);
    }
  }

  fetchValue(): Promise<SensorValues> {
    return axios.get(this.queryUrl.toString())
      .then(rawXmlData => parseStringPromise(rawXmlData.data))
      .then( (mayBeValues: TCW122SensorPayload) => {
            const timestamp = new Date();
            const returned: SensorValues = {
              values: new Map(),            
            };
            for( const [key, decoding] of TCW122Sensor.keyProcessingMap ) {
              const [decoder] = decoding;
              returned.values.set(key, {
                  timestamp,
                  value: decoder(TCW122Sensor.readValue(mayBeValues, key))
                });
            }
            return returned;
          });
  }

  getValuesKeys(): Readonly<Set<string>> {
    return new Set(TCW122Sensor.keyProcessingMap.keys()); 
  }

  getKeyValueUnit(key:string): Readonly<Unit> {
    const decoding = TCW122Sensor.keyProcessingMap.get(key);
    const [ , unit] = decoding;
    return unit; 
  }

  static create(id:string, mayBeConfig: unknown ): TCW122Sensor {
    if( typeof mayBeConfig === 'object'
    && mayBeConfig !== null
    && 'url' in mayBeConfig
    && typeof (mayBeConfig as {url:unknown}).url ==='string'){
      return new TCW122Sensor(id, mayBeConfig as TCW122SensorConfigInterface)
    }
    throw new Error ('Unexpected TCW122 config');
  }

  private static readValue( data: TCW122SensorPayload, key:string):string {
    return data?.Monitor?.[key]?.[0];
  }

  private static decodeString(rawValue: string): string{
    // actually this is identify function
    return rawValue;
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