export default interface ObjectWithId {
  readonly id: string;
}

export class ObjectWithIdCollection<T extends ObjectWithId> {
  
  private objectsWithID : T[]

  public constructor( objectsWithID: T[]) {
    this.objectsWithID = Array.from(objectsWithID);
  }

  public add(objectWithID: T) {
    this.objectsWithID.push(objectWithID);
  }

  public findById( id: string): T {
    const returned = this.objectsWithID.find( current => current.id === id);
    if( ! returned ) {
      throw new Error(`unknown id ${id}`);
    }
    return returned;
  }

  public forEach( callback: ( object :T ) => void ) {
    this.objectsWithID.forEach( (element) => callback(element)  );
  }

  public size(): number {
    return this.objectsWithID.length;
  }
}