import { MeasurementSupplier } from "../Measurement";
import MeasurementDatabase from "../MeasurementDatabase";
import Recorder from "./Recorder";
import {Duration} from 'luxon';
import { setInterval } from 'timers';

export default class PeriodicRecorder extends Recorder {
  
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

  private cycle() {
    this.measurementSupplier.get()
      .then( measurement => {
        this.database.record(measurement);
      });
  }

}


