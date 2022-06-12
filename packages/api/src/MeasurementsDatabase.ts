import { DatabaseConfig } from "./Config";
import { Measurement } from "./Measurement";
import { Knex, knex } from 'knex';
import { ValueType } from "./ValueType";


export default class MeasurementsDatabase {

  private readyTables: Set<string>;
  private db: Knex<Measurement>;

  public constructor( config: DatabaseConfig) {
        this.db = knex( {
                client: config.type,
                connection: config.config,
                // 🤔
                useNullAsDefault: true
            });

        this.readyTables = new Set();
  }

  disconnect(): Promise<void> {
    return this.db.destroy();
  }

  private ensureTableReady( tableName :string, exampleOfValue: ValueType ): Promise<Knex<Measurement>> {
    return this.readyTables.has(tableName)
      ? Promise.resolve(this.db)
      : this.ensureTableExists( tableName, exampleOfValue);
  }   
      
  private ensureTableExists (tableName :string, exampleOfValue: ValueType ): Promise<Knex<Measurement>> {
    return this.db.schema.hasTable(tableName)
          .then( tableExists => tableExists
                  ? Promise.resolve()
                  : this.prepareTable( tableName, exampleOfValue))
        .then( () => {
          this.readyTables.add(tableName);
          return Promise.resolve(this.db);
        })
  }

  private prepareTable( tableName :string, exampleOfValue: ValueType ): Promise<void> {
    return this.db.schema.createTable(tableName, table => {

      let valueFieldCreator: (typeOfValue:string) => Knex.ColumnBuilder;
      switch(typeof exampleOfValue) {
        case 'number': valueFieldCreator = table.double; break;
        case 'string': valueFieldCreator = table.string; break;
        case 'boolean': valueFieldCreator = table.boolean; break;
        default: throw new Error(`type ${typeof exampleOfValue} not supported`);
      }

      table.increments('id');
      valueFieldCreator('value').notNullable();
      table.datetime('at', { useTz: true }).notNullable();

      table.index(['at'], 'iAt');
    });
  }

  private static getTableName( measurement: Measurement ) : string {
    return measurement.supplier.id;
  }

  public record( measurement: Measurement): Promise<void> {
    const tableName = MeasurementsDatabase.getTableName( measurement );
    return this.ensureTableReady(tableName, measurement.value)
      .then( db => db(tableName).insert(measurement))
      .then( () => Promise.resolve())
  } 
}