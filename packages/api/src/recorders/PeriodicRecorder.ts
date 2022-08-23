import { MeasurementSupplier } from "../Measurement";
import MeasurementsDatabase from "../MeasurementsDatabase";
import {Duration} from 'luxon';
import { setInterval } from 'timers';
import ManualRecorder from "./ManualRecorder";
import * as Log4js from 'log4js';

export default class PeriodicRecorder extends ManualRecorder {

  protected static appLogger = Log4js.getLogger('app');
  
  private cycleId: NodeJS.Timer;
  private period: number;

  public constructor(
      id:string,
      measurementSupplier: MeasurementSupplier,
      database: MeasurementsDatabase,
      period: string
    ) {
    super(id, measurementSupplier, database);

    this.cycleId = null;
    this.period = Duration.fromISO(period).as("milliseconds");
  }

  public start(){
    this.cycle();
    this.cycleId = setInterval(this.cycle.bind(this), this.period )
    PeriodicRecorder.appLogger.info(`${this.id} started cycling`);
  } 

  public stop(){
    clearInterval(this.cycleId);
    this.cycleId = null;
    PeriodicRecorder.appLogger.info(`${this.id} stopped cycling`);
  } 

  public isRecording(): boolean {
    return !!this.cycleId;
  }

  private cycle() {
    PeriodicRecorder.appLogger.trace(`${this.id} cycles`);
    this.recordOneMeasurement();
  }

}


