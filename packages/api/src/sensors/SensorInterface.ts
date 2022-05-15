export interface SensorInterface {
  fetchValue(): Promise<SensorValues>;
  getValuesKeys(): Readonly<string[]>;
}

export type SensorValueType = boolean|number|string;

export interface SensorValues {
  timestamp: Date,
  values: Map<string, SensorValueType>
} 