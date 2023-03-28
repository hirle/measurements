import { Measurement, MeasurementSupplier } from "../Measurement";
import MeasurementsDatabase from "../MeasurementsDatabase";
import {Duration} from 'luxon';
import { setInterval } from 'timers';
import ManualRecorder from "./ManualRecorder";

export default class PeriodicRecorder extends ManualRecorder {
  
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
    this.appLogger.info(`${this.id} started cycling`); 
  } 

  public stop(){
    clearInterval(this.cycleId);
    this.cycleId = null;
    this.appLogger.info(`${this.id} stopped cycling`);
  }
  
  public isRecording(): boolean {
    return !!this.cycleId;
  }

  private cycle() {
    this.appLogger.trace(`${this.id} cycles`);
    this.recordOneMeasurement()
      .then( (_: Measurement) =>{
        this.appLogger.trace(`${this.id} cycle succeeded`);
      })
      .catch( ( err: Error) => {
        this.appLogger.error(`${this.id} cycle error ${err.name} ${err.message}`);
      });
  }
}