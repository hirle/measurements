import {URL} from 'url';
import {parseStringPromise} from 'xml2js';
import { SensorInterface, SensorValues, SensorValueType } from './SensorInterface';
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

type SensorValueDecoder =  (x:string) => SensorValueType;

export class TCW122Sensor implements SensorInterface {

  private static readonly keyProcessingMap: Map<string, SensorValueDecoder> = new Map([
    ['Device', TCW122Sensor.decodeString ],
    ['ID', TCW122Sensor.decodeString ],
    ['Hostname', TCW122Sensor.decodeString ],
    ['FW', TCW122Sensor.decodeString ],
    ['DigitalInput1', TCW122Sensor.decodeDigitalInput ],
    ['DigitalInput2', TCW122Sensor.decodeDigitalInput ],
    ['AnalogInput1', TCW122Sensor.decodeVoltage ],
    ['AnalogInput2', TCW122Sensor.decodeVoltage ],
    ['Temperature1', TCW122Sensor.decodeTemperature ],
    ['Temperature2', TCW122Sensor.decodeTemperature ]
  ]);

  private queryUrl: URL;

  constructor( config: TCW122SensorConfigInterface ) {
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
            const returned: SensorValues = {
              timestamp: new Date(),
              values: new Map()
            };
            for( const [key, decoder] of TCW122Sensor.keyProcessingMap ) {
              returned.values.set(key,decoder(TCW122Sensor.readValue(mayBeValues, key)));
            }
            return returned;
          });
  }

  getValuesKeys(): Readonly<string[]> {
    return Array.from(TCW122Sensor.keyProcessingMap.keys()); 
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
    return data?.Monitor?.[key]?.[0];
  }

  private static decodeString(rawValue: string): string{
    // actually this is identify function
    return rawValue;
  }

  private static decodeDigitalInput(rawValue: string): SensorValueType {
    switch( rawValue ) {
      case 'OPEN': return true;
      case 'CLOSED': return false;
      default: throw new Error(`invalid value ${rawValue}`);
    }
  }

  private static decodeVoltage( rawValue: string): SensorValueType
  {
    const readVoltsExpr = /(\d+)\.(\d)V/;
    const decodedValues = readVoltsExpr.exec(rawValue)
    if( decodedValues ) {
      return Number( decodedValues[1] + '.' + decodedValues[2] );
    } else {
      throw new Error(`invalid value ${rawValue}`)
    }
  }

  private static decodeTemperature(rawValue: string): SensorValueType {
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