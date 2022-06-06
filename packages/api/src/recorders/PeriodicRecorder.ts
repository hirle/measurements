import { MeasurementSupplier } from "../Measurement";
import MeasurementDatabase from "../MeasurementDatabase";
import {Duration} from 'luxon';
import { setInterval } from 'timers';
import ManualRecorder from "./ManualRecorder";

export default class PeriodicRecorder extends ManualRecorder {
  
  private cycleId: NodeJS.Timer;
  private period: number;

  public constructor(
      id:string,
      measurementSupplier: MeasurementSupplier,
      database: MeasurementDatabase,
      period: string
    ) {
    super(id, measurementSupplier, database);

    this.cycleId = null;
    this.period = Duration.fromISO(period).as("milliseconds");
  }

  public start(){
    this.cycleId = setInterval(this.cycle.bind(this), this.period )
  } 

  public stop(){
    clearInterval(this.cycleId);
    this.cycleId = null;
  } 

  public isRecording(): boolean {
    return !!this.cycleId;
  }

  private cycle() {
    this.recordOneMeasurement();
  }

}


