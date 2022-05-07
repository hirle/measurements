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
  "auto-start": boolean,
  period: string
} 

export interface SensorConfig {
  id: string,
  type: string,
  recording?: RecordingConfig,
  config: unknown
}

export default interface Config {
    "http-port": number,
    database: DatabaseConfig,
    sensors: SensorConfig[],
    logs?: LogsConfig
  }
  
  