import { MeasurementSupplier } from '../Measurement';
import MeasurementsDatabase from '../MeasurementsDatabase';
import PeriodicRecorder from './PeriodicRecorder';

export default class PeriodicRecorderFactory {
  public static create(
    id: string,
    measurementSupplier: MeasurementSupplier,
    measurementDb: MeasurementsDatabase,
    config: unknown
  ): PeriodicRecorder {
    const period: string = PeriodicRecorderFactory.getPeriodFromConfig(config);
    const autoStart: boolean = PeriodicRecorderFactory.getAutoStartFromConfig(config);
    
    if (autoStart) {
      throw new Error('not implemented yet');
    } else {
      return new PeriodicRecorder(
        id,
        measurementSupplier,
        measurementDb,
        period
      );
    }
  }

  private static getAutoStartFromConfig(config: unknown): boolean {
    if ( typeof config === 'object' &&
      config !== null &&
      'auto-start' in config ) {
      if ( typeof (config as { 'auto-start': unknown })['auto-start'] === 'boolean' ) {
        return (config as { 'auto-start': boolean })['auto-start'];
      } else {
        throw new Error('expecting auto-start to be a boolean');
      }
    } else {
      return false;
    }
  }

  private static getPeriodFromConfig(config: unknown): string {
    if (
      typeof config === 'object' &&
      config !== null &&
      'period' in config &&
      typeof (config as { period: unknown }).period === 'string') {
      return (config as { period: string }).period;
    } else {
      throw new Error('a periodic recorder requires a period as a string');
    }
  }
}
