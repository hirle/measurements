
export interface LogsConfig {
    dir: string
    retention: number
    level?: string
  }

export interface DatabaseConfig {
  type: string,
  config: unknown
} 

export interface RecordingConfig {
  id: string,
  "measurement-id": string,
  mode: string,
  "auto-start"?: boolean,
  period?: string
} 

export interface SensorConfig {
  id: string,
  type: string,
  recording?: RecordingConfig,
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
  recorders: RecordingConfig[],
  logs?: LogsConfig
}

