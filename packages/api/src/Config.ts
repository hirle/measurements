
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
  "measurement-id": string,
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

