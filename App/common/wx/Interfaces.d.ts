import * as Rx from 'rxjs';

  /**
    * IObservableProperty combines a function signature for value setting and getting with
    * observables for monitoring value changes
    * @interface
    **/
    export interface IObservableProperty<T> extends Rx.Subscription {
        (newValue: T): void;
        (): T;
        changing: Rx.Observable<T>;
        changed: Rx.Observable<T>;
    }