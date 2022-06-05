import { DatabaseConfig } from "./Config";
import { Measurement } from "./Measurement";

export default class MeasurementDatabase {
  
  public constructor( _config: DatabaseConfig) {
    throw new Error('Not implemented yet');
  }

  public record( _measurement: Measurement): Promise<void> {
    throw new Error('Not implemented yet');
  }
}