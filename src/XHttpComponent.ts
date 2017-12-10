// RxJS Extensions
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

import {Observable} from "rxjs/Observable";
import {Subscription} from "rxjs/Subscription";
import {XComponent} from "./XComponent";

export interface IFragmentState {
    fragment: JSX.Element
}

export const enum HttpStatus {
    Pending,
    Succeeded,
    Failed
}

export interface IHttpError {
    message ?: string;
}

export interface IHttpBag<T, E> {
    status: HttpStatus;
    data?: T;
    error?: E;
}

export abstract class XHttpComponent<P, S extends IFragmentState, T> extends XComponent<P, S> {
    private subscription: Subscription;

    constructor(props: P) {
        super(props);
    }

    protected abstract sourceData(props: P): Observable<IHttpBag<T, IHttpError>>

    componentDidMount() {
        this.subscription = this.props$
            .mergeMap(props => this.sourceData(props))
            .map(httpBag => this.renderFragment(httpBag))
            .subscribe(jsxFragment => {
                this.setState({fragment: jsxFragment});
            });
    }

    componentWillUnmount() {
        this.subscription.unsubscribe();
    }

    protected abstract renderPending(): JSX.Element

    protected abstract renderSucceeded(data: T): JSX.Element

    protected abstract renderFailed(error: IHttpError): JSX.Element

    renderFragment(httpBag: IHttpBag<T, IHttpError>): JSX.Element {
        switch (httpBag.status) {
            case HttpStatus.Pending:
                return this.renderPending();

            case HttpStatus.Succeeded:
                return this.renderSucceeded(httpBag.data);

            case HttpStatus.Failed:
                return this.renderFailed(httpBag.error);

            default:
                return null;
        }
    }
}

