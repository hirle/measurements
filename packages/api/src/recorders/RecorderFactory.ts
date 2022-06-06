import { RecorderConfig } from "../Config";
import { MeasurementSupplier } from "../Measurement";
import MeasurementDatabase from "../MeasurementDatabase";
import ManualRecorder from "./ManualRecorder";
import PeriodicRecorderFactory from "./PeriodicRecorderFactory";
import Recorder from "./Recorder";

export default class RecorderFactory  {
  public static create(
    recordingConfig: RecorderConfig,
    measurementSupplier: MeasurementSupplier,
    measurementDb: MeasurementDatabase
  ) : Recorder {
    switch( recordingConfig.mode ) {
      case 'manual': return new ManualRecorder(recordingConfig.id, measurementSupplier, measurementDb)
      case 'periodic': return PeriodicRecorderFactory.create(
        recordingConfig.id,
        measurementSupplier,
        measurementDb,
        recordingConfig.config);
      default: throw new Error(`unknown recorder mode ${recordingConfig.mode}`)
    }
  }
}