import ObjectWithId, { ObjectWithIdCollection } from "../patterns/ObjectWithIdCollection";
import { Unit } from "../Unit";
import { isValueType, ValueType } from "../ValueType";


export abstract class Sensor implements ObjectWithId{
  public readonly id: string;

  protected constructor( id:string ) {
    this.id = id;
  }

  public abstract fetchValue(): Promise<SensorValues>;
  public abstract getValuesKeys(): Readonly<Set<string>>;
  public abstract getKeyValueUnit( key:string): Readonly<Unit>;
}


export interface SensorValues {
  values: Map<string, SensorValue>
} 

export interface SensorValue {
  at: Date,
  value: ValueType
}

export function narrowSensorValue ( maybeSensorValue: unknown ): SensorValue {
  if (isAltmostSensorValue ( maybeSensorValue )
  &&  isValueType(maybeSensorValue.value)
  &&  mayBecomeADate( maybeSensorValue.at ) ) {
    return { at: new Date((maybeSensorValue).at), value: maybeSensorValue.value};
  } else {
    throw new Error('unexpected data')
  } 
}

type AltmostSensorValue = { at: unknown, value: unknown };
function isAltmostSensorValue ( maybeSensorValue: unknown ): maybeSensorValue is AltmostSensorValue {
  return typeof maybeSensorValue === 'object'
  && maybeSensorValue !== null
  && 'at' in maybeSensorValue
  && 'value' in maybeSensorValue;
}

function mayBecomeADate( input: unknown ) : input is string|number|Date {
  return input && ( ['string', 'number'].includes(typeof input) || input instanceof Date );
}


export class SensorCollection extends ObjectWithIdCollection<Sensor>{}