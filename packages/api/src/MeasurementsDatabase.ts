import { DatabaseConfig } from "./Config";
import { Measurement, MeasurementSupplier } from "./Measurement";
import { Knex, knex } from 'knex';
import { ValueType } from "./ValueType";
import { narrowSensorValue, SensorValue } from "./sensors/Sensor";
import {Mutex, MutexInterface, withTimeout} from 'async-mutex';


export default class MeasurementsDatabase {

  private readyTables: Set<string>;
  private db: Knex<SensorValue>;
  private ddlMutex: MutexInterface;
  private static readonly mutexTimeOut: number = 1000;

  public constructor( config: DatabaseConfig) {
        this.db = knex( {
                client: config.type,
                connection: config.config,
                // 🤔
                useNullAsDefault: true
            });

        this.readyTables = new Set();
        this.ddlMutex = withTimeout(new Mutex(), MeasurementsDatabase.mutexTimeOut);
  }

  disconnect(): Promise<void> {
    return this.db.destroy();
  }

  private ensureTableReady( tableName :string, exampleOfValue: ValueType ): Promise<Knex<SensorValue>> {
    return this.readyTables.has(tableName)
      ? Promise.resolve(this.db)
      : this.ensureTableExists( tableName, exampleOfValue);
  }   
      
  private ensureTableExists (tableName :string, exampleOfValue: ValueType ): Promise<Knex<SensorValue>> {
    return this.ddlMutex.runExclusive( () => 
        this.db.schema.hasTable(tableName)
          .then( tableExists => tableExists
                    ? Promise.resolve()
                    : this.prepareTable( tableName, exampleOfValue))   
          .then( () => {
            this.readyTables.add(tableName);
            return Promise.resolve(this.db);
          })               
      );
  }

  private prepareTable( tableName :string, exampleOfValue: ValueType): Promise<void> {
    return this.db.schema.createTable(tableName, table => {
      let valueFieldCreator: (typeOfValue:string) => Knex.ColumnBuilder;
      switch(typeof exampleOfValue) {
        case 'number': valueFieldCreator = (fieldName: string) => table.double(fieldName); break;
        case 'string': valueFieldCreator = (fieldName: string) => table.string(fieldName); break;
        case 'boolean': valueFieldCreator = (fieldName: string) => table.boolean(fieldName); break;
        default: throw new Error(`type ${typeof exampleOfValue} not supported`);
      }

      table.increments('id');
      valueFieldCreator('value').notNullable();
      table.datetime('at', { useTz: true }).notNullable();

      const indexName = `i${tableName.charAt(0).toUpperCase() + tableName.slice(1)}At`;
      table.index(['at'], indexName);
    });
  }

  private static getTableName( measurement: Measurement ) : string {
    return measurement.getSupplier().id;
  }

  public record( measurement: Measurement): Promise<void> {
    const tableName = MeasurementsDatabase.getTableName( measurement );
    return this.ensureTableReady(tableName, measurement.getSensorValue().value)
      .then( db => {
        return db(tableName).insert(measurement.getSensorValue());
      })
      .then( () => Promise.resolve())
  }
  
  public getLatestMeasurements(supplier :MeasurementSupplier, count :number): Promise<Measurement[]> {
    const tableName = supplier.id;

    const doesTableExist: Promise<boolean> = this.readyTables.has(tableName)
      ? Promise.resolve(true)
      : this.db.schema.hasTable(tableName);
    
    return doesTableExist
      .then( tableExists => tableExists
        ? (this.db.select().from<SensorValue>(tableName).limit(count).orderBy('at', 'desc')
          .then(altmostMeasurements => altmostMeasurements.map((sensorValue: unknown) => new Measurement(supplier, narrowSensorValue(sensorValue)))))
        : Promise.resolve([])
      );
  }
}