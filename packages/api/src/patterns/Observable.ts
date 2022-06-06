export interface IObservable<T> {

  subscribe(observer: IObserver<T>): void

  unsubscribe(observer: IObserver<T>): void

  notify(arg: T): void
}

export interface IObserver<T> {
  notify(args: T): void
}

export class SimpleConcreteObservable<T> implements IObservable<T> {
  private observers: Set<IObserver<T>>;
  public constructor() {
    this.observers = new Set();
  }

  public subscribe(observer: IObserver<T>) {
    this.observers.add(observer);
  }

  public unsubscribe(observer: IObserver<T>) {
    this.observers.delete(observer);
  }

  public notify( arg: T) {
    for( const observer of this.observers ) {
      observer.notify(arg);
    }
  }
}