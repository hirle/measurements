export interface SensorInterface {
  fetchValue(): Promise<SensorValues>;
}

export interface SensorValues {
  timestamp: Date;
} 